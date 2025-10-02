const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

if (!API_KEY || API_KEY === 'your_elevenlabs_api_key_here') {
  console.warn('ElevenLabs API key is not configured. Please add VITE_ELEVENLABS_API_KEY to your .env file.');
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  if (!API_KEY || API_KEY === 'your_elevenlabs_api_key_here') {
    throw new Error('ElevenLabs API key is not configured');
  }

  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('model_id', 'scribe_v1');

    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API Error:', errorText);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const data = await response.json();
    return data.text || '';
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}
