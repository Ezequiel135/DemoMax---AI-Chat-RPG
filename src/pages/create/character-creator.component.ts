
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GeminiService } from '../../services/gemini.service';
import { ImageGenerationService, GenStyleId } from '../../services/ai/image-generation.service';
import { CharacterService } from '../../services/character.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { SystemAssetsService } from '../../services/core/system-assets.service'; 
import { Character } from '../../models/character.model';
import { HeaderComponent } from '../../components/header/header.component';
import { createNewCharacter } from '../../logic/character/character-factory.logic';

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
  private assets = inject(SystemAssetsService); 

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

  // Form Data
  draft: Partial<Character> = {
    name: '',
    tagline: '',
    description: '',
    gender: undefined, 
    avatarUrl: this.assets.getIcon(),
    coverUrl: this.assets.getIcon(),
    systemInstruction: '',
    rarity: 'Common',
    tags: [],
    messageCount: '0',
    favoriteCount: '0',
    pixKey: '',
    isNSFW: false,
    modelConfig: 'Standard',
    initialAffinity: 0 
  };

  ageConfirmed = false;
  imagePrompt = '';
  firstMessage = '';
  trainingPairs: {q: string, a: string}[] = [{q: '', a: ''}];

  isStepValid = computed(() => {
    switch (this.step()) {
      case 1: 
        return (
          !!this.draft.name?.trim() && 
          !!this.draft.tagline?.trim() && 
          !!this.draft.description?.trim() && 
          !!this.draft.gender && 
          this.ageConfirmed
        );
      case 2: return !!this.draft.avatarUrl; 
      case 3: return !!this.firstMessage?.trim();
      case 4: return !!this.draft.systemInstruction?.trim();
      default: return true;
    }
  });

  nextStep() {
    if (!this.isStepValid()) {
      this.toast.show("Preencha os campos obrigatórios.", "error");
      return;
    }
    if (this.step() < 6) {
      this.step.update(s => s + 1);
    }
  }

  prevStep() {
    if (this.step() > 1) {
      this.step.update(s => s - 1);
    }
  }

  setGender(g: 'Female' | 'Male' | 'Other') {
    this.draft.gender = g;
  }

  setModel(model: 'Standard' | 'Deep Thought' | 'Creative') {
    this.draft.modelConfig = model;
    this.toast.show(`Modelo: ${model}`, 'info');
  }

  getAffinityLabel(val: number): string {
    if (val <= -50) return 'Inimigo ☠️';
    if (val < 0) return 'Hostil 💢';
    if (val === 0) return 'Desconhecido 😐';
    if (val < 50) return 'Conhecido 🙂';
    if (val < 100) return 'Amigo 🤝';
    if (val < 500) return 'Paixão 💗';
    return 'Alma Gêmea 💍';
  }

  async generateAvatar() {
    if (!this.imagePrompt) return;
    
    this.isGenerating.set(true);
    this.toast.show("Criando arte neural...", "info");

    try {
      const result = await this.imageGenService.generateCharacter(this.imagePrompt, this.selectedStyle());
      
      if (result) {
        this.draft.avatarUrl = result;
        this.draft.coverUrl = result; 
        this.toast.show("Imagem Gerada!", "success");
      } else {
        this.toast.show("Falha na geração.", "error");
      }
    } catch(e) {
      this.toast.show("Erro ao gerar imagem.", "error");
    } finally {
      this.isGenerating.set(false);
    }
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
    if (!this.isStepValid()) {
       this.toast.show("Faltam dados.", "error");
       return;
    }

    this.isModerating.set(true);
    this.toast.show("Publicando na rede...", "info");

    try {
      const fullInstruction = `
        Name: ${this.draft.name}
        Gender: ${this.draft.gender}
        Tagline: ${this.draft.tagline}
        Description: ${this.draft.description}
        Personality/Lore: ${this.draft.systemInstruction}
        [Example Dialogues]
        ${this.trainingPairs.map(p => `User: ${p.q}\nChar: ${p.a}`).join('\n')}
        First Message: ${this.firstMessage}
      `;

      let finalName = this.draft.name!;
      let finalDesc = this.draft.description!;
      let finalInstruct = this.draft.systemInstruction!;

      // Optional: AI Moderation call here
      
      const newChar = createNewCharacter(
        { ...this.draft, systemInstruction: finalInstruct, firstMessage: this.firstMessage },
        this.auth.currentUser()?.id || 'guest',
        this.auth.currentUser()?.username || 'Guest'
      );

      await this.characterService.addCharacter(newChar);
      
      this.toast.show("Personagem Criado!", "success");
      this.router.navigate(['/home']);

    } catch (e) {
      this.toast.show("Erro ao publicar.", "error");
      console.error(e);
    } finally {
      this.isModerating.set(false);
    }
  }
}
