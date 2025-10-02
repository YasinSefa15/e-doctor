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
  const rafIdRef = useRef<number | null>(null);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;

      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        resolve(null);
        return;
      }

      // Temizlik
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }

      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
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

      // Silence detection
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 2048;
      const bufferLength = analyser.fftSize;
      const dataArray = new Uint8Array(bufferLength);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;
      dataArrayRef.current = dataArray;

      const SILENCE_THRESHOLD = 5;
      const SILENCE_TIMEOUT = 3000;

      const checkSilence = () => {
        analyser.getByteTimeDomainData(dataArray);
        const avg = dataArray.reduce((sum, val) => sum + Math.abs(val - 128), 0) / dataArray.length;

        if (avg < SILENCE_THRESHOLD) {
          if (!silenceTimeoutRef.current) {
            silenceTimeoutRef.current = setTimeout(() => {
              if (mediaRecorder.state === 'recording') {
                stopRecording();
              }
            }, SILENCE_TIMEOUT);
          }
        } else {
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
          }
        }

        rafIdRef.current = requestAnimationFrame(checkSilence);
      };

      checkSilence(); // Başlat

      mediaRecorder.start();
      setRecordingState('recording');
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Mikrofona erişim izni gerekli / Microphone access required');
      setRecordingState('idle');
    }
  }, [stopRecording]);

  return {
    recordingState,
    startRecording,
    stopRecording,
    error,
  };
}
