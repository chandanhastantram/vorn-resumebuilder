import { useEffect, useRef } from 'react';
import { Download, Palette } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useApp } from '../../context/AppContext';
import { TemplateId } from '../../types/resume';
import ModernTemplate from '../../templates/modern';
import ClassicTemplate from '../../templates/classic';
import MinimalTemplate from '../../templates/minimal';
import CreativeTemplate from '../../templates/creative';
import styles from './Preview.module.css';

const TEMPLATES: { id: TemplateId; label: string; color: string }[] = [
  { id: 'modern', label: 'Modern', color: '#6366f1' },
  { id: 'classic', label: 'Classic', color: '#0f172a' },
  { id: 'minimal', label: 'Minimal', color: '#10b981' },
  { id: 'creative', label: 'Creative', color: '#f59e0b' },
];

export default function ResumePreview() {
  const { resume } = useResume();
  const { template, setTemplate } = useApp();
  const previewRef = useRef<HTMLDivElement>(null);

  // PDF export via html2pdf
  useEffect(() => {
    const handler = async () => {
      if (!previewRef.current) return;
      // @ts-ignore — html2pdf loaded via CDN Script in index.html
      if (typeof window.html2pdf === 'undefined') {
        alert('PDF export is loading. Please try again in a moment.');
        return;
      }
      const name = resume.personal.fullName || 'Resume';
      // @ts-ignore
      window.html2pdf()
        .set({
          margin: [8, 8, 8, 8],
          filename: `${name.replace(/\s+/g, '_')}_Resume.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(previewRef.current)
        .save();
    };
    window.addEventListener('export-pdf', handler);
    return () => window.removeEventListener('export-pdf', handler);
  }, [resume]);

  const TemplateComponent = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    minimal: MinimalTemplate,
    creative: CreativeTemplate,
  }[template];

  return (
    <div className={styles.previewContainer}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <Palette size={16} />
          <span>Template</span>
          <div className={styles.templatePicker}>
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                className={`${styles.templateBtn} ${template === t.id ? styles.templateActive : ''}`}
                onClick={() => setTemplate(t.id)}
                style={{ '--template-color': t.color } as React.CSSProperties}
                title={t.label}
              >
                <span className={styles.templateDot} />
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => window.dispatchEvent(new CustomEvent('export-pdf'))}
        >
          <Download size={14} /> PDF
        </button>
      </div>

      {/* A4 Preview */}
      <div className={styles.previewScroll}>
        <div className={styles.pageWrapper}>
          <div className={styles.page} ref={previewRef} id="resume-preview">
            <TemplateComponent resume={resume} />
          </div>
        </div>
      </div>
    </div>
  );
}
