import { ResumeData } from '../types/resume';
import './templates.css';

interface Props { resume: ResumeData; }

export default function MinimalTemplate({ resume }: Props) {
  const { personal, summary, experience, education, skills, projects, sectionOrder } = resume;

  const renderSection = (section: string) => {
    switch (section) {
      case 'summary':
        return summary ? (
          <section key="summary" className="tmpl-section">
            <h2 className="tmpl-section-title minimal-title">Summary</h2>
            <div className="tmpl-divider minimal-divider" />
            <p className="tmpl-summary">{summary}</p>
          </section>
        ) : null;
      case 'experience':
        return experience.length > 0 ? (
          <section key="experience" className="tmpl-section">
            <h2 className="tmpl-section-title minimal-title">Experience</h2>
            <div className="tmpl-divider minimal-divider" />
            {experience.map(exp => (
              <div key={exp.id} className="tmpl-entry">
                <div className="tmpl-entry-header">
                  <div>
                    <div className="tmpl-entry-title">{exp.position}</div>
                    <div className="tmpl-entry-subtitle">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                  </div>
                  <div className="tmpl-entry-date">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                </div>
                {exp.bullets.filter(b => b.trim()).length > 0 && (
                  <ul className="tmpl-bullets">{exp.bullets.filter(b => b.trim()).map((b, i) => <li key={i}>{b}</li>)}</ul>
                )}
              </div>
            ))}
          </section>
        ) : null;
      case 'education':
        return education.length > 0 ? (
          <section key="education" className="tmpl-section">
            <h2 className="tmpl-section-title minimal-title">Education</h2>
            <div className="tmpl-divider minimal-divider" />
            {education.map(edu => (
              <div key={edu.id} className="tmpl-entry">
                <div className="tmpl-entry-header">
                  <div>
                    <div className="tmpl-entry-title">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                    <div className="tmpl-entry-subtitle">{edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</div>
                  </div>
                  <div className="tmpl-entry-date">{edu.startDate} – {edu.endDate}</div>
                </div>
              </div>
            ))}
          </section>
        ) : null;
      case 'skills':
        return skills.length > 0 ? (
          <section key="skills" className="tmpl-section">
            <h2 className="tmpl-section-title minimal-title">Skills</h2>
            <div className="tmpl-divider minimal-divider" />
            <div className="tmpl-skills-grid">
              {skills.map(cat => (
                <div key={cat.id} className="tmpl-skill-cat">
                  <span className="tmpl-skill-cat-name">{cat.name}:</span>
                  <span className="tmpl-skill-list">{cat.skills.join(' · ')}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null;
      case 'projects':
        return projects.length > 0 ? (
          <section key="projects" className="tmpl-section">
            <h2 className="tmpl-section-title minimal-title">Projects</h2>
            <div className="tmpl-divider minimal-divider" />
            {projects.map(proj => (
              <div key={proj.id} className="tmpl-entry">
                <div className="tmpl-entry-title">{proj.name}</div>
                <div className="tmpl-entry-subtitle">{proj.technologies.join(' · ')}</div>
                {proj.description && <p className="tmpl-proj-desc">{proj.description}</p>}
              </div>
            ))}
          </section>
        ) : null;
      default: return null;
    }
  };

  return (
    <div className="tmpl minimal-tmpl">
      <header className="minimal-header">
        <div>
          {personal.fullName && <h1 className="minimal-name">{personal.fullName}</h1>}
        </div>
        <div className="minimal-contact">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.github && <span>{personal.github}</span>}
        </div>
      </header>
      <div className="tmpl-body">{sectionOrder.map(s => renderSection(s))}</div>
    </div>
  );
}
