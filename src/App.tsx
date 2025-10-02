import { useState } from 'react';
import { Language, Screen } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import ModeSelection from './components/ModeSelection';
import TextMode from './components/TextMode';
import VoiceMode from './components/VoiceMode';
import EndSession from './components/EndSession';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [language, setLanguage] = useState<Language>('tr');

  const handleStartSession = () => {
    setCurrentScreen('mode-selection');
  };

  const handleSelectMode = (mode: 'text' | 'voice') => {
    if (mode === 'text') {
      setCurrentScreen('text-mode');
    } else {
      setCurrentScreen('voice-mode');
    }
  };

  const handleBackToModes = () => {
    setCurrentScreen('mode-selection');
  };

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
  };

  const handleEndSession = () => {
    setCurrentScreen('end-session');
  };

  const handleRestart = () => {
    setCurrentScreen('welcome');
  };


  return (
    <div className="w-screen h-screen ">
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          language={language}
          onLanguageChange={setLanguage}
          onStartSession={handleStartSession}
        />
      )}

      {currentScreen === 'mode-selection' && (
        <ModeSelection
          language={language}
          onSelectMode={handleSelectMode}
          onBack={handleBackToWelcome}
        />
      )}

      {currentScreen === 'text-mode' && (
        <TextMode
          language={language}
          onBack={handleBackToModes}
          onEndSession={handleEndSession}
        />
      )}

      {currentScreen === 'voice-mode' && (
        <VoiceMode
          language={language}
          onBack={handleBackToModes}
          onEndSession={handleEndSession}
        />
      )}

      {currentScreen === 'end-session' && (
        <EndSession
          language={language}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
