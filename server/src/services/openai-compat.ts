import OpenAI from 'openai';
import {
  GenerateResumeRequest,
  EnhanceBulletRequest,
  WriteSummaryRequest,
  ATSKeywordsRequest,
  ATSAnalysisResponse,
  ResumeData,
} from '../types';

/**
 * OpenAI-compatible service — works with OpenAI, any OpenAI-compatible endpoint
 * (Together AI, Groq via OpenAI compat, Ollama, etc.)
 */
function createClient(apiKey: string, baseURL?: string): OpenAI {
  return new OpenAI({
    apiKey,
    baseURL: baseURL || 'https://api.openai.com/v1',
  });
}

const DEFAULT_MODEL_MAP: Record<string, string> = {
  'https://api.openai.com/v1': 'gpt-4o-mini',
  'https://api.groq.com/openai/v1': 'llama-3.3-70b-versatile',
};

function getDefaultModel(baseURL?: string): string {
  if (!baseURL) return 'gpt-4o-mini';
  return DEFAULT_MODEL_MAP[baseURL] || 'gpt-4o-mini';
}

const SYSTEM_PROMPT = `You are an expert resume writer and career coach. Always respond with valid JSON only.`;

export async function generateResumeOpenAI(
  req: GenerateResumeRequest,
  apiKey: string,
  baseURL?: string,
  model?: string
): Promise<Partial<ResumeData>> {
  const client = createClient(apiKey, baseURL);
  const resolvedModel = model || getDefaultModel(baseURL);

  const completion = await client.chat.completions.create({
    model: resolvedModel,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Generate a professional resume JSON for a ${req.level}-level ${req.jobTitle}.${req.skills?.length ? ` Skills: ${req.skills.join(', ')}` : ''} Return a complete resume object with personal, summary, experience (3 entries with bullets), education, skills (2 categories), projects (2 entries), and certifications fields.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content || '{}';
  return JSON.parse(content);
}

export async function enhanceBulletOpenAI(
  req: EnhanceBulletRequest,
  apiKey: string,
  baseURL?: string,
  model?: string
): Promise<string> {
  const client = createClient(apiKey, baseURL);
  const resolvedModel = model || getDefaultModel(baseURL);

  const completion = await client.chat.completions.create({
    model: resolvedModel,
    messages: [
      { role: 'system', content: 'You are an expert resume writer. Respond with JSON only: { "enhanced": "..." }' },
      {
        role: 'user',
        content: `Role: ${req.role}. Rewrite this bullet to be more impactful: "${req.bullet}"`,
      },
    ],
    temperature: 0.6,
    max_tokens: 200,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content || '{"enhanced": ""}';
  return JSON.parse(content).enhanced || req.bullet;
}

export async function writeSummaryOpenAI(
  req: WriteSummaryRequest,
  apiKey: string,
  baseURL?: string,
  model?: string
): Promise<string> {
  const client = createClient(apiKey, baseURL);
  const resolvedModel = model || getDefaultModel(baseURL);

  const expStr = req.experience.slice(0, 3).map(e => `${e.position} at ${e.company}`).join(', ');

  const completion = await client.chat.completions.create({
    model: resolvedModel,
    messages: [
      { role: 'system', content: 'You are an expert resume writer. Respond with JSON: { "summary": "..." }' },
      {
        role: 'user',
        content: `Write a 2-3 sentence professional summary for a "${req.targetRole}" candidate. Experience: ${expStr}. No pronouns.`,
      },
    ],
    temperature: 0.6,
    max_tokens: 300,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content || '{"summary": ""}';
  return JSON.parse(content).summary || '';
}

export async function analyzeATSOpenAI(
  req: ATSKeywordsRequest,
  apiKey: string,
  baseURL?: string,
  model?: string
): Promise<ATSAnalysisResponse> {
  const client = createClient(apiKey, baseURL);
  const resolvedModel = model || getDefaultModel(baseURL);

  const completion = await client.chat.completions.create({
    model: resolvedModel,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Analyze this resume against the job description. JD: ${req.jobDescription.slice(0, 1000)}. Resume: ${JSON.stringify(req.currentResume).slice(0, 2000)}. Return JSON with score (0-100), breakdown array, missingKeywords array, suggestions array.`,
      },
    ],
    temperature: 0.3,
    max_tokens: 1500,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content || '{}';
  return JSON.parse(content) as ATSAnalysisResponse;
}
