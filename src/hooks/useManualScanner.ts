import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

export interface ScanResult {
  woodType: 'sugi' | 'kurumi' | 'kiri' | 'default';
  qrData: string | null;
}

export function useManualScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      if (!videoRef.current) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
        setIsCameraReady(true);
      } catch (err) {
        console.error("Camera Start Error:", err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject instanceof MediaStream) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureAndAnalyze = (): ScanResult => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || !isCameraReady) {
      return { woodType: 'default', qrData: null };
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return { woodType: 'default', qrData: null };

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // 色判定
    const sampleSize = 40;
    const startX = Math.max(0, (canvas.width / 2) - (sampleSize / 2));
    const startY = Math.max(0, (canvas.height * 0.3) - (sampleSize / 2));
    const pixelIndex = (Math.floor(startY + sampleSize/2) * canvas.width + Math.floor(startX + sampleSize/2)) * 4;

    const r = imageData.data[pixelIndex];
    const g = imageData.data[pixelIndex + 1];
    const b = imageData.data[pixelIndex + 2];

    let woodType: ScanResult['woodType'] = 'sugi';
    const brightness = (r + g + b) / 3;
    const redness = r - b;

    if (g > r + 10 || b > r || r - g > 70) {
        woodType = 'default'; 
    } else {
        if (brightness > 200 || redness < 15) {
            woodType = 'kiri';
        } else if (redness > 30 || brightness < 150) {
            woodType = 'kurumi';
        } else {
            woodType = 'sugi';
        }
    }

    // QR判定
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
    });

    return {
      woodType,
      qrData: code ? code.data : null
    };
  };

  return { videoRef, canvasRef, isCameraReady, captureAndAnalyze };
}