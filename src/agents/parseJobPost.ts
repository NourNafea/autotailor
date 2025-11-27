import { createAIProvider } from '../utils/aiProvider';

export interface JobPostAnalysis {
  requiredSkills: string[];
  tools: string[];
  keywords: string[];
  seniority: string;
  responsibilities: string[];
  email: string | null;
}

export async function parseJobPost(jobPostText: string): Promise<JobPostAnalysis> {
  const aiProvider = createAIProvider();

  const prompt = `You are an expert job post analyzer. Analyze the following job posting and extract key information.

Job Post:
${jobPostText}

Please provide a structured analysis with:
1. Required skills (technical and soft skills)
2. Tools and technologies mentioned
3. Important keywords that should appear in a CV
4. Seniority level (Junior, Mid-level, Senior, Lead, etc.)
5. Key responsibilities
6. Email address if present (null if not found)

Return your response as valid JSON with this structure:
{
  "requiredSkills": ["skill1", "skill2"],
  "tools": ["tool1", "tool2"],
  "keywords": ["keyword1", "keyword2"],
  "seniority": "level",
  "responsibilities": ["resp1", "resp2"],
  "email": "email@example.com or null"
}`;

  const responseText = await aiProvider.generateText(prompt);

  // Extract JSON from response (in case AI wraps it in markdown)
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse job post analysis');
  }

  const analysis: JobPostAnalysis = JSON.parse(jsonMatch[0]);
  return analysis;
}
