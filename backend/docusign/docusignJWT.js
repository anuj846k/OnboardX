const docusign = require('docusign-esign');
const fs = require('fs');
const path = require('path');

const generateToken = async () => {
  try {
    const apiClient = new docusign.ApiClient();
    apiClient.setOAuthBasePath('account-d.docusign.com');

    // Configure JWT authentication
    const privateKeyFile = path.resolve(__dirname, './docusign_private.key');
    const privateKeyContent = fs.readFileSync(privateKeyFile, 'utf8');
    
    // Format the private key properly
    const privateKey = privateKeyContent.replace(/\\n/g, '\n');

    // Replace these with your values from DocuSign
    const integrationKey = 'e2ece81c-01cf-4683-beb9-3f9cb6fdee77';  // From DocuSign Admin
    const userId = '0ba10c57-b9bb-4734-a7d4-50a259869180';          // Your DocuSign User ID
    const scopes = [
      'signature',
      'impersonation',
      'webhook_write',
      'webhook_read'
    ];

    const token = await apiClient.requestJWTUserToken(
      integrationKey,
      userId,
      scopes,
      privateKey,
      3600  // token expires in 1 hour
    );

    console.log('Access Token:', token.body.access_token);
    return token.body.access_token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
};

module.exports = { generateToken }; 