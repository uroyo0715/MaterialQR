import React, { useState } from 'react';
import { useManualScanner } from '../../hooks/useManualScanner';
import { masterDatabase } from '../../data/masterData';
import { translations, Language } from '../../data/locales';

interface URLScanScreenProps {
  onBack: () => void;
  lang: Language;
}

export function URLScanScreen({ onBack, lang }: URLScanScreenProps) {
  const { videoRef, canvasRef, isCameraReady, captureAndAnalyze } = useManualScanner();
  const t = translations[lang];
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultItemName, setResultItemName] = useState<string>("");
  const [detectedWood, setDetectedWood] = useState<string>("");

  const handleAnalyzeClick = () => {
    if (!isCameraReady) return;
    
    setIsAnalyzing(true);

    setTimeout(() => {
      const result = captureAndAnalyze();
      
      if (result.qrData && masterDatabase[result.qrData]) {
        const item = masterDatabase[result.qrData];
        const woodType = result.woodType;
        const variation = item.variations[woodType] || item.variations.default;
        
        if (variation && variation.url) {
          setResultUrl(variation.url);
          setResultItemName(item.name[lang]); // 多言語対応
          setDetectedWood(woodType);
        } else {
          alert(t.scan_item_unknown);
        }
      } else {
        alert(t.scan_qr_missing);
      }

      setIsAnalyzing(false);
    }, 1000);
  };

  const handleReset = () => {
    setResultUrl(null);
    setResultItemName("");
    setDetectedWood("");
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <div className="relative flex-1 bg-black overflow-hidden">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover opacity-80" muted playsInline />
        <canvas ref={canvasRef} className="hidden" />
        
        {resultUrl ? (
          <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in fade-in">
            <div className="bg-white text-black p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center space-y-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl">🔗</div>
              <div>
                <h3 className="font-bold text-lg">{resultItemName}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {t.label_wood_type}: <span className="font-bold uppercase text-blue-600">{detectedWood}</span>
                </p>
                <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded border break-all line-clamp-2 text-left">
                  {resultUrl}
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <a href={resultUrl} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all">
                  {t.scan_open_page}
                </a>
                <button onClick={handleReset} className="w-full py-3 text-gray-600 font-medium border border-gray-200 rounded-lg hover:bg-gray-50">
                  {t.scan_rescan}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-2 border-white/50 rounded-lg relative">
                <div className="absolute -top-8 w-full text-center text-white/90 text-sm font-bold shadow-black drop-shadow-md whitespace-pre-wrap">
                   {t.scan_guide}
                </div>
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>
              </div>
            </div>
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/50 z-10 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-white font-bold animate-pulse">{t.scan_analyzing}</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="bg-stone-900 p-6 flex flex-col items-center gap-4 pb-10">
        {!resultUrl && (
          <button
            onClick={handleAnalyzeClick}
            disabled={!isCameraReady || isAnalyzing}
            className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all duration-200 shadow-lg ${isAnalyzing ? 'bg-gray-500 scale-90 opacity-50' : 'bg-blue-600 hover:bg-blue-500 active:scale-95'}`}
          >
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </button>
        )}
        <button onClick={onBack} className="text-white/60 text-sm hover:text-white px-8 py-2 rounded-full border border-white/20">
          {t.scan_back}
        </button>
      </div>
    </div>
  );
}