import './styles/index.css';
import { AppProvider, useApp } from './context/AppContext';
import { ResumeProvider } from './context/ResumeContext';
import Header from './components/Layout/Header';
import WizardContainer from './components/Wizard/WizardContainer';
import ResumePreview from './components/Preview/ResumePreview';
import APIKeyModal from './components/Settings/APIKeyModal';
import styles from './App.module.css';

function AppContent() {
  const { isSettingsOpen, setIsSettingsOpen } = useApp();

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <div className={styles.editorPane}>
          <WizardContainer />
        </div>
        <div className={styles.previewPane}>
          <ResumePreview />
        </div>
      </main>
      {isSettingsOpen && (
        <APIKeyModal onClose={() => setIsSettingsOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ResumeProvider>
        <AppContent />
      </ResumeProvider>
    </AppProvider>
  );
}
