
import { Injectable, signal } from '@angular/core';
import { getBestVoice } from '../logic/media/voice-selection.logic';

@Injectable({
  providedIn: 'root'
})
export class VoiceService {
  isSpeaking = signal(false);
  private synthesis = window.speechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = () => { };
    }
  }

  speak(text: string, gender: 'male' | 'female' | 'robot' = 'female') {
    this.cancel(); 

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    const voices = this.synthesis.getVoices();
    const settings = getBestVoice(voices, text, gender);

    if (settings.voice) utterance.voice = settings.voice;
    utterance.pitch = settings.pitch;
    utterance.rate = settings.rate;

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
