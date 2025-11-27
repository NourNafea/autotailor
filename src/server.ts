import express, { Request, Response } from 'express';
import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs-extra';
import dotenv from 'dotenv';

import { parseJobPost, JobPostAnalysis } from './agents/parseJobPost';
import { tailorCV } from './agents/tailorCV';
import { generateEmail } from './agents/generateEmail';
import { compileLatexToPDF } from './services/latexCompiler';
import { sendEmail } from './services/emailSender';
import { extractEmail } from './utils/extractEmail';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    await fs.ensureDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, 'CV.tex');
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) === '.tex') {
      cb(null, true);
    } else {
      cb(new Error('Only .tex files are allowed'));
    }
  },
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'AutoTailor API is running' });
});

// Main endpoint: Process CV and job post
app.post('/api/tailor', upload.single('cv'), async (req: Request, res: Response) => {
  try {
    const { jobPost, applicantName, recipientEmail } = req.body;

    if (!jobPost) {
      return res.status(400).json({ error: 'Job post text is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'CV file (.tex) is required' });
    }

    if (!applicantName) {
      return res.status(400).json({ error: 'Applicant name is required' });
    }

    console.log('Step 1: Parsing job post...');
    const jobAnalysis: JobPostAnalysis = await parseJobPost(jobPost);
    console.log('Job analysis complete:', jobAnalysis);

    // Determine recipient email
    let targetEmail = recipientEmail || jobAnalysis.email || extractEmail(jobPost);

    if (!targetEmail) {
      return res.status(400).json({
        error: 'No email address found in job post. Please provide recipientEmail in the request.'
      });
    }

    console.log('Step 2: Reading original CV...');
    const cvPath = path.join(__dirname, '../uploads/CV.tex');
    const originalCV = await fs.readFile(cvPath, 'utf-8');

    console.log('Step 3: Tailoring CV...');
    const tailoredCVContent = await tailorCV(originalCV, jobAnalysis);

    console.log('Step 4: Saving tailored CV...');
    const tailoredCVPath = path.join(__dirname, '../uploads/tailored-CV.tex');
    await fs.writeFile(tailoredCVPath, tailoredCVContent);

    console.log('Step 5: Compiling PDF...');
    const pdfPath = await compileLatexToPDF(tailoredCVPath);

    console.log('Step 6: Generating email...');
    const emailContent = await generateEmail(jobAnalysis, applicantName);

    // Return preview for user confirmation
    res.json({
      success: true,
      message: 'CV tailored successfully. Review the details below.',
      data: {
        jobAnalysis,
        emailPreview: {
          to: targetEmail,
          subject: emailContent.subject,
          body: emailContent.body,
        },
        files: {
          tailoredCV: tailoredCVPath,
          pdf: pdfPath,
        },
      },
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      error: 'Failed to process CV tailoring',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Send email endpoint (requires user confirmation)
app.post('/api/send', async (req: Request, res: Response) => {
  try {
    const { recipientEmail, subject, body } = req.body;

    if (!recipientEmail || !subject || !body) {
      return res.status(400).json({
        error: 'recipientEmail, subject, and body are required'
      });
    }

    const pdfPath = path.join(__dirname, '../uploads/tailored-CV.pdf');

    if (!(await fs.pathExists(pdfPath))) {
      return res.status(400).json({
        error: 'PDF not found. Please run /api/tailor first.'
      });
    }

    console.log('Sending email to:', recipientEmail);
    await sendEmail({
      to: recipientEmail,
      subject,
      body,
      pdfAttachmentPath: pdfPath,
    });

    res.json({
      success: true,
      message: 'Email sent successfully!',
      sentTo: recipientEmail,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`AutoTailor API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
