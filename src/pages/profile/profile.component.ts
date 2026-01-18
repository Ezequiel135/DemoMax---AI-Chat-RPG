
import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EconomyService } from '../../services/economy.service';
import { CharacterService } from '../../services/character.service';
import { VnService } from '../../services/vn.service'; 
import { WebNovelService } from '../../services/web-novel.service'; 
import { HeaderComponent } from '../../components/header/header.component';
import { ToastService } from '../../services/toast.service';
import { ThemeToggleComponent } from '../../components/ui/theme-toggle.component';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { ImageCropperModalComponent } from '../../components/ui/image-cropper-modal.component';
import { OptimizationManagerService } from '../../services/core/optimization-manager.service'; 
import { SocialService } from '../../services/social.service';
import { UserListModalComponent } from '../../components/user/user-list-modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, FormsModule, HeaderComponent, 
    ThemeToggleComponent, RouterLink, CharacterCardComponent,
    ImageCropperModalComponent, UserListModalComponent
  ],
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent {
  auth = inject(AuthService);
  economy = inject(EconomyService);
  charService = inject(CharacterService);
  vnService = inject(VnService); 
  wnService = inject(WebNovelService); 
  socialService = inject(SocialService);
  toast = inject(ToastService);
  router = inject(Router);
  optimizer = inject(OptimizationManagerService); 

  activeTab = signal<'creations' | 'favorites'>('creations');
  editMode = signal(false);
  
  // User List Modal
  showUserList = signal<'followers' | 'following' | null>(null);
  
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

  // --- MEUS CONTEÚDOS (CRIAÇÕES) ---
  myCharacters = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.charService.allCharacters().filter(c => c.creatorId === user.id);
  });

  myNovels = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.vnService.novels().filter(n => n.creatorId === user.id);
  });

  myWebNovels = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.wnService.novels().filter(n => n.creatorId === user.id);
  });

  // --- FAVORITOS (REAL) ---
  favCharacters = computed(() => {
    const ids = this.socialService.followingCharsIds();
    return this.charService.allCharacters().filter(c => ids.includes(c.id));
  });

  favNovels = computed(() => {
    const ids = this.socialService.likedNovelsIds();
    return this.vnService.novels().filter(n => ids.includes(n.id));
  });

  favWebNovels = computed(() => {
    const ids = this.socialService.likedWebNovelsIds();
    return this.wnService.novels().filter(n => ids.includes(n.id));
  });

  // --- HELPERS ---
  
  hasContent = computed(() => {
    return this.myCharacters().length > 0 || this.myNovels().length > 0 || this.myWebNovels().length > 0;
  });

  hasFavorites = computed(() => {
    return this.favCharacters().length > 0 || this.favNovels().length > 0 || this.favWebNovels().length > 0;
  });

  followersCount = this.socialService.followerCount;
  followingCount = this.socialService.followingCount;
  
  // Dados para o modal
  followersList = computed(() => this.socialService.followersList);
  followingList = computed(() => this.socialService.followingList);
  
  totalPostsCount = computed(() => {
     return this.myCharacters().length + this.myNovels().length + this.myWebNovels().length;
  });

  openUserList(type: 'followers' | 'following') {
    this.showUserList.set(type);
  }

  startEdit() {
    const u = this.auth.currentUser();
    if (!u) return;

    if (this.auth.isGuest()) {
      this.toast.show("Visitantes não podem editar perfil.", "error");
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
    this.auth.updateProfile(this.editData);
    this.toast.show("Perfil atualizado!", "success");
    this.editMode.set(false);
  }

  triggerUpload(type: 'avatar' | 'banner') {
    if (this.auth.isGuest()) return;
    const inputId = type === 'avatar' ? 'avatarInput' : 'bannerInput';
    document.getElementById(inputId)?.click();
  }

  onFileSelected(event: Event, type: 'avatar' | 'banner') {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result as string;
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
  }

  cancelCrop() {
    this.showCropper.set(false);
    this.tempImage.set('');
  }

  toggleNSFW() {
    const current = this.auth.currentUser();
    if (current) {
       this.auth.updateContentFilter(!current.showNSFW);
    }
  }

  createNew() {
    if (this.auth.isGuest()) {
      this.toast.show("Crie uma conta para criar conteúdo!", "error");
      return;
    }
    this.router.navigate(['/create']);
  }
}
