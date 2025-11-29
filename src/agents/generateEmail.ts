import { createAIProvider, AIProviderService } from '../utils/aiProvider';
import { JobPostAnalysis } from './parseJobPost';

export interface EmailContent {
  subject: string;
  body: string;
}

export async function generateEmail(
  jobAnalysis: JobPostAnalysis,
  applicantName: string,
  aiProvider?: AIProviderService
): Promise<EmailContent> {
  if (!aiProvider) {
    aiProvider = createAIProvider();
  }

  const prompt = `You are an expert at writing professional job application emails. Write a concise, professional email for a job application.

Job Details:
- Seniority: ${jobAnalysis.seniority}
- Key Skills: ${jobAnalysis.requiredSkills.slice(0, 5).join(', ')}
- Key Responsibilities: ${jobAnalysis.responsibilities.slice(0, 3).join(', ')}

Applicant Name: ${applicantName}

Requirements:
1. Write a professional subject line
2. Write a concise email body (3-4 short paragraphs)
3. Mention 2-3 relevant skills/experiences that match the role
4. Keep it professional but friendly
5. End with a proper signature

Return your response as JSON:
{
  "subject": "Subject line here",
  "body": "Email body here including signature"
}

Keep the email concise - no more than 150 words total.`;

  const responseText = await aiProvider.generateText(prompt);

  // Extract JSON from response
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to generate email content');
  }

  const emailContent: EmailContent = JSON.parse(jsonMatch[0]);
  return emailContent;
}
