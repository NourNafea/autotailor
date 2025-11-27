import nodemailer from 'nodemailer';
import * as fs from 'fs-extra';

export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  pdfAttachmentPath: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  // Verify PDF exists
  if (!(await fs.pathExists(options.pdfAttachmentPath))) {
    throw new Error(`PDF attachment not found: ${options.pdfAttachmentPath}`);
  }

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: options.to,
    subject: options.subject,
    text: options.body,
    attachments: [
      {
        filename: 'CV.pdf',
        path: options.pdfAttachmentPath,
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
  } catch (error) {
    throw new Error(`Failed to send email: ${error}`);
  }
}
