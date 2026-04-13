import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { useResume } from '../../../context/ResumeContext';
import { EducationEntry } from '../../../types/resume';
import styles from '../StepForm.module.css';

function generateId() { return Math.random().toString(36).slice(2, 9); }

function newEntry(): EducationEntry {
  return {
    id: generateId(),
    institution: '', degree: '', field: '',
    startDate: '', endDate: '', gpa: '', achievements: [],
  };
}

export default function EducationStep() {
  const { resume, dispatch } = useResume();
  const [expanded, setExpanded] = useState<string | null>(null);
  const entries = resume.education;

  const update = (id: string, field: keyof EducationEntry, value: unknown) => {
    dispatch({
      type: 'UPDATE_EDUCATION',
      payload: entries.map(e => e.id === id ? { ...e, [field]: value } : e),
    });
  };

  const addEntry = () => {
    const entry = newEntry();
    dispatch({ type: 'UPDATE_EDUCATION', payload: [...entries, entry] });
    setExpanded(entry.id);
  };

  const removeEntry = (id: string) =>
    dispatch({ type: 'UPDATE_EDUCATION', payload: entries.filter(e => e.id !== id) });

  return (
    <div className={styles.stepForm}>
      <div className={styles.stepHeader}>
        <h3>Education</h3>
        <p>Include your degrees, institutions, and relevant coursework or honors.</p>
      </div>

      <div className={styles.fields}>
        {entries.length === 0 && (
          <div className={styles.emptyState}><p>No education added yet.</p></div>
        )}

        {entries.map((entry) => (
          <div key={entry.id} className={styles.entryCard}>
            <div className={styles.entryHeader} onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}>
              <GripVertical size={16} className={styles.grip} />
              <div className={styles.entryTitle}>
                <strong>{entry.degree || 'Degree'} {entry.field && `in ${entry.field}`}</strong>
                {entry.institution && <span> @ {entry.institution}</span>}
              </div>
              <div className={styles.entryMeta}>
                {entry.endDate}
                {expanded === entry.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              <button className="btn btn-danger btn-icon btn-sm" onClick={(e) => { e.stopPropagation(); removeEntry(entry.id); }}>
                <Trash2 size={14} />
              </button>
            </div>

            {expanded === entry.id && (
              <div className={styles.entryBody}>
                <div className="form-group">
                  <label className="form-label">Institution *</label>
                  <input className="form-input" type="text" placeholder="Massachusetts Institute of Technology"
                    value={entry.institution} onChange={e => update(entry.id, 'institution', e.target.value)} />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Degree</label>
                    <select className="form-select" value={entry.degree} onChange={e => update(entry.id, 'degree', e.target.value)}>
                      <option value="">Select degree</option>
                      <option>Bachelor of Science</option>
                      <option>Bachelor of Arts</option>
                      <option>Master of Science</option>
                      <option>Master of Arts</option>
                      <option>Master of Business Administration</option>
                      <option>Doctor of Philosophy</option>
                      <option>Associate Degree</option>
                      <option>High School Diploma</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Field of Study</label>
                    <input className="form-input" type="text" placeholder="Computer Science"
                      value={entry.field} onChange={e => update(entry.id, 'field', e.target.value)} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input className="form-input" type="text" placeholder="Aug 2020"
                      value={entry.startDate} onChange={e => update(entry.id, 'startDate', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date (or Expected)</label>
                    <input className="form-input" type="text" placeholder="May 2024"
                      value={entry.endDate} onChange={e => update(entry.id, 'endDate', e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">GPA (optional)</label>
                  <input className="form-input" type="text" placeholder="3.8 / 4.0"
                    value={entry.gpa || ''} onChange={e => update(entry.id, 'gpa', e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Achievements / Coursework (optional)</label>
                  <textarea className="form-textarea" rows={2}
                    placeholder="Dean's List, Summa Cum Laude, Relevant coursework: Algorithms, Machine Learning..."
                    value={(entry.achievements || []).join('\n')}
                    onChange={e => update(entry.id, 'achievements', e.target.value.split('\n'))} />
                </div>
              </div>
            )}
          </div>
        ))}

        <button className={`btn btn-secondary ${styles.addBtn}`} onClick={addEntry}>
          <Plus size={16} /> Add Education
        </button>

        <div className={styles.tip}>
          💡 <strong>Pro Tip:</strong> Include GPA only if it's 3.5+. For recent graduates, put education before experience.
        </div>
      </div>
    </div>
  );
}
