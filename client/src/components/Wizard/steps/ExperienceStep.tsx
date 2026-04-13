import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Loader, GripVertical } from 'lucide-react';
import { useResume } from '../../../context/ResumeContext';
import { useAI } from '../../../hooks/useAI';
import { ExperienceEntry } from '../../../types/resume';
import styles from '../StepForm.module.css';

function generateId() { return Math.random().toString(36).slice(2, 9); }

function newEntry(): ExperienceEntry {
  return {
    id: generateId(),
    company: '', position: '', startDate: '', endDate: '',
    current: false, location: '', bullets: [''],
  };
}

export default function ExperienceStep() {
  const { resume, dispatch } = useResume();
  const { enhanceBullet, loading } = useAI();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [enhancingBullet, setEnhancingBullet] = useState<string | null>(null);

  const entries = resume.experience;

  const update = (id: string, field: keyof ExperienceEntry, value: unknown) => {
    dispatch({
      type: 'UPDATE_EXPERIENCE',
      payload: entries.map(e => e.id === id ? { ...e, [field]: value } : e),
    });
  };

  const addEntry = () => {
    const entry = newEntry();
    dispatch({ type: 'UPDATE_EXPERIENCE', payload: [...entries, entry] });
    setExpanded(entry.id);
  };

  const removeEntry = (id: string) =>
    dispatch({ type: 'UPDATE_EXPERIENCE', payload: entries.filter(e => e.id !== id) });

  const updateBullet = (id: string, idx: number, val: string) => {
    const entry = entries.find(e => e.id === id)!;
    const bullets = [...entry.bullets];
    bullets[idx] = val;
    update(id, 'bullets', bullets);
  };

  const addBullet = (id: string) => {
    const entry = entries.find(e => e.id === id)!;
    update(id, 'bullets', [...entry.bullets, '']);
  };

  const removeBullet = (id: string, idx: number) => {
    const entry = entries.find(e => e.id === id)!;
    const bullets = entry.bullets.filter((_, i) => i !== idx);
    update(id, 'bullets', bullets.length ? bullets : ['']);
  };

  const handleEnhance = async (entryId: string, bulletIdx: number) => {
    const entry = entries.find(e => e.id === entryId)!;
    const key = `${entryId}-${bulletIdx}`;
    setEnhancingBullet(key);
    const enhanced = await enhanceBullet(
      entry.bullets[bulletIdx],
      entry.position,
      entry.company
    );
    if (enhanced) updateBullet(entryId, bulletIdx, enhanced);
    setEnhancingBullet(null);
  };

  return (
    <div className={styles.stepForm}>
      <div className={styles.stepHeader}>
        <h3>Work Experience</h3>
        <p>List your most recent positions first. Use action verbs and quantify your impact.</p>
      </div>

      <div className={styles.fields}>
        {entries.length === 0 && (
          <div className={styles.emptyState}>
            <p>No experience added yet. Add your work history below.</p>
          </div>
        )}

        {entries.map((entry) => (
          <div key={entry.id} className={styles.entryCard}>
            <div className={styles.entryHeader} onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}>
              <GripVertical size={16} className={styles.grip} />
              <div className={styles.entryTitle}>
                <strong>{entry.position || 'New Position'}</strong>
                {entry.company && <span> @ {entry.company}</span>}
              </div>
              <div className={styles.entryMeta}>
                {entry.current ? 'Present' : entry.endDate}
                {expanded === entry.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              <button className="btn btn-danger btn-icon btn-sm" onClick={(e) => { e.stopPropagation(); removeEntry(entry.id); }}>
                <Trash2 size={14} />
              </button>
            </div>

            {expanded === entry.id && (
              <div className={styles.entryBody}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Job Title *</label>
                    <input className="form-input" type="text" placeholder="Software Engineer"
                      value={entry.position} onChange={e => update(entry.id, 'position', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company *</label>
                    <input className="form-input" type="text" placeholder="Google"
                      value={entry.company} onChange={e => update(entry.id, 'company', e.target.value)} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input className="form-input" type="text" placeholder="Jan 2022"
                      value={entry.startDate} onChange={e => update(entry.id, 'startDate', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input className="form-input" type="text"
                      placeholder={entry.current ? 'Present' : 'Dec 2024'}
                      value={entry.current ? 'Present' : entry.endDate}
                      disabled={entry.current}
                      onChange={e => update(entry.id, 'endDate', e.target.value)} />
                  </div>
                </div>

                <div className={styles.checkRow}>
                  <input type="checkbox" id={`current-${entry.id}`}
                    checked={entry.current}
                    onChange={e => update(entry.id, 'current', e.target.checked)} />
                  <label htmlFor={`current-${entry.id}`}>I currently work here</label>
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input className="form-input" type="text" placeholder="Remote / San Francisco, CA"
                    value={entry.location} onChange={e => update(entry.id, 'location', e.target.value)} />
                </div>

                {/* Bullet Points */}
                <div className="form-group">
                  <div className={styles.bulletHeader}>
                    <label className="form-label">Key Achievements & Responsibilities</label>
                    <span className={styles.bulletHint}>Use AI to enhance each bullet ✨</span>
                  </div>
                  <div className={styles.bullets}>
                    {entry.bullets.map((b, idx) => (
                      <div key={idx} className={styles.bulletRow}>
                        <span className={styles.bulletDot}>•</span>
                        <textarea
                          className={`form-textarea ${styles.bulletInput}`}
                          rows={2}
                          placeholder="Led development of... resulting in..."
                          value={b}
                          onChange={e => updateBullet(entry.id, idx, e.target.value)}
                        />
                        <div className={styles.bulletActions}>
                          <button
                            className="btn btn-ai btn-icon btn-sm"
                            title="Enhance with AI"
                            onClick={() => handleEnhance(entry.id, idx)}
                            disabled={!b.trim() || (loading && enhancingBullet === `${entry.id}-${idx}`)}
                          >
                            {loading && enhancingBullet === `${entry.id}-${idx}`
                              ? <Loader size={13} className={styles.spin} />
                              : <Sparkles size={13} />}
                          </button>
                          <button
                            className="btn btn-danger btn-icon btn-sm"
                            onClick={() => removeBullet(entry.id, idx)}
                            disabled={entry.bullets.length === 1}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button className="btn btn-ghost btn-sm" onClick={() => addBullet(entry.id)}>
                      <Plus size={14} /> Add bullet point
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <button className={`btn btn-secondary ${styles.addBtn}`} onClick={addEntry}>
          <Plus size={16} /> Add Experience
        </button>

        <div className={styles.tip}>
          💡 <strong>Pro Tip:</strong> Aim for 3-5 bullet points per role. Start each with an action verb (Built, Led, Designed, Optimized) and include a metric (%, $, users, time).
        </div>
      </div>
    </div>
  );
}
