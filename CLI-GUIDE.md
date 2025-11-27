# AutoTailor CLI - User Guide

## Quick Start

Run the interactive CLI tool:

```bash
npm run tailor
```

That's it! The CLI will guide you through the entire process.

---

## How It Works

The CLI will walk you through these steps:

### 1. **CV File Path**
   - Enter the path to your LaTeX CV file
   - Default: `./uploads/CV.tex`
   - Must be a `.tex` file

### 2. **Your Name**
   - Enter your full name
   - Used in the email signature

### 3. **Job Post**
   - Paste the entire job posting
   - Press **Ctrl+D** (Mac/Linux) or **Ctrl+Z** (Windows) when done
   - The AI will extract:
     - Required skills
     - Tools/technologies
     - Seniority level
     - Keywords
     - Email address (if available)

### 4. **Recipient Email**
   - If email is found in job post, it's used automatically
   - If not found, you'll be prompted to enter it manually

### 5. **AI Processing**
   - Job post analysis
   - CV tailoring
   - PDF compilation
   - Email generation

### 6. **Preview**
   - Review the generated email
   - Check recipient, subject, and body
   - Verify the attachment

### 7. **Confirmation**
   - Decide whether to send now
   - **Yes**: Email is sent immediately
   - **No**: Files are saved but email is not sent

---

## Example Session

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   AutoTailor - AI-Powered CV Tailoring & Job Application  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

? Enter path to your CV (.tex file): ./uploads/CV.tex
? Your full name: John Doe

📋 Paste the job post below:
Job Post:
(Paste your text and press Ctrl+D when done)

[Paste job description here]
[Press Ctrl+D]

✓ Job post received

✓ Job post analyzed successfully

📊 Job Analysis:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Seniority: Senior
Required Skills: Node.js, TypeScript, AWS, Docker, PostgreSQL
Tools: Git, Docker, Kubernetes, Jenkins, Redis
Keywords: microservices, scalable, backend, API, cloud
Email found: hiring@company.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ CV loaded
✓ CV tailored successfully
✓ Tailored CV saved to: /path/to/uploads/tailored-CV.tex
✓ PDF created: /path/to/uploads/tailored-CV.pdf
✓ Email generated

📧 Email Preview:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: hiring@company.com
Subject: Application for Senior Backend Engineer Role
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hi Hiring Team,

I hope this message finds you well. I am writing to express my
interest in the Senior Backend Engineer position...

[Full email body]

Best regards,
John Doe
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Attachment: tailored-CV.pdf

? Send this email now? (y/N) y

✓ Email sent successfully! 🎉

✓ Application submitted successfully!

Sent to: hiring@company.com
Files saved in: /path/to/uploads
```

---

## Commands

### Development Mode (with ts-node)
```bash
npm run tailor
```

### Production Mode (compiled)
```bash
npm run build
npm run tailor:build
```

---

## Tips

1. **Keep your base CV generic** - Let the AI tailor it for each job

2. **Copy complete job posts** - More context = better tailoring

3. **Always preview before sending** - Review the email and CV first

4. **Start with test emails** - Send to yourself first to verify

5. **Save your base CV** - Keep a master copy outside the uploads folder

---

## File Locations

After running the CLI:

```
uploads/
├── CV.tex              # Your original CV (if uploaded here)
├── tailored-CV.tex     # AI-tailored LaTeX CV
└── tailored-CV.pdf     # Compiled PDF (sent as attachment)
```

---

## Troubleshooting

### "CLAUDE_API_KEY not found"
- Create a `.env` file from `.env.example`
- Add your Claude API key: `CLAUDE_API_KEY=sk-ant-api03-...`

### "SMTP credentials not found"
- Add to `.env`:
  ```
  SMTP_EMAIL=your.email@gmail.com
  SMTP_PASS=your_app_password
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  ```

### "File not found"
- Check the CV path is correct
- Use absolute or relative path from project root

### LaTeX Compilation Failed
- Ensure `pdflatex` or `latexmk` is installed
- Check your `.tex` file is valid LaTeX
- Run: `pdflatex --version` to verify installation

### Email Send Failed
- For Gmail: use App Password, not regular password
- Enable 2FA and generate App Password at: https://myaccount.google.com/apppasswords
- Check firewall/network settings

---

## Comparison: CLI vs API

| Feature | CLI | API |
|---------|-----|-----|
| **Ease of Use** | ✓ Very easy | Requires HTTP client |
| **Interactive** | ✓ Yes | No |
| **Preview** | ✓ Built-in | Manual |
| **Automation** | Manual runs | Can be automated |
| **Integration** | Standalone | Can integrate with other systems |
| **Best For** | Personal use | Automated workflows |

---

## Next Steps

1. Run `npm run tailor` to start your first job application
2. Test with a real job posting
3. Review the generated CV and email
4. Start applying to jobs faster!

Good luck with your job search! 🚀
