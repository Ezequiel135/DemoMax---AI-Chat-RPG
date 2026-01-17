
import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VnScene, VisualNovel } from '../../models/vn.model';

@Component({
  selector: 'app-vn-property-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-slate-900 border border-slate-700 rounded-2xl flex flex-col overflow-hidden h-full">
      @if (scene(); as s) {
         <div class="p-3 border-b border-slate-800 bg-slate-950 sticky top-0 z-10">
            <h3 class="font-bold text-white text-xs uppercase tracking-wider">Propriedades</h3>
         </div>
         
         <div class="flex-1 p-4 space-y-5 overflow-y-auto custom-scroll">
            
            <!-- Identification -->
            <div class="space-y-2">
               <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nome da Cena</label>
               <input [(ngModel)]="s.name" (ngModelChange)="update.emit()" class="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white text-sm focus:border-pink-500 outline-none">
               
               @if (currentStartId() !== s.id) {
                 <button (click)="setStart.emit(s.id)" class="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 mt-1">
                    <span>⚑</span> Definir como Início
                 </button>
               }
            </div>
            
            <div class="h-px bg-slate-800"></div>

            <!-- ASSETS -->
            <div class="space-y-3">
               <!-- Background -->
               <div class="space-y-1">
                  <div class="flex justify-between items-center">
                     <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fundo</label>
                     <label class="cursor-pointer bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded border border-slate-600 flex items-center gap-1 transition-colors">
                        <span class="text-[10px] text-white">📂 Upload</span>
                        <input type="file" accept="image/*" class="hidden" (change)="handleFile($event, 'bg')">
                     </label>
                  </div>
                  <input [(ngModel)]="s.backgroundUrl" (ngModelChange)="update.emit()" class="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white text-xs focus:border-pink-500 outline-none truncate">
               </div>
               
               <!-- Character -->
               <div class="space-y-1">
                  <div class="flex justify-between items-center">
                     <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Personagem</label>
                     <label class="cursor-pointer bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded border border-slate-600 flex items-center gap-1 transition-colors">
                        <span class="text-[10px] text-white">📂 Upload</span>
                        <input type="file" accept="image/png, image/webp" class="hidden" (change)="handleFile($event, 'char')">
                     </label>
                  </div>
                  <input [(ngModel)]="s.characterUrl" (ngModelChange)="update.emit()" class="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white text-xs focus:border-pink-500 outline-none truncate">
               </div>
            </div>

            <div class="h-px bg-slate-800"></div>

            <!-- DIALOGUE -->
            <div class="space-y-2">
               <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quem fala?</label>
               <input [(ngModel)]="s.speakerName" (ngModelChange)="update.emit()" class="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white text-sm focus:border-pink-500 outline-none">
            </div>

            <div class="space-y-2">
               <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Texto</label>
               <textarea [(ngModel)]="s.dialogue" (ngModelChange)="update.emit()" rows="4" class="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white text-sm focus:border-pink-500 outline-none resize-none"></textarea>
            </div>

            <div class="h-px bg-slate-800"></div>

            <!-- CHOICES & FLOW -->
            <div class="space-y-2">
               <label class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Próxima Cena (Padrão)</label>
               <select [(ngModel)]="s.nextSceneId" (ngModelChange)="update.emit()" class="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white text-xs focus:border-emerald-500 outline-none">
                  <option [ngValue]="null">-- Fim / Requer Escolha --</option>
                  @for (scn of allScenes(); track scn.id) {
                     @if(scn.id !== s.id) {
                        <option [value]="scn.id">{{ scn.name }}</option>
                     }
                  }
               </select>
            </div>

            <div class="space-y-2">
               <div class="flex justify-between items-center">
                  <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Escolhas</label>
                  <button (click)="addChoice.emit()" class="text-[10px] bg-slate-800 border border-slate-600 px-2 py-1 rounded text-white hover:bg-slate-700">+ Botão</button>
               </div>
               @for (choice of s.choices; track $index) {
                  <div class="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-2">
                     <div class="flex justify-between">
                        <span class="text-[9px] text-slate-500">Opção {{$index+1}}</span>
                        <button (click)="removeChoice.emit($index)" class="text-red-500 text-[10px]">✕</button>
                     </div>
                     <input [(ngModel)]="choice.text" (ngModelChange)="update.emit()" class="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-xs text-white">
                     <select [(ngModel)]="choice.nextSceneId" (ngModelChange)="update.emit()" class="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-xs text-white">
                        <option value="">-- Fim --</option>
                        @for (scn of allScenes(); track scn.id) {
                           <option [value]="scn.id">{{ scn.name }}</option>
                        }
                     </select>
                  </div>
               }
            </div>

         </div>
      } @else {
         <div class="flex items-center justify-center h-full text-slate-500 text-xs">Selecione uma cena</div>
      }
    </div>
  `
})
export class VnPropertyEditorComponent {
  scene = input<VnScene | undefined>();
  allScenes = input.required<VnScene[]>();
  currentStartId = input.required<string>();

  update = output<void>();
  setStart = output<string>();
  uploadImage = output<{file: File, type: 'bg' | 'char'}>();
  addChoice = output<void>();
  removeChoice = output<number>();

  handleFile(event: Event, type: 'bg' | 'char') {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.uploadImage.emit({ file: input.files[0], type });
    }
  }
}
