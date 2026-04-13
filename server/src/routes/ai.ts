import { Router, Request, Response } from 'express';
import { aiRateLimit } from '../middleware/rate-limit';
import * as groqService from '../services/groq';
import * as openaiService from '../services/openai-compat';
import {
  GenerateResumeRequest,
  EnhanceBulletRequest,
  WriteSummaryRequest,
  ATSKeywordsRequest,
  AIProvider,
} from '../types';
import { createLogger } from '../utils/logger';

const router = Router();
const logger = createLogger('ai-routes');

// ─── Helper: Resolve Provider Config ─────────────────────────────────────────
interface ProviderInfo {
  provider: AIProvider;
  apiKey: string;
  baseURL?: string;
  model?: string;
  isByok: boolean;
}

function resolveProvider(req: Request): ProviderInfo {
  const userKey = req.headers['x-ai-key'] as string | undefined;
  const userProvider = (req.headers['x-ai-provider'] as AIProvider) || 'groq';
  const userBaseURL = req.headers['x-ai-base-url'] as string | undefined;
  const userModel = req.headers['x-ai-model'] as string | undefined;

  if (userKey) {
    // BYOK mode — use user's key
    return {
      provider: userProvider,
      apiKey: userKey,
      baseURL: userBaseURL,
      model: userModel,
      isByok: true,
    };
  }

  // Free tier — use default Groq key
  const defaultKey = process.env.GROQ_API_KEY;
  if (!defaultKey || defaultKey === 'your_groq_api_key_here') {
    throw new Error('GROQ_API_KEY not configured on server. Please add your own API key in Settings.');
  }

  return {
    provider: 'groq',
    apiKey: defaultKey,
    isByok: false,
  };
}

async function callAI<T>(
  providerInfo: ProviderInfo,
  groqFn: () => Promise<T>,
  openaiFn: () => Promise<T>
): Promise<T> {
  if (providerInfo.provider === 'groq' && !providerInfo.baseURL) {
    return groqFn();
  }
  return openaiFn();
}

// ─── Apply Rate Limiting to ALL AI routes ────────────────────────────────────
router.use(aiRateLimit);

// ─── POST /api/ai/generate-resume ─────────────────────────────────────────────
router.post('/generate-resume', async (req: Request, res: Response) => {
  try {
    const provider = resolveProvider(req);
    const body: GenerateResumeRequest = req.body;

    if (!body.jobTitle || !body.level) {
      return res.status(400).json({ error: 'jobTitle and level are required' });
    }

    logger.info(`Generating resume`, { jobTitle: body.jobTitle, level: body.level, byok: provider.isByok });

    const resume = await callAI(
      provider,
      () => groqService.generateResume(body, provider.apiKey, provider.model),
      () => openaiService.generateResumeOpenAI(body, provider.apiKey, provider.baseURL, provider.model)
    );

    return res.json({ success: true, resume });
  } catch (err: unknown) {
    const error = err as Error;
    logger.error('generate-resume error', { error: error.message });
    return res.status(500).json({ error: error.message });
  }
});

// ─── POST /api/ai/enhance-bullet ─────────────────────────────────────────────
router.post('/enhance-bullet', async (req: Request, res: Response) => {
  try {
    const provider = resolveProvider(req);
    const body: EnhanceBulletRequest = req.body;

    if (!body.bullet || !body.role) {
      return res.status(400).json({ error: 'bullet and role are required' });
    }

    logger.info(`Enhancing bullet`, { role: body.role, byok: provider.isByok });

    const enhanced = await callAI(
      provider,
      () => groqService.enhanceBullet(body, provider.apiKey, provider.model),
      () => openaiService.enhanceBulletOpenAI(body, provider.apiKey, provider.baseURL, provider.model)
    );

    return res.json({ success: true, enhanced });
  } catch (err: unknown) {
    const error = err as Error;
    logger.error('enhance-bullet error', { error: error.message });
    return res.status(500).json({ error: error.message });
  }
});

// ─── POST /api/ai/write-summary ───────────────────────────────────────────────
router.post('/write-summary', async (req: Request, res: Response) => {
  try {
    const provider = resolveProvider(req);
    const body: WriteSummaryRequest = req.body;

    if (!body.targetRole) {
      return res.status(400).json({ error: 'targetRole is required' });
    }

    logger.info(`Writing summary`, { role: body.targetRole, byok: provider.isByok });

    const summary = await callAI(
      provider,
      () => groqService.writeSummary(body, provider.apiKey, provider.model),
      () => openaiService.writeSummaryOpenAI(body, provider.apiKey, provider.baseURL, provider.model)
    );

    return res.json({ success: true, summary });
  } catch (err: unknown) {
    const error = err as Error;
    logger.error('write-summary error', { error: error.message });
    return res.status(500).json({ error: error.message });
  }
});

// ─── POST /api/ai/ats-keywords ────────────────────────────────────────────────
router.post('/ats-keywords', async (req: Request, res: Response) => {
  try {
    const provider = resolveProvider(req);
    const body: ATSKeywordsRequest = req.body;

    if (!body.jobDescription) {
      return res.status(400).json({ error: 'jobDescription is required' });
    }

    logger.info(`Analyzing ATS`, { byok: provider.isByok });

    const analysis = await callAI(
      provider,
      () => groqService.analyzeATS(body, provider.apiKey, provider.model),
      () => openaiService.analyzeATSOpenAI(body, provider.apiKey, provider.baseURL, provider.model)
    );

    return res.json({ success: true, analysis });
  } catch (err: unknown) {
    const error = err as Error;
    logger.error('ats-keywords error', { error: error.message });
    return res.status(500).json({ error: error.message });
  }
});

export { router as aiRouter };
