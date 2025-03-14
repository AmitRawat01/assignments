import sgMail from '@sendgrid/mail';
import { sendGridApiKey } from '../config/keys';

sgMail.setApiKey(sendGridApiKey);

export const sendEmail = (to, subject, text) => {
  const msg = {
    to: to,
    from: 'noreply@yourapp.com',
    subject: subject,
    text: text,
  };
  return sgMail.send(msg);
};
