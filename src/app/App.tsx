import { useState } from 'react';
import { translations, Language } from '../data/locales'; 
import { HomeScreen } from "./components/HomeScreen";
import { AgingScanScreen } from "./components/AgingScanScreen";
import { MusicScanScreen } from "./components/MusicScanScreen";
import { URLScanScreen } from "./components/URLScanScreen";
import { Level1New } from "./components/Level1New";
import { Level2Used } from "./components/Level2Used";
import { Level3Vintage } from "./components/Level3Vintage";
import { ScanResult } from '../hooks/useManualScanner';

type ScreenState = 
  | 'home' 
  | 'scan_aging' 
  | 'scan_music' 
  | 'scan_url'
  | 'result_lv1' 
  | 'result_lv2'
  | 'result_lv3';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('home');
  const [lang, setLang] = useState<Language>('ja');

  const toggleLang = () => {
    setLang(prev => prev === 'ja' ? 'en' : 'ja');
  };

  const handleSelectMode = (mode: 'url' | 'aging' | 'music') => {
    if (mode === 'aging') setCurrentScreen('scan_aging');
    else if (mode === 'music') setCurrentScreen('scan_music');
    else if (mode === 'url') setCurrentScreen('scan_url');
  };

  const handleAnalyzeComplete = (result: ScanResult) => {
    switch (result.woodType) {
      case 'kiri': setCurrentScreen('result_lv3'); break;
      case 'kurumi': setCurrentScreen('result_lv2'); break;
      case 'sugi':
      default: setCurrentScreen('result_lv1'); break;
    }
  };

  const BackToHomeButton = () => (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        onClick={() => setCurrentScreen('home')}
        className="bg-black/80 text-white px-4 py-2 rounded-full text-sm shadow-lg border border-white/20 hover:bg-black"
      >
        {translations[lang].scan_back}
      </button>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-black font-sans">
      {currentScreen === 'home' && (
        <HomeScreen onSelectMode={handleSelectMode} lang={lang} toggleLang={toggleLang} />
      )}

      {currentScreen === 'scan_aging' && (
        <AgingScanScreen onAnalyzeComplete={handleAnalyzeComplete} onBack={() => setCurrentScreen('home')} lang={lang} />
      )}

      {currentScreen === 'scan_music' && (
        <MusicScanScreen onBack={() => setCurrentScreen('home')} lang={lang} />
      )}

      {currentScreen === 'scan_url' && (
        <URLScanScreen onBack={() => setCurrentScreen('home')} lang={lang} />
      )}

      {currentScreen === 'result_lv1' && <><Level1New lang={lang} /><BackToHomeButton /></>}
      {currentScreen === 'result_lv2' && <><Level2Used lang={lang} /><BackToHomeButton /></>}
      {currentScreen === 'result_lv3' && <><Level3Vintage lang={lang} /><BackToHomeButton /></>}
    </div>
  );
}