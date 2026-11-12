/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer, { SendMailOptions, Transporter } from 'nodemailer';
import config from '..';

// Create transporter with proper type
const transport: Transporter = nodemailer.createTransport(config.email.smtp);

export const verifyEmailTransport = async () => {

  try {
    await transport.verify();
    console.log('Connected to email server');
  } catch (err: any) {
    console.warn(
      'Unable to connect to email server. Make sure you have configured the SMTP options in .env',
    );
    console.error('SMTP Connection Error:', err.message || err);
  }
};

// Properly type the sendEmail function
const sendEmail = async (
  to: string,
  subject: string,
  html: string,
): Promise<void> => {
  const msg: SendMailOptions = {
    from: config.email.from,
    to,
    subject,
    html,
  };
  await transport.sendMail(msg);
};

verifyEmailTransport();

export { sendEmail, transport };
