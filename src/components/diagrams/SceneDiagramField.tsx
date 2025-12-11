"use client";

import React, { useRef, useEffect, useState } from 'react';
import {
  setupCanvasScaling,
  clearCanvas,
  drawLine,
  drawArrow,
  getCoordinates,
  exportToPNG,
  loadImageToCanvas,
  type DrawingTool,
  type DrawingState
} from './drawingUtils';

interface SceneDiagramFieldProps {
  value?: string;
  onChange: (base64: string) => void;
  disabled?: boolean;
}

const COLORS = ['#ef4444', '#3b82f6', '#000000', '#eab308']; // red, blue, black, yellow
const LINE_WIDTH = 4;

export default function SceneDiagramField({ value, onChange, disabled }: SceneDiagramFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
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
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 }); // 16:9 ratio
  
  // Setup canvas dimensions
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      const containerWidth = containerRef.current!.offsetWidth;
      const width = Math.min(containerWidth * 0.9, 800);
      const height = width * (9 / 16); // 16:9 ratio
      
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
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled || !drawingState.isDrawing || !canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const coords = getCoordinates(e.nativeEvent, canvasRef.current);
    
    if (tool === 'pen') {
      drawLine(ctx, drawingState.lastX, drawingState.lastY, coords.x, coords.y, color, LINE_WIDTH);
      setDrawingState(prev => ({ ...prev, lastX: coords.x, lastY: coords.y }));
    }
  };
  
  const handleMouseUp = async (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled || !drawingState.isDrawing || !canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const coords = getCoordinates(e.nativeEvent, canvasRef.current);
    
    if (tool === 'line') {
      drawLine(ctx, drawingState.startX, drawingState.startY, coords.x, coords.y, color, LINE_WIDTH);
    } else if (tool === 'arrow') {
      drawArrow(ctx, drawingState.startX, drawingState.startY, coords.x, coords.y, color, LINE_WIDTH);
    }
    
    setDrawingState(prev => ({ ...prev, isDrawing: false }));
    
    // Export and save
    const base64 = await exportToPNG(canvasRef.current, svgRef.current);
    onChange(base64);
  };
  
  const handleClear = async () => {
    if (disabled || !canvasRef.current) return;
    clearCanvas(canvasRef.current);
    
    // Export cleared canvas
    const base64 = await exportToPNG(canvasRef.current, svgRef.current);
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
            onClick={() => setTool('line')}
            disabled={disabled}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              tool === 'line' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Line
          </button>
          <button
            type="button"
            onClick={() => setTool('arrow')}
            disabled={disabled}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              tool === 'arrow' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Arrow
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
      <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
        {/* SVG Background */}
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          viewBox="0 0 1600 900"
          className="absolute inset-0"
          style={{ pointerEvents: 'none' }}
        >
          {/* Intersection background */}
          <rect x="0" y="0" width="1600" height="900" fill="#f8fafc" />
          
          {/* Vertical road */}
          <rect x="600" y="0" width="400" height="900" fill="#94a3b8" />
          
          {/* Horizontal road */}
          <rect x="0" y="350" width="1600" height="200" fill="#94a3b8" />
          
          {/* Center intersection */}
          <rect x="600" y="350" width="400" height="200" fill="#94a3b8" />
          
          {/* Lane markings - vertical road */}
          <line x1="800" y1="0" x2="800" y2="350" stroke="#fbbf24" strokeWidth="4" strokeDasharray="40,20" />
          <line x1="800" y1="550" x2="800" y2="900" stroke="#fbbf24" strokeWidth="4" strokeDasharray="40,20" />
          
          {/* Lane markings - horizontal road */}
          <line x1="0" y1="450" x2="600" y2="450" stroke="#fbbf24" strokeWidth="4" strokeDasharray="40,20" />
          <line x1="1000" y1="450" x2="1600" y2="450" stroke="#fbbf24" strokeWidth="4" strokeDasharray="40,20" />
          
          {/* Stop lines */}
          <line x1="620" y1="350" x2="980" y2="350" stroke="white" strokeWidth="8" />
          <line x1="620" y1="550" x2="980" y2="550" stroke="white" strokeWidth="8" />
          <line x1="600" y1="370" x2="600" y2="530" stroke="white" strokeWidth="8" />
          <line x1="1000" y1="370" x2="1000" y2="530" stroke="white" strokeWidth="8" />
          
          {/* Crosswalks */}
          {[...Array(8)].map((_, i) => (
            <rect key={`cross-h1-${i}`} x={650 + i * 40} y="320" width="20" height="30" fill="white" />
          ))}
          {[...Array(8)].map((_, i) => (
            <rect key={`cross-h2-${i}`} x={650 + i * 40} y="550" width="20" height="30" fill="white" />
          ))}
          {[...Array(8)].map((_, i) => (
            <rect key={`cross-v1-${i}`} x="570" y={370 + i * 20} width="30" height="10" fill="white" />
          ))}
          {[...Array(8)].map((_, i) => (
            <rect key={`cross-v2-${i}`} x="1000" y={370 + i * 20} width="30" height="10" fill="white" />
          ))}
          
          {/* Direction arrows */}
          <polygon points="800,150 750,220 850,220" fill="white" opacity="0.8" />
          <polygon points="800,750 750,680 850,680" fill="white" opacity="0.8" />
          <polygon points="300,450 370,400 370,500" fill="white" opacity="0.8" />
          <polygon points="1300,450 1230,400 1230,500" fill="white" opacity="0.8" />
        </svg>
        
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





