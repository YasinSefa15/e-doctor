import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, LogOut, Bot, User } from 'lucide-react';
import { Language, Message } from '../types';
import { t } from '../i18n/translations';
import { generateAIResponse } from '../services/geminiService';

interface TextModeProps {
  language: Language;
  onBack: () => void;
  onEndSession: () => void;
}

export default function TextMode({ language, onBack, onEndSession }: TextModeProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: language === 'tr'
        ? 'Merhaba! Ben e-Doktor, yapay zeka destekli tıbbi asistanınızım. Size nasıl yardımcı olabilirim? Lütfen semptomlarınızı detaylı bir şekilde anlatın.'
        : 'Hello! I am e-Doktor, your AI-powered medical assistant. How can I help you today? Please describe your symptoms in detail.',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponseText = await generateAIResponse(userInput, language);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating AI response:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: language === 'tr'
          ? 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.'
          : 'Sorry, an error occurred. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col animate-fadeIn">
      <div className="bg-white shadow-lg border-b border-gray-200">
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
              <Bot className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('appName', language)}</h1>
                <p className="text-sm text-gray-600">{t('textMode', language)}</p>
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

      <div className="flex-1  flex flex-col max-w-7xl mx-auto w-full">
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
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
                className={`flex-1 max-w-3xl ${
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
                <p className="text-xs text-gray-500 mt-2 px-2">
                  {message.timestamp.toLocaleTimeString(language === 'tr' ? 'tr-TR' : 'en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 animate-slideUp">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 max-w-3xl">
                <div className="inline-block px-6 py-4 rounded-2xl rounded-tl-none bg-white border border-gray-200 shadow-md">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 px-2">{t('aiThinking', language)}</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 bg-white shadow-lg">
          <div className="px-8 py-6">
            <div className="flex gap-4 max-w-5xl mx-auto">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('typeYourSymptoms', language)}
                disabled={isLoading}
                className="flex-1 px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3 font-semibold text-lg"
              >
                <Send className="w-6 h-6" />
                {t('send', language)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
