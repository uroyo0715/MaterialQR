import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { musicDatabase } from '../data/musicData';
import { masterDatabase } from '../data/masterData';

interface ScanResult {
    woodType: 'sugi' | 'kurumi' | 'kiri' | 'default';
    qrData: string | null;
    rgb: { r: number, g: number, b: number };
}

export function useCameraScanner() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scanResult, setScanResult] = useState<ScanResult>({
        woodType: 'default',
        qrData: null,
        rgb: { r: 0, g: 0, b: 0 }
    });
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    const detectMaterial = (r: number, g: number, b: number): 'sugi' | 'kurumi' | 'kiri' | 'default' => {
        const brightness = (r + g + b) / 3;
        const redness = r - b;
        if (g > r + 10 || b > r || r - g > 70) return 'default';
        if (brightness > 220 || redness < 15) return 'kiri';
        else if (redness > 35 || brightness < 155) return 'kurumi';
        else return 'sugi';
    };

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        let animationFrameId: number;

        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: "environment" } 
                });
                video.srcObject = stream;
                video.setAttribute("playsinline", "true");
                await video.play();
                requestAnimationFrame(tick);
            } catch (err) {
                console.error("Camera Error:", err);
            }
        };

        const tick = () => {
            if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                // --- ここから修正 ---
                const sampleSize = 40;
                const startX = Math.max(0, (canvas.width / 2) - (sampleSize / 2));
                const startY = Math.max(0, (canvas.height * 0.3) - (sampleSize / 2));
                
                // 指定エリアのピクセルデータを取得
                const sampleData = ctx.getImageData(startX, startY, sampleSize, sampleSize).data;
                
                let rSum = 0, gSum = 0, bSum = 0;
                for(let i=0; i < sampleData.length; i += 4) {
                    rSum += sampleData[i];
                    gSum += sampleData[i+1];
                    bSum += sampleData[i+2];
                }
                
                const count = sampleData.length / 4;
                const r = rSum / count;
                const g = gSum / count;
                const b = bSum / count;
                // --- ここまで修正 ---
                
                const woodType = detectMaterial(r, g, b);

                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert",
                });
                
                // QRがない場合はnullにする
                const newQrData = code ? code.data : null;

                setScanResult(prev => {
                    if (prev.woodType !== woodType || prev.qrData !== newQrData) {
                        return { woodType, qrData: newQrData, rgb: { r, g, b } };
                    }
                    return prev;
                });
            }
            animationFrameId = requestAnimationFrame(tick);
        };

        startCamera();

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (video.srcObject instanceof MediaStream) {
                video.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // 音楽再生
    useEffect(() => {
        if (!scanResult.qrData) {
            // QRが外れたら音楽を止める場合はここに処理を追加（今回は再生継続か、ループ制御）
            return;
        }

        // MasterDBから音楽IDを取得
        const item = masterDatabase[scanResult.qrData];
        let audioPath = "";
        
        if (item) {
            const variation = item.variations[scanResult.woodType] || item.variations.default;
            if (variation && variation.musicId) {
                const song = musicDatabase[variation.musicId];
                if (song) {
                    audioPath = song.variations[scanResult.woodType] || song.variations.default;
                }
            }
        } else {
            const song = musicDatabase[scanResult.qrData];
            if (song) {
                audioPath = song.variations[scanResult.woodType] || song.variations.default;
            }
        }

        if (audioPath) {
            setAudio(prevAudio => {
                if (prevAudio && prevAudio.src.endsWith(audioPath)) {
                    if (prevAudio.paused) prevAudio.play().catch(() => {});
                    return prevAudio;
                }
                
                if (prevAudio) prevAudio.pause();
                const newAudio = new Audio(audioPath);
                newAudio.loop = true;
                newAudio.play().catch(e => console.log("Audio play failed", e));
                return newAudio;
            });
        }
    }, [scanResult.woodType, scanResult.qrData]);

    return { videoRef, canvasRef, scanResult };
}