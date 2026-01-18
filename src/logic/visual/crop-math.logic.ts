
export function calculateCropDimensions(
  containerW: number, 
  containerH: number, 
  aspectRatio: number, 
  padding: number = 40
): { width: number, height: number } {
    const maxW = containerW - padding;
    const maxH = containerH - padding;

    let viewportWidth = 0;
    let viewportHeight = 0;

    if (maxW / aspectRatio < maxH) {
        viewportWidth = maxW;
        viewportHeight = maxW / aspectRatio;
    } else {
        viewportHeight = maxH;
        viewportWidth = maxH * aspectRatio;
    }
    
    return { width: viewportWidth, height: viewportHeight };
}

export function drawImageOnCanvas(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  state: { scale: number, posX: number, posY: number },
  layout: { cx: number, cy: number }
) {
    const w = img.width * state.scale;
    const h = img.height * state.scale;

    ctx.save();
    ctx.translate(layout.cx + state.posX, layout.cy + state.posY);
    ctx.drawImage(img, -w/2, -h/2, w, h);
    ctx.restore();
}
