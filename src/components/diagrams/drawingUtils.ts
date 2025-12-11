/**
 * Drawing utilities for canvas-based diagram fields
 * Provides tools for freehand drawing, lines, arrows, erasing, and export
 */

export type DrawingTool = 'pen' | 'line' | 'arrow' | 'highlight' | 'eraser';

export interface DrawingState {
  isDrawing: boolean;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
}

export interface CanvasSetup {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  cleanup: () => void;
}

/**
 * Get device pixel ratio for high-DPI displays
 */
export function getPixelRatio(): number {
  return window.devicePixelRatio || 1;
}

/**
 * Setup canvas with proper scaling for high-DPI displays
 */
export function setupCanvasScaling(canvas: HTMLCanvasElement, width: number, height: number): void {
  const ratio = getPixelRatio();
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.scale(ratio, ratio);
  }
}

/**
 * Clear entire canvas
 */
export function clearCanvas(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const ratio = getPixelRatio();
  ctx.clearRect(0, 0, canvas.width / ratio, canvas.height / ratio);
}

/**
 * Draw a line on canvas
 */
export function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  lineWidth: number,
  opacity: number = 1
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = opacity;
  
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  
  ctx.restore();
}

/**
 * Draw an arrow (line with triangle head)
 */
export function drawArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  lineWidth: number
): void {
  // Draw the line
  drawLine(ctx, x1, y1, x2, y2, color, lineWidth);
  
  // Calculate arrow head
  const headLength = 15;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headLength * Math.cos(angle - Math.PI / 6),
    y2 - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    x2 - headLength * Math.cos(angle + Math.PI / 6),
    y2 - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  ctx.restore();
}

/**
 * Erase area around a point
 */
export function eraseArea(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number = 10
): void {
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Get mouse/touch coordinates relative to canvas
 */
export function getCoordinates(
  e: MouseEvent | TouchEvent,
  canvas: HTMLCanvasElement
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  
  if (e instanceof MouseEvent) {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  } else {
    const touch = e.touches[0] || e.changedTouches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  }
}

/**
 * Export canvas and SVG to base64 PNG
 */
export async function exportToPNG(
  canvas: HTMLCanvasElement,
  svgElement?: SVGSVGElement | null,
  imageUrl?: string | null
): Promise<string> {
  // Create a temporary canvas for merging
  const tempCanvas = document.createElement('canvas');
  const ctx = tempCanvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');
  
  // Set size to match the display canvas
  const width = parseInt(canvas.style.width);
  const height = parseInt(canvas.style.height);
  tempCanvas.width = width;
  tempCanvas.height = height;
  
  // Fill with white background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);
  
  // Draw background image if provided (either from SVG or image URL)
  if (svgElement) {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    await new Promise((resolve, reject) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.onerror = reject;
      img.src = url;
    });
  } else if (imageUrl) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise((resolve, reject) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(null);
      };
      img.onerror = reject;
      img.src = imageUrl;
    });
  }
  
  // Draw canvas content on top
  ctx.drawImage(canvas, 0, 0, width, height);
  
  // Convert to base64
  return tempCanvas.toDataURL('image/png');
}

/**
 * Load base64 image onto canvas
 */
export async function loadImageToCanvas(
  canvas: HTMLCanvasElement,
  base64: string
): Promise<void> {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = () => {
      clearCanvas(canvas);
      const ratio = getPixelRatio();
      ctx.drawImage(img, 0, 0, canvas.width / ratio, canvas.height / ratio);
      resolve(null);
    };
    img.onerror = reject;
    img.src = base64;
  });
}

