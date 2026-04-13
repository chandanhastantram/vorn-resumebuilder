import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

const FREE_TIER_LIMIT = parseInt(process.env.FREE_TIER_RATE_LIMIT || '15');

/**
 * Rate limiter applied only when no user-provided API key is present.
 * If the user sends X-AI-Key header, they bypass the rate limit (BYOK mode).
 */
export const aiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req: Request) => {
    // BYOK users bypass rate limits
    if (req.headers['x-ai-key']) return 1000;
    return FREE_TIER_LIMIT;
  },
  message: {
    error: 'rate_limit_exceeded',
    message: `Free tier limit reached (${FREE_TIER_LIMIT} AI requests per 15 minutes). Add your own Groq or OpenAI API key in Settings to get unlimited access.`,
    code: 'RATE_LIMIT',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'rate_limit_exceeded',
      message: `Free tier limit reached (${FREE_TIER_LIMIT} AI requests per 15 minutes). Add your own Groq or OpenAI API key in Settings to get unlimited access.`,
      code: 'RATE_LIMIT',
      retryAfter: res.getHeader('Retry-After'),
    });
  },
});
