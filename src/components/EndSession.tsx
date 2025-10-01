import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Heart, Home } from 'lucide-react';
import { Language } from '../types';
import { t } from '../i18n/translations';

interface EndSessionProps {
  language: Language;
  onRestart: () => void;
}

export default function EndSession({ language, onRestart }: EndSessionProps) {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);

  const handleFeedback = (type: 'positive' | 'negative') => {
    setFeedback(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-8 animate-fadeIn">
      <div className="text-center max-w-4xl">
        <div className="mb-8 inline-block animate-slideUp">
          <div className="relative">
            <Heart className="w-32 h-32 text-green-600 animate-pulse" fill="currentColor" />
            <div className="absolute inset-0 bg-green-600 blur-3xl opacity-20 animate-pulse"></div>
          </div>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-6 animate-slideUp" style={{ animationDelay: '100ms' }}>
          {t('thankYou', language)}
        </h1>

        <p className="text-2xl text-gray-600 mb-12 animate-slideUp" style={{ animationDelay: '200ms' }}>
          {language === 'tr'
            ? 'Sağlığınız için e-Doktor\'u tercih ettiğiniz için teşekkür ederiz.'
            : 'Thank you for choosing e-Doktor for your health needs.'}
        </p>

        {feedback === null ? (
          <div className="animate-slideUp" style={{ animationDelay: '300ms' }}>
            <p className="text-xl text-gray-700 mb-8 font-semibold">{t('feedbackPrompt', language)}</p>
            <div className="flex gap-8 justify-center mb-16">
              <button
                onClick={() => handleFeedback('positive')}
                className="group w-32 h-32 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center border-2 border-transparent hover:border-green-500"
              >
                <ThumbsUp className="w-16 h-16 text-green-600 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => handleFeedback('negative')}
                className="group w-32 h-32 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center border-2 border-transparent hover:border-red-500"
              >
                <ThumbsDown className="w-16 h-16 text-red-600 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-16 animate-slideUp">
            <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-8 inline-block mb-8">
              <p className="text-green-900 text-xl font-semibold flex items-center gap-3">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {t('feedbackThankYou', language)}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={onRestart}
          className="group px-16 py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-2xl font-semibold rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95 animate-slideUp"
          style={{ animationDelay: '400ms' }}
        >
          <span className="flex items-center gap-3">
            <Home className="w-8 h-8" />
            {t('startNewSession', language)}
          </span>
        </button>

        <p className="mt-8 text-gray-500 text-sm animate-slideUp" style={{ animationDelay: '500ms' }}>
          {language === 'tr'
            ? 'Acil durumlarda lütfen 112\'yi arayın'
            : 'In case of emergency, please call 112'}
        </p>
      </div>
    </div>
  );
}
