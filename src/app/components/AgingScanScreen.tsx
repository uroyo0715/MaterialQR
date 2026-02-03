import React, { useState } from 'react';
import { useManualScanner, ScanResult } from '../../hooks/useManualScanner';
import { masterDatabase } from '../../data/masterData';
import { translations, Language } from '../../data/locales';

interface AgingScanScreenProps {
  onAnalyzeComplete: (result: ScanResult) => void;
  onBack: () => void;
  lang: Language;
}

export function AgingScanScreen({ onAnalyzeComplete, onBack, lang }: AgingScanScreenProps) {
  const { videoRef, canvasRef, isCameraReady, captureAndAnalyze } = useManualScanner();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const t = translations[lang];

  const handleAnalyzeClick = () => {
    if (!isCameraReady) return;
    
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = captureAndAnalyze();
      
      // QRコードによるチェックを入れる場合
      if (result.qrData && masterDatabase[result.qrData]) {
          setIsAnalyzing(false);
          onAnalyzeComplete(result);
      } else {
          alert(t.scan_item_unknown);
          setIsAnalyzing(false);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <div className="relative flex-1 bg-black overflow-hidden">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover opacity-80" muted playsInline />
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border-2 border-white/50 rounded-lg relative">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>
          </div>
        </div>

        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white font-serif tracking-widest animate-pulse">{t.scan_analyzing}</p>
          </div>
        )}
      </div>

      <div className="bg-stone-900 p-6 pb-10 flex flex-col gap-4 items-center">
        <p className="text-stone-400 text-sm text-center mb-2 whitespace-pre-wrap">{t.scan_guide}</p>
        <button
          onClick={handleAnalyzeClick}
          disabled={!isCameraReady || isAnalyzing}
          className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all duration-200 ${isAnalyzing ? 'bg-gray-500 scale-90 opacity-50' : 'bg-red-600 hover:bg-red-500 active:scale-95'}`}
        >
          <div className="w-16 h-16 rounded-full border-2 border-stone-900/20"></div>
        </button>
        <button onClick={onBack} className="text-white/60 text-sm mt-2 hover:text-white">{t.scan_cancel}</button>
      </div>
    </div>
  );
}