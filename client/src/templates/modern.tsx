import { ResumeData } from '../types/resume';
import './templates.css';

interface Props { resume: ResumeData; }

export default function ModernTemplate({ resume }: Props) {
  const { personal, summary, experience, education, skills, projects, certifications, sectionOrder } = resume;

  const allSkills = skills.flatMap(cat => cat.skills);

  const renderSection = (section: string) => {
    switch (section) {
      case 'summary':
        return summary ? (
          <section key="summary" className="tmpl-section">
            <h2 className="tmpl-section-title modern-title">Professional Summary</h2>
            <div className="tmpl-divider modern-divider" />
            <p className="tmpl-summary">{summary}</p>
          </section>
        ) : null;

      case 'experience':
        return experience.length > 0 ? (
          <section key="experience" className="tmpl-section">
            <h2 className="tmpl-section-title modern-title">Experience</h2>
            <div className="tmpl-divider modern-divider" />
            {experience.map(exp => (
              <div key={exp.id} className="tmpl-entry">
                <div className="tmpl-entry-header">
                  <div>
                    <div className="tmpl-entry-title modern-accent">{exp.position}</div>
                    <div className="tmpl-entry-subtitle">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                  </div>
                  <div className="tmpl-entry-date">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                </div>
                {exp.bullets.filter(b => b.trim()).length > 0 && (
                  <ul className="tmpl-bullets">
                    {exp.bullets.filter(b => b.trim()).map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </section>
        ) : null;

      case 'education':
        return education.length > 0 ? (
          <section key="education" className="tmpl-section">
            <h2 className="tmpl-section-title modern-title">Education</h2>
            <div className="tmpl-divider modern-divider" />
            {education.map(edu => (
              <div key={edu.id} className="tmpl-entry">
                <div className="tmpl-entry-header">
                  <div>
                    <div className="tmpl-entry-title">{edu.degree} {edu.field && `in ${edu.field}`}</div>
                    <div className="tmpl-entry-subtitle">{edu.institution}</div>
                  </div>
                  <div className="tmpl-entry-right">
                    <div className="tmpl-entry-date">{edu.startDate} – {edu.endDate}</div>
                    {edu.gpa && <div className="tmpl-gpa">GPA: {edu.gpa}</div>}
                  </div>
                </div>
                {edu.achievements && edu.achievements.filter(a => a.trim()).length > 0 && (
                  <p className="tmpl-edu-extra">{edu.achievements.filter(a => a.trim()).join(' · ')}</p>
                )}
              </div>
            ))}
          </section>
        ) : null;

      case 'skills':
        return skills.length > 0 ? (
          <section key="skills" className="tmpl-section">
            <h2 className="tmpl-section-title modern-title">Skills</h2>
            <div className="tmpl-divider modern-divider" />
            <div className="tmpl-skills-grid">
              {skills.map(cat => (
                <div key={cat.id} className="tmpl-skill-cat">
                  <span className="tmpl-skill-cat-name">{cat.name}:</span>
                  <span className="tmpl-skill-list">{cat.skills.join(', ')}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'projects':
        return projects.length > 0 ? (
          <section key="projects" className="tmpl-section">
            <h2 className="tmpl-section-title modern-title">Projects</h2>
            <div className="tmpl-divider modern-divider" />
            {projects.map(proj => (
              <div key={proj.id} className="tmpl-entry">
                <div className="tmpl-entry-header">
                  <div>
                    <div className="tmpl-entry-title modern-accent">
                      {proj.name}
                      {(proj.github || proj.link) && (
                        <span className="tmpl-proj-links">
                          {proj.github && <a href={`https://${proj.github}`} target="_blank" rel="noreferrer"> · GitHub</a>}
                          {proj.link && <a href={`https://${proj.link}`} target="_blank" rel="noreferrer"> · Demo</a>}
                        </span>
                      )}
                    </div>
                    {proj.technologies.length > 0 && (
                      <div className="tmpl-entry-subtitle">{proj.technologies.join(', ')}</div>
                    )}
                  </div>
                </div>
                {proj.description && <p className="tmpl-proj-desc">{proj.description}</p>}
                {proj.bullets.filter(b => b.trim()).length > 0 && (
                  <ul className="tmpl-bullets">
                    {proj.bullets.filter(b => b.trim()).map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </section>
        ) : null;

      case 'certifications':
        return certifications.length > 0 ? (
          <section key="certifications" className="tmpl-section">
            <h2 className="tmpl-section-title modern-title">Certifications</h2>
            <div className="tmpl-divider modern-divider" />
            {certifications.map(cert => (
              <div key={cert.id} className="tmpl-cert">
                <span className="tmpl-cert-name">{cert.name}</span>
                <span className="tmpl-cert-issuer"> · {cert.issuer}</span>
                <span className="tmpl-cert-date">{cert.date}</span>
              </div>
            ))}
          </section>
        ) : null;

      default: return null;
    }
  };

  return (
    <div className="tmpl modern-tmpl">
      {/* Header */}
      <header className="modern-header">
        <div className="modern-header-main">
          {personal.fullName && <h1 className="modern-name">{personal.fullName}</h1>}
          <div className="modern-contact">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>{personal.phone}</span>}
            {personal.location && <span>{personal.location}</span>}
            {personal.linkedin && <span>{personal.linkedin}</span>}
            {personal.github && <span>{personal.github}</span>}
            {personal.website && <span>{personal.website}</span>}
          </div>
        </div>
        {allSkills.length > 0 && (
          <div className="modern-header-skills">
            {allSkills.slice(0, 6).map(s => (
              <span key={s} className="modern-skill-chip">{s}</span>
            ))}
          </div>
        )}
      </header>

      {/* Sections */}
      <div className="tmpl-body">
        {sectionOrder.map(s => renderSection(s))}
      </div>
    </div>
  );
}
