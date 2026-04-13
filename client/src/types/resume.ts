// =====================================================
// Core TypeScript interfaces for Resume Builder
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
  sectionOrder: SectionKey[];
}

export type SectionKey = 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications';
export type TemplateId = 'modern' | 'classic' | 'minimal' | 'creative';
export type AIProvider = 'groq' | 'openai' | 'custom';
export type ThemeMode = 'light' | 'dark';

export interface APIKeyConfig {
  provider: AIProvider;
  apiKey: string;
  baseURL?: string;
  model?: string;
}

export interface AppSettings {
  theme: ThemeMode;
  template: TemplateId;
  apiKeyConfig: APIKeyConfig | null;
  aiUsageCount: number;
}

export const DEFAULT_RESUME: ResumeData = {
  personal: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'],
};

export const WIZARD_STEPS = [
  { id: 'personal', label: 'Personal Info', icon: 'User' },
  { id: 'summary', label: 'Summary', icon: 'FileText' },
  { id: 'experience', label: 'Experience', icon: 'Briefcase' },
  { id: 'education', label: 'Education', icon: 'GraduationCap' },
  { id: 'skills', label: 'Skills', icon: 'Code' },
  { id: 'projects', label: 'Projects', icon: 'FolderOpen' },
] as const;
