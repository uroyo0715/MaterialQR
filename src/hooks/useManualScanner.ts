import { useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { useCamera } from '../context/CameraContext';

export interface ScanResult {
  woodType: string;
  qrData: string | null;
}

export function useManualScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // 自分でカメラを初期化せず、グローバルなストリームをもらう
  const { stream, isReady } = useCamera();

  // ストリームが来たらvideoタグにセット
  useEffect(() => {
    if (videoRef.current && stream && isReady) {
      videoRef.current.srcObject = stream;
      // 自動再生ポリシー対策のため catch を入れる
      videoRef.current.play().catch(e => console.log("Video play error:", e));
    }
  }, [stream, isReady]);

  // --- 以下、解析ロジックは以前と同じ

  const captureAndAnalyze = (): ScanResult => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || !isReady) {
      return { woodType: 'default', qrData: null };
    }

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // 1. QRコード読み取り
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        // 2. 樹種判定（簡易版）
        // 中央付近の色を取得
        const centerX = Math.floor(canvas.width / 2);
        const centerY = Math.floor(canvas.height / 2);
        const p = ctx.getImageData(centerX - 5, centerY - 5, 10, 10).data;
        
        let rSum = 0, gSum = 0, bSum = 0;
        for(let i=0; i<p.length; i+=4) {
            rSum += p[i]; gSum += p[i+1]; bSum += p[i+2];
        }
        const avgR = rSum / (p.length/4);
        const avgG = gSum / (p.length/4);
        const avgB = bSum / (p.length/4);
        const brightness = (avgR + avgG + avgB) / 3;

        let detectedType = "sugi";
        if (brightness > 180) detectedType = "kiri";
        else if (brightness < 100) detectedType = "kurumi";
        else if (avgR > avgG + 20) detectedType = "sugi";

        return {
            woodType: detectedType,
            qrData: code ? code.data : null
        };
      }
    }
    return { woodType: 'default', qrData: null };
  };

  return {
    videoRef,
    canvasRef,
    isCameraReady: isReady,
    captureAndAnalyze
  };
}