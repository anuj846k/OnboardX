const PDFDocument = require('pdfkit');

const createOfferLetterPDF = async (employeeData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });

      // Offer Letter Content
      doc
        .fontSize(20)
        .text('Offer Letter', { align: 'center' })
        .moveDown()
        .fontSize(12)
        .text(`Date: ${new Date().toLocaleDateString()}`)
        .moveDown()
        .text(`Dear ${employeeData.personalInfo.firstName} ${employeeData.personalInfo.lastName},`)
        .moveDown()
        .text('We are pleased to offer you the position of ' + employeeData.employmentDetails.position)
        .text('in the ' + employeeData.employmentDetails.department + ' department.')
        .moveDown()
        .text('Start Date: ' + new Date(employeeData.employmentDetails.startDate).toLocaleDateString())
        .text('Employment Type: ' + employeeData.employmentDetails.employmentType)
        .moveDown()
        .text('Please sign below to accept this offer:')
        .moveDown()
        .text('Signature: _________________')
        .moveDown()
        .text('Date: _________________');

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

const createNDADocument = async (employeeData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });

      // NDA Content
      doc
        .fontSize(20)
        .text('Non-Disclosure Agreement', { align: 'center' })
        .moveDown()
        .fontSize(12)
        .text(`This Agreement is made on ${new Date().toLocaleDateString()} between:`)
        .moveDown()
        .text('Company: Your Company Name')
        .text(`Employee: ${employeeData.personalInfo.firstName} ${employeeData.personalInfo.lastName}`)
        .moveDown()
        .text('1. Confidential Information')
        .text('The Employee agrees that during employment and thereafter, they will hold in strictest confidence and will not disclose any confidential information.')
        .moveDown()
        .text('2. Term')
        .text('This agreement shall remain in effect throughout the employment period and for a period of two years following termination.')
        .moveDown()
        .text('3. Return of Materials')
        .text('Upon termination, Employee will return all documents and materials containing confidential information.')
        .moveDown()
        .moveDown()
        .text('IN WITNESS WHEREOF, the parties have executed this Agreement:')
        .moveDown()
        .text('Employee Signature: _________________')
        .moveDown()
        .text('Date: _________________');

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createOfferLetterPDF,
  createNDADocument
};