
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GeminiService } from '../../services/gemini.service';
import { ImageGenerationService, GenStyleId } from '../../services/ai/image-generation.service';
import { CharacterService } from '../../services/character.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { SystemAssetsService } from '../../services/core/system-assets.service'; // Injected
import { Character } from '../../models/character.model';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-character-creator',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './character-creator.component.html'
})
export class CharacterCreatorComponent {
  private gemini = inject(GeminiService);
  private imageGenService = inject(ImageGenerationService);
  private characterService = inject(CharacterService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private assets = inject(SystemAssetsService); // Injected

  // State
  step = signal(1);
  isGenerating = signal(false);
  isModerating = signal(false);
  
  // Style Selection
  selectedStyle = signal<GenStyleId>('anime_moe');
  
  stylesList: {id: GenStyleId, name: string, img: string}[] = [
    { id: 'anime_moe', name: 'Anime Moe', img: 'https://picsum.photos/seed/anime_moe/100/100' },
    { id: 'dark_fantasy', name: 'Dark Fantasy', img: 'https://picsum.photos/seed/dark_fantasy/100/100' },
    { id: 'realistic', name: 'Realista', img: 'https://picsum.photos/seed/realistic/100/100' },
    { id: 'retro', name: 'Retro 90s', img: 'https://picsum.photos/seed/retro/100/100' },
    { id: 'oil', name: 'Pintura a Óleo', img: 'https://picsum.photos/seed/oil_paint/100/100' },
  ];

  // Form Data - use asset service for defaults
  draft: Partial<Character> = {
    name: '',
    tagline: '',
    description: '',
    avatarUrl: this.assets.getIcon(),
    coverUrl: this.assets.getIcon(),
    systemInstruction: '',
    rarity: 'Common',
    tags: [],
    messageCount: '0',
    favoriteCount: '0',
    pixKey: '',
    isNSFW: false,
    modelConfig: 'Standard'
  };

  // Step 1: Identity
  ageConfirmed = false;
  
  // Step 2: Visual
  imagePrompt = '';
  
  // Step 3: Scene
  firstMessage = '';

  // Step 5: Training
  trainingPairs: {q: string, a: string}[] = [{q: '', a: ''}];

  // Step 6: Brain
  selectedVoice = 'Soft';

  nextStep() {
    if (this.step() < 6) {
      this.step.update(s => s + 1);
    }
  }

  prevStep() {
    if (this.step() > 1) {
      this.step.update(s => s - 1);
    }
  }

  setModel(model: 'Standard' | 'Deep Thought' | 'Creative') {
    this.draft.modelConfig = model;
    this.toast.show(`Model switched to: ${model}`, 'info');
  }

  async generateAvatar() {
    if (!this.imagePrompt) return;
    
    this.isGenerating.set(true);
    this.toast.show("Traduzindo e Configurando Estilo...", "info");

    const result = await this.imageGenService.generateCharacter(this.imagePrompt, this.selectedStyle());
    
    if (result) {
      this.draft.avatarUrl = result;
      this.draft.coverUrl = result; 
      this.toast.show("Imagem Gerada com Sucesso!", "success");
    } else {
      this.toast.show("Falha na geração.", "error");
    }
    this.isGenerating.set(false);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (file.size > 2 * 1024 * 1024) {
      this.toast.show("Imagem muito grande (Max 2MB)", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      this.draft.avatarUrl = result;
      this.draft.coverUrl = result; 
    };
    reader.readAsDataURL(file);
  }

  addTrainingPair() {
    this.trainingPairs.push({q: '', a: ''});
  }

  removeTrainingPair(index: number) {
    this.trainingPairs.splice(index, 1);
  }

  async publish() {
    this.isModerating.set(true);
    this.toast.show("Scanning Neural Pattern for Safety...", "info");

    let fullInstruction = `
      Name: ${this.draft.name}
      Tagline: ${this.draft.tagline}
      Description: ${this.draft.description}
      Personality/Lore: ${this.draft.systemInstruction}
      [Example Dialogues]
      ${this.trainingPairs.map(p => `User: ${p.q}\nChar: ${p.a}`).join('\n')}
      First Message: ${this.firstMessage}
    `;

    const modResult = await this.gemini.moderateAndRewrite(
      this.draft.name!, 
      this.draft.description!, 
      fullInstruction
    );

    if (!modResult.safe) {
      this.toast.show("Safety Protocols Engaged: Content automatically optimized.", "error", 5000);
      this.draft.name = modResult.rewritten.name;
      this.draft.description = modResult.rewritten.description;
      this.draft.systemInstruction = modResult.rewritten.systemInstruction;
    }

    const newChar: Character = {
      id: `custom_${Date.now()}`,
      name: this.draft.name!,
      tagline: this.draft.tagline!,
      description: this.draft.description!,
      avatarUrl: this.draft.avatarUrl!,
      coverUrl: this.draft.coverUrl!,
      systemInstruction: this.draft.systemInstruction!,
      rarity: 'Common',
      affinity: 0,
      tags: ['User Created', 'New'],
      creator: '@' + (this.auth.currentUser()?.username || 'Guest'),
      messageCount: '0',
      favoriteCount: '0',
      isNew: true,
      pixKey: this.draft.pixKey,
      isNSFW: this.draft.isNSFW,
      modelConfig: this.draft.modelConfig || 'Standard'
    };

    this.characterService.addCharacter(newChar);
    this.isModerating.set(false);
    this.toast.show("Character Initialized Successfully.", "success");
    this.router.navigate(['/home']);
  }
}
