import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

async function testEmail() {
  console.log('Testing email configuration...');
  console.log('SMTP Host:', process.env.SMTP_HOST);
  console.log('SMTP Port:', process.env.SMTP_PORT);
  console.log('SMTP Email:', process.env.SMTP_EMAIL);
  console.log('');

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✓ SMTP connection verified successfully!');
    console.log('');

    console.log('Sending test email to barbrothersegy@gmail.com...');
    const info = await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: 'barbrothersegy@gmail.com',
      subject: 'AutoTailor - Test Email',
      text: `Hello!

This is a test email from AutoTailor to verify your SMTP credentials are configured correctly.

If you're receiving this email, your email configuration is working perfectly!

Sent at: ${new Date().toLocaleString()}

Best regards,
AutoTailor System`,
    });

    console.log('✓ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('');
    console.log('Check barbrothersegy@gmail.com inbox for the test email.');
  } catch (error) {
    console.error('✗ Email test failed:');
    console.error(error);
    process.exit(1);
  }
}

testEmail();
