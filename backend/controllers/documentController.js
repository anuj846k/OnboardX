const DocumentTemplate = require("../models/documentTemplate");
const Employee = require("../models/employee");
const docusignService = require('../docusign/docusignService');
const { createOfferLetterPDF, createNDADocument } = require('../docusign/templates/documentTemplates');

const documentController = {
  addDocumentTemplate: async (req, res) => {
    try {
      const template = new DocumentTemplate(req.body);
      await template.save();
      res.status(201).json(template);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAllTemplates: async (req, res) => {
    try {
      const templates = await DocumentTemplate.find();
      res.status(200).json(templates);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  assignDocumentToEmployees: async (req, res) => {
    try {
      const { employeeId } = req.params;
      const { documents } = req.body;

      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      console.log('Processing documents for:', employee.personalInfo.email);

      for (const doc of documents) {
        let documentPDF;
        let documentName;

        // Generate appropriate document based on type
        switch (doc.type) {
          case 'OFFER_LETTER':
            documentPDF = await createOfferLetterPDF(employee);
            documentName = 'Offer Letter.pdf';
            break;
          case 'NDA':
            documentPDF = await createNDADocument(employee);
            documentName = 'Non-Disclosure Agreement.pdf';
            break;
          default:
            throw new Error(`Unsupported document type: ${doc.type}`);
        }

        console.log(`Created ${doc.type} document`);

        // Send to DocuSign
        const result = await docusignService.sendEnvelope(
          documentPDF,
          employee.personalInfo.email,
          `${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`,
          documentName
        );

        // Add to employee's documents
        employee.onboardingStatus.documents.push({
          documentType: doc.type,
          status: 'SENT',
          docusignEnvelopeId: result.envelopeId,
          sentAt: new Date()
        });
      }

      employee.onboardingStatus.status = 'IN_PROGRESS';
      await employee.save();

      res.status(200).json({
        message: 'Documents sent successfully',
        employee
      });
    } catch (error) {
      console.error('Document Assignment Error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Update document status (This will be called by DocuSign webhook)
  updateDocumentStatus: async (req, res) => {
    try {
      const { employeeId, documentType } = req.params;
      const { status } = req.body; // Status from DocuSign (SIGNED)

      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      // Find and update the specific document
      const document = employee.onboardingStatus.documents.find(
        doc => doc.documentType === documentType
      );

      if (document) {
        document.status = status;
        document.completedAt = new Date();
      }

      // Auto-update overall status
      const allDocuments = employee.onboardingStatus.documents;
      const allSigned = allDocuments.every(doc => doc.status === 'SIGNED');
      
      if (allSigned) {
        employee.onboardingStatus.status = 'COMPLETED';
      }

      // Auto-calculate progress
      const totalDocs = allDocuments.length;
      const signedDocs = allDocuments.filter(doc => doc.status === 'SIGNED').length;
      employee.onboardingStatus.progress = Math.round((signedDocs / totalDocs) * 100);

      await employee.save();
      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = documentController;
