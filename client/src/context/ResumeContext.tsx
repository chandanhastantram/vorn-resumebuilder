import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { ResumeData, DEFAULT_RESUME, SectionKey } from '../types/resume';
import { loadResume, saveResume } from '../services/storage';

// ─── Actions ──────────────────────────────────────────────────────────────────
type ResumeAction =
  | { type: 'SET_RESUME'; payload: ResumeData }
  | { type: 'UPDATE_PERSONAL'; payload: Partial<ResumeData['personal']> }
  | { type: 'UPDATE_SUMMARY'; payload: string }
  | { type: 'UPDATE_EXPERIENCE'; payload: ResumeData['experience'] }
  | { type: 'UPDATE_EDUCATION'; payload: ResumeData['education'] }
  | { type: 'UPDATE_SKILLS'; payload: ResumeData['skills'] }
  | { type: 'UPDATE_PROJECTS'; payload: ResumeData['projects'] }
  | { type: 'UPDATE_CERTIFICATIONS'; payload: ResumeData['certifications'] }
  | { type: 'UPDATE_SECTION_ORDER'; payload: SectionKey[] }
  | { type: 'RESET' };

function resumeReducer(state: ResumeData, action: ResumeAction): ResumeData {
  switch (action.type) {
    case 'SET_RESUME':
      return action.payload;
    case 'UPDATE_PERSONAL':
      return { ...state, personal: { ...state.personal, ...action.payload } };
    case 'UPDATE_SUMMARY':
      return { ...state, summary: action.payload };
    case 'UPDATE_EXPERIENCE':
      return { ...state, experience: action.payload };
    case 'UPDATE_EDUCATION':
      return { ...state, education: action.payload };
    case 'UPDATE_SKILLS':
      return { ...state, skills: action.payload };
    case 'UPDATE_PROJECTS':
      return { ...state, projects: action.payload };
    case 'UPDATE_CERTIFICATIONS':
      return { ...state, certifications: action.payload };
    case 'UPDATE_SECTION_ORDER':
      return { ...state, sectionOrder: action.payload };
    case 'RESET':
      return DEFAULT_RESUME;
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
interface ResumeContextValue {
  resume: ResumeData;
  dispatch: React.Dispatch<ResumeAction>;
  resetResume: () => void;
  importResume: (data: ResumeData) => void;
}

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [resume, dispatch] = useReducer(resumeReducer, DEFAULT_RESUME, () => {
    return loadResume() ?? DEFAULT_RESUME;
  });

  // Auto-save with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      saveResume(resume);
    }, 500);
    return () => clearTimeout(timer);
  }, [resume]);

  const resetResume = useCallback(() => dispatch({ type: 'RESET' }), []);
  const importResume = useCallback((data: ResumeData) => dispatch({ type: 'SET_RESUME', payload: data }), []);

  return (
    <ResumeContext.Provider value={{ resume, dispatch, resetResume, importResume }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume(): ResumeContextValue {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within ResumeProvider');
  return ctx;
}
