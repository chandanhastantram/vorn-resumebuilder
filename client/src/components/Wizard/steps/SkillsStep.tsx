import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useResume } from '../../../context/ResumeContext';
import { SkillCategory } from '../../../types/resume';
import styles from '../StepForm.module.css';

function generateId() { return Math.random().toString(36).slice(2, 9); }

const PRESET_CATEGORIES = [
  { name: 'Programming Languages', examples: 'Python, JavaScript, TypeScript, Java, C++, Go, Rust' },
  { name: 'Frameworks & Libraries', examples: 'React, Node.js, FastAPI, Spring Boot, Vue.js, Django' },
  { name: 'Cloud & DevOps', examples: 'AWS, GCP, Azure, Docker, Kubernetes, Terraform, CI/CD' },
  { name: 'Databases', examples: 'PostgreSQL, MongoDB, Redis, MySQL, Elasticsearch' },
  { name: 'Tools & Platforms', examples: 'Git, Linux, Jira, Figma, VS Code' },
  { name: 'Soft Skills', examples: 'Team Leadership, Agile, Communication, Problem Solving' },
];

export default function SkillsStep() {
  const { resume, dispatch } = useResume();
  const [newSkillInputs, setNewSkillInputs] = useState<Record<string, string>>({});
  const categories = resume.skills;

  const addCategory = (name?: string) => {
    const cat: SkillCategory = { id: generateId(), name: name || '', skills: [] };
    dispatch({ type: 'UPDATE_SKILLS', payload: [...categories, cat] });
  };

  const removeCategory = (id: string) =>
    dispatch({ type: 'UPDATE_SKILLS', payload: categories.filter(c => c.id !== id) });

  const updateName = (id: string, name: string) =>
    dispatch({ type: 'UPDATE_SKILLS', payload: categories.map(c => c.id === id ? { ...c, name } : c) });

  const addSkill = (id: string) => {
    const input = newSkillInputs[id]?.trim();
    if (!input) return;
    const skills = input.split(',').map(s => s.trim()).filter(Boolean);
    const cat = categories.find(c => c.id === id)!;
    dispatch({ type: 'UPDATE_SKILLS', payload: categories.map(c => c.id === id ? { ...c, skills: [...c.skills, ...skills] } : c) });
    setNewSkillInputs(s => ({ ...s, [id]: '' }));
  };

  const removeSkill = (catId: string, skill: string) => {
    dispatch({
      type: 'UPDATE_SKILLS',
      payload: categories.map(c => c.id === catId
        ? { ...c, skills: c.skills.filter(s => s !== skill) }
        : c
      ),
    });
  };

  return (
    <div className={styles.stepForm}>
      <div className={styles.stepHeader}>
        <h3>Skills</h3>
        <p>Organize skills into categories. Tailor them to match the job description.</p>
      </div>

      <div className={styles.fields}>
        {/* Quick add presets */}
        <div className={styles.presetsSection}>
          <p className={styles.presetsLabel}>Quick add category:</p>
          <div className={styles.presetChips}>
            {PRESET_CATEGORIES.filter(p => !categories.some(c => c.name === p.name)).slice(0, 4).map(p => (
              <button key={p.name} className="tag" onClick={() => addCategory(p.name)}>
                + {p.name}
              </button>
            ))}
          </div>
        </div>

        {categories.length === 0 && (
          <div className={styles.emptyState}><p>No skill categories yet. Add one below or use presets above.</p></div>
        )}

        {categories.map((cat) => (
          <div key={cat.id} className={styles.skillCard}>
            <div className={styles.skillCardHeader}>
              <input
                className={`form-input ${styles.categoryNameInput}`}
                type="text"
                placeholder="Category name (e.g. Programming Languages)"
                value={cat.name}
                onChange={e => updateName(cat.id, e.target.value)}
              />
              <button className="btn btn-danger btn-icon btn-sm" onClick={() => removeCategory(cat.id)}>
                <Trash2 size={14} />
              </button>
            </div>

            <div className={styles.skillTags}>
              {cat.skills.map(skill => (
                <span key={skill} className={`tag ${styles.skillTag}`}>
                  {skill}
                  <button className={styles.skillRemove} onClick={() => removeSkill(cat.id, skill)}>
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>

            <div className={styles.skillInputRow}>
              <input
                className="form-input"
                type="text"
                placeholder="Type skill(s) — separate with commas"
                value={newSkillInputs[cat.id] || ''}
                onChange={e => setNewSkillInputs(s => ({ ...s, [cat.id]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && addSkill(cat.id)}
              />
              <button className="btn btn-secondary btn-sm" onClick={() => addSkill(cat.id)}>
                <Plus size={14} /> Add
              </button>
            </div>
          </div>
        ))}

        <button className={`btn btn-secondary ${styles.addBtn}`} onClick={() => addCategory()}>
          <Plus size={16} /> Add Skill Category
        </button>

        <div className={styles.tip}>
          💡 <strong>Pro Tip:</strong> Match your skills to keywords in the job description. ATS systems scan for exact matches.
        </div>
      </div>
    </div>
  );
}
