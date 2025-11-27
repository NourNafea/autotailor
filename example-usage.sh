#!/bin/bash

# AutoTailor Example Usage Script
# This demonstrates how to use the API endpoints

BASE_URL="http://localhost:3000"

echo "AutoTailor API Example Usage"
echo "=============================="
echo ""

# 1. Health Check
echo "1. Testing health check..."
curl -s "${BASE_URL}/health" | jq '.'
echo ""

# 2. Tailor CV (adjust paths as needed)
echo "2. Tailoring CV for job application..."
echo "   (Make sure you have a CV.tex file ready)"
echo ""

# Example job post
JOB_POST="We are looking for a Senior Backend Engineer with 5+ years of experience in Node.js and TypeScript.
The ideal candidate will have:
- Strong experience with Express.js and REST APIs
- Knowledge of AWS cloud services
- Experience with Docker and Kubernetes
- Excellent problem-solving skills

Responsibilities:
- Design and implement scalable backend services
- Lead technical discussions and mentor junior developers
- Collaborate with frontend teams

Please send your CV to hiring@techcorp.com"

echo "Job Post Preview:"
echo "${JOB_POST}"
echo ""

# Uncomment and adjust this when you have a CV.tex file:
# curl -X POST "${BASE_URL}/api/tailor" \
#   -F "cv=@./uploads/CV.tex" \
#   -F "jobPost=${JOB_POST}" \
#   -F "applicantName=John Doe" \
#   -F "recipientEmail=hiring@techcorp.com" \
#   | jq '.' > response.json

# echo "Response saved to response.json"
# echo ""

# 3. Send Email (after review)
# echo "3. Sending email..."
# curl -X POST "${BASE_URL}/api/send" \
#   -H "Content-Type: application/json" \
#   -d '{
#     "recipientEmail": "hiring@techcorp.com",
#     "subject": "Application for Senior Backend Engineer Role",
#     "body": "Hi Hiring Team,\n\nI hope you are doing well. I am applying for the Senior Backend Engineer role...\n\nBest regards,\nJohn Doe"
#   }' | jq '.'

echo "Example script complete!"
echo ""
echo "To use this script:"
echo "1. Make sure the server is running: npm run dev"
echo "2. Place your CV.tex file in the uploads/ directory"
echo "3. Uncomment the curl commands above"
echo "4. Run: bash example-usage.sh"
