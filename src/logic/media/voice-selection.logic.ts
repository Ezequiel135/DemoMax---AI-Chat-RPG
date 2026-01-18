
export function getBestVoice(voices: SpeechSynthesisVoice[], text: string, gender: 'male' | 'female' | 'robot'): { voice: SpeechSynthesisVoice | null, pitch: number, rate: number } {
    const isPT = /[áàãâéêíóôõúç]/i.test(text) || text.includes(' o ') || text.includes(' a ');
    const langCode = isPT ? 'pt-BR' : 'en-US';

    const langVoices = voices.filter(v => v.lang.includes(langCode));
    let selectedVoice = null;
    let pitch = 1.0;
    let rate = 1.0;

    if (gender === 'robot') {
      selectedVoice = langVoices.find(v => v.name.toLowerCase().includes('google')) || langVoices[0];
      pitch = 0.5;
      rate = 0.9;
    } else if (gender === 'male') {
       selectedVoice = langVoices.find(v => 
         v.name.toLowerCase().includes('male') || 
         v.name.toLowerCase().includes('daniel') || 
         v.name.toLowerCase().includes('felipe')
       ) || langVoices[0];
       pitch = 0.8;
    } else {
       selectedVoice = langVoices.find(v => 
         v.name.toLowerCase().includes('female') || 
         v.name.toLowerCase().includes('luciana') || 
         v.name.toLowerCase().includes('fernanda')
       ) || langVoices[0];
       pitch = 1.1;
    }

    return { voice: selectedVoice || null, pitch, rate };
}
