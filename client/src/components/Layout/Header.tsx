import { Sun, Moon, Settings, Download, Sparkles, FileText, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAI } from '../../hooks/useAI';
import styles from './Header.module.css';

export default function Header() {
  const { theme, toggleTheme, setIsSettingsOpen, apiKeyConfig } = useApp();
  const { isByok, usageCount, freeLimit } = useAI();

  const usagePercent = Math.min((usageCount / freeLimit) * 100, 100);

  return (
    <header className={styles.header}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <FileText size={18} />
        </div>
        <div>
          <span className={styles.logoText}>Vorn</span>
          <span className={styles.logoBadge}>Resume Builder</span>
        </div>
      </div>

      {/* Center — AI Usage Indicator */}
      <div className={styles.center}>
        {isByok ? (
          <div className={styles.byokBadge}>
            <Zap size={13} />
            <span>BYOK — Unlimited AI</span>
          </div>
        ) : (
          <div className={styles.usageBar}>
            <Sparkles size={13} className={styles.sparkle} />
            <span className={styles.usageLabel}>
              Free AI: {usageCount}/{freeLimit}
            </span>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${usagePercent}%` }}
                data-warning={usagePercent > 70}
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={`btn btn-ghost btn-icon ${styles.themeBtn}`}
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className={`btn btn-secondary btn-sm ${styles.settingsBtn}`}
          onClick={() => setIsSettingsOpen(true)}
          title="API Key Settings"
        >
          <Settings size={15} />
          <span>
            {apiKeyConfig?.apiKey ? 'Key Active' : 'Add API Key'}
          </span>
        </button>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => window.dispatchEvent(new CustomEvent('export-pdf'))}
        >
          <Download size={15} />
          Export PDF
        </button>
      </div>
    </header>
  );
}
