import { MessageSquare, Mic, ArrowLeft } from 'lucide-react';
import { Language } from '../types';
import { t } from '../i18n/translations';

interface ModeSelectionProps {
  language: Language;
  onSelectMode: (mode: 'text' | 'voice') => void;
  onBack: () => void;
}

export default function ModeSelection({ language, onSelectMode, onBack }: ModeSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col p-8 animate-fadeIn">
      <button
        onClick={onBack}
        className="self-start flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-all duration-300"
      >
        <ArrowLeft className="w-6 h-6" />
        <span className="text-lg">{t('returnHome', language)}</span>
      </button>

      <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-16 animate-slideUp">
          {t('modeSelection', language)}
        </h2>

        <div className="grid grid-cols-2 gap-12 max-w-6xl w-full">
          <button
            onClick={() => onSelectMode('text')}
            className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-12 hover:scale-105 active:scale-95 border-2 border-transparent hover:border-blue-500 animate-slideUp"
            style={{ animationDelay: '100ms' }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-8 relative">
                <MessageSquare className="w-32 h-32 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('textMode', language)}</h3>
              <p className="text-xl text-gray-600">{t('textModeDesc', language)}</p>
            </div>
          </button>

          <button
            onClick={() => onSelectMode('voice')}
            className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-12 hover:scale-105 active:scale-95 border-2 border-transparent hover:border-green-500 animate-slideUp relative "
            style={{ animationDelay: '200ms' }}
          >
      
            <div className="flex flex-col items-center text-center">
              <div className="mb-8 relative">
                <Mic className="w-32 h-32 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-green-600 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('voiceMode', language)}</h3>
              <p className="text-xl text-gray-600">{t('voiceModeDesc', language)}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
