import { Languages, Heart } from 'lucide-react';
import { Language } from '../types';
import { t } from '../i18n/translations';

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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1058 1058"><defs><style>.cls-1{fill:#d0011b;}.cls-2{fill:#f8f8f8;}</style></defs><g id="katman_2" data-name="katman 2"><g id="katman_1-2" data-name="katman 1"><rect className="cls-1" width="1058" height="1058" rx="233.16"/><path className="cls-2" d="M766.43,218.75h0C840.08,223,899.21,245.1,914.78,308.4c9.34,35.85-1,72.76-13.49,99.11a321,321,0,0,1-46.68,72.76C818.3,523.52,775.77,558.34,727,590a840.22,840.22,0,0,1-155.61,81.19c-27,10.56-57.07,21.08-90.28,28.48C450,707,410.57,712.29,376.33,703.86c-32.17-7.37-57.07-24.27-62.26-57-5.19-35.85,12.46-65.36,28-88.56,32.16-47.46,76.77-82.28,127.6-109.7,50.84-28.48,109-51.68,186.75-48.49-63.28,7.36-105.82,26.35-148.37,53.77C471.76,478.18,428.2,514,414.71,563.58c-9.33,33.76,6.22,57,29.05,67.52s59.14,11.58,88.19,8.43c60.18-5.28,110-27.42,151.47-50.62,63.28-35.85,119.32-83.31,157.7-147.64,12.45-21.11,23.86-45.34,30.08-71.73,14.53-71.69-19.71-110.73-70.54-126.53s-125.54-7.4-177.41,6.31C518.46,277.8,434.42,329.48,359.72,390.65,323.41,420.16,290.22,455,259.08,493c-30.07,37.94-57,80.13-74.7,127.59-8.29,26.36-15.56,55.9-11.41,87.53,10.38,84.38,97.52,109.67,196.09,104.39,124.5-7.37,218.91-50.62,305-99.11-77.8,48.49-172.23,94.89-282.19,111.79C268.42,846.22,137.7,823,129.39,706V684.87c8.31-79.1,45.65-137.08,83-185.61,40.46-52.71,85.07-93.84,135.91-131.81,49.8-39,106.86-71.73,169.1-98.08S651.25,223,732.19,218.75h34.24m32.14,146.58c-6.22,14.77-15.56,30.6-22.82,46.4,19.72,2.12,41.5,2.12,62.25,4.21-24.89,9.5-50.82,17.93-76.77,26.39-8.29,16.86-17.63,33.73-25.94,50.62-8.3-10.55-14.52-23.2-22.83-33.76l-74.7,25.33c20.75-14.77,41.51-30.6,62.26-45.37-6.22-10.52-13.49-21.08-19.71-31.64,14.52,1.07,29.05,2.13,43.58,2.13,5.18,0,10.37,2.09,14.52,1.06s11.41-7.4,15.56-10.55c14.53-11.62,30.09-24.27,44.6-34.82"/></g></g></svg>
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
