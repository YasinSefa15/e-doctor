import { Languages, Heart } from 'lucide-react';
import { Language } from '../types';
import { t } from '../i18n/translations';
import Devlet from '../..Devlet.svg' 

interface WelcomeScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onStartSession: () => void;
}

export default function WelcomeScreen({ language, onLanguageChange, onStartSession }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center justify-center p-8 animate-fadeIn">
      <div className="absolute top-8 right-8 flex gap-2">
        <button
          onClick={() => onLanguageChange('tr')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            language === 'tr'
              ? 'bg-blue-600 text-white shadow-lg scale-105'
              : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
          }`}
        >
          Türkçe
        </button>
        <button
          onClick={() => onLanguageChange('en')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            language === 'en'
              ? 'bg-blue-600 text-white shadow-lg scale-105'
              : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
          }`}
        >
          English
        </button>
      </div>

      <div className="text-center max-w-4xl animate-slideUp">
        <div className="mb-8 inline-block">
          <div className="relative">
            <Heart className="w-32 h-32 text-blue-600 animate-pulse" fill="currentColor" />
            <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-20 animate-pulse"></div>
          </div>
        </div>

        <h1 className="text-7xl font-bold text-gray-900 mb-4 tracking-tight">
          {t('appName', language)}
        </h1>

        <p className="text-3xl text-gray-600 mb-12 font-light">
          {t('tagline', language)}
        </p>

        <div className="mb-16 p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-blue-900 mb-2 text-lg">{t('disclaimerTitle', language)}</h3>
              <p className="text-blue-800 leading-relaxed">{t('disclaimerText', language)}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onStartSession}
          className="group px-16 py-6 bg-gradient-to-r from-red-600 to-red-700 text-white text-2xl font-semibold rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <span className="flex items-center gap-3">
    
             <Devlet width={48} height={48} />
            {t('startSession', language)}
            <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
