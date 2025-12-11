"use client";

import React, { useRef, useEffect, useState } from 'react';
import {
  setupCanvasScaling,
  clearCanvas,
  drawLine,
  getCoordinates,
  exportToPNG,
  loadImageToCanvas,
  type DrawingTool,
  type DrawingState
} from './drawingUtils';

interface BodyDiagramFieldProps {
  value?: string;
  onChange: (base64: string) => void;
  disabled?: boolean;
}

const COLORS = ['#ef4444', '#3b82f6', '#000000', '#eab308']; // red, blue, black, yellow
const PEN_WIDTH = 2;
const HIGHLIGHT_WIDTH = 8;

export default function BodyDiagramField({ value, onChange, disabled }: BodyDiagramFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [tool, setTool] = useState<DrawingTool>('pen');
  const [color, setColor] = useState(COLORS[0]);
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0
  });
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 }); // 1:1 ratio for side-by-side
  
  // Setup canvas dimensions
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      const containerWidth = containerRef.current!.offsetWidth;
      const width = Math.min(containerWidth * 0.9, 600);
      const height = width; // 1:1 ratio for side-by-side layout
      
      setDimensions({ width, height });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Setup canvas
  useEffect(() => {
    if (canvasRef.current) {
      setupCanvasScaling(canvasRef.current, dimensions.width, dimensions.height);
    }
  }, [dimensions]);
  
  // Load existing value
  useEffect(() => {
    if (value && value.startsWith('data:image')) {
      if (canvasRef.current) {
        loadImageToCanvas(canvasRef.current, value).catch(console.error);
      }
    }
  }, [value]);
  
  const getImageUrl = () => imageRef.current?.src || '/body-outline.svg';
  
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    if (!canvasRef.current) return;
    
    const coords = getCoordinates(e.nativeEvent, canvasRef.current);
    setDrawingState({
      isDrawing: true,
      startX: coords.x,
      startY: coords.y,
      lastX: coords.x,
      lastY: coords.y
    });
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled || !drawingState.isDrawing) return;
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const coords = getCoordinates(e.nativeEvent, canvasRef.current);
    const lineWidth = tool === 'highlight' ? HIGHLIGHT_WIDTH : PEN_WIDTH;
    const opacity = tool === 'highlight' ? 0.4 : 1;
    
    drawLine(ctx, drawingState.lastX, drawingState.lastY, coords.x, coords.y, color, lineWidth, opacity);
    setDrawingState(prev => ({ ...prev, lastX: coords.x, lastY: coords.y }));
  };
  
  const handleMouseUp = async () => {
    if (disabled || !drawingState.isDrawing) return;
    setDrawingState(prev => ({ ...prev, isDrawing: false }));
    
    // Export and save
    if (canvasRef.current) {
      const imageUrl = getImageUrl();
      const base64 = await exportToPNG(canvasRef.current, svgRef.current, imageUrl);
      onChange(base64);
    }
  };
  
  const handleClear = async () => {
    if (disabled || !canvasRef.current) return;
    
    clearCanvas(canvasRef.current);
    
    // Export cleared canvas
    const imageUrl = getImageUrl();
    const base64 = await exportToPNG(canvasRef.current, svgRef.current, imageUrl);
    onChange(base64);
  };
  
  return (
    <div ref={containerRef} className="space-y-3">
      {/* Tools */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1 bg-gray-100 rounded-md p-1">
          <button
            type="button"
            onClick={() => setTool('pen')}
            disabled={disabled}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              tool === 'pen' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Pen
          </button>
          <button
            type="button"
            onClick={() => setTool('highlight')}
            disabled={disabled}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              tool === 'highlight' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Highlight
          </button>
        </div>
        
        {/* Colors */}
        <div className="flex gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              disabled={disabled}
              className={`w-8 h-8 rounded border-2 transition-all ${
                color === c ? 'border-gray-900 scale-110' : 'border-gray-300'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
              style={{ backgroundColor: c }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
        
        <button
          type="button"
          onClick={handleClear}
          disabled={disabled}
          className="ml-auto px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear
        </button>
      </div>
      
      {/* Canvas container */}
      <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-white mx-auto" style={{ width: dimensions.width, height: dimensions.height }}>
        {/* Background Image - Side-by-side front and back */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imageRef}
          src="/body-outline.svg"
          alt="Body diagram"
          className="absolute inset-0 w-full h-full object-contain"
          style={{ pointerEvents: 'none' }}
        />
        
        {/* Drawing canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`relative ${disabled ? 'cursor-not-allowed' : 'cursor-crosshair'}`}
          style={{ touchAction: 'none' }}
        />
      </div>
    </div>
  );
}

