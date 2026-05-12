// src/app/components/ProcessedNewImage.tsx
import React, { useEffect, useState, useRef } from 'react';

interface ProcessedImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ProcessedNewImage({ src, alt, className }: ProcessedImageProps) {
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

      // 1. 画像を描画 (新品なのでそのまま)
      ctx.drawImage(img, 0, 0);

      // Level 1はフィルター加工なし、または微調整のみ
      // 必要であればここで明るさ調整などを入れることができます

      setProcessedSrc(canvas.toDataURL('image/png'));
    };

    img.src = src;

  }, [src]);

  if (!processedSrc) {
    return <div className={`bg-gray-50 animate-pulse ${className}`} />;
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