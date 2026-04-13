// =====================================================
// Shared TypeScript types for the Resume Builder API
// =====================================================

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  bullets: string[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements?: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  bullets: string[];
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillCategory[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  sectionOrder: string[];
}

// AI Request/Response types
export interface GenerateResumeRequest {
  jobTitle: string;
  level: 'entry' | 'mid' | 'senior';
  skills?: string[];
  industry?: string;
}

export interface EnhanceBulletRequest {
  bullet: string;
  role: string;
  company?: string;
}

export interface WriteSummaryRequest {
  experience: ExperienceEntry[];
  targetRole: string;
  skills?: string[];
}

export interface ATSKeywordsRequest {
  jobDescription: string;
  currentResume: Partial<ResumeData>;
}

export interface ATSAnalysisResponse {
  score: number;
  breakdown: {
    category: string;
    score: number;
    maxScore: number;
    feedback: string;
  }[];
  missingKeywords: string[];
  suggestions: string[];
}

// Provider types
export type AIProvider = 'groq' | 'openai' | 'custom';

export interface ProviderConfig {
  provider: AIProvider;
  apiKey: string;
  baseURL?: string;
  model?: string;
}
