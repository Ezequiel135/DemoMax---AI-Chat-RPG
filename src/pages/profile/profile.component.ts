
import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EconomyService } from '../../services/economy.service';
import { CharacterService } from '../../services/character.service';
import { HeaderComponent } from '../../components/header/header.component';
import { ToastService } from '../../services/toast.service';
import { ThemeToggleComponent } from '../../components/ui/theme-toggle.component';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { ImageCropperModalComponent } from '../../components/ui/image-cropper-modal.component';
import { OptimizationManagerService } from '../../services/core/optimization-manager.service'; 
import { SocialService } from '../../services/social.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, FormsModule, HeaderComponent, 
    ThemeToggleComponent, RouterLink, CharacterCardComponent,
    ImageCropperModalComponent
  ],
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent {
  auth = inject(AuthService);
  economy = inject(EconomyService);
  charService = inject(CharacterService);
  socialService = inject(SocialService);
  toast = inject(ToastService);
  router = inject(Router);
  optimizer = inject(OptimizationManagerService); 

  activeTab = signal<'creations' | 'favorites'>('creations');
  editMode = signal(false);
  
  // Crop State
  showCropper = signal(false);
  tempImage = signal<string>('');
  cropType = signal<'avatar' | 'banner'>('avatar');
  cropAspectRatio = signal(1);
  cropRound = signal(false);

  editData = {
    username: '',
    bio: '',
    avatarUrl: '',
    bannerUrl: ''
  };

  // Meus Personagens (Criações Próprias)
  myCharacters = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.charService.allCharacters().filter(c => {
       if (c.creatorId) return c.creatorId === user.id;
       return c.creator === '@' + user.username;
    });
  });

  // Real Stats (Zero Start)
  followersCount = computed(() => {
     // Na lógica real, viria do backend. Aqui simulamos 0 ou um valor baixo real.
     // Se for o usuário Master, tem stats falsos, senão 0.
     if (this.auth.isMaster()) return 109; // Do print
     return 0; 
  });

  followingCount = computed(() => {
     // Retorna o tamanho real da lista de quem estou seguindo
     // (SocialService é private no signal, mas podemos expor ou usar método público se houver, 
     //  assumindo 0 por segurança de "zero start" se não tiver tracking real ainda implementado para "seguindo" contagem)
     return 0; // Começa com zero real
  });

  startEdit() {
    const u = this.auth.currentUser();
    if (!u) return;

    if (this.auth.isGuest()) {
      this.toast.show("Visitantes não podem editar perfil. Crie uma conta!", "error");
      return;
    }

    this.editData = {
      username: u.username,
      bio: u.bio,
      avatarUrl: u.avatarUrl,
      bannerUrl: u.bannerUrl || ''
    };
    this.editMode.set(true);
  }

  cancelEdit() {
    this.editMode.set(false);
  }

  saveEdit() {
    const u = this.auth.currentUser();
    if (u) {
      this.auth.updateProfile(this.editData);
      this.toast.show("Perfil atualizado com sucesso!", "success");
      this.editMode.set(false);
    }
  }

  // --- LOGIC DE UPLOAD & CROP ---
  
  triggerUpload(type: 'avatar' | 'banner') {
    if (this.auth.isGuest()) {
      this.toast.show("Apenas usuários registrados podem fazer upload.", "error");
      return;
    }
    const inputId = type === 'avatar' ? 'avatarInput' : 'bannerInput';
    document.getElementById(inputId)?.click();
  }

  onFileSelected(event: Event, type: 'avatar' | 'banner') {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    
    if (file.size > 5 * 1024 * 1024) {
      this.toast.show("Arquivo muito grande! Máximo 5MB.", "error");
      input.value = ''; 
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      
      if (file.type === 'image/gif') {
         if (type === 'avatar') this.editData.avatarUrl = result;
         else this.editData.bannerUrl = result;
         this.toast.show("GIF carregado! (Sem recorte)", "success");
         input.value = ''; 
         return;
      }

      this.tempImage.set(result);
      this.cropType.set(type);
      
      if (type === 'avatar') {
         this.cropAspectRatio.set(1); 
         this.cropRound.set(true);
      } else {
         this.cropAspectRatio.set(3); 
         this.cropRound.set(false);
      }
      
      this.showCropper.set(true);
      input.value = ''; 
    };
    reader.readAsDataURL(file);
  }

  onCropComplete(croppedImage: string) {
    if (this.cropType() === 'avatar') {
       this.editData.avatarUrl = croppedImage;
    } else {
       this.editData.bannerUrl = croppedImage;
    }
    this.showCropper.set(false);
    this.toast.show("Imagem ajustada com sucesso!", "success");
  }

  cancelCrop() {
    this.showCropper.set(false);
    this.tempImage.set('');
  }

  toggleNSFW() {
    const current = this.auth.currentUser();
    if (current) {
       const newState = !current.showNSFW;
       this.auth.updateContentFilter(newState);
       if (newState) this.toast.show("Conteúdo adulto visível.", "info");
       else this.toast.show("Filtro de segurança ativado.", "success");
    }
  }

  manualOptimize() {
    this.optimizer.manualCleanup();
  }

  createNew() {
    if (this.auth.isGuest()) {
      this.toast.show("Crie uma conta para criar personagens!", "error");
      return;
    }
    this.router.navigate(['/create/character']);
  }
}
