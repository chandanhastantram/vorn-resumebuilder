import { useState } from 'react';
import { User, FileText, Briefcase, GraduationCap, Code, FolderOpen, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAI } from '../../hooks/useAI';
import PersonalInfoStep from './steps/PersonalInfoStep';
import SummaryStep from './steps/SummaryStep';
import ExperienceStep from './steps/ExperienceStep';
import EducationStep from './steps/EducationStep';
import SkillsStep from './steps/SkillsStep';
import ProjectsStep from './steps/ProjectsStep';
import GenerateModal from './GenerateModal';
import styles from './Wizard.module.css';

const STEPS = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Code },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
];

export default function WizardContainer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showGenerate, setShowGenerate] = useState(false);
  const { setIsSettingsOpen } = useApp();
  const { isOverLimit } = useAI();

  const stepComponents = [
    <PersonalInfoStep />,
    <SummaryStep />,
    <ExperienceStep />,
    <EducationStep />,
    <SkillsStep />,
    <ProjectsStep />,
  ];

  return (
    <div className={styles.wizard}>
      {/* Step Progress */}
      <div className={styles.stepBar}>
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === currentStep;
          const isDone = i < currentStep;
          return (
            <button
              key={step.id}
              className={`${styles.stepBtn} ${isActive ? styles.stepActive : ''} ${isDone ? styles.stepDone : ''}`}
              onClick={() => setCurrentStep(i)}
              title={step.label}
            >
              <Icon size={16} />
              <span className={styles.stepLabel}>{step.label}</span>
              {isDone && <span className={styles.stepCheck}>✓</span>}
            </button>
          );
        })}
      </div>

      {/* AI Generate Banner */}
      <div className={styles.aiBanner}>
        <div className={styles.aiBannerText}>
          <Sparkles size={16} className={styles.aiSpark} />
          <span>Generate entire resume with AI in seconds</span>
        </div>
        <button
          className="btn btn-ai btn-sm"
          onClick={() => isOverLimit ? setIsSettingsOpen(true) : setShowGenerate(true)}
        >
          {isOverLimit ? '🔑 Add Key' : '✨ AI Generate'}
        </button>
      </div>

      {/* Step Content */}
      <div className={styles.stepContent}>
        <div key={currentStep} className="animate-fadeIn">
          {stepComponents[currentStep]}
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.nav}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
          disabled={currentStep === 0}
        >
          <ChevronLeft size={16} /> Back
        </button>
        <span className={styles.stepIndicator}>{currentStep + 1} / {STEPS.length}</span>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setCurrentStep(s => Math.min(STEPS.length - 1, s + 1))}
          disabled={currentStep === STEPS.length - 1}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>

      {showGenerate && (
        <GenerateModal onClose={() => setShowGenerate(false)} />
      )}
    </div>
  );
}
