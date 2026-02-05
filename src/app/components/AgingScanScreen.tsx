import React, { useState, useEffect } from 'react';
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
  // エラーメッセージ管理用のステートを追加
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  const t = translations[lang];

  // メッセージを自動で消去するエフェクト
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 2000); // 2秒後に消える
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleAnalyzeClick = () => {
    if (!isCameraReady) return;
    
    setIsAnalyzing(true);
    setStatusMessage(null); // 前回のメッセージをクリア

    setTimeout(() => {
      try {
        const result = captureAndAnalyze();
        
        // 1. QRコードの有無をチェック
        if (result.qrData) {
            // 2. マスタデータへの登録をチェック
            if (masterDatabase[result.qrData]) {
                // 成功時
                onAnalyzeComplete(result);
                setIsAnalyzing(false);
            } else {
                // QRはあるがデータがない場合
                setStatusMessage(t.scan_item_unknown || "未登録のアイテムです");
            }
        } else {
            // QRコード自体が見つからない場合
            setStatusMessage((t as any).scan_qr_missing || "QRコードが見つかりません");
        }
      } catch (error) {
        console.error(error);
        setStatusMessage("エラーが発生しました");
      } finally {
        // 成功・失敗にかかわらず解析モードを解除（ボタンを押せるように戻す）
        if (!statusMessage) { 
           setIsAnalyzing(false);
        } else {
           setIsAnalyzing(false);
        }
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <div className="relative flex-1 bg-black overflow-hidden">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover opacity-80" muted playsInline />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* ガイド枠 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border-2 border-white/50 rounded-lg relative">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>
          </div>
        </div>

        {/* ステータスメッセージ */}
        {statusMessage && (
           <div className="absolute top-20 left-0 right-0 z-50 flex justify-center animate-in fade-in slide-in-from-top-4 pointer-events-none">
             <div className="bg-red-500/90 text-white px-6 py-3 rounded-full shadow-lg backdrop-blur-md font-bold text-sm">
               {statusMessage}
             </div>
           </div>
        )}

        {/* 解析中のローディング表示 */}
        {isAnalyzing && !statusMessage && (
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