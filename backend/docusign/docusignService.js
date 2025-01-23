const docusign = require('docusign-esign');
const { initializeDocusign } = require('./docusign');

const docusignService = {
  // Send document for signing
  sendEnvelope: async (document, signerEmail, signerName) => {
    try {
      // Get fresh client with token
      const { apiClient, accountId } = await initializeDocusign();
      
      console.log('Sending document to:', signerEmail);
      
      const envelopeDefinition = new docusign.EnvelopeDefinition();
      
      // Create document
      const doc = new docusign.Document();
      doc.documentBase64 = Buffer.from(document).toString('base64');
      doc.name = 'Offer Letter.pdf';
      doc.fileExtension = 'pdf';
      doc.documentId = '1';

      // Create signer
      const signer = new docusign.Signer();
      signer.email = signerEmail;
      signer.name = signerName;
      signer.recipientId = '1';

      // Create signHere tab
      const signHere = new docusign.SignHere();
      signHere.documentId = '1';
      signHere.pageNumber = '1';
      signHere.recipientId = '1';
      signHere.xPosition = '100';
      signHere.yPosition = '100';

      // Add tabs to signer
      const tabs = new docusign.Tabs();
      tabs.signHereTabs = [signHere];
      signer.tabs = tabs;

      // Add documents and recipients to envelope
      envelopeDefinition.documents = [doc];
      envelopeDefinition.recipients = new docusign.Recipients();
      envelopeDefinition.recipients.signers = [signer];
      envelopeDefinition.status = 'sent';

      // Configure webhook for status updates
      const eventNotification = new docusign.EventNotification();
      eventNotification.url = process.env.WEBHOOK_URL + '/api/docusign/webhook';
      eventNotification.requireAcknowledgment = 'true';
      eventNotification.envelopeEvents = [
        { envelopeEventStatusCode: 'completed' },
        { envelopeEventStatusCode: 'declined' },
        { envelopeEventStatusCode: 'signed' }
      ];
      envelopeDefinition.eventNotification = eventNotification;

      // Send envelope
      const envelopesApi = new docusign.EnvelopesApi(apiClient);
      console.log('Sending envelope...');
      const results = await envelopesApi.createEnvelope(accountId, {
        envelopeDefinition
      });
      console.log('Envelope sent:', results);

      return results;
    } catch (error) {
      console.error('DocuSign Error:', error);
      throw error;
    }
  }
};

module.exports = docusignService;