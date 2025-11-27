import { createAIProvider } from '../utils/aiProvider';
import { JobPostAnalysis } from './parseJobPost';

export async function tailorCV(
  originalCV: string,
  jobAnalysis: JobPostAnalysis
): Promise<string> {
  const aiProvider = createAIProvider();

  const prompt = `You are an expert LaTeX CV optimizer. Your task is to tailor a CV to match a specific job posting while preserving LaTeX formatting.

Job Analysis:
- Required Skills: ${jobAnalysis.requiredSkills.join(', ')}
- Tools/Technologies: ${jobAnalysis.tools.join(', ')}
- Keywords: ${jobAnalysis.keywords.join(', ')}
- Seniority: ${jobAnalysis.seniority}
- Responsibilities: ${jobAnalysis.responsibilities.join(', ')}

Original CV (LaTeX):
${originalCV}

Your task:
1. Modify relevant sections to highlight skills and experience that match the job requirements
2. Rewrite bullet points to naturally include relevant keywords
3. Reorder experience/projects to prioritize relevant ones
4. Adjust wording to match the seniority level
5. Keep all LaTeX syntax valid and compilable
6. Do NOT add false information - only reframe existing experience
7. Maintain professional tone and formatting

IMPORTANT: Return ONLY the complete modified LaTeX CV. Do not include any explanations or comments outside the LaTeX code.`;

  const tailoredCV = await aiProvider.generateText(prompt);

  // Remove any markdown code blocks if present
  let cleanedCV = tailoredCV.replace(/```latex\n/g, '').replace(/```\n/g, '').replace(/```$/g, '');
  cleanedCV = cleanedCV.trim();

  return cleanedCV;
}
