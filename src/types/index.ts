export type Language = 'tr' | 'en';

export type Screen = 'welcome' | 'mode-selection' | 'text-mode' | 'voice-mode' | 'end-session';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface SessionData {
  sessionId: string;
  startTime: Date;
  messages: Message[];
  language: Language;
}
