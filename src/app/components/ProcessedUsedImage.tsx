// src/app/components/ProcessedUsedImage.tsx
import React, { useEffect, useState, useRef } from 'react';

interface ProcessedImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ProcessedUsedImage({ src, alt, className }: ProcessedImageProps) {
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

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // --- Level 2 Filter Reproduction ---
        // filter: sepia(0.15) saturate(1.1) brightness(0.95) contrast(1.05)

        // 1. Sepia (0.15) - ほんのり温かみを足す
        const tr = 0.393 * r + 0.769 * g + 0.189 * b;
        const tg = 0.349 * r + 0.686 * g + 0.168 * b;
        const tb = 0.272 * r + 0.534 * g + 0.131 * b;
        r = r * 0.85 + tr * 0.15;
        g = g * 0.85 + tg * 0.15;
        b = b * 0.85 + tb * 0.15;

        // 2. Contrast (1.05)
        r = (r - 128) * 1.05 + 128;
        g = (g - 128) * 1.05 + 128;
        b = (b - 128) * 1.05 + 128;

        // 3. Brightness (0.95)
        r *= 0.95;
        g *= 0.95;
        b *= 0.95;

        // 4. Saturate (1.1) - 少し鮮やかに
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        r = lum + (r - lum) * 1.1;
        g = lum + (g - lum) * 1.1;
        b = lum + (b - lum) * 1.1;

        data[i] = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
      }

      ctx.putImageData(imageData, 0, 0);
      setProcessedSrc(canvas.toDataURL('image/png'));
    };

    img.src = src;

  }, [src]);

  if (!processedSrc) {
    return <div className={`bg-amber-50 animate-pulse ${className}`} />;
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