import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical, X } from 'lucide-react';
import { useResume } from '../../../context/ResumeContext';
import { ProjectEntry } from '../../../types/resume';
import styles from '../StepForm.module.css';

function generateId() { return Math.random().toString(36).slice(2, 9); }

function newProject(): ProjectEntry {
  return {
    id: generateId(), name: '', description: '',
    technologies: [], link: '', github: '', bullets: [''],
  };
}

export default function ProjectsStep() {
  const { resume, dispatch } = useResume();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [techInputs, setTechInputs] = useState<Record<string, string>>({});
  const entries = resume.projects;

  const update = (id: string, field: keyof ProjectEntry, value: unknown) =>
    dispatch({ type: 'UPDATE_PROJECTS', payload: entries.map(p => p.id === id ? { ...p, [field]: value } : p) });

  const addProject = () => {
    const p = newProject();
    dispatch({ type: 'UPDATE_PROJECTS', payload: [...entries, p] });
    setExpanded(p.id);
  };

  const removeProject = (id: string) =>
    dispatch({ type: 'UPDATE_PROJECTS', payload: entries.filter(p => p.id !== id) });

  const addTech = (id: string) => {
    const input = techInputs[id]?.trim();
    if (!input) return;
    const techs = input.split(',').map(t => t.trim()).filter(Boolean);
    const proj = entries.find(p => p.id === id)!;
    update(id, 'technologies', [...proj.technologies, ...techs]);
    setTechInputs(s => ({ ...s, [id]: '' }));
  };

  const removeTech = (projId: string, tech: string) => {
    const proj = entries.find(p => p.id === projId)!;
    update(projId, 'technologies', proj.technologies.filter(t => t !== tech));
  };

  const updateBullet = (id: string, idx: number, val: string) => {
    const proj = entries.find(p => p.id === id)!;
    const bullets = [...proj.bullets];
    bullets[idx] = val;
    update(id, 'bullets', bullets);
  };

  return (
    <div className={styles.stepForm}>
      <div className={styles.stepHeader}>
        <h3>Projects</h3>
        <p>Showcase your best work. For CS majors, strong projects can outweigh experience.</p>
      </div>

      <div className={styles.fields}>
        {entries.length === 0 && (
          <div className={styles.emptyState}><p>No projects yet. Add your best work below.</p></div>
        )}

        {entries.map((proj) => (
          <div key={proj.id} className={styles.entryCard}>
            <div className={styles.entryHeader} onClick={() => setExpanded(expanded === proj.id ? null : proj.id)}>
              <GripVertical size={16} className={styles.grip} />
              <div className={styles.entryTitle}>
                <strong>{proj.name || 'New Project'}</strong>
              </div>
              <div className={styles.entryMeta}>
                {proj.technologies.slice(0, 2).join(', ')}
                {expanded === proj.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              <button className="btn btn-danger btn-icon btn-sm" onClick={(e) => { e.stopPropagation(); removeProject(proj.id); }}>
                <Trash2 size={14} />
              </button>
            </div>

            {expanded === proj.id && (
              <div className={styles.entryBody}>
                <div className="form-group">
                  <label className="form-label">Project Name *</label>
                  <input className="form-input" type="text" placeholder="Vorn Resume Builder"
                    value={proj.name} onChange={e => update(proj.id, 'name', e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" rows={2}
                    placeholder="A full-stack web app that uses AI to generate and optimize resumes..."
                    value={proj.description} onChange={e => update(proj.id, 'description', e.target.value)} />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">GitHub Link</label>
                    <input className="form-input" type="text" placeholder="github.com/user/project"
                      value={proj.github || ''} onChange={e => update(proj.id, 'github', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Live Demo</label>
                    <input className="form-input" type="text" placeholder="myproject.vercel.app"
                      value={proj.link || ''} onChange={e => update(proj.id, 'link', e.target.value)} />
                  </div>
                </div>

                {/* Technologies */}
                <div className="form-group">
                  <label className="form-label">Technologies Used</label>
                  <div className={styles.skillTags} style={{ marginBottom: '8px' }}>
                    {proj.technologies.map(t => (
                      <span key={t} className="tag">
                        {t}
                        <button className={styles.skillRemove} onClick={() => removeTech(proj.id, t)}>
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className={styles.skillInputRow}>
                    <input className="form-input" type="text" placeholder="React, TypeScript, Node.js..."
                      value={techInputs[proj.id] || ''}
                      onChange={e => setTechInputs(s => ({ ...s, [proj.id]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && addTech(proj.id)} />
                    <button className="btn btn-secondary btn-sm" onClick={() => addTech(proj.id)}>
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>

                {/* Impact Bullets */}
                <div className="form-group">
                  <label className="form-label">Key Highlights</label>
                  {proj.bullets.map((b, idx) => (
                    <div key={idx} className={styles.bulletRow} style={{ marginBottom: '8px' }}>
                      <span className={styles.bulletDot}>•</span>
                      <input className="form-input" type="text"
                        placeholder="Built X feature achieving Y result..."
                        value={b}
                        onChange={e => updateBullet(proj.id, idx, e.target.value)} />
                    </div>
                  ))}
                  <button className="btn btn-ghost btn-sm" onClick={() => {
                    update(proj.id, 'bullets', [...proj.bullets, '']);
                  }}>
                    <Plus size={14} /> Add bullet
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        <button className={`btn btn-secondary ${styles.addBtn}`} onClick={addProject}>
          <Plus size={16} /> Add Project
        </button>

        <div className={styles.tip}>
          💡 <strong>Pro Tip:</strong> Always link to GitHub and live demos. Mention scale (users, requests/sec, data volume) and technologies used.
        </div>
      </div>
    </div>
  );
}
