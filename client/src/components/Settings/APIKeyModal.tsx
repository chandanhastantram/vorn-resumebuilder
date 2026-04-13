import { useState, useEffect } from 'react';
import { X, Key, Zap, Globe, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AIProvider, APIKeyConfig } from '../../types/resume';
import styles from './APIKeyModal.module.css';

const PROVIDERS: { id: AIProvider; name: string; placeholder: string; docsUrl: string; baseURL?: string }[] = [
  {
    id: 'groq',
    name: 'Groq (Recommended — Free & Fast)',
    placeholder: 'gsk_...',
    docsUrl: 'https://console.groq.com',
  },
  {
    id: 'openai',
    name: 'OpenAI (GPT-4o)',
    placeholder: 'sk-...',
    docsUrl: 'https://platform.openai.com/api-keys',
    baseURL: 'https://api.openai.com/v1',
  },
  {
    id: 'custom',
    name: 'Custom (OpenAI-Compatible)',
    placeholder: 'your-api-key',
    docsUrl: '',
  },
];

interface Props {
  onClose: () => void;
}

export default function APIKeyModal({ onClose }: Props) {
  const { apiKeyConfig, setApiKeyConfig } = useApp();

  const [provider, setProvider] = useState<AIProvider>(apiKeyConfig?.provider || 'groq');
  const [apiKey, setApiKey] = useState(apiKeyConfig?.apiKey || '');
  const [baseURL, setBaseURL] = useState(apiKeyConfig?.baseURL || '');
  const [model, setModel] = useState(apiKeyConfig?.model || '');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const selectedProvider = PROVIDERS.find(p => p.id === provider)!;

  const handleSave = () => {
    if (!apiKey.trim()) {
      setApiKeyConfig(null);
    } else {
      const config: APIKeyConfig = {
        provider,
        apiKey: apiKey.trim(),
        baseURL: baseURL.trim() || selectedProvider.baseURL,
        model: model.trim() || undefined,
      };
      setApiKeyConfig(config);
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setApiKeyConfig(null);
    setApiKey('');
    setBaseURL('');
    setModel('');
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.modal} animate-scaleIn`}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <div className={styles.titleIcon}><Key size={18} /></div>
            <div>
              <h2>AI API Key Settings</h2>
              <p>Unlock unlimited AI-powered resume generation</p>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Free Tier Info */}
        <div className={styles.freeTierBanner}>
          <AlertCircle size={16} />
          <div>
            <strong>Free tier included</strong> — You get 15 free AI requests without any key.
            Add your own key for unlimited, faster access.
          </div>
        </div>

        <div className={styles.modalBody}>
          {/* Provider Selection */}
          <div className="form-group">
            <label className="form-label">AI Provider</label>
            <div className={styles.providerGrid}>
              {PROVIDERS.map(p => (
                <button
                  key={p.id}
                  className={`${styles.providerCard} ${provider === p.id ? styles.providerActive : ''}`}
                  onClick={() => setProvider(p.id)}
                >
                  {p.id === 'groq' && <Zap size={16} />}
                  {p.id === 'openai' && <Key size={16} />}
                  {p.id === 'custom' && <Globe size={16} />}
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* API Key Input */}
          <div className="form-group">
            <div className={styles.labelRow}>
              <label className="form-label">API Key</label>
              {selectedProvider.docsUrl && (
                <a href={selectedProvider.docsUrl} target="_blank" rel="noopener noreferrer" className={styles.getKeyLink}>
                  Get free key <ExternalLink size={11} />
                </a>
              )}
            </div>
            <div className={styles.keyInputWrapper}>
              <input
                type={showKey ? 'text' : 'password'}
                className="form-input"
                placeholder={selectedProvider.placeholder}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                autoComplete="off"
              />
              <button
                type="button"
                className={styles.toggleVisibility}
                onClick={() => setShowKey(s => !s)}
              >
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
            <p className={styles.keyNote}>
              🔒 Your key is stored only in your browser and never sent to our servers permanently.
              It's sent per-request via HTTPS and used solely to call the AI provider.
            </p>
          </div>

          {/* Custom Base URL */}
          {provider === 'custom' && (
            <div className="form-group">
              <label className="form-label">Base URL (OpenAI-compatible endpoint)</label>
              <input
                type="text"
                className="form-input"
                placeholder="https://api.together.xyz/v1"
                value={baseURL}
                onChange={e => setBaseURL(e.target.value)}
              />
            </div>
          )}

          {/* Optional model override */}
          <div className="form-group">
            <label className="form-label">Model Override (optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder={
                provider === 'groq' ? 'llama-3.3-70b-versatile' :
                provider === 'openai' ? 'gpt-4o-mini' :
                'your-model-name'
              }
              value={model}
              onChange={e => setModel(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          {apiKeyConfig?.apiKey && (
            <button className="btn btn-danger btn-sm" onClick={handleClear}>
              Remove Key
            </button>
          )}
          <div className={styles.footerActions}>
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button
              className={`btn ${saved ? 'btn-secondary' : 'btn-primary'}`}
              onClick={handleSave}
            >
              {saved ? (
                <><CheckCircle size={16} /> Saved!</>
              ) : (
                <><Key size={16} /> Save Key</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
