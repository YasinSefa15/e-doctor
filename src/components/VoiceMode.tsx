import { Mic, ArrowLeft, Bot, User, LogOut, AlertCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Language, Message } from '../types';
import { t } from '../i18n/translations';
import { generateAIResponse } from '../services/geminiService';
import { transcribeAudio } from '../services/elevenLabsService';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

interface VoiceModeProps {
  language: Language;
  onBack: () => void;
  onEndSession: () => void;
}

export default function VoiceMode({ language, onBack, onEndSession }: VoiceModeProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: language === 'tr'
        ? 'Merhaba! Mikrofon butonuna basarak konuşmaya başlayabilirsiniz. Size nasıl yardımcı olabilirim?'
        : 'Hello! Press the microphone button to start speaking. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [chatHistory, setChatHistory] = useState([])
  
  const { recordingState, startRecording, stopRecording, error: recordingError } = useAudioRecorder();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (recordingState === 'recording') {
      setRecordingTimer(0);
      timerRef.current = setInterval(() => {
        setRecordingTimer(prev => prev + 0.1);
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingTimer(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recordingState]);

  const handleMicrophoneClick = async () => {
    if (recordingState === 'idle' && !isProcessing) {
      await startRecording();

      setTimeout(async () => {
        if (recordingState === 'recording') {
          await handleStopRecording();
        }
      }, 5000);
    } else if (recordingState === 'recording') {
      await handleStopRecording();
    }
  };

  const handleStopRecording = async () => {
    setIsProcessing(true);

    try {
      const audioBlob = await stopRecording();

      if (!audioBlob) {
        throw new Error('No audio recorded');
      }

      const transcribedText = await transcribeAudio(audioBlob);

      if (!transcribedText || transcribedText.trim() === '') {
        throw new Error('No speech detected');
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        text: transcribedText.trim(),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

       chatHistory.push({
        role: 'user',
        parts: [{text : userMessage.text}],
      });

      const aiResponseText = await generateAIResponse(chatHistory, language);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error processing voice input:', error);

      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: language === 'tr'
          ? 'Üzgünüm, sesinizi anlayamadım. Lütfen tekrar deneyin ve daha yüksek sesle konuşun.'
          : 'Sorry, I could not understand your voice. Please try again and speak louder.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex flex-col animate-fadeIn">
      <div className="sticky top-0 bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t('backToModes', language)}</span>
            </button>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <Bot className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('appName', language)}</h1>
                <p className="text-sm text-gray-600">{t('voiceMode', language)}</p>
              </div>
            </div>
          </div>
          <button
            onClick={onEndSession}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">{t('endSession', language)}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex max-w-7xl mx-auto w-full">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="relative mb-12 animate-slideUp">
            {recordingState === 'recording' && (
              <>
                <div className="absolute inset-0 animate-ping">
                  <div className="w-80 h-80 bg-red-500 rounded-full opacity-30"></div>
                </div>
                <div className="absolute inset-0 animate-pulse" style={{ animationDuration: '1s' }}>
                  <div className="w-80 h-80 bg-red-400 rounded-full opacity-40"></div>
                </div>
              </>
            )}

            {recordingState === 'idle' && !isProcessing && (
              <>
                <div className="absolute inset-0 animate-pulse" style={{ animationDuration: '2s' }}>
                  <div className="w-80 h-80 bg-green-400 rounded-full opacity-20"></div>
                </div>
              </>
            )}

            <button
              onClick={handleMicrophoneClick}
              disabled={isProcessing}
              className={`relative z-10 w-80 h-80 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
                recordingState === 'recording'
                  ? 'bg-gradient-to-br from-red-500 to-red-600 scale-105'
                  : isProcessing
                  ? 'bg-gradient-to-br from-gray-400 to-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-br from-green-500 to-green-600 hover:scale-105 active:scale-95 cursor-pointer'
              }`}
            >
              <Mic
                className={`w-40 h-40 text-white ${
                  recordingState === 'recording' ? 'animate-pulse' : isProcessing ? '' : 'animate-pulse'
                }`}
                style={{ animationDuration: '1.5s' }}
              />
            </button>

            {recordingState === 'recording' && (
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg animate-pulse">
                {recordingTimer.toFixed(1)}s
              </div>
            )}
          </div>

          <div className="text-center max-w-2xl animate-slideUp" style={{ animationDelay: '200ms' }}>
            {recordingState === 'idle' && !isProcessing && (
              <p className="text-2xl text-gray-700 font-medium">
                {language === 'tr'
                  ? 'Mikrofona basarak konuşmaya başlayın'
                  : 'Press the microphone to start speaking'}
              </p>
            )}

            {recordingState === 'recording' && (
              <p className="text-2xl text-red-600 font-bold">
                {language === 'tr' ? 'Dinliyorum...' : 'Listening...'}
              </p>
            )}

            {isProcessing && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <p className="text-2xl text-gray-700 font-medium">
                  {language === 'tr' ? 'İşleniyor...' : 'Processing...'}
                </p>
              </div>
            )}

            {recordingError && (
              <div className="mt-4 bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <p className="text-red-800">{recordingError}</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-1/2 border-l border-gray-200 bg-white/50 overflow-y-auto">
          <div className="p-8 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'tr' ? 'Konuşma Geçmişi' : 'Conversation History'}
            </h3>

            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-4 animate-slideUp ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700'
                      : 'bg-gradient-to-br from-green-600 to-green-700'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-6 h-6 text-white" />
                  ) : (
                    <Bot className="w-6 h-6 text-white" />
                  )}
                </div>
                <div
                  className={`flex-1 ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block px-6 py-4 rounded-2xl shadow-md ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white text-gray-900 rounded-tl-none border border-gray-200'
                    }`}
                  >
                    <p className="text-lg leading-relaxed whitespace-pre-wrap">{message.content || message.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 px-2">
                    {message.timestamp.toLocaleTimeString(language === 'tr' ? 'tr-TR' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
