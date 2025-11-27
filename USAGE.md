# AutoTailor - Complete Usage Guide

This guide covers both the **CLI interface** (recommended for personal use) and the **REST API** (for automation/integration).

---

## Table of Contents

1. [CLI Usage (Recommended)](#cli-usage-recommended)
2. [REST API Usage](#rest-api-usage)
3. [Setup & Configuration](#setup--configuration)
4. [Troubleshooting](#troubleshooting)

---

## CLI Usage (Recommended)

The CLI provides an interactive, user-friendly way to tailor your CV and send applications.

### Quick Start

```bash
npm run tailor
```

### Step-by-Step Process

#### 1. **CV File Path**

When prompted, enter the path to your LaTeX CV:

```
? Enter path to your CV (.tex file): ./uploads/CV.tex
```

- Can be absolute or relative path
- Must be a `.tex` file
- File must exist

#### 2. **Your Name**

Enter your full name (used in email signature):

```
? Your full name: John Doe
```

#### 3. **Job Post**

Paste the complete job posting:

```
📋 Paste the job post below:
Job Post:
(Paste your text and press Ctrl+D when done)
```

**How to paste:**
- Copy the entire job post from LinkedIn/Indeed/etc.
- Paste into terminal
- Press **Ctrl+D** (Mac/Linux) or **Ctrl+Z + Enter** (Windows) to finish

**What gets extracted:**
- Required skills and experience
- Tools and technologies
- Keywords for CV optimization
- Seniority level
- Company email address

#### 4. **Job Analysis**

The AI analyzes the job post and displays results:

```
📊 Job Analysis:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Seniority: Senior
Required Skills: Node.js, TypeScript, AWS, Docker, Kubernetes
Tools: Git, Jenkins, PostgreSQL, Redis, Terraform
Keywords: microservices, scalable, distributed, cloud-native
Email found: careers@company.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If no email is found, you'll be prompted to enter one manually.

#### 5. **CV Tailoring**

The AI rewrites your CV to match the job:

```
✓ CV loaded
✓ CV tailored successfully
✓ Tailored CV saved to: uploads/tailored-CV.tex
```

**What happens:**
- Relevant skills are emphasized
- Experience is reordered by relevance
- Bullet points are rewritten to include keywords
- LaTeX formatting is preserved

#### 6. **PDF Compilation**

Your tailored CV is compiled to PDF:

```
✓ PDF created: uploads/tailored-CV.pdf
```

#### 7. **Email Generation**

A professional application email is generated:

```
✓ Email generated
```

#### 8. **Email Preview**

Review the complete email before sending:

```
📧 Email Preview:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: careers@company.com
Subject: Application for Senior Backend Engineer Position

Hi Hiring Team,

I am writing to express my strong interest in the Senior Backend
Engineer position. With extensive experience in Node.js, TypeScript,
and AWS cloud architecture, I am excited about the opportunity to
contribute to your team's success.

[... full email content ...]

Best regards,
John Doe
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Attachment: tailored-CV.pdf
```

#### 9. **Send Confirmation**

Decide whether to send the email:

```
? Send this email now? (y/N)
```

- **Yes (y)**: Email is sent immediately
- **No (N)**: Files are saved but email is not sent

#### 10. **Completion**

If sent:

```
✓ Email sent successfully! 🎉

✓ Application submitted successfully!

Sent to: careers@company.com
Files saved in: uploads/
```

If not sent:

```
⚠️  Email not sent.

Your tailored CV is saved at: uploads/tailored-CV.tex
PDF is available at: uploads/tailored-CV.pdf
```

### CLI Commands

```bash
# Development mode (with hot reload)
npm run tailor

# Production mode (compiled)
npm run build
npm run tailor:build
```

### Generated Files

After running the CLI:

```
uploads/
├── CV.tex              # Your original CV
├── tailored-CV.tex     # AI-tailored version
└── tailored-CV.pdf     # Compiled PDF (sent as attachment)
```

---

## REST API Usage

For automation, integration, or building custom interfaces.

### Starting the API Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

Server runs at: `http://localhost:3000`

### API Endpoints

#### 1. Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "message": "AutoTailor API is running"
}
```

#### 2. Tailor CV and Generate Email

```http
POST /api/tailor
Content-Type: multipart/form-data
```

**Request (Form Data):**
- `cv` (file): Your CV file (must be .tex format)
- `jobPost` (text): Complete job post text
- `applicantName` (text): Your full name
- `recipientEmail` (text, optional): Recipient email if not in job post

**Example with cURL:**

```bash
curl -X POST http://localhost:3000/api/tailor \
  -F "cv=@./uploads/CV.tex" \
  -F "jobPost=We are looking for a Senior Backend Engineer with experience in Node.js, TypeScript, and AWS. Required skills: Docker, Kubernetes, PostgreSQL. Please send your CV to hiring@company.com" \
  -F "applicantName=John Doe" \
  -F "recipientEmail=hiring@company.com"
```

**Response:**

```json
{
  "success": true,
  "message": "CV tailored successfully. Review the details below.",
  "data": {
    "jobAnalysis": {
      "requiredSkills": ["Node.js", "TypeScript", "AWS", "Docker", "Kubernetes"],
      "tools": ["Docker", "Kubernetes", "PostgreSQL"],
      "keywords": ["microservices", "scalable", "backend", "API"],
      "seniority": "Senior",
      "responsibilities": ["Design systems", "Lead team", "Deploy services"],
      "email": "hiring@company.com"
    },
    "emailPreview": {
      "to": "hiring@company.com",
      "subject": "Application for Senior Backend Engineer Role",
      "body": "Hi Hiring Team,\n\nI hope this message finds you well..."
    },
    "files": {
      "tailoredCV": "/path/to/uploads/tailored-CV.tex",
      "pdf": "/path/to/uploads/tailored-CV.pdf"
    }
  }
}
```

**Error Response:**

```json
{
  "error": "Job post text is required",
  "details": "No job post provided in request"
}
```

#### 3. Send Email

```http
POST /api/send
Content-Type: application/json
```

**Request Body:**

```json
{
  "recipientEmail": "hiring@company.com",
  "subject": "Application for Senior Backend Engineer Role",
  "body": "Hi Hiring Team,\n\nI hope this message finds you well..."
}
```

**Example with cURL:**

```bash
curl -X POST http://localhost:3000/api/send \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "hiring@company.com",
    "subject": "Application for Senior Backend Engineer Role",
    "body": "Hi Hiring Team,\n\nI am writing to express my interest in the Senior Backend Engineer position..."
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Email sent successfully!",
  "sentTo": "hiring@company.com"
}
```

**Error Response:**

```json
{
  "error": "PDF not found. Please run /api/tailor first.",
  "details": "No PDF file available to attach"
}
```

### API Workflow

1. **Upload and Tailor**: Call `/api/tailor` with CV and job post
2. **Review Response**: Check the generated email and analysis
3. **Send Email**: Call `/api/send` with email details

### Testing with Postman

#### Test `/api/tailor`:

1. Create new POST request: `http://localhost:3000/api/tailor`
2. Set Body type to "form-data"
3. Add fields:
   - `cv` (File): Select your `.tex` file
   - `jobPost` (Text): Paste job description
   - `applicantName` (Text): Your name
   - `recipientEmail` (Text): Optional
4. Send request
5. Review response

#### Test `/api/send`:

1. Create new POST request: `http://localhost:3000/api/send`
2. Set Body type to "raw" → "JSON"
3. Paste email details from previous response
4. Send request

---

## Setup & Configuration

### Environment Variables

Required in `.env` file:

```env
# Claude API Key (get from console.anthropic.com)
CLAUDE_API_KEY=sk-ant-api03-xxxxx

# SMTP Email Configuration
SMTP_EMAIL=your.email@gmail.com
SMTP_PASS=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Server Port (for API only)
PORT=3000
```

### Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication**
   - Go to Google Account Security
   - Enable 2FA

2. **Generate App Password**
   - Visit: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Update .env**
   ```env
   SMTP_EMAIL=your.email@gmail.com
   SMTP_PASS=abcd efgh ijkl mnop  # App Password
   ```

### Other Email Providers

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_EMAIL=your.email@outlook.com
SMTP_PASS=your_password
```

**Custom SMTP:**
```env
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587  # or 465 for SSL
SMTP_EMAIL=your@email.com
SMTP_PASS=your_password
```

---

## Troubleshooting

### CLI Issues

**"CLAUDE_API_KEY not found"**
- Ensure `.env` file exists in project root
- Check `.env` contains `CLAUDE_API_KEY=...`
- Restart the CLI after adding the key

**"SMTP credentials not found"**
- Add `SMTP_EMAIL` and `SMTP_PASS` to `.env`
- For Gmail, use App Password not regular password

**"File not found"**
- Check CV path is correct (relative or absolute)
- Ensure file has `.tex` extension
- Try absolute path: `/full/path/to/CV.tex`

**"Ctrl+D not working for job post"**
- Windows: Use `Ctrl+Z` then press Enter
- Mac/Linux: Use `Ctrl+D`
- Alternative: Save job post to file, redirect input

### LaTeX Compilation Issues

**"PDF compilation failed"**
- Check pdflatex is installed: `pdflatex --version`
- Test your CV compiles: `pdflatex CV.tex`
- Look for LaTeX errors in console output
- Ensure all required LaTeX packages are installed

**"Missing LaTeX packages"**
```bash
# macOS
tlmgr install <package-name>

# Linux
sudo apt install texlive-<package-name>
```

### Email Sending Issues

**"Failed to send email"**
- Gmail: Must use App Password (not regular password)
- Check firewall isn't blocking SMTP ports
- Verify SMTP settings in `.env`
- Test with a different email provider

**"Authentication failed"**
- Gmail: Enable 2FA and generate App Password
- Check email and password are correct
- Some providers require "less secure apps" enabled

### API Issues

**"Port already in use"**
- Change `PORT` in `.env` to different value
- Or kill process using port 3000:
  ```bash
  # macOS/Linux
  lsof -ti:3000 | xargs kill -9

  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <pid> /F
  ```

**"Connection refused"**
- Ensure server is running: `npm run dev`
- Check correct port in URL
- Verify firewall settings

### Claude API Issues

**"Rate limit exceeded"**
- Wait a few minutes and retry
- Check your API usage at console.anthropic.com
- Consider upgrading your API plan

**"Invalid API key"**
- Verify key starts with `sk-ant-api03-`
- Check no extra spaces in `.env`
- Regenerate key if needed

---

## Tips for Best Results

1. **CV Quality**
   - Keep base CV comprehensive but generic
   - Use standard LaTeX packages
   - Avoid complex custom formatting

2. **Job Posts**
   - Copy complete job descriptions
   - Include all sections (requirements, responsibilities, benefits)
   - More context = better AI tailoring

3. **Preview Everything**
   - Always review generated email
   - Check tailored CV makes sense
   - Verify no false claims added

4. **Test First**
   - Send first application to yourself
   - Verify PDF looks professional
   - Check email formatting

5. **Track Applications**
   - Keep copies of tailored CVs
   - Note which jobs you applied to
   - Follow up after 1-2 weeks

---

## Advanced Usage

### Batch Processing (API)

Process multiple applications:

```bash
#!/bin/bash

for job in jobs/*.txt; do
  echo "Processing $job..."

  curl -X POST http://localhost:3000/api/tailor \
    -F "cv=@./uploads/CV.tex" \
    -F "jobPost@$job" \
    -F "applicantName=John Doe" \
    > response.json

  # Extract email details and send
  # ... parse response and call /api/send
done
```

### Custom CV Path (CLI)

```bash
npm run tailor -- --cv=/path/to/custom-CV.tex
```

### Dry Run Mode

Preview without sending:
- CLI: Choose "No" when asked to send
- API: Only call `/api/tailor`, skip `/api/send`

---

## Getting Help

- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check README.md and CLI-GUIDE.md
- **API Logs**: Check console output for debugging

---

**Happy job hunting! 🚀**
