import React from 'react';
import { translations, Language } from '../../data/locales';

interface HomeScreenProps {
  onSelectMode: (mode: 'url' | 'aging' | 'music') => void;
  lang: Language;
  toggleLang: () => void;
}

export function HomeScreen({ onSelectMode, lang, toggleLang }: HomeScreenProps) {
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      <button 
        onClick={toggleLang}
        className="absolute top-6 right-6 z-50 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm font-bold shadow-sm hover:bg-gray-50 flex items-center gap-2"
      >
        <span>🌐</span>
        <span>{lang === 'ja' ? 'English' : '日本語'}</span>
      </button>

      <div className="relative z-10 text-center space-y-8 max-w-md w-full">
        <div className="space-y-2">
          <p className="text-amber-800 font-bold tracking-widest text-sm uppercase">{t.app_title}</p>
          <h1 className="text-4xl font-serif text-gray-900">{t.mode_select}</h1>
        </div>

        <div className="grid gap-4 w-full">
          <button 
            onClick={() => onSelectMode('url')}
            className="w-full py-4 bg-white border border-gray-200 text-gray-800 font-serif rounded-lg shadow-sm hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            {t.mode_url}
          </button>

          <button 
            onClick={() => onSelectMode('aging')}
            className="w-full py-5 bg-amber-900 text-white font-serif text-lg rounded-lg shadow-xl hover:bg-amber-800 flex items-center justify-center gap-2"
          >
            {t.mode_aging}
          </button>

          <button 
            onClick={() => onSelectMode('music')}
            className="w-full py-4 bg-white border border-gray-200 text-gray-800 font-serif rounded-lg shadow-sm hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            {t.mode_music}
          </button>
        </div>

        <p className="text-xs text-gray-400">{t.camera_permission}</p>
      </div>
    </div>
  );
}