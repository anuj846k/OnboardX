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

      // Company Header
      doc
        .fontSize(24)
        .text('OnBoardX', { align: 'center' })
        .fontSize(12)
        .text('123 Tech Park, Silicon Valley', { align: 'center' })
        .text('California, USA 94025', { align: 'center' })
        .text('Phone: (555) 123-4567', { align: 'center' })
        .moveDown(2);

      // Date
      doc
        .text(`Date: ${new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}`)
        .moveDown();

      // Recipient
      doc
        .text(`${employeeData.personalInfo.firstName} ${employeeData.personalInfo.lastName}`)
        .text(`Email: ${employeeData.personalInfo.email}`)
        .moveDown(2);

      // Subject Line
      doc
        .fontSize(16)
        .text('Re: Offer of Employment', { underline: true })
        .moveDown()
        .fontSize(12);

      // Salutation
      doc
        .text(`Dear ${employeeData.personalInfo.firstName},`)
        .moveDown();

      // Opening Paragraph
      doc
        .text('We are delighted to offer you the position of ' + 
          employeeData.employmentDetails.position + ' at TechBeast. ' +
          'We believe your skills and experience are an excellent match for our company.')
        .moveDown();

      // Employment Details
      doc
        .text('Employment Details:', { underline: true })
        .moveDown(0.5)
        .text(`Position: ${employeeData.employmentDetails.position}`)
        .text(`Department: ${employeeData.employmentDetails.department}`)
        .text(`Employment Type: ${employeeData.employmentDetails.employmentType}`)
        .text(`Start Date: ${new Date(employeeData.employmentDetails.startDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}`)
        .moveDown();

      // Additional Terms
      doc
        .text('Additional Terms:', { underline: true })
        .moveDown(0.5)
        .text('• This offer is contingent upon successful completion of background checks.')
        .text('• You will be eligible for our comprehensive benefits package.')
        .text('• Your employment with TechBeast will be on an at-will basis.')
        .text('• You will be required to sign our standard non-disclosure agreement.')
        .moveDown();

      // Closing
      doc
        .text('We are excited about having you join our team and look forward to working with you. ' +
          'Please indicate your acceptance of this offer by signing below.')
        .moveDown(2);

      // Signature Block
      doc
        .text('Acceptance:', { underline: true })
        .moveDown()
        .text('By signing below, I accept this offer of employment and agree to the terms and conditions outlined above.')
        .moveDown(2)
        .text('/s1/', { align: 'left' })
        .moveDown()
        .text('/d1/', { align: 'left' })
        .moveDown(2);

      // Company Signature
      doc
        .text('Best regards,')
        .moveDown()
        .text('John Smith')
        .text('Director of Human Resources')
        .text('OnBoardX');

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