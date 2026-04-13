import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import * as api from '../services/api';
import { ResumeData, ExperienceEntry } from '../types/resume';

interface UseAIState {
  loading: boolean;
  error: string | null;
}

const FREE_TIER_LIMIT = 15;

export function useAI() {
  const { apiKeyConfig, aiUsageCount, incrementAIUsage } = useApp();
  const [state, setState] = useState<UseAIState>({ loading: false, error: null });

  const isOverLimit = !apiKeyConfig?.apiKey && aiUsageCount >= FREE_TIER_LIMIT;

  const setLoading = (loading: boolean) => setState(s => ({ ...s, loading }));
  const setError = (error: string | null) => setState(s => ({ ...s, error }));

  const generateResume = useCallback(async (
    jobTitle: string,
    level: 'entry' | 'mid' | 'senior',
    skills?: string[],
    industry?: string
  ): Promise<Partial<ResumeData> | null> => {
    setLoading(true);
    setError(null);
    const { data, error } = await api.generateResume({ jobTitle, level, skills, industry }, apiKeyConfig);
    setLoading(false);
    if (error) { setError(error); return null; }
    incrementAIUsage();
    return data;
  }, [apiKeyConfig, incrementAIUsage]);

  const enhanceBullet = useCallback(async (
    bullet: string,
    role: string,
    company?: string
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);
    const { data, error } = await api.enhanceBullet(bullet, role, company, apiKeyConfig);
    setLoading(false);
    if (error) { setError(error); return null; }
    incrementAIUsage();
    return data;
  }, [apiKeyConfig, incrementAIUsage]);

  const writeSummary = useCallback(async (
    experience: ExperienceEntry[],
    targetRole: string,
    skills: string[] = []
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);
    const { data, error } = await api.writeSummary(experience, targetRole, skills, apiKeyConfig);
    setLoading(false);
    if (error) { setError(error); return null; }
    incrementAIUsage();
    return data;
  }, [apiKeyConfig, incrementAIUsage]);

  const analyzeATS = useCallback(async (
    jobDescription: string,
    resume: ResumeData
  ) => {
    setLoading(true);
    setError(null);
    const { data, error } = await api.analyzeATS(jobDescription, resume, apiKeyConfig);
    setLoading(false);
    if (error) { setError(error); return null; }
    incrementAIUsage();
    return data;
  }, [apiKeyConfig, incrementAIUsage]);

  return {
    ...state,
    isOverLimit,
    isByok: !!apiKeyConfig?.apiKey,
    usageCount: aiUsageCount,
    freeLimit: FREE_TIER_LIMIT,
    generateResume,
    enhanceBullet,
    writeSummary,
    analyzeATS,
    clearError: () => setError(null),
  };
}
