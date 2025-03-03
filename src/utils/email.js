const formData = require('form-data');
const Mailgun = require('mailgun.js');

// Load environment variables
const DOMAIN = process.env.MAILGUN_DOMAIN || 'dummy-domain.mailgun.org'; // Example: "sandboxxxxxxxxx.mailgun.org"
const API_KEY = process.env.MAILGUN_API_KEY || 'dummy-api-key';
const EMAIL_FROM = process.env.EMAIL_FROM || `no-reply@${DOMAIN}`;

if (process.env.NODE_ENV === 'test') {
  module.exports.sendEmail = async (to, subject, text) => {
    console.log('Skipping email send test environment');
    return { message: 'Email send skipped in test environment' };
  };
} else {
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: 'api', key: API_KEY });

  /**
   * Send an email using Mailgun
   * @param {string} to - Recipient email address
   * @param {string} subject - Email subject
   * @param {string} text - Plain text email content
   */
  const sendEmail = async (to, subject, text) => {
    try {
      const messageData = {
        from: EMAIL_FROM,
        to,
        subject,
        text
      };

      const response = await mg.messages.create(DOMAIN, messageData);
      console.log('Email sent:', response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  module.exports = { sendEmail };
};
