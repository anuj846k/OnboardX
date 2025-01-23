const docusign = require('docusign-esign');
const { generateToken } = require('./docusignJWT');

const initializeDocusign = async () => {
  try {
    // Get fresh token
    const accessToken = await generateToken();
    
    const docusignConfig = {
      basePath: process.env.DOCUSIGN_BASE_PATH || 'https://demo.docusign.net/restapi',
      oAuthToken: accessToken,
      accountId: process.env.DOCUSIGN_ACCOUNT_ID
    };

    // Initialize DocuSign API Client
    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath(docusignConfig.basePath);
    apiClient.addDefaultHeader('Authorization', 'Bearer ' + docusignConfig.oAuthToken);

    console.log('DocuSign initialized with token');
    
    return {
      apiClient,
      accountId: docusignConfig.accountId
    };
  } catch (error) {
    console.error('DocuSign initialization error:', error);
    throw error;
  }
};

module.exports = { initializeDocusign };