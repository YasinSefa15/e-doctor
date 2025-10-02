import { Mic, ArrowLeft, Bot, User } from 'lucide-react';
import { useState } from 'react';
import { Language, Message } from '../types';
import { t } from '../i18n/translations';
import { generateAIResponse } from '../services/geminiService';

interface VoiceModeProps {
  language: Language;
  onBack: () => void;
}

const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

export default function VoiceMode({ language, onBack }: VoiceModeProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleRecord = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      setIsRecording(false);
      setLoading(true);

      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
   
      try {
        const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
          method: 'POST',
          headers: {
            'xi-api-key': apiKey,
          },
          body: {...formData,model_id:"scribe_v"},
        });

        const data = await response.json();
        const userText = data?.text;

        if (!userText) throw new Error('Ses tanıma başarısız');

        // 1. Kullanıcı mesajını göster
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: userText,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);

        // 2. AI cevabını al ve göster
        const aiResponseText = await generateAIResponse(userText, language);

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponseText,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (err) {
        console.error(err);
        alert(t('errorSpeechToText', language));
      } finally {
        setLoading(false);
      }
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 5000); // 5 saniye kayıt
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex flex-col p-8 animate-fadeIn">
      <button
        onClick={onBack}
        className="self-start flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-all duration-300"
      >
        <ArrowLeft className="w-6 h-6" />
        <span className="text-lg">{t('backToModes', language)}</span>
      </button>

      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="relative animate-slideUp" onClick={handleRecord}>
          <div className="relative z-10 w-80 h-80 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl cursor-pointer">
            <Mic className={`w-40 h-40 text-white ${isRecording ? 'animate-bounce' : 'animate-pulse'}`} />
          </div>
        </div>

        {loading && (
          <p className="text-xl text-gray-600">
            {language === 'tr' ? 'Yanıt alınıyor...' : 'Getting response...'}
          </p>
        )}

        <div className="w-full max-w-2xl space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600'
                    : 'bg-green-600'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-6 h-6 text-white" />
                ) : (
                  <Bot className="w-6 h-6 text-white" />
                )}
              </div>
              <div
                className={`flex-1 max-w-2xl ${
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
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
