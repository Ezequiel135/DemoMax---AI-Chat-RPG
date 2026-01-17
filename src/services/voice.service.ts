
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VoiceService {
  isSpeaking = signal(false);
  private synthesis = window.speechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    // Ensure voices are loaded
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = () => { /* Voices loaded */ };
    }
  }

  speak(text: string, gender: 'male' | 'female' | 'robot' = 'female') {
    this.cancel(); // Stop current

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    // Select Voice (Basic Heuristic)
    const voices = this.synthesis.getVoices();
    let selectedVoice = null;

    if (gender === 'robot') {
      selectedVoice = voices.find(v => v.name.includes('Google') && v.name.includes('English')) || voices[0];
      utterance.pitch = 0.5;
      utterance.rate = 0.9;
    } else if (gender === 'male') {
       selectedVoice = voices.find(v => v.name.includes('Male') || v.name.includes('Guy')) || voices[0];
       utterance.pitch = 0.8;
    } else {
       selectedVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Girl') || v.name.includes('Samantha')) || voices[0];
       utterance.pitch = 1.1;
    }

    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onstart = () => this.isSpeaking.set(true);
    utterance.onend = () => this.isSpeaking.set(false);
    utterance.onerror = () => this.isSpeaking.set(false);

    this.synthesis.speak(utterance);
  }

  cancel() {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
      this.isSpeaking.set(false);
    }
  }

  toggle(text: string) {
    if (this.isSpeaking()) {
      this.cancel();
    } else {
      this.speak(text);
    }
  }
}
