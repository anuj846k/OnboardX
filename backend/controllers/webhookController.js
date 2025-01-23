const Employee = require('../models/employee');

const webhookController = {
  handleDocusignWebhook: async (req, res) => {
    try {
      const { envelopeStatus, envelopeId } = req.body;
      
      // Find employee with this envelopeId
      const employee = await Employee.findOne({
        'onboardingStatus.documents.docusignEnvelopeId': envelopeId
      });

      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      // Update document status based on envelope status
      const document = employee.onboardingStatus.documents.find(
        doc => doc.docusignEnvelopeId === envelopeId
      );

      if (document) {
        switch (envelopeStatus) {
          case 'completed':
          case 'signed':
            document.status = 'SIGNED';
            document.completedAt = new Date();
            break;
          case 'declined':
            document.status = 'DECLINED';
            break;
        }

        // Auto-update overall status
        const allDocuments = employee.onboardingStatus.documents;
        const allSigned = allDocuments.every(doc => doc.status === 'SIGNED');
        
        if (allSigned) {
          employee.onboardingStatus.status = 'COMPLETED';
        }

        // Update progress
        const totalDocs = allDocuments.length;
        const signedDocs = allDocuments.filter(doc => doc.status === 'SIGNED').length;
        employee.onboardingStatus.progress = Math.round((signedDocs / totalDocs) * 100);

        await employee.save();
      }

      res.status(200).json({ message: 'Webhook processed successfully' });
    } catch (error) {
      console.error('Webhook Error:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = webhookController;