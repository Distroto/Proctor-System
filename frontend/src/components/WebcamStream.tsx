import React, { useEffect, useRef, useState } from 'react';

const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws/detect';

interface DetectionResult {
  timestamp: string;
  numFaces: number;
  faces: any;
  error?: string;
}

const FRAME_INTERVAL = 1000; // ms

interface WebcamStreamProps {
  sessionId: string;
}

const WebcamStream: React.FC<WebcamStreamProps> = ({ sessionId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [wsStatus, setWsStatus] = useState('Connecting...');

  useEffect(() => {
    // Get webcam stream
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        setResult({ timestamp: '', numFaces: 0, faces: [], error: 'Webcam access denied' });
      });
  }, []);

  useEffect(() => {
    // Open WebSocket connection
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    ws.onopen = () => setWsStatus('Connected');
    ws.onclose = () => setWsStatus('Disconnected');
    ws.onerror = () => setWsStatus('Error');
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setResult(data);
      } catch (e) {
        setResult({ timestamp: '', numFaces: 0, faces: [], error: 'Invalid response' });
      }
    };
    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    // Send frames at intervals
    const interval = setInterval(() => {
      if (!videoRef.current || !canvasRef.current || !wsRef.current || wsRef.current.readyState !== 1) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (!blob) return;
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          wsRef.current?.send(JSON.stringify({ sessionId, image: base64 }));
        };
        reader.readAsDataURL(blob);
      }, 'image/jpeg');
    }, FRAME_INTERVAL);
    return () => clearInterval(interval);
  }, [sessionId]);

  return (
    <div>
      <h2>Webcam Face Detection</h2>
      <div>Status: {wsStatus}</div>
      <video ref={videoRef} autoPlay playsInline style={{ width: 320, height: 240, border: '1px solid #ccc' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div style={{ marginTop: 16 }}>
        {result && (
          result.error ? (
            <div style={{ color: 'red' }}>Error: {result.error}</div>
          ) : (
            <div>
              <b>Timestamp:</b> {result.timestamp ? new Date(result.timestamp).toLocaleString() : ''}<br />
              <b>Faces Detected:</b> {result.numFaces}
              {result.numFaces > 1 && <span style={{ color: 'red', marginLeft: 8 }}>Suspicious!</span>}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default WebcamStream; 