// src/app/components/URLScanScreen.tsx

import React, { useState, useEffect } from 'react';
import { useManualScanner } from '../../hooks/useManualScanner';
import { masterDatabase } from '../../data/masterData';
import { translations, Language } from '../../data/locales';

interface URLScanScreenProps {
  onBack: () => void;
  lang: Language;
}

// テクスチャレベルの定義
type TextureLevel = 1 | 2 | 3;

const LEVEL_LABELS: Record<TextureLevel, { ja: string; en: string }> = {
  1: { ja: "Lv.1 新品", en: "Lv.1 New" },
  2: { ja: "Lv.2 使用感あり", en: "Lv.2 Used" },
  3: { ja: "Lv.3 ヴィンテージ", en: "Lv.3 Vintage" },
};

export function URLScanScreen({ onBack, lang }: URLScanScreenProps) {
  const { videoRef, canvasRef, isCameraReady, captureAndAnalyze } = useManualScanner();
  const t = translations[lang];
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultItemName, setResultItemName] = useState<string>("");
  const [detectedWood, setDetectedWood] = useState<string>("");
  const [detectedLevel, setDetectedLevel] = useState<TextureLevel | null>(null);
  
  // ステータスメッセージ（エラーや案内用）
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // ステータスメッセージを数秒後に消すエフェクト
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // --- 画像解析ロジック ---

  const analyzeImageData = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const w = canvas.width;
    const h = canvas.height;
    const size = 100;
    const startX = Math.max(0, Math.floor(w / 2) - size / 2);
    const startY = Math.max(0, Math.floor(h / 2) - size / 2);

    const imageData = ctx.getImageData(startX, startY, size, size);
    const data = imageData.data;
    
    let rSum = 0, gSum = 0, bSum = 0, lumSum = 0;
    const luminances: number[] = [];

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      rSum += r; gSum += g; bSum += b;
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      luminances.push(lum);
      lumSum += lum;
    }

    const pixelCount = data.length / 4;
    const avgR = rSum / pixelCount;
    const avgG = gSum / pixelCount;
    const avgB = bSum / pixelCount;
    const avgLum = lumSum / pixelCount;

    let varianceSum = 0;
    for (const lum of luminances) varianceSum += Math.pow(lum - avgLum, 2);
    const stdDev = Math.sqrt(varianceSum / pixelCount);

    return { avgR, avgG, avgB, avgLum, stdDev };
  };

  const determineWoodType = (stats: { avgR: number, avgG: number, avgB: number, avgLum: number }): string => {
    const { avgR, avgG, avgB, avgLum } = stats;
    if (avgLum > 180) return "kiri";
    if (avgLum < 100) return "kurumi";
    if (avgR > avgG + 10 && avgR > avgB + 10) return "sugi";
    return "sugi"; 
  };

  const determineTextureLevel = (stdDev: number): TextureLevel => {
    if (stdDev < 20) return 1;
    if (stdDev < 40) return 2;
    return 3;
  };

  const handleAnalyzeClick = () => {
    if (!isCameraReady || !canvasRef.current || !videoRef.current) return;
    
    setIsAnalyzing(true);
    setStatusMessage(null);

    setTimeout(() => {
      try {
        const result = captureAndAnalyze();
        const canvas = canvasRef.current;

        // 画像処理（テクスチャ・樹種）
        const stats = analyzeImageData(canvas!);
        
        if (stats) {
          const woodType = determineWoodType(stats);
          const level = determineTextureLevel(stats.stdDev);
          
          console.log("Analysis Stats:", stats, "Detected:", woodType, "Level:", level);

          // 1. QRコードの有無を確認
          if (result.qrData) {
            // 2. マスタデータ登録の確認
            if (masterDatabase[result.qrData]) {
              const item = masterDatabase[result.qrData];
              const variation = item.variations[woodType] || item.variations.default;
              
              if (variation) {
                setDetectedLevel(level);
                setResultUrl(variation.url);
                setResultItemName(item.name[lang]);
                setDetectedWood(woodType);
              }
            } else {
              // QRはあるがデータ未登録
              setStatusMessage("未登録のアイテムです");
            }
          } else {
             // QR自体がない
             setStatusMessage("QRコードが見つかりません");
          }
        } else {
          setStatusMessage("画像の解析に失敗しました");
        }
      } catch (error) {
        console.error("Analysis Error:", error);
        setStatusMessage("エラーが発生しました");
      } finally {
        // 成功・失敗に関わらず解析モードを終了し、ボタンを押せるようにする
        setIsAnalyzing(false);
      }
    }, 800);
  };

  const handleReset = () => {
    setResultUrl(null);
    setResultItemName("");
    setDetectedWood("");
    setDetectedLevel(null);
    setStatusMessage(null);
  };

  const handleOpenPage = () => {
    if (resultUrl) {
      window.location.href = resultUrl;
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <div className="relative flex-1 bg-black overflow-hidden">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover opacity-80" muted playsInline />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* ステータスメッセージ */}
        {statusMessage && (
           <div className="absolute top-20 left-0 right-0 z-50 flex justify-center animate-in fade-in slide-in-from-top-4 pointer-events-none">
             <div className="bg-red-500/90 text-white px-6 py-3 rounded-full shadow-lg backdrop-blur-md font-bold text-sm">
               {statusMessage}
             </div>
           </div>
        )}

        {resultUrl && detectedLevel ? (
          <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in fade-in">
            <div className="bg-white text-black p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center space-y-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl">🔗</div>
              <div>
                <h3 className="font-bold text-lg">{resultItemName}</h3>
                
                <div className="flex justify-center gap-4 text-sm text-gray-500 mb-2 mt-2">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-400">{t.label_wood_type}</span>
                    <span className="font-bold uppercase text-blue-600">{detectedWood}</span>
                  </div>
                  <div className="w-px bg-gray-300"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-400">Condition</span>
                    <span className={`font-bold ${
                      detectedLevel === 1 ? 'text-green-600' : 
                      detectedLevel === 2 ? 'text-orange-500' : 'text-red-700'
                    }`}>
                      {LEVEL_LABELS[detectedLevel][lang]}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded border break-all line-clamp-2 text-left">
                  {resultUrl}
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <button 
                  onClick={handleOpenPage} 
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
                >
                  {t.scan_open_page}
                </button>
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