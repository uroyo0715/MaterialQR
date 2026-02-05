import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

interface CameraContextType {
  stream: MediaStream | null;
  isReady: boolean;
  error: Error | null;
}

const CameraContext = createContext<CameraContextType>({
  stream: null,
  isReady: false,
  error: null,
});

export const useCamera = () => useContext(CameraContext);

export const CameraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let mounted = true;

    const initCamera = async () => {
      // すでにストリームが存在し、アクティブなら再利用
      if (streamRef.current && streamRef.current.active) {
        setStream(streamRef.current);
        setIsReady(true);
        return;
      }

      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // 背面カメラ
          audio: false,
        });

        if (mounted) {
          streamRef.current = newStream;
          setStream(newStream);
          setIsReady(true);
        }
      } catch (err) {
        if (mounted) {
          console.error("Camera Init Error:", err);
          setError(err as Error);
        }
      }
    };

    initCamera();

    // アプリが完全に終了するまでクリーンアップしない
    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return (
    <CameraContext.Provider value={{ stream, isReady, error }}>
      {children}
    </CameraContext.Provider>
  );
};