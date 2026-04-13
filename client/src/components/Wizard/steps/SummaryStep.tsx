import { useState } from 'react';
import { Sparkles, Loader } from 'lucide-react';
import { useResume } from '../../../context/ResumeContext';
import { useAI } from '../../../hooks/useAI';
import { useApp } from '../../../context/AppContext';
import styles from '../StepForm.module.css';

export default function SummaryStep() {
  const { resume, dispatch } = useResume();
  const { writeSummary, loading, error } = useAI();
  const { setIsSettingsOpen, apiKeyConfig } = useApp();
  const [targetRole, setTargetRole] = useState('');

  const handleAIWrite = async () => {
    if (!targetRole.trim()) return;
    const allSkills = resume.skills.flatMap(s => s.skills);
    const result = await writeSummary(resume.experience, targetRole, allSkills);
    if (result) dispatch({ type: 'UPDATE_SUMMARY', payload: result });
  };

  return (
    <div className={styles.stepForm}>
      <div className={styles.stepHeader}>
        <h3>Professional Summary</h3>
        <p>2-3 sentences that capture your value proposition. This is the first thing recruiters read.</p>
      </div>

      <div className={styles.fields}>
        {/* AI Writing assistant */}
        <div className={styles.aiCard}>
          <div className={styles.aiCardHeader}>
            <Sparkles size={16} className={styles.aiSpark} />
            <span>AI Summary Writer</span>
          </div>
          <div className={styles.aiCardBody}>
            <input
              className="form-input"
              type="text"
              placeholder="Target role (e.g. Software Engineer at Google)"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
            />
            <button
              className="btn btn-ai btn-sm"
              onClick={() => apiKeyConfig === null && !resume.experience.length
                ? setIsSettingsOpen(true)
                : handleAIWrite()
              }
              disabled={loading || !targetRole.trim()}
            >
              {loading ? <><Loader size={14} className={styles.spin} /> Writing...</>
                : <><Sparkles size={14} /> Write with AI</>}
            </button>
          </div>
          {error && <p className={styles.errorMsg}>{error}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Your Summary</label>
          <textarea
            className="form-textarea"
            rows={5}
            placeholder="Results-driven Software Engineer with 3+ years of experience building scalable web applications using React and Node.js. Proven track record of reducing load times by 40% and shipping features used by 100K+ users. Passionate about clean code and exceptional user experiences..."
            value={resume.summary}
            onChange={e => dispatch({ type: 'UPDATE_SUMMARY', payload: e.target.value })}
          />
          <div className={styles.charCount}>
            {resume.summary.length} characters
            {resume.summary.length < 100 && <span className={styles.charHint}> — aim for 150-300</span>}
          </div>
        </div>

        <div className={styles.tip}>
          💡 <strong>Pro Tip:</strong> Lead with years of experience + key skills + a quantified achievement. Avoid "I" — write in third person implicitly.
        </div>
      </div>
    </div>
  );
}
