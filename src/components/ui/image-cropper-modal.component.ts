
import { Component, input, output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { calculateCropDimensions, drawImageOnCanvas } from '../../logic/visual/crop-math.logic';

@Component({
  selector: 'app-image-cropper-modal',
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[200] flex items-start justify-center pt-[15dvh] px-4 bg-black/90 backdrop-blur-md animate-fade-in" 
         (touchmove)="$event.preventDefault()"> 
      
      <div class="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[75dvh] h-auto overflow-hidden">
        
        <div class="p-4 border-b border-slate-800 flex justify-between items-center shrink-0 z-20 bg-slate-900">
           <h3 class="text-white font-bold">Ajustar Imagem</h3>
           <button (click)="cancel.emit()" class="text-slate-400 p-2 hover:text-white rounded-full hover:bg-white/10 transition-colors">✕</button>
        </div>

        <div #container class="relative flex-1 bg-black overflow-hidden select-none cursor-move flex items-center justify-center touch-none w-full min-h-[250px]"
             (mousedown)="startDrag($event)"
             (touchstart)="startDrag($event)"
             (mousemove)="onDrag($event)"
             (touchmove)="onDrag($event)"
             (mouseup)="endDrag()"
             (touchend)="endDrag()">
           
           <canvas #canvas class="block pointer-events-none"></canvas>
           
           <div class="absolute pointer-events-none border-black/60 box-content shadow-[0_0_0_1px_rgba(255,255,255,0.5)] z-10"
                [style.border-width.px]="borderSize"
                [style.border-radius]="round() ? '50%' : '12px'"
                [style.width.px]="viewportWidth"
                [style.height.px]="viewportHeight"
                [style.top.px]="(containerHeight - viewportHeight) / 2 - borderSize"
                [style.left.px]="(containerWidth - viewportWidth) / 2 - borderSize">
           </div>
           
           <div class="absolute pointer-events-none border border-white/30 opacity-50 z-10"
                [style.width.px]="viewportWidth"
                [style.height.px]="viewportHeight"
                [style.top.px]="(containerHeight - viewportHeight) / 2"
                [style.left.px]="(containerWidth - viewportWidth) / 2">
                <div class="w-full h-1/3 border-b border-white/30 absolute top-0"></div>
                <div class="w-full h-1/3 border-b border-white/30 absolute bottom-0"></div>
                <div class="h-full w-1/3 border-r border-white/30 absolute left-0"></div>
                <div class="h-full w-1/3 border-r border-white/30 absolute right-0"></div>
           </div>

        </div>

        <div class="p-5 bg-slate-900 space-y-4 shrink-0 z-20 border-t border-slate-800">
           <div class="flex items-center gap-4">
              <span class="text-xs text-slate-500 font-bold uppercase w-10">Zoom</span>
              <input type="range" min="0.1" max="3" step="0.05" [value]="scale" (input)="onZoom($event)" class="flex-1 accent-pink-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer">
           </div>
           <div class="flex gap-3">
              <button (click)="cancel.emit()" class="flex-1 py-3 border border-slate-600 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors text-sm">Cancelar</button>
              <button (click)="save()" class="flex-1 py-3 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-500 transition-colors shadow-lg shadow-pink-500/20 text-sm">Salvar</button>
           </div>
        </div>
      </div>
    </div>
  `
})
export class ImageCropperModalComponent implements AfterViewInit {
  imageBase64 = input.required<string>();
  aspectRatio = input<number>(1);
  round = input<boolean>(false);
  saveImage = output<string>();
  cancel = output<void>();

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;
  
  img = new Image();
  scale = 1;
  posX = 0; posY = 0;
  isDragging = false;
  lastX = 0; lastY = 0;
  
  containerWidth = 0; containerHeight = 0;
  viewportWidth = 200; viewportHeight = 200;
  borderSize = 2000; 

  ngAfterViewInit() {
    setTimeout(() => {
        if (!this.containerRef || !this.canvasRef) return;

        this.containerWidth = this.containerRef.nativeElement.offsetWidth;
        this.containerHeight = this.containerRef.nativeElement.offsetHeight;

        this.canvasRef.nativeElement.width = this.containerWidth;
        this.canvasRef.nativeElement.height = this.containerHeight;

        const dims = calculateCropDimensions(this.containerWidth, this.containerHeight, this.aspectRatio());
        this.viewportWidth = dims.width;
        this.viewportHeight = dims.height;

        this.img.src = this.imageBase64();
        this.img.onload = () => {
           const ratioW = this.viewportWidth / this.img.width;
           const ratioH = this.viewportHeight / this.img.height;
           this.scale = Math.max(ratioW, ratioH); 
           
           this.draw();
        };
    }, 100);
  }

  draw() {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0,0,this.containerWidth, this.containerHeight);
    
    const cx = this.containerWidth / 2;
    const cy = this.containerHeight / 2;
    
    drawImageOnCanvas(ctx, this.img, { scale: this.scale, posX: this.posX, posY: this.posY }, { cx, cy });
  }

  startDrag(e: any) { 
    this.isDragging = true; 
    this.lastX = e.touches ? e.touches[0].clientX : e.clientX; 
    this.lastY = e.touches ? e.touches[0].clientY : e.clientY; 
  }
  
  onDrag(e: any) {
    if (!this.isDragging) return;
    e.preventDefault(); 
    
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    
    this.posX += cx - this.lastX;
    this.posY += cy - this.lastY;
    
    this.lastX = cx; 
    this.lastY = cy;
    
    this.draw();
  }
  
  endDrag() { this.isDragging = false; }
  
  onZoom(e: any) { 
    this.scale = parseFloat(e.target.value); 
    this.draw(); 
  }

  save() {
    const canvas = document.createElement('canvas');
    const w = this.round() ? 400 : 800;
    const h = w / this.aspectRatio();
    
    canvas.width = w; 
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
       const finalRatio = w / this.viewportWidth;
       const finalScale = this.scale * finalRatio;
       const finalX = (w/2) + (this.posX * finalRatio);
       const finalY = (h/2) + (this.posY * finalRatio);
       
       ctx.translate(finalX, finalY);
       ctx.drawImage(
         this.img, 
         -(this.img.width * finalScale)/2, 
         -(this.img.height * finalScale)/2, 
         this.img.width * finalScale, 
         this.img.height * finalScale
       );
    }
    
    this.saveImage.emit(canvas.toDataURL('image/jpeg', 0.9));
  }
}
