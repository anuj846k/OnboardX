const DocumentTemplate = require("../models/documentTemplate");
const Employee = require("../models/employee");

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

      // Add documents and automatically set status to IN_PROGRESS
      const documentsToAdd = documents.map(doc => ({
        documentType: doc.type,
        status: 'SENT',  // Initial status when document is assigned
        sentAt: new Date()
      }));

      employee.onboardingStatus.documents.push(...documentsToAdd);
      employee.onboardingStatus.status = 'IN_PROGRESS';  // Auto-update status
      
      // Calculate initial progress
      const totalDocs = employee.onboardingStatus.documents.length;
      const signedDocs = employee.onboardingStatus.documents.filter(
        doc => doc.status === 'SIGNED'
      ).length;
      employee.onboardingStatus.progress = Math.round((signedDocs / totalDocs) * 100);

      await employee.save();
      res.status(200).json(employee);
    } catch (error) {
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
