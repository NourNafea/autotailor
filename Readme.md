# AutoTailor - AI-Powered CV Tailoring & Job Application

> Automatically tailor your CV to any job posting and send professional applications with AI

AutoTailor uses AI (Claude, ChatGPT, or Gemini) to analyze job posts, intelligently rewrite your LaTeX CV to match requirements, and generate personalized application emails - all through a simple, interactive command-line interface.

## 🎯 What It Does

1. **Analyzes job postings** - Extracts required skills, keywords, seniority, and contact email
2. **Tailors your CV** - Rewrites and reorders sections to match job requirements perfectly
3. **Compiles to PDF** - Generates a professional PDF from your tailored LaTeX CV
4. **Writes the email** - Creates a personalized, professional application email
5. **Sends it for you** - Delivers your application with confirmation

**You stay in control:** Review everything before sending.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment (see Setup below)
cp .env.example .env
# Edit .env with your API keys

# 3. Run the interactive CLI
npm run tailor
```

That's it! The CLI guides you through the entire process.

---

## ✨ Features

### 🧠 AI-Powered Intelligence
- **Job Analysis** - Extracts keywords, skills, tools, responsibilities, and seniority
- **Smart Tailoring** - Rewrites bullet points, reorders sections, optimizes wording
- **Email Generation** - Creates professional, personalized application emails

### 🎨 User Experience
- **Interactive CLI** - Beautiful, step-by-step command-line interface
- **Real-time Progress** - See what's happening with spinners and colored output
- **Email Preview** - Review everything before sending
- **Confirmation Required** - No accidental sends

### 🛠️ Technical
- **LaTeX Safe** - Preserves formatting, ensures valid compilation
- **PDF Generation** - Automatic compilation using pdflatex/latexmk
- **Email Delivery** - Reliable sending via Nodemailer (Gmail/SMTP)
- **Dual Interface** - CLI for personal use, REST API for automation

---

## 📋 Requirements

- **Node.js** 16+ and npm
- **LaTeX** compiler (pdflatex or latexmk)
- **AI API key** - Choose one:
  - Claude API (Anthropic) - Recommended
  - OpenAI API (ChatGPT)
  - Google Gemini API
- **Email account** with SMTP access (Gmail recommended)

---

## 🚀 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Install LaTeX Compiler

**macOS:**
```bash
brew install mactex
```

**Linux:**
```bash
sudo apt install texlive-full
```

**Windows:**
Install [MiKTeX](https://miktex.org/download)

Verify installation:
```bash
pdflatex --version
```

### 3. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# AI Provider (Choose ONE - Claude recommended)
# Get Claude API key: https://console.anthropic.com/settings/keys
CLAUDE_API_KEY=your_claude_api_key_here

# OR use OpenAI (ChatGPT)
# Get OpenAI API key: https://platform.openai.com/api-keys
# OPENAI_API_KEY=your_openai_api_key_here

# OR use Google Gemini
# Get Gemini API key: https://makersuite.google.com/app/apikey
# GEMINI_API_KEY=your_gemini_api_key_here

# Email Settings (Gmail recommended)
SMTP_EMAIL=your.email@gmail.com
SMTP_PASS=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

**Choose Your AI Provider:**
- **Claude (Recommended)**: Best results, get key at [console.anthropic.com](https://console.anthropic.com/settings/keys)
- **ChatGPT**: Use OpenAI API, get key at [platform.openai.com](https://platform.openai.com/api-keys)
- **Gemini**: Use Google's AI, get key at [makersuite.google.com](https://makersuite.google.com/app/apikey)

**Gmail Setup:**
1. Enable 2-Factor Authentication
2. Generate App Password: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Use the App Password (not your regular password)

---

## 🎮 Usage

### Option 1: Global Installation (Easiest)

Install AutoTailor globally from npm:

```bash
# Install globally
npm install -g autotailor

# Create config directory
mkdir -p ~/.autotailor

# Create .env file (choose one AI provider)
cat > ~/.autotailor/.env << EOF
# Choose ONE AI provider:
CLAUDE_API_KEY=your-claude-api-key-here
# OPENAI_API_KEY=your-openai-api-key-here
# GEMINI_API_KEY=your-gemini-api-key-here

SMTP_EMAIL=your.email@gmail.com
SMTP_PASS=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EOF

# Run from anywhere
autotailor
```

### Option 2: Local Development

Clone and run locally:

```bash
npm run tailor
```

The CLI will:
1. ✅ Ask for your CV file path
2. ✅ Ask for your name
3. ✅ Let you paste the job post
4. ✅ Analyze the job with AI
5. ✅ Tailor your CV automatically
6. ✅ Compile to PDF
7. ✅ Generate professional email
8. ✅ Show preview of everything
9. ✅ Ask for confirmation
10. ✅ Send the application

**See [CLI-GUIDE.md](./CLI-GUIDE.md) for detailed CLI documentation.**

### REST API (For Automation)

Start the API server:

```bash
npm run dev
```

Use the REST endpoints for integration:
- `POST /api/tailor` - Tailor CV and generate email
- `POST /api/send` - Send the email

**See [USAGE.md](./USAGE.md) for API documentation.**

---

## 📁 Project Structure

```
AutoTailor/
├── src/
│   ├── cli.ts              # Interactive CLI interface (main)
│   ├── server.ts           # REST API server (optional)
│   ├── agents/
│   │   ├── parseJobPost.ts    # AI job post analyzer
│   │   ├── tailorCV.ts        # AI CV tailoring engine
│   │   └── generateEmail.ts   # AI email generator
│   ├── services/
│   │   ├── latexCompiler.ts   # PDF compilation
│   │   └── emailSender.ts     # Email delivery
│   └── utils/
│       └── extractEmail.ts    # Email extraction utility
├── uploads/                # Working directory for CVs
├── .env                    # Your configuration
└── package.json
```

---

## 🎬 Example Session

```bash
$ npm run tailor

╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   AutoTailor - AI-Powered CV Tailoring & Job Application  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

🤖 Using: Claude (Anthropic) (claude-sonnet-4-20250514)

? Enter path to your CV (.tex file): ./uploads/CV.tex
? Your full name: John Doe

📋 Paste the job post below:
[Paste job description, press Enter twice when done]

✓ Job post received
✓ Job post analyzed successfully

📊 Job Analysis:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Seniority: Senior
Required Skills: Node.js, TypeScript, AWS, Docker, Kubernetes
Tools: Git, Jenkins, PostgreSQL, Redis, Terraform
Keywords: microservices, scalable, distributed, cloud-native
Email found: careers@company.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ CV loaded
✓ CV tailored successfully
✓ Tailored CV saved to: uploads/tailored-CV.tex
✓ PDF created: uploads/tailored-CV.pdf
✓ Email generated

📧 Email Preview:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: careers@company.com
Subject: Application for Senior Backend Engineer Position

Hi Hiring Team,

I am writing to express my strong interest in the Senior Backend
Engineer position. With extensive experience in Node.js, TypeScript,
and AWS cloud architecture, I am excited about the opportunity to
contribute to your team's success...

[Full email content]

Best regards,
John Doe
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Attachment: tailored-CV.pdf

? Send this email now? Yes

✓ Email sent successfully! 🎉

✓ Application submitted successfully!

Sent to: careers@company.com
Files saved in: uploads/
```

---

## 🛠️ Tech Stack

- **Node.js + TypeScript** - Runtime and type safety
- **AI Providers** - Claude API (Anthropic), OpenAI API (ChatGPT), or Google Gemini
- **Inquirer** - Interactive CLI prompts
- **Chalk** - Terminal colors
- **Ora** - Loading spinners
- **Nodemailer** - Email sending
- **LaTeX (pdflatex)** - PDF compilation
- **Express.js** - REST API (optional)

---

## 📚 Documentation

- **[CLI-GUIDE.md](./CLI-GUIDE.md)** - Complete CLI usage guide
- **[USAGE.md](./USAGE.md)** - REST API documentation
- **[.env.example](./.env.example)** - Environment configuration template

---

## 💡 Tips

1. **Keep base CV generic** - Let AI tailor it for each job
2. **Include complete job posts** - More context = better results
3. **Always preview** - Review before sending
4. **Test first** - Send to yourself before real applications
5. **Use LaTeX-compatible CVs** - Avoid complex custom packages

---

## 🔧 Troubleshooting

### LaTeX Errors
- Ensure pdflatex is in PATH: `pdflatex --version`
- Validate your .tex file compiles standalone
- Check for missing LaTeX packages

### Email Issues
- Gmail: Use App Password, not regular password
- Enable 2FA first, then generate App Password
- Check SMTP settings in .env

### AI API Errors
- **Claude**: Verify API key is correct at [console.anthropic.com](https://console.anthropic.com)
- **OpenAI**: Check API key and credits at [platform.openai.com](https://platform.openai.com)
- **Gemini**: Verify API key at [makersuite.google.com](https://makersuite.google.com)
- Check account has credits/quota
- Ensure no rate limiting
- The CLI will show which AI provider it's using at startup

---

## 🚀 Future Enhancements

- [ ] Browser extension for LinkedIn job posts
- [ ] Support for Word/PDF CVs (auto-convert to LaTeX)
- [ ] Multi-language support
- [ ] Job application tracking dashboard
- [ ] Skill gap analysis and suggestions
- [ ] A/B testing for CV variations

---

## 📄 License

This project is for personal use. Claude API usage subject to Anthropic's terms.

---

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

## ⭐ Star This Repo

If AutoTailor helps you land interviews, consider giving it a star!

---

**Made with ❤️ and Claude AI**

Happy job hunting! 🎯
