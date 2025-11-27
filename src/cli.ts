#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import * as path from 'path';
import * as fs from 'fs-extra';
import dotenv from 'dotenv';
import * as readline from 'readline';

import { parseJobPost, JobPostAnalysis } from './agents/parseJobPost';
import { tailorCV } from './agents/tailorCV';
import { generateEmail } from './agents/generateEmail';
import { compileLatexToPDF } from './services/latexCompiler';
import { sendEmail } from './services/emailSender';
import { extractEmail } from './utils/extractEmail';
import { createAIProvider } from './utils/aiProvider';
import os from 'os';

// Load environment variables from multiple locations
function loadEnvConfig() {
  // Try current directory first
  const currentDirEnv = path.join(process.cwd(), '.env');
  if (fs.existsSync(currentDirEnv)) {
    dotenv.config({ path: currentDirEnv });
    return currentDirEnv;
  }

  // Try home directory config
  const homeDirEnv = path.join(os.homedir(), '.autotailor', '.env');
  if (fs.existsSync(homeDirEnv)) {
    dotenv.config({ path: homeDirEnv });
    return homeDirEnv;
  }

  // Try default dotenv config
  dotenv.config();
  return null;
}

const envPath = loadEnvConfig();

const BANNER = `
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ${chalk.cyan.bold('AutoTailor')} - AI-Powered CV Tailoring & Job Application  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`;

interface CliAnswers {
  cvPath: string;
  jobPost: string;
  applicantName: string;
  recipientEmail?: string;
}

async function getMultilineInput(message: string): Promise<string> {
  console.log(chalk.yellow(`\n${message}`));
  console.log(chalk.gray('(Paste your text and press Enter twice when done)\n'));

  return new Promise((resolve) => {
    let input: string[] = [];
    let emptyLineCount = 0;

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: ''
    });

    rl.on('line', (line) => {
      // Detect two consecutive empty lines as end signal
      if (line.trim() === '') {
        emptyLineCount++;
        if (emptyLineCount >= 2) {
          rl.close();
          return;
        }
        input.push(line);
      } else {
        emptyLineCount = 0;
        input.push(line);
      }
    });

    rl.on('close', () => {
      // Remove trailing empty lines
      while (input.length > 0 && input[input.length - 1].trim() === '') {
        input.pop();
      }
      resolve(input.join('\n').trim());
    });
  });
}

async function main() {
  console.clear();
  console.log(BANNER);

  // Check for AI API keys
  const hasClaudeKey = !!process.env.CLAUDE_API_KEY;
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
  const hasGeminiKey = !!process.env.GEMINI_API_KEY;

  if (!hasClaudeKey && !hasOpenAIKey && !hasGeminiKey) {
    console.log(chalk.red('\n✗ Error: No AI API key found\n'));
    console.log(chalk.yellow('AutoTailor needs an AI API key to work.\n'));
    console.log(chalk.cyan('Choose one of these AI providers:\n'));

    console.log(chalk.white('1. Claude (Anthropic) - Recommended:'));
    console.log(chalk.gray('   echo "CLAUDE_API_KEY=your-key-here" > .env'));
    console.log(chalk.blue('   Get key: https://console.anthropic.com/settings/keys\n'));

    console.log(chalk.white('2. ChatGPT (OpenAI):'));
    console.log(chalk.gray('   echo "OPENAI_API_KEY=your-key-here" > .env'));
    console.log(chalk.blue('   Get key: https://platform.openai.com/api-keys\n'));

    console.log(chalk.white('3. Gemini (Google):'));
    console.log(chalk.gray('   echo "GEMINI_API_KEY=your-key-here" > .env'));
    console.log(chalk.blue('   Get key: https://makersuite.google.com/app/apikey\n'));

    if (envPath) {
      console.log(chalk.gray(`Checked: ${envPath} (found but no AI API key)`));
    }
    process.exit(1);
  }

  // Display which AI provider is being used
  try {
    const aiProvider = createAIProvider();
    console.log(chalk.gray(`\n🤖 Using: ${aiProvider.getProviderName()} (${aiProvider.getModelName()})\n`));
  } catch (error) {
    // Will be caught below
  }

  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASS) {
    console.log(chalk.red('\n✗ Error: SMTP credentials not found\n'));
    console.log(chalk.yellow('AutoTailor needs email credentials to send applications.\n'));
    console.log(chalk.cyan('Add to your .env file:\n'));
    console.log(chalk.gray('SMTP_EMAIL=your.email@gmail.com'));
    console.log(chalk.gray('SMTP_PASS=your_app_password'));
    console.log(chalk.gray('SMTP_HOST=smtp.gmail.com'));
    console.log(chalk.gray('SMTP_PORT=587\n'));
    console.log(chalk.white('For Gmail App Password:'));
    console.log(chalk.blue('https://myaccount.google.com/apppasswords\n'));

    if (envPath) {
      console.log(chalk.gray(`Config file: ${envPath}`));
    }
    process.exit(1);
  }

  try {
    // Step 1: Get CV file path
    const { cvPath } = await inquirer.prompt([
      {
        type: 'input',
        name: 'cvPath',
        message: 'Enter path to your CV (.tex file):',
        default: './uploads/CV.tex',
        validate: async (input: string) => {
          const fullPath = path.resolve(input);
          if (!(await fs.pathExists(fullPath))) {
            return 'File not found. Please provide a valid path.';
          }
          if (!input.endsWith('.tex')) {
            return 'Please provide a .tex file';
          }
          return true;
        },
      },
    ]);

    // Step 2: Get applicant name
    const { applicantName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'applicantName',
        message: 'Your full name:',
        validate: (input: string) => (input.trim() ? true : 'Name is required'),
      },
    ]);

    // Step 3: Get job post
    console.log(chalk.cyan('\n📋 Paste the job post below:'));
    const jobPost = await getMultilineInput('Job Post:');

    if (!jobPost) {
      console.log(chalk.red('✗ No job post provided'));
      process.exit(1);
    }

    console.log(chalk.green('✓ Job post received\n'));

    // Step 4: Analyze job post
    const spinner1 = ora('Analyzing job post with AI...').start();
    let jobAnalysis: JobPostAnalysis;
    try {
      jobAnalysis = await parseJobPost(jobPost);
      spinner1.succeed('Job post analyzed successfully');
    } catch (error) {
      spinner1.fail('Failed to analyze job post');
      throw error;
    }

    // Display analysis
    console.log(chalk.cyan('\n📊 Job Analysis:'));
    console.log(chalk.gray('━'.repeat(60)));
    console.log(`${chalk.bold('Seniority:')} ${jobAnalysis.seniority}`);
    console.log(`${chalk.bold('Required Skills:')} ${jobAnalysis.requiredSkills.slice(0, 5).join(', ')}`);
    console.log(`${chalk.bold('Tools:')} ${jobAnalysis.tools.slice(0, 5).join(', ')}`);
    console.log(`${chalk.bold('Keywords:')} ${jobAnalysis.keywords.slice(0, 5).join(', ')}`);

    // Determine recipient email
    let recipientEmail: string = jobAnalysis.email || extractEmail(jobPost) || '';

    if (!recipientEmail) {
      const { manualEmail } = await inquirer.prompt([
        {
          type: 'input',
          name: 'manualEmail',
          message: 'No email found in job post. Enter recipient email:',
          validate: (input: string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(input) ? true : 'Please enter a valid email';
          },
        },
      ]);
      recipientEmail = manualEmail;
    } else {
      console.log(`${chalk.bold('Email found:')} ${chalk.green(recipientEmail)}`);
    }
    console.log(chalk.gray('━'.repeat(60)));

    // Step 5: Read original CV
    const spinner2 = ora('Reading your CV...').start();
    const fullCvPath = path.resolve(cvPath);
    const originalCV = await fs.readFile(fullCvPath, 'utf-8');
    spinner2.succeed('CV loaded');

    // Step 6: Tailor CV
    const spinner3 = ora('Tailoring CV with AI (this may take a moment)...').start();
    let tailoredCVContent: string;
    try {
      tailoredCVContent = await tailorCV(originalCV, jobAnalysis);
      spinner3.succeed('CV tailored successfully');
    } catch (error) {
      spinner3.fail('Failed to tailor CV');
      throw error;
    }

    // Step 7: Save tailored CV
    const spinner4 = ora('Saving tailored CV...').start();
    const uploadsDir = path.join(process.cwd(), 'uploads');
    await fs.ensureDir(uploadsDir);
    const tailoredCVPath = path.join(uploadsDir, 'tailored-CV.tex');
    await fs.writeFile(tailoredCVPath, tailoredCVContent);
    spinner4.succeed(`Tailored CV saved to: ${chalk.cyan(tailoredCVPath)}`);

    // Step 8: Compile to PDF
    const spinner5 = ora('Compiling LaTeX to PDF...').start();
    let pdfPath: string;
    try {
      pdfPath = await compileLatexToPDF(tailoredCVPath);
      spinner5.succeed(`PDF created: ${chalk.cyan(pdfPath)}`);
    } catch (error) {
      spinner5.fail('Failed to compile PDF');
      throw error;
    }

    // Step 9: Generate email
    const spinner6 = ora('Generating application email...').start();
    let emailContent;
    try {
      emailContent = await generateEmail(jobAnalysis, applicantName);
      spinner6.succeed('Email generated');
    } catch (error) {
      spinner6.fail('Failed to generate email');
      throw error;
    }

    // Step 10: Preview email
    console.log(chalk.cyan('\n📧 Email Preview:'));
    console.log(chalk.gray('━'.repeat(60)));
    console.log(`${chalk.bold('To:')} ${recipientEmail}`);
    console.log(`${chalk.bold('Subject:')} ${emailContent.subject}`);
    console.log(chalk.gray('━'.repeat(60)));
    console.log(emailContent.body);
    console.log(chalk.gray('━'.repeat(60)));
    console.log(`${chalk.bold('Attachment:')} ${path.basename(pdfPath)}\n`);

    // Step 11: Confirm sending
    const { confirmSend } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmSend',
        message: 'Send this email now?',
        default: false,
      },
    ]);

    if (!confirmSend) {
      console.log(chalk.yellow('\n⚠️  Email not sent.'));
      console.log(chalk.gray(`Your tailored CV is saved at: ${tailoredCVPath}`));
      console.log(chalk.gray(`PDF is available at: ${pdfPath}`));
      process.exit(0);
    }

    // Step 12: Send email
    const spinner7 = ora('Sending email...').start();
    try {
      await sendEmail({
        to: recipientEmail,
        subject: emailContent.subject,
        body: emailContent.body,
        pdfAttachmentPath: pdfPath,
      });
      spinner7.succeed(chalk.green.bold('Email sent successfully! 🎉'));
    } catch (error) {
      spinner7.fail('Failed to send email');
      throw error;
    }

    console.log(chalk.green('\n✓ Application submitted successfully!\n'));
    console.log(chalk.gray(`Sent to: ${recipientEmail}`));
    console.log(chalk.gray(`Files saved in: ${uploadsDir}\n`));

  } catch (error) {
    console.error(chalk.red('\n✗ Error:'), error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run CLI
main();
