
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VnScene, VisualNovel } from '../../models/vn.model';

@Component({
  selector: 'app-vn-scene-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-slate-900 border border-slate-700 rounded-2xl flex flex-col overflow-hidden h-full">
      <div class="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-950 sticky top-0 z-10">
         <h3 class="font-bold text-slate-300 text-xs uppercase tracking-wider">Cenas</h3>
         <button (click)="add.emit()" class="bg-slate-800 hover:bg-slate-700 text-pink-400 w-6 h-6 rounded flex items-center justify-center font-bold transition-colors">+</button>
      </div>
      <div class="flex-1 overflow-y-auto p-2 space-y-1 custom-scroll min-h-[150px]">
         @for (scene of scenes(); track scene.id) {
            <div (click)="select.emit(scene.id)" 
                 class="p-3 rounded-xl cursor-pointer text-sm font-medium transition-colors flex justify-between items-center group relative overflow-hidden"
                 [class.bg-pink-600_20]="selectedId() === scene.id"
                 [class.text-pink-300]="selectedId() === scene.id"
                 [class.border-pink-500_50]="selectedId() === scene.id"
                 [class.border]="true"
                 [class.border-transparent]="selectedId() !== scene.id"
                 [class.text-slate-400]="selectedId() !== scene.id"
                 [class.hover:bg-white_5]="selectedId() !== scene.id">
               
               <div class="truncate pr-4">{{ scene.name }}</div>
               
               <div class="flex items-center gap-2">
                 @if (startId() === scene.id) {
                    <span class="text-[9px] font-bold bg-green-900/50 text-green-400 px-1.5 py-0.5 rounded border border-green-500/30">START</span>
                 }
                 @if (scenes().length > 1 && startId() !== scene.id) {
                   <button (click)="remove.emit(scene.id); $event.stopPropagation()" class="text-slate-600 hover:text-red-400 px-1">×</button>
                 }
               </div>
            </div>
         }
      </div>
    </div>
  `
})
export class VnSceneListComponent {
  scenes = input.required<VnScene[]>();
  selectedId = input.required<string | null>();
  startId = input.required<string>();
  
  add = output<void>();
  remove = output<string>();
  select = output<string>();
}
