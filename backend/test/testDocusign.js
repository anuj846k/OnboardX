const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const docusignService = require('../docusign/docusignService');
const { createOfferLetterPDF } = require('../docusign/templates/documentTemplates');

const testDocusignWebhook = async () => {
  try {
    // Create a test employee data
    const testEmployee = {
      personalInfo: {
        firstName: "Test",
        lastName: "User",
        email: "madhavdhatrak02@gmail.com" // Replace with your email
      },
      employmentDetails: {
        position: "Software Engineer",
        department: "Engineering",
        startDate: new Date(),
        employmentType: "FULL_TIME"
      }
    };

    // Generate PDF using existing template
    console.log('Generating test document...');
    const documentBuffer = await createOfferLetterPDF(testEmployee);
    console.log('PDF generated successfully');
    
    // Send envelope with webhook notification
    console.log('Sending document to DocuSign...');
    console.log('Using email:', testEmployee.personalInfo.email);
    
    const result = await docusignService.sendEnvelope(
      documentBuffer,
      testEmployee.personalInfo.email,
      `${testEmployee.personalInfo.firstName} ${testEmployee.personalInfo.lastName}`
    );

    console.log('Envelope sent successfully!');
    console.log('Envelope ID:', result.envelopeId);
    console.log('Check your email to sign the document');
    console.log('After signing, the webhook will be triggered automatically');

  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
  }
};

testDocusignWebhook(); 