// src/app/components/MusicScanScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useManualScanner } from '../../hooks/useManualScanner';
import { masterDatabase } from '../../data/masterData';
import { musicDatabase } from '../../data/musicData'; 
import { translations, Language } from '../../data/locales';
// 画像表示用コンポーネントをインポート
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MusicScanScreenProps {
  onBack: () => void;
  lang: Language;
}

export function MusicScanScreen({ onBack, lang }: MusicScanScreenProps) {
  const { videoRef, canvasRef, isCameraReady, captureAndAnalyze } = useManualScanner();
  const t = translations[lang];

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  // imageを追加
  const [currentTrack, setCurrentTrack] = useState<{ title: string; wood: string; image?: string } | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 樹種IDを翻訳テキストに変換するヘルパー関数
  const getWoodDisplayName = (woodId: string): string => {
    const woodMap: { [key: string]: string } = {
      sugi: (t as any).wood_sugi || "杉",
      kiri: (t as any).wood_kiri || "桐",
      kurumi: (t as any).wood_kurumi || "胡桃",
    };
    return woodMap[woodId] || woodId.toUpperCase();
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const analyzeWoodType = (canvas: HTMLCanvasElement): string => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return "sugi";

    const w = canvas.width;
    const h = canvas.height;
    const imageData = ctx.getImageData(Math.floor(w/2)-5, Math.floor(h/2)-5, 10, 10);
    const data = imageData.data;
    
    let rSum = 0, gSum = 0, bSum = 0;
    for(let i=0; i<data.length; i+=4) {
        rSum += data[i]; gSum += data[i+1]; bSum += data[i+2];
    }
    const count = data.length / 4;
    const avgR = rSum / count;
    const avgLum = (rSum + gSum + bSum) / (count * 3);

    if (avgLum > 180) return "kiri";
    if (avgLum < 100) return "kurumi";
    if (avgR > gSum/count + 10) return "sugi";
    return "sugi";
  };

  const handleAnalyzeClick = () => {
    if (!isCameraReady) return;
    
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentTrack(null);
      return; 
    }

    setIsAnalyzing(true);
    setStatusMessage(null);

    setTimeout(() => {
      try {
        const result = captureAndAnalyze();
        const canvas = canvasRef.current;
        
        let detectedWood = "sugi";
        if (canvas) {
           detectedWood = analyzeWoodType(canvas);
        }

        if (result.qrData) {
          if (masterDatabase[result.qrData]) {
            const item = masterDatabase[result.qrData];
            const variation = item.variations[detectedWood] || item.variations.default;
            const musicId = variation.musicId;

            if (musicDatabase[musicId]) {
              const songData = musicDatabase[musicId];
              const audioSrc = (songData.variations as any)[detectedWood] || songData.variations.default;
              
              if (audioSrc) {
                // 画像パスも渡す
                playMusic(audioSrc, songData.title, detectedWood, songData.image);
              } else {
                setStatusMessage("音楽ファイルが見つかりません");
              }
            } else {
              setStatusMessage("音楽データがありません");
            }

          } else {
            setStatusMessage(t.scan_item_unknown || "未登録のアイテムです");
          }
        } else {
          setStatusMessage((t as any).scan_qr_missing || "QRコードが見つかりません");
        }

      } catch (error) {
        console.error(error);
        setStatusMessage("エラーが発生しました");
      } finally {
        setIsAnalyzing(false);
      }
    }, 1000);
  };

  // 引数に image を追加
  const playMusic = (src: string, title: string, wood: string, image?: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    const audio = new Audio(src);
    audio.loop = true; 
    
    audio.play()
      .then(() => {
        audioRef.current = audio;
        setIsPlaying(true);
        // ステートに保存
        setCurrentTrack({ title, wood, image });
      })
      .catch(err => {
        console.error("Playback failed:", err);
        setStatusMessage("再生できませんでした");
      });
  };
  
  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
        {/* 背景のカメラ映像（再生中は少し暗くする） */}
        <video ref={videoRef} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isPlaying ? 'opacity-30 blur-sm' : 'opacity-80'}`} muted playsInline />
        <canvas ref={canvasRef} className="hidden" />

        {!isPlaying && (
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
        )}

        {/* 再生中の表示（デザイン改良） */}
        {isPlaying && currentTrack && (
           <div className="absolute inset-0 z-10 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4">
             
             {/* アルバムアート/写真表示エリア */}
             <div className="relative w-72 h-72 mb-8 shadow-2xl rounded-xl overflow-hidden border border-white/10 group">
                {/* 背景エフェクト */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 animate-pulse"></div>
                
                {currentTrack.image ? (
                  <ImageWithFallback 
                    src={currentTrack.image} 
                    alt={currentTrack.title}
                    className="w-full h-full object-cover transition-transform duration-[20s] ease-linear transform group-hover:scale-110"
                  />
                ) : (
                  // 画像がない場合のダミー表示（音符アイコンなど）
                  <div className="w-full h-full flex items-center justify-center bg-stone-800">
                    <span className="text-6xl">🎵</span>
                  </div>
                )}
             </div>

             {/* 曲情報とコントロール */}
             <div className="text-center text-white p-6 bg-black/60 rounded-3xl border border-white/10 backdrop-blur-xl w-[90%] max-w-sm shadow-xl">
               <h3 className="text-2xl font-bold mb-2 drop-shadow-md">{currentTrack.title}</h3>
               <p className="text-sm text-white/70 uppercase tracking-widest mb-6">
                 {(t as any).label_wood_material || "Material"}: <span className="text-blue-400 font-bold ml-2">{getWoodDisplayName(currentTrack.wood)}</span>
               </p>
               <button 
                 onClick={stopMusic}
                 className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors active:scale-95"
               >
                 {(t as any).music_stop || "Stop Music"}
               </button>
             </div>
           </div>
        )}

        {/* トーストメッセージ */}
        {statusMessage && (
           <div className="absolute top-20 left-0 right-0 z-50 flex justify-center animate-in fade-in slide-in-from-top-4 pointer-events-none">
             <div className="bg-red-500/90 text-white px-6 py-3 rounded-full shadow-lg backdrop-blur-md font-bold text-sm">
               {statusMessage}
             </div>
           </div>
        )}

        {/* 解析中ローディング */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white font-bold animate-pulse">{t.scan_analyzing}</p>
          </div>
        )}
      </div>

      <div className="bg-stone-900 p-6 flex flex-col items-center gap-4 pb-10">
        {!isPlaying && (
          <button
            onClick={handleAnalyzeClick}
            disabled={!isCameraReady || isAnalyzing}
            className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all duration-200 shadow-lg ${isAnalyzing ? 'bg-gray-500 scale-90 opacity-50' : 'bg-blue-600 hover:bg-blue-500 active:scale-95'}`}
          >
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </button>
        )}
        <button onClick={() => { stopMusic(); onBack(); }} className="text-white/60 text-sm hover:text-white px-8 py-2 rounded-full border border-white/20">
          {t.scan_back}
        </button>
      </div>
    </div>
  );
}