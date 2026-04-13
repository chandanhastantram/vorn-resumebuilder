import { ResumeData } from '../types/resume';
import './templates.css';

interface Props { resume: ResumeData; }

export default function CreativeTemplate({ resume }: Props) {
  const { personal, summary, experience, education, skills, projects, sectionOrder } = resume;

  const initials = personal.fullName
    ? personal.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const allSkills = skills.flatMap(cat => cat.skills);

  const sidebarSections = ['skills'];
  const mainSections = sectionOrder.filter(s => !sidebarSections.includes(s));

  const renderMainSection = (section: string) => {
    switch (section) {
      case 'summary':
        return summary ? (
          <section key="summary" className="tmpl-section">
            <h2 className="tmpl-section-title creative-title">About</h2>
            <div className="tmpl-divider creative-divider" />
            <p className="tmpl-summary">{summary}</p>
          </section>
        ) : null;
      case 'experience':
        return experience.length > 0 ? (
          <section key="experience" className="tmpl-section">
            <h2 className="tmpl-section-title creative-title">Experience</h2>
            <div className="tmpl-divider creative-divider" />
            {experience.map(exp => (
              <div key={exp.id} className="tmpl-entry">
                <div className="tmpl-entry-header">
                  <div>
                    <div className="tmpl-entry-title" style={{ color: '#f59e0b' }}>{exp.position}</div>
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
            <h2 className="tmpl-section-title creative-title">Education</h2>
            <div className="tmpl-divider creative-divider" />
            {education.map(edu => (
              <div key={edu.id} className="tmpl-entry">
                <div className="tmpl-entry-header">
                  <div>
                    <div className="tmpl-entry-title">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                    <div className="tmpl-entry-subtitle">{edu.institution}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</div>
                  </div>
                  <div className="tmpl-entry-date">{edu.endDate}</div>
                </div>
              </div>
            ))}
          </section>
        ) : null;
      case 'projects':
        return projects.length > 0 ? (
          <section key="projects" className="tmpl-section">
            <h2 className="tmpl-section-title creative-title">Projects</h2>
            <div className="tmpl-divider creative-divider" />
            {projects.map(proj => (
              <div key={proj.id} className="tmpl-entry">
                <div className="tmpl-entry-title" style={{ color: '#f59e0b' }}>{proj.name}</div>
                <div className="tmpl-entry-subtitle">{proj.technologies.join(', ')}</div>
                {proj.description && <p className="tmpl-proj-desc">{proj.description}</p>}
                {proj.bullets.filter(b => b.trim()).length > 0 && (
                  <ul className="tmpl-bullets">{proj.bullets.filter(b => b.trim()).map((b, i) => <li key={i}>{b}</li>)}</ul>
                )}
              </div>
            ))}
          </section>
        ) : null;
      default: return null;
    }
  };

  return (
    <div className="tmpl creative-tmpl">
      {/* Sidebar */}
      <div className="creative-sidebar">
        <div className="creative-avatar">{initials}</div>
        {personal.fullName && <h1 className="creative-name">{personal.fullName}</h1>}

        <div className="creative-sidebar-section">
          <h3>Contact</h3>
          <div className="creative-contact">
            {personal.email && <div className="creative-contact-item">✉ {personal.email}</div>}
            {personal.phone && <div className="creative-contact-item">☎ {personal.phone}</div>}
            {personal.location && <div className="creative-contact-item">📍 {personal.location}</div>}
            {personal.linkedin && <div className="creative-contact-item">in {personal.linkedin}</div>}
            {personal.github && <div className="creative-contact-item">⌥ {personal.github}</div>}
          </div>
        </div>

        {allSkills.length > 0 && (
          <div className="creative-sidebar-section">
            <h3>Skills</h3>
            {allSkills.slice(0, 15).map(skill => (
              <div key={skill} className="creative-skill-item">• {skill}</div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="creative-main">
        {mainSections.map(s => renderMainSection(s))}
      </div>
    </div>
  );
}
