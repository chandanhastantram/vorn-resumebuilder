import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { aiRouter } from './routes/ai';
import { createLogger } from './utils/logger';

dotenv.config();

const app = express();
const logger = createLogger('server');
const PORT = process.env.PORT || 3001;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Request Logging ──────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/ai', aiRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    groqConfigured: !!process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here',
  });
});

// Root route handler
app.get('/', (_req, res) => {
  res.json({ message: 'Vorn Resume Builder API is running. Please access the application through the frontend client.' });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`🚀 Resume Builder API running on http://localhost:${PORT}`);
  logger.info(`📝 Health check: http://localhost:${PORT}/health`);

  const hasGroqKey = !!process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here';
  if (!hasGroqKey) {
    logger.warn('⚠️  No GROQ_API_KEY found. Only BYOK mode will work. Add your key to .env');
  } else {
    logger.info('✅ Groq default key loaded — free tier active');
  }
});

export default app;
