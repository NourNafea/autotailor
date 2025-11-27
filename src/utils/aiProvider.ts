import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export type AIProvider = 'claude' | 'openai' | 'gemini';

export interface AIResponse {
  text: string;
}

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}

export class AIProviderService {
  private provider: AIProvider;
  private apiKey: string;
  private model: string;

  constructor(config: AIProviderConfig) {
    this.provider = config.provider;
    this.apiKey = config.apiKey;

    // Set default models
    this.model = config.model || this.getDefaultModel();
  }

  private getDefaultModel(): string {
    switch (this.provider) {
      case 'claude':
        return 'claude-sonnet-4-20250514';
      case 'openai':
        return 'gpt-4-turbo-preview';
      case 'gemini':
        return 'gemini-1.5-pro';
      default:
        return 'claude-sonnet-4-20250514';
    }
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    switch (this.provider) {
      case 'claude':
        return this.generateWithClaude(prompt, systemPrompt);
      case 'openai':
        return this.generateWithOpenAI(prompt, systemPrompt);
      case 'gemini':
        return this.generateWithGemini(prompt, systemPrompt);
      default:
        throw new Error(`Unsupported AI provider: ${this.provider}`);
    }
  }

  private async generateWithClaude(prompt: string, systemPrompt?: string): Promise<string> {
    const client = new Anthropic({ apiKey: this.apiKey });

    const message = await client.messages.create({
      model: this.model,
      max_tokens: 8192,
      messages: [
        {
          role: 'user',
          content: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt,
        },
      ],
    });

    return message.content[0].type === 'text' ? message.content[0].text : '';
  }

  private async generateWithOpenAI(prompt: string, systemPrompt?: string): Promise<string> {
    const client = new OpenAI({ apiKey: this.apiKey });

    const messages: any[] = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    messages.push({ role: 'user', content: prompt });

    const completion = await client.chat.completions.create({
      model: this.model,
      messages,
      max_tokens: 8192,
    });

    return completion.choices[0]?.message?.content || '';
  }

  private async generateWithGemini(prompt: string, systemPrompt?: string): Promise<string> {
    const genAI = new GoogleGenerativeAI(this.apiKey);
    const model = genAI.getGenerativeModel({ model: this.model });

    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;

    return response.text();
  }

  getProviderName(): string {
    switch (this.provider) {
      case 'claude':
        return 'Claude (Anthropic)';
      case 'openai':
        return 'ChatGPT (OpenAI)';
      case 'gemini':
        return 'Gemini (Google)';
      default:
        return 'Unknown';
    }
  }

  getModelName(): string {
    return this.model;
  }
}

export function createAIProvider(): AIProviderService {
  // Determine which provider to use based on env vars
  let provider: AIProvider;
  let apiKey: string;
  let model: string | undefined;

  if (process.env.CLAUDE_API_KEY) {
    provider = 'claude';
    apiKey = process.env.CLAUDE_API_KEY;
    model = process.env.CLAUDE_MODEL;
  } else if (process.env.OPENAI_API_KEY) {
    provider = 'openai';
    apiKey = process.env.OPENAI_API_KEY;
    model = process.env.OPENAI_MODEL;
  } else if (process.env.GEMINI_API_KEY) {
    provider = 'gemini';
    apiKey = process.env.GEMINI_API_KEY;
    model = process.env.GEMINI_MODEL;
  } else {
    throw new Error('No AI API key found. Please set CLAUDE_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY');
  }

  return new AIProviderService({ provider, apiKey, model });
}
