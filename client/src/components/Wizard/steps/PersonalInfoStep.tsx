import { useResume } from '../../../context/ResumeContext';
import styles from '../StepForm.module.css';

export default function PersonalInfoStep() {
  const { resume, dispatch } = useResume();
  const { personal } = resume;

  const update = (field: string, value: string) =>
    dispatch({ type: 'UPDATE_PERSONAL', payload: { [field]: value } });

  return (
    <div className={styles.stepForm}>
      <div className={styles.stepHeader}>
        <h3>Personal Information</h3>
        <p>This goes at the top of your resume. Be accurate and professional.</p>
      </div>

      <div className={styles.fields}>
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input className="form-input" type="text" placeholder="Alex Johnson"
            value={personal.fullName} onChange={e => update('fullName', e.target.value)} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input className="form-input" type="email" placeholder="alex@email.com"
              value={personal.email} onChange={e => update('email', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-input" type="tel" placeholder="+1 (555) 123-4567"
              value={personal.phone} onChange={e => update('phone', e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Location</label>
          <input className="form-input" type="text" placeholder="San Francisco, CA"
            value={personal.location} onChange={e => update('location', e.target.value)} />
        </div>

        <div className={styles.sectionDivider}>
          <span>Online Presence (Optional)</span>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">LinkedIn</label>
            <input className="form-input" type="text" placeholder="linkedin.com/in/username"
              value={personal.linkedin || ''} onChange={e => update('linkedin', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">GitHub</label>
            <input className="form-input" type="text" placeholder="github.com/username"
              value={personal.github || ''} onChange={e => update('github', e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Personal Website / Portfolio</label>
          <input className="form-input" type="text" placeholder="yourportfolio.com"
            value={personal.website || ''} onChange={e => update('website', e.target.value)} />
        </div>

        <div className={styles.tip}>
          💡 <strong>Pro Tip:</strong> Use a professional email (firstname.lastname@gmail.com) and make sure your LinkedIn URL is customized.
        </div>
      </div>
    </div>
  );
}
