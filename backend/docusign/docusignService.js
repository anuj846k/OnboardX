const docusign = require('docusign-esign');
const { initializeDocusign } = require('./docusign');

const docusignService = {
  // Send document for signing
  sendEnvelope: async (document, signerEmail, signerName) => {
    try {
      const { apiClient, accountId } = await initializeDocusign();
      
      console.log('Sending document to:', signerEmail);
      
      // Create envelope definition
      const envelopeDefinition = new docusign.EnvelopeDefinition();
      envelopeDefinition.emailSubject = 'Please sign your Offer Letter';
      envelopeDefinition.emailBlurb = 'Please review and sign your offer letter document.';
      
      // Create document
      const doc = new docusign.Document();
      doc.documentBase64 = Buffer.from(document).toString('base64');
      doc.name = 'Offer Letter.pdf';
      doc.fileExtension = 'pdf';
      doc.documentId = '1';

      // Create signer with specific positioning
      const signer = docusign.Signer.constructFromObject({
        email: signerEmail,
        name: signerName,
        recipientId: '1',
        routingOrder: '1'
      });

      // Create signHere tab with specific positioning
      const signHere = docusign.SignHere.constructFromObject({
        anchorString: '/s1/',
        anchorYOffset: '0',
        anchorUnits: 'pixels',
        anchorXOffset: '0'
      });

      // Create dateHere tab
      const dateHere = docusign.DateSigned.constructFromObject({
        anchorString: '/d1/',
        anchorYOffset: '0',
        anchorUnits: 'pixels',
        anchorXOffset: '0'
      });

      // Add tabs to signer
      const tabs = docusign.Tabs.constructFromObject({
        signHereTabs: [signHere],
        dateSignedTabs: [dateHere]
      });
      signer.tabs = tabs;

      // Add to envelope definition
      envelopeDefinition.documents = [doc];
      envelopeDefinition.recipients = docusign.Recipients.constructFromObject({
        signers: [signer]
      });
      envelopeDefinition.status = 'sent';

      // Add webhook notification
      const eventNotification = new docusign.EventNotification();
      eventNotification.url = process.env.WEBHOOK_URL;
      eventNotification.requireAcknowledgment = 'true';
      eventNotification.envelopeEvents = [
        { envelopeEventStatusCode: 'completed' },
        { envelopeEventStatusCode: 'declined' }
      ];
      envelopeDefinition.eventNotification = eventNotification;

      // Create envelope
      const envelopesApi = new docusign.EnvelopesApi(apiClient);
      const results = await envelopesApi.createEnvelope(accountId, {
        envelopeDefinition: envelopeDefinition
      });

      return results;
    } catch (error) {
      console.error('DocuSign Error:', error?.response?.data || error);
      throw error;
    }
  }
};

module.exports = docusignService;