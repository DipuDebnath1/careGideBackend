import { sendEmail } from './email';

// Generate OTP email template
const generateOtpEmailTemplate = (otp: string): string => {
  return `
    <html>
      <head>
      </head>
      <body>
        <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #333;">
          <h2 style="color: #007bff;">OTP Verification</h2>
          <h3 style="font-size: 24px; color: #007bff; font-weight: bold;">${otp}</h3>
        </div>
      
      </body>
    </html>
  `;
};


// Send OTP email
export const sendOtpVerificationMail = async (
  to: string,
  otp: string,
): Promise<void> => {
  const html = generateOtpEmailTemplate(otp);
  await sendEmail(to, 'Email Verification Code', html);
};