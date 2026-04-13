import { useState } from 'react';
import { X, Sparkles, Loader, Zap } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useAI } from '../../hooks/useAI';
import styles from './GenerateModal.module.css';

interface Props { onClose: () => void; }

const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Design', 'Data Science', 'Cybersecurity', 'Product Management'];

export default function GenerateModal({ onClose }: Props) {
  const { importResume, resume } = useResume();
  const { generateResume, loading, error } = useAI();
  const [jobTitle, setJobTitle] = useState('');
  const [level, setLevel] = useState<'entry' | 'mid' | 'senior'>('entry');
  const [industry, setIndustry] = useState('Technology');
  const [skills, setSkills] = useState('');
  const [done, setDone] = useState(false);

  const handleGenerate = async () => {
    const skillsArr = skills.split(',').map(s => s.trim()).filter(Boolean);
    const result = await generateResume(jobTitle, level, skillsArr, industry);
    if (result) {
      importResume({
        ...resume,
        ...result,
        sectionOrder: resume.sectionOrder,
      });
      setDone(true);
      setTimeout(onClose, 1500);
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.modal} animate-scaleIn`}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <div className={styles.headerIcon}><Zap size={20} /></div>
            <div>
              <h2>AI Resume Generator</h2>
              <p>Generate a complete, tailored resume in seconds</p>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        <div className={styles.body}>
          <div className="form-group">
            <label className="form-label">Target Job Title *</label>
            <input className="form-input" type="text"
              placeholder="e.g. Full Stack Engineer, Data Scientist, Product Manager"
              value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Experience Level</label>
              <select className="form-select" value={level} onChange={e => setLevel(e.target.value as 'entry' | 'mid' | 'senior')}>
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (3-6 years)</option>
                <option value="senior">Senior Level (7+ years)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Industry</label>
              <select className="form-select" value={industry} onChange={e => setIndustry(e.target.value)}>
                {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Key Skills (optional)</label>
            <input className="form-input" type="text"
              placeholder="React, Python, Machine Learning, AWS..."
              value={skills} onChange={e => setSkills(e.target.value)} />
          </div>

          {error && (
            <div className={styles.error}>
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-ai"
            onClick={handleGenerate}
            disabled={loading || !jobTitle.trim() || done}
          >
            {done ? (
              <>✅ Resume Generated!</>
            ) : loading ? (
              <><Loader size={16} className={styles.spin} /> Generating...</>
            ) : (
              <><Sparkles size={16} /> Generate Resume</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
