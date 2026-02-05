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
  const { stream, isReady } = useCamera();

  useEffect(() => {
    if (videoRef.current && stream && isReady) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => console.log("Video play error:", e));
    }
  }, [stream, isReady]);

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

        // 2. 樹種判定（修正版：40x40ピクセル平均）
        const sampleSize = 40;
        const centerX = Math.floor(canvas.width / 2);
        const centerY = Math.floor(canvas.height / 2);
        
        // 中心からオフセットして領域を取得
        const offset = Math.floor(sampleSize / 2);
        const p = ctx.getImageData(centerX - offset, centerY - offset, sampleSize, sampleSize).data;
        
        let rSum = 0, gSum = 0, bSum = 0;
        for(let i=0; i<p.length; i+=4) {
            rSum += p[i]; gSum += p[i+1]; bSum += p[i+2];
        }
        
        // ピクセル数で割って平均を算出
        const pixelCount = p.length / 4;
        const avgR = rSum / pixelCount;
        const avgG = gSum / pixelCount;
        const avgB = bSum / pixelCount;
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