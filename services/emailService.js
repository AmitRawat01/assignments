const sgMail = require('@sendgrid/mail');
const { sendGridApiKey } = require('../config/keys');

sgMail.setApiKey(sendGridApiKey);

exports.sendEmail = (to, subject, text) => {
  const msg = {
    to: to,
    from: 'noreply@yourapp.com',
    subject: subject,
    text: text,
  };
  return sgMail.send(msg);
};
