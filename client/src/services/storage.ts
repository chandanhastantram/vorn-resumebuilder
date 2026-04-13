import { ResumeData, AppSettings } from '../types/resume';

const RESUME_KEY = 'resumebuilder:resume';
const SETTINGS_KEY = 'resumebuilder:settings';

export function saveResume(data: ResumeData): void {
  try {
    localStorage.setItem(RESUME_KEY, JSON.stringify(data));
  } catch { /* quota exceeded, ignore */ }
}

export function loadResume(): ResumeData | null {
  try {
    const raw = localStorage.getItem(RESUME_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    // Never persist actual API key values — store only provider/model info
    const toSave = {
      ...settings,
      apiKeyConfig: settings.apiKeyConfig
        ? { ...settings.apiKeyConfig, apiKey: '' }
        : null,
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(toSave));
  } catch { /* ignore */ }
}

export function loadSettings(): AppSettings | null {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAll(): void {
  localStorage.removeItem(RESUME_KEY);
  localStorage.removeItem(SETTINGS_KEY);
}
