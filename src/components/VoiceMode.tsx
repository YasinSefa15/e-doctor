import { Mic, ArrowLeft } from 'lucide-react';
import { t } from '../i18n/translations';
import { Language, Message } from '../types';
import { generateAIResponse } from '../services/geminiService';


interface VoiceModeProps {
  language: Language;
  onBack: () => void;
}

const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;


export default function VoiceMode({ language, onBack }: VoiceModeProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex flex-col p-8 animate-fadeIn">
      <button
        onClick={onBack}
        className="self-start flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-all duration-300"
      >
        <ArrowLeft className="w-6 h-6" />
        <span className="text-lg">{t('backToModes', language)}</span>
      </button>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative mb-12 animate-slideUp">
          <div className="absolute inset-0 animate-ping">
            <div className="w-80 h-80 bg-green-500 rounded-full opacity-20"></div>
          </div>
          <div className="absolute inset-0 animate-pulse" style={{ animationDuration: '2s' }}>
            <div className="w-80 h-80 bg-green-400 rounded-full opacity-30"></div>
          </div>
          <div className="relative z-10 w-80 h-80 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
            <Mic className="w-40 h-40 text-white animate-pulse" style={{ animationDuration: '1.5s' }} />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 border-4 border-green-400 rounded-full animate-ping opacity-30"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[26rem] h-[26rem] border-4 border-green-300 rounded-full animate-ping opacity-20" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
          </div>
        </div>

        <div className="text-center max-w-3xl animate-slideUp" style={{ animationDelay: '200ms' }}>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            {t('voiceModeComingSoon', language)}
          </h2>
          <p className="text-2xl text-gray-600 leading-relaxed mb-8">
            {t('voiceModeMessage', language)}
          </p>

          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-8 inline-block">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <svg className="w-10 h-10 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-amber-900 text-xl font-semibold">
                {language === 'tr'
                  ? 'Ses tanıma özelliği geliştirme aşamasındadır'
                  : 'Voice recognition feature is under development'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onBack}
          className="mt-16 px-12 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xl font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 animate-slideUp"
          style={{ animationDelay: '400ms' }}
        >
          {t('backToModes', language)}
        </button>
      </div>
    </div>
  );
}
