// src/app/components/ProcessedVintageImage.tsx

import React, { useEffect, useState, useRef } from 'react';

interface ProcessedImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ProcessedVintageImage({ src, alt, className }: ProcessedImageProps) {
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // 1. 画像を描画
      ctx.drawImage(img, 0, 0);

      // 2. ピクセルデータ取得・加工 (セピア・コントラスト等)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // --- 加工処理 (前回と同じ設定) ---
        // Sepia
        const tr = 0.393 * r + 0.769 * g + 0.189 * b;
        const tg = 0.349 * r + 0.686 * g + 0.168 * b;
        const tb = 0.272 * r + 0.534 * g + 0.131 * b;
        r = r * 0.4 + tr * 0.6;
        g = g * 0.4 + tg * 0.6;
        b = b * 0.4 + tb * 0.6;

        // Contrast
        r = (r - 128) * 1.15 + 128;
        g = (g - 128) * 1.15 + 128;
        b = (b - 128) * 1.15 + 128;

        // Brightness
        r *= 0.85;
        g *= 0.85;
        b *= 0.85;

        // Saturate
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        r = lum + (r - lum) * 0.7;
        g = lum + (g - lum) * 0.7;
        b = lum + (b - lum) * 0.7;

        // Hue tweak
        r += 5; 
        b -= 5;

        data[i] = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
      }

      ctx.putImageData(imageData, 0, 0);

      // 3. オーバーレイ（周辺減光）の修正
      ctx.globalCompositeOperation = 'source-over';
      
      // 修正: 中心を画像のど真ん中に設定
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // 修正: 半径を大きくしてグラデーションをなだらかにする
      // 画像の対角線の長さの半分より少し大きくすることで、隅までカバーしつつ緩やかにする
      const radius = Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2)) * 0.6;

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      
      // 修正: グラデーションの分岐点を調整
      // 0% - 40%: 完全に透明 (中心の被写体をクリアに見せる)
      gradient.addColorStop(0, 'rgba(139, 69, 19, 0)');
      gradient.addColorStop(0.4, 'rgba(139, 69, 19, 0)'); 
      
      // 70%: わずかに色づく
      gradient.addColorStop(0.7, 'rgba(139, 69, 19, 0.1)');
      
      // 100%: 外側を暗くするが、濃すぎないように不透明度を下げる (0.4 -> 0.3)
      gradient.addColorStop(1, 'rgba(60, 30, 0, 0.3)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      setProcessedSrc(canvas.toDataURL('image/png'));
    };

    img.src = src;

  }, [src]);

  if (!processedSrc) {
    return <div className={`bg-[#d4c4a8] animate-pulse ${className}`} />;
  }

  return (
    <img 
      src={processedSrc} 
      alt={alt} 
      className={className}
      style={{ transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)' }}
    />
  );
}