import axios, { AxiosError } from 'axios';
import { APIKeyConfig, AIProvider } from '../types/resume';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// ─── Build auth headers for BYOK ─────────────────────────────────────────────
function buildHeaders(config: APIKeyConfig | null): Record<string, string> {
  if (!config?.apiKey) return {};
  const headers: Record<string, string> = {
    'x-ai-provider': config.provider as string,
    'x-ai-key': config.apiKey,
  };
  if (config.baseURL) headers['x-ai-base-url'] = config.baseURL;
  if (config.model) headers['x-ai-model'] = config.model;
  return headers;
}

// ─── Error helper ─────────────────────────────────────────────────────────────
function extractError(err: unknown): string {
  const axErr = err as AxiosError<{ error?: string; message?: string }>;
  return (
    axErr.response?.data?.message ||
    axErr.response?.data?.error ||
    axErr.message ||
    'Unknown error'
  );
}

// ─── API Functions ────────────────────────────────────────────────────────────
export interface GenerateResumeParams {
  jobTitle: string;
  level: 'entry' | 'mid' | 'senior';
  skills?: string[];
  industry?: string;
}

export async function generateResume(
  params: GenerateResumeParams,
  apiConfig: APIKeyConfig | null
) {
  try {
    const res = await client.post('/api/ai/generate-resume', params, {
      headers: buildHeaders(apiConfig),
    });
    return { data: res.data.resume, error: null };
  } catch (err) {
    return { data: null, error: extractError(err) };
  }
}

export async function enhanceBullet(
  bullet: string,
  role: string,
  company: string | undefined,
  apiConfig: APIKeyConfig | null
) {
  try {
    const res = await client.post(
      '/api/ai/enhance-bullet',
      { bullet, role, company },
      { headers: buildHeaders(apiConfig) }
    );
    return { data: res.data.enhanced as string, error: null };
  } catch (err) {
    return { data: null, error: extractError(err) };
  }
}

export async function writeSummary(
  experience: unknown[],
  targetRole: string,
  skills: string[],
  apiConfig: APIKeyConfig | null
) {
  try {
    const res = await client.post(
      '/api/ai/write-summary',
      { experience, targetRole, skills },
      { headers: buildHeaders(apiConfig) }
    );
    return { data: res.data.summary as string, error: null };
  } catch (err) {
    return { data: null, error: extractError(err) };
  }
}

export async function analyzeATS(
  jobDescription: string,
  currentResume: unknown,
  apiConfig: APIKeyConfig | null
) {
  try {
    const res = await client.post(
      '/api/ai/ats-keywords',
      { jobDescription, currentResume },
      { headers: buildHeaders(apiConfig) }
    );
    return { data: res.data.analysis, error: null };
  } catch (err) {
    return { data: null, error: extractError(err) };
  }
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await client.get('/health');
    return res.data.status === 'ok';
  } catch {
    return false;
  }
}

export type { AIProvider };
