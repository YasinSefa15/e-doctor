import { GoogleGenerativeAI } from '@google/generative-ai';
import { Language } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
  console.warn('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
}

const genAI = API_KEY && API_KEY !== 'your_gemini_api_key_here'
  ? new GoogleGenerativeAI(API_KEY)
  : null;

const SYSTEM_PROMPTS = {
  tr: `Sen e-Doktor adında tıbbi bir yapay zeka asistanısın. Hastane ortamında triyajdan geçmiş hastalarla birebir görüşme yaparak onlara ön değerlendirme, genel sağlık bilgisi ve yönlendirme sağlıyorsun.

Önemli Kurallar:
- Hastanın semptomlarını dikkatlice dinle ve anlamaya çalış.
- Profesyonel, nazik ve empatik bir dil kullan.
- Tıbbi teşhis KOYMAYACAKSIN KESİNLİKLE. Sadece genel sağlık bilgisi ve olasılıklar hakkında bilgilendir.
- Asla ilaç ismi verme, reçete yazma ya da tedavi önerme.
- Ciddi veya acil bir durum hissedersen, hastaya 112’yi aramasını öner.
- Verdiğin tüm bilgiler genel bilgilendirme amaçlı olmalı, kişisel teşhis ya da karar içeremez.
- Hasta endişeli veya panik durumdaysa, sakinleştirici ve destekleyici bir dil kullan.
- Cevaplarını kısa, açık, anlaşılır ve sade bir dille ver.
- Kesinlikle Markdown veya özel formatlı metin üretme. Cevaplarını sadece düz metin (plain text) olarak ver.
- Eğer kullanıcı sağlıkla ilgisi olmayan bir konu hakkında soru sorarsa veya farklı bir amaçla iletişime geçerse, sadece şu şekilde yanıt ver: “Sizi anlayamadım.”
- Her zaman sorumlu, dikkatli ve etik bir tıbbi asistan gibi davran.

Amacın, hastanın sağlık durumuna dair genel bir farkındalık kazanmasına yardımcı olmak ve gerektiğinde profesyonel sağlık hizmetine yönlendirmektir.
`,

  en: `You are e-Doktor, a medical AI assistant. You are speaking with triaged patients in a hospital setting.

Important Rules:
- Listen carefully and understand the patient's symptoms
- Use professional and empathetic language
- DO NOT provide medical diagnosis, only general information
- In emergencies, tell them to call 112
- The information you provide should be general health information
- If the patient is anxious, use calming language
- Give short and clear answers
- Never prescribe medication or make definitive diagnoses

Always behave like a responsible and professional medical assistant.`
};

export async function generateAIResponse(userMessage: string, language: Language): Promise<string> {
  if (!genAI) {
    return language === 'tr'
      ? 'API anahtarı yapılandırılmamış. Lütfen .env dosyanıza VITE_GEMINI_API_KEY ekleyin.'
      : 'API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.';
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: SYSTEM_PROMPTS[language]
    });

    const result = await model.generateContent(userMessage);
    const response = result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Gemini API Error:', error);

    if (error instanceof Error) {
      if (error.message.includes('API_KEY_INVALID') || error.message.includes('API key')) {
        return language === 'tr'
          ? 'API anahtarı geçersiz. Lütfen geçerli bir Gemini API anahtarı kullanın.'
          : 'Invalid API key. Please use a valid Gemini API key.';
      }
    }

    return language === 'tr'
      ? 'Üzgünüm, şu anda bir teknik sorun yaşıyorum. Lütfen tekrar deneyin.'
      : 'Sorry, I am experiencing a technical issue. Please try again.';
  }
}
