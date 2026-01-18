
import { Component, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonaService, Persona } from '../../../services/persona.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-persona-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-sm animate-fade-in" (click)="close.emit()">
      
      <div class="bg-[#121212] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl w-full max-w-md h-[90vh] sm:h-auto overflow-hidden shadow-2xl relative flex flex-col" (click)="$event.stopPropagation()">
        
        <!-- HEADER -->
        <div class="p-4 border-b border-white/5 flex justify-between items-center bg-[#121212] shrink-0">
           @if (view() === 'list') {
             <h3 class="font-bold text-white text-lg">Gerenciar Personas</h3>
             <button (click)="close.emit()" class="text-slate-400 hover:text-white p-2">✕</button>
           } @else {
             <button (click)="view.set('list')" class="text-slate-400 hover:text-white flex items-center gap-1 text-sm font-bold">
               ← Voltar
             </button>
             <h3 class="font-bold text-white text-lg">{{ isEditing ? 'Editar' : 'Nova' }} Persona</h3>
             <button (click)="savePersona()" class="text-pink-500 font-bold text-sm" [disabled]="!formData.name">
               Salvar
             </button>
           }
        </div>

        <!-- LIST VIEW -->
        @if (view() === 'list') {
           <div class="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll">
              
              <!-- 1. ORIGINAL PROFILE (Account) -->
              <div class="bg-[#1E1E1E] rounded-2xl p-4 border transition-all relative overflow-hidden"
                   [class.border-pink-500]="personaService.activePersonaId() === null"
                   [class.bg-pink-500_10]="personaService.activePersonaId() === null"
                   [class.border-white_5]="personaService.activePersonaId() !== null">
                 
                 <div class="flex justify-between items-start">
                    <div class="flex items-center gap-3">
                       <div class="w-12 h-12 rounded-full bg-slate-800 overflow-hidden border border-white/10">
                          <img [src]="auth.currentUser()?.avatarUrl" class="w-full h-full object-cover">
                       </div>
                       <div>
                          <div class="font-bold text-white text-base">
                             {{ auth.currentUser()?.username }}
                          </div>
                          <div class="text-xs text-slate-400">Perfil Original (Conta)</div>
                       </div>
                    </div>
                    
                    @if (personaService.activePersonaId() === null) {
                       <span class="text-[10px] font-bold bg-pink-500 text-white px-2 py-1 rounded-full shadow-lg">ATIVO</span>
                    }
                 </div>

                 <div class="mt-3">
                    @if (personaService.activePersonaId() !== null) {
                       <button (click)="selectOriginal()" class="w-full py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-bold text-xs transition-colors border border-white/5">
                          Usar Original
                       </button>
                    }
                 </div>
              </div>

              <!-- DIVIDER & LABEL -->
              <div class="flex items-center gap-4 py-2">
                 <div class="h-px bg-white/10 flex-1"></div>
                 <span class="text-xs text-slate-500 font-bold uppercase tracking-wider">Personas Criadas</span>
                 <div class="h-px bg-white/10 flex-1"></div>
              </div>

              <!-- 2. PERSONAS LIST -->
              @for (p of personaService.personas(); track p.id) {
                 <div class="bg-[#1E1E1E] rounded-2xl p-4 border transition-all relative group"
                      [class.border-pink-500]="personaService.activePersonaId() === p.id"
                      [class.bg-pink-500_10]="personaService.activePersonaId() === p.id"
                      [class.border-white_5]="personaService.activePersonaId() !== p.id">
                    
                    <div class="flex justify-between items-start mb-2">
                       <div class="flex items-center gap-3">
                          <div class="w-12 h-12 rounded-full bg-slate-800 overflow-hidden border border-white/10">
                             <img *ngIf="p.avatarUrl" [src]="p.avatarUrl" class="w-full h-full object-cover">
                             <div *ngIf="!p.avatarUrl" class="w-full h-full flex items-center justify-center text-lg">🎭</div>
                          </div>
                          <div>
                             <div class="font-bold text-white text-base">{{ p.name }}</div>
                             <div class="text-xs text-slate-500">{{ p.gender }}</div>
                          </div>
                       </div>
                       
                       @if (personaService.activePersonaId() === p.id) {
                          <span class="text-[10px] font-bold bg-pink-500 text-white px-2 py-1 rounded-full shadow-lg">ATIVO</span>
                       }
                    </div>

                    <p class="text-xs text-slate-400 line-clamp-2 mb-4 bg-black/20 p-2 rounded-lg border border-white/5">
                       {{ p.description || 'Sem história definida.' }}
                    </p>

                    <div class="flex gap-2">
                       @if (personaService.activePersonaId() !== p.id) {
                          <button (click)="selectPersona(p.id)" class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-bold text-xs transition-colors border border-white/5">
                             Ativar
                          </button>
                       }
                       <button (click)="editPersona(p)" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 font-bold text-xs border border-white/5">
                          Editar
                       </button>
                    </div>
                 </div>
              }

              <!-- EMPTY STATE / CREATE BUTTON -->
              @if (personaService.personas().length === 0) {
                 <div class="text-center py-8 opacity-50">
                    <p class="text-sm text-slate-400 mb-2">Nenhuma persona criada.</p>
                    <p class="text-xs text-slate-600">Crie personas para interpretar papéis e histórias diferentes.</p>
                 </div>
              }

              <button (click)="startCreate()" class="w-full py-4 rounded-2xl border-2 border-dashed border-slate-700 hover:border-pink-500/50 hover:bg-pink-500/5 text-slate-400 hover:text-pink-400 font-bold transition-all flex items-center justify-center gap-2 group">
                 <span class="text-xl group-hover:scale-110 transition-transform">+</span> Criar Nova Persona
              </button>

           </div>
        }

        <!-- EDIT/CREATE VIEW -->
        @if (view() === 'edit') {
           <div class="flex-1 overflow-y-auto p-5 space-y-6 custom-scroll bg-[#121212]">
              
              <!-- Avatar -->
              <div class="flex justify-center">
                 <div class="w-24 h-24 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center relative">
                    <span class="text-3xl">🎭</span>
                 </div>
              </div>

              <!-- Name -->
              <div class="space-y-2">
                 <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">Nome da Persona <span class="text-pink-500">*</span></label>
                 <input [(ngModel)]="formData.name" placeholder="Ex: Detetive Smith, Mago Negro..." class="w-full bg-[#1E1E1E] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none transition-colors">
              </div>

              <!-- Gender -->
              <div class="space-y-2">
                 <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">Gênero / Pronomes</label>
                 <div class="grid grid-cols-3 gap-2">
                    <button (click)="formData.gender = 'Masculino'" class="py-2.5 rounded-lg border text-xs font-bold transition-all" [class.bg-blue-600]="formData.gender === 'Masculino'" [class.border-transparent]="formData.gender === 'Masculino'" [class.bg-transparent]="formData.gender !== 'Masculino'" [class.border-slate-700]="formData.gender !== 'Masculino'" [class.text-slate-400]="formData.gender !== 'Masculino'">Masculino</button>
                    <button (click)="formData.gender = 'Feminino'" class="py-2.5 rounded-lg border text-xs font-bold transition-all" [class.bg-pink-600]="formData.gender === 'Feminino'" [class.border-transparent]="formData.gender === 'Feminino'" [class.bg-transparent]="formData.gender !== 'Feminino'" [class.border-slate-700]="formData.gender !== 'Feminino'" [class.text-slate-400]="formData.gender !== 'Feminino'">Feminino</button>
                    <button (click)="formData.gender = 'Não binário'" class="py-2.5 rounded-lg border text-xs font-bold transition-all" [class.bg-purple-600]="formData.gender === 'Não binário'" [class.border-transparent]="formData.gender === 'Não binário'" [class.bg-transparent]="formData.gender !== 'Não binário'" [class.border-slate-700]="formData.gender !== 'Não binário'" [class.text-slate-400]="formData.gender !== 'Não binário'">Outro</button>
                 </div>
              </div>

              <!-- Description -->
              <div class="space-y-2">
                 <label class="text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                    <span>História & Passado com a IA</span>
                    <span class="text-pink-500 text-[10px]">Importante!</span>
                 </label>
                 <textarea [(ngModel)]="formData.description" rows="6" 
                           placeholder="Descreva quem você é e qual seu relacionamento passado com o personagem. A IA usará isso como memória real." 
                           class="w-full bg-[#1E1E1E] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none resize-none transition-colors leading-relaxed text-sm"></textarea>
                 <p class="text-[10px] text-slate-500">
                    A IA assumirá essa história imediatamente como verdade.
                 </p>
              </div>

              <!-- Delete Button -->
              @if (isEditing) {
                 <div class="pt-4 border-t border-white/5">
                    <button (click)="delete()" class="w-full py-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-colors">
                       Excluir Persona
                    </button>
                 </div>
              }

           </div>
        }

      </div>
    </div>
  `
})
export class PersonaSelectorComponent {
  close = output();
  personaService = inject(PersonaService);
  auth = inject(AuthService);

  view = signal<'list' | 'edit'>('list');
  isEditing = false;
  editingId: string | null = null;

  formData = {
    name: '',
    gender: 'Masculino' as any,
    description: '',
    avatarUrl: ''
  };

  selectPersona(id: string) {
    this.personaService.setActive(id);
  }

  selectOriginal() {
    this.personaService.deactivatePersona();
  }

  startCreate() {
    this.isEditing = false;
    this.editingId = null;
    this.formData = { name: '', gender: 'Masculino', description: '', avatarUrl: '' };
    this.view.set('edit');
  }

  editPersona(p: Persona) {
    this.isEditing = true;
    this.editingId = p.id;
    this.formData = { 
      name: p.name, 
      gender: p.gender, 
      description: p.description, 
      avatarUrl: p.avatarUrl || '' 
    };
    this.view.set('edit');
  }

  savePersona() {
    if (!this.formData.name.trim()) return;

    if (this.isEditing && this.editingId) {
      this.personaService.updatePersona(this.editingId, this.formData);
    } else {
      this.personaService.createPersona(this.formData, true);
    }
    this.view.set('list');
  }

  delete() {
    if (this.editingId && confirm('Tem certeza? Isso apaga essa identidade para sempre.')) {
      this.personaService.deletePersona(this.editingId);
      this.view.set('list');
    }
  }
}
