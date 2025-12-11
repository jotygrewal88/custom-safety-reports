"use client";

import React, { useRef, useEffect, useState } from 'react';
import {
  setupCanvasScaling,
  clearCanvas,
  drawLine,
  eraseArea,
  getCoordinates,
  exportToPNG,
  loadImageToCanvas,
  type DrawingTool,
  type DrawingState
} from './drawingUtils';

interface SketchDrawingFieldProps {
  value?: string;
  onChange: (base64: string) => void;
  disabled?: boolean;
}

const COLORS = ['#000000', '#ef4444', '#3b82f6', '#eab308']; // black, red, blue, yellow
const LINE_WIDTH = 3;
const ERASER_RADIUS = 10;

export default function SketchDrawingField({ value, onChange, disabled }: SketchDrawingFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 }); // 4:3 ratio
  
  // Setup canvas dimensions
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      const containerWidth = containerRef.current!.offsetWidth;
      const width = Math.min(containerWidth * 0.9, 800);
      const height = width * (3 / 4); // 4:3 ratio
      
      setDimensions({ width, height });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Setup canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    setupCanvasScaling(canvasRef.current, dimensions.width, dimensions.height);
    
    // Fill with white background
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'white';
      const ratio = window.devicePixelRatio || 1;
      ctx.fillRect(0, 0, canvasRef.current.width / ratio, canvasRef.current.height / ratio);
    }
  }, [dimensions]);
  
  // Load existing value
  useEffect(() => {
    if (value && canvasRef.current && value.startsWith('data:image')) {
      loadImageToCanvas(canvasRef.current, value).catch(console.error);
    }
  }, [value]);
  
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled || !canvasRef.current) return;
    const coords = getCoordinates(e.nativeEvent, canvasRef.current);
    
    setDrawingState({
      isDrawing: true,
      startX: coords.x,
      startY: coords.y,
      lastX: coords.x,
      lastY: coords.y
    });
    
    // For eraser, start erasing immediately
    if (tool === 'eraser') {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        eraseArea(ctx, coords.x, coords.y, ERASER_RADIUS);
      }
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled || !drawingState.isDrawing || !canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const coords = getCoordinates(e.nativeEvent, canvasRef.current);
    
    if (tool === 'pen') {
      drawLine(ctx, drawingState.lastX, drawingState.lastY, coords.x, coords.y, color, LINE_WIDTH);
    } else if (tool === 'eraser') {
      eraseArea(ctx, coords.x, coords.y, ERASER_RADIUS);
    }
    
    setDrawingState(prev => ({ ...prev, lastX: coords.x, lastY: coords.y }));
  };
  
  const handleMouseUp = async () => {
    if (disabled || !drawingState.isDrawing || !canvasRef.current) return;
    setDrawingState(prev => ({ ...prev, isDrawing: false }));
    
    // Export and save
    const base64 = await exportToPNG(canvasRef.current);
    onChange(base64);
  };
  
  const handleClear = async () => {
    if (disabled || !canvasRef.current) return;
    
    clearCanvas(canvasRef.current);
    
    // Fill with white background
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'white';
      const ratio = window.devicePixelRatio || 1;
      ctx.fillRect(0, 0, canvasRef.current.width / ratio, canvasRef.current.height / ratio);
    }
    
    // Export cleared canvas
    const base64 = await exportToPNG(canvasRef.current);
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
            onClick={() => setTool('eraser')}
            disabled={disabled}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              tool === 'eraser' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Eraser
          </button>
        </div>
        
        {/* Colors */}
        {tool === 'pen' && (
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
        )}
        
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
      <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
        {/* Drawing canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`relative ${disabled ? 'cursor-not-allowed' : tool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair'}`}
          style={{ touchAction: 'none' }}
        />
      </div>
    </div>
  );
}





