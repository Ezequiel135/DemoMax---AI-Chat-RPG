
import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CharacterService } from '../../services/character.service';
import { VnService } from '../../services/vn.service';
import { WebNovelService } from '../../services/web-novel.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-creator-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './creator-dashboard.component.html'
})
export class CreatorDashboardComponent {
  auth = inject(AuthService);
  charService = inject(CharacterService);
  vnService = inject(VnService);
  wnService = inject(WebNovelService);
  toast = inject(ToastService);
  router = inject(Router);

  activeTab = signal<'chars' | 'novels' | 'webnovels'>('chars');

  // Filtra itens criados pelo usuário atual
  myCharacters = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.charService.allCharacters().filter(c => {
       if (c.creatorId) return c.creatorId === user.id;
       return c.creator === '@' + user.username;
    });
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

  createNew() {
    if (this.activeTab() === 'chars') {
        this.router.navigate(['/create/character']);
    } else if (this.activeTab() === 'novels') {
        const newVn = this.vnService.createEmptyNovel();
        // Salva no DB imediatamente para garantir que o ID exista ao editar
        this.vnService.saveNovel(newVn).then(() => {
            this.router.navigate(['/vn/edit', newVn.id]);
        });
    } else {
        const newWn = this.wnService.createEmpty();
        this.wnService.saveNovel(newWn).then(() => {
            this.router.navigate(['/novel/edit', newWn.id]);
        });
    }
  }

  async deleteItem(id: string) {
    if (!confirm('Tem certeza? A exclusão é permanente.')) return;
    
    try {
      if (this.activeTab() === 'chars') {
         await this.charService.deleteCharacter(id);
      } else if (this.activeTab() === 'novels') {
         await this.vnService.deleteNovel(id);
      } else {
         await this.wnService.deleteNovel(id);
      }
      this.toast.show("Item excluído com sucesso.", "success");
    } catch (e) {
      this.toast.show("Erro ao excluir.", "error");
    }
  }

  triggerUpload(id: string) {
    document.getElementById(`file-${id}`)?.click();
  }

  onImageSelected(event: Event, item: any, type: 'char' | 'novel' | 'web_novel') {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
       const result = e.target?.result as string;
       
       if (type === 'char') {
          item.avatarUrl = result;
          item.coverUrl = result; 
          await this.charService.addCharacter(item); // Salva no DB
          this.toast.show("Foto atualizada!", "success");
       } else if (type === 'novel') {
          item.coverUrl = result;
          await this.vnService.saveNovel(item);
          this.toast.show("Capa atualizada!", "success");
       } else {
          item.coverUrl = result;
          await this.wnService.saveNovel(item);
          this.toast.show("Capa atualizada!", "success");
       }
    };
    reader.readAsDataURL(file);
  }
}
