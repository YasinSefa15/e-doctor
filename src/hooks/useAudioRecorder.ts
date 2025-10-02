import { useState, useRef, useCallback } from 'react';

export type RecordingState = 'idle' | 'recording' | 'processing';

interface UseAudioRecorderReturn {
  recordingState: RecordingState;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  error: string | null;
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Silence detection
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const checkSilence = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

    // Calculate average volume
    const avg = dataArrayRef.current.reduce((sum, val) => sum + Math.abs(val - 128), 0) / dataArrayRef.current.length;

    // Ses eşiği (threshold), küçükse sessizlik kabul edilir
    const SILENCE_THRESHOLD = 5;

    if (avg < SILENCE_THRESHOLD) {
      // Sessizlik varsa zamanlayıcıyı başlat
      if (!silenceTimeoutRef.current) {
        silenceTimeoutRef.current = setTimeout(() => {
          if (mediaRecorderRef.current?.state === 'recording') {
            stopRecording();
          }
        }, 3000); // 3 saniye sessizlik
      }
    } else {
      // Ses varsa zamanlayıcıyı sıfırla
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
    }

    requestAnimationFrame(checkSilence);
  };

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Silence detection setup
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 2048;
      const bufferLength = analyserRef.current.fftSize;
      dataArrayRef.current = new Uint8Array(bufferLength);

      checkSilence(); // Başlat

      mediaRecorder.start();
      setRecordingState('recording');
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Mikrofona erişim izni gerekli / Microphone access required');
      setRecordingState('idle');
    }
  }, []);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;

      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        resolve(null);
        return;
      }

      // 🔇 Temizleme işlemleri
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];
        mediaRecorderRef.current = null;
        setRecordingState('idle');
        resolve(audioBlob);
      };

      mediaRecorder.stop();
    });
  }, []);

  return {
    recordingState,
    startRecording,
    stopRecording,
    error,
  };
}
