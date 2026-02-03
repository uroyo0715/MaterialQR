import React from 'react';
import { useCameraScanner } from '../../hooks/useCameraScanner';
import { musicDatabase } from '../../data/musicData';
import { masterDatabase } from '../../data/masterData';
import { translations, Language } from '../../data/locales';

interface MusicScanScreenProps {
  onBack: () => void;
  lang: Language;
}

export function MusicScanScreen({ onBack, lang }: MusicScanScreenProps) {
  const { videoRef, canvasRef, scanResult } = useCameraScanner();
  const t = translations[lang];

  let currentSong = null;
  let displayTitle = "No Music";

  if (scanResult.qrData && masterDatabase[scanResult.qrData]) {
    const item = masterDatabase[scanResult.qrData];
    const woodType = scanResult.woodType;
    const variation = item.variations[woodType] || item.variations.default;
    
    if (variation && variation.musicId) {
       const songData = musicDatabase[variation.musicId];
       if (songData) {
         currentSong = songData; 
         displayTitle = `${songData.title} (${woodType})`;
       }
    }
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <div className="relative flex-1 bg-black overflow-hidden">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover opacity-60" muted playsInline />
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {currentSong ? (
            <div className="w-64 h-64 border border-white/30 rounded-full animate-ping opacity-20"></div>
          ) : (
             <div className="text-white/50 text-sm bg-black/50 px-3 py-1 rounded">{t.music_waiting}</div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-t from-indigo-900 to-black p-6 pb-10 flex flex-col items-center">
        <div className="w-full mb-6 p-4 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 min-h-[100px] flex items-center gap-4">
          <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl shadow-lg ${currentSong ? 'bg-green-500 animate-pulse' : 'bg-gray-700'}`}>
            🎵
          </div>
          <div className="flex-1">
             <p className="text-xs text-indigo-300 uppercase tracking-wider mb-1">{t.music_playing}</p>
             <h3 className="text-white font-bold text-lg leading-tight">{displayTitle}</h3>
             <p className="text-white/60 text-sm mt-1">
               {t.music_detected}: {scanResult.woodType.toUpperCase()}
             </p>
          </div>
        </div>
        <button onClick={onBack} className="text-white/60 text-sm border border-white/20 px-8 py-3 rounded-full">{t.scan_back}</button>
      </div>
    </div>
  );
}