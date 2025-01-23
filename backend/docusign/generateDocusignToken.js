const { generateToken } = require('./docusignJWT');

async function main() {
  try {
    const token = await generateToken();
    console.log('\nCopy this token to your .env file:\n');
    console.log('DOCUSIGN_OAUTH_TOKEN=' + token);
  } catch (error) {
    console.error('Failed to generate token:', error);
  }
}

main();