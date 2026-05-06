import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { LazyImage } from './LazyImage';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  label?: string;
}

export function BeforeAfterSlider({ beforeImage, afterImage, label }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    
    setSliderPosition(Math.max(0, Math.min(100, position)));
  }, []);

  if (!beforeImage || !afterImage) {
    return (
      <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden bg-secondary/5 border-2 border-dashed border-secondary/10 flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 bg-secondary/5 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-secondary/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h4 className="text-secondary/40 font-bold uppercase tracking-widest text-xs mb-2">Results Processing</h4>
        <p className="text-muted-foreground text-sm max-w-xs italic">The transformation images for this result are currently being prepared for the gallery.</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative aspect-video w-full rounded-2xl overflow-hidden cursor-ew-resize select-none border border-border/40 shadow-2xl"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* After Image (Background) */}
      <LazyImage 
        src={afterImage} 
        alt="After" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Before Image (ClipPath) */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <LazyImage 
          src={beforeImage} 
          alt="Before" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Slider Line */}
      <div 
        className="absolute inset-y-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] z-10"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="flex space-x-0.5">
            <div className="w-0.5 h-3 bg-primary rounded-full" />
            <div className="w-0.5 h-3 bg-primary rounded-full" />
          </div>
        </div>
      </div>

      {/* Labels removed for clean UI as per request */}
      {label && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-white text-sm font-medium">
          {label}
        </div>
      )}
    </div>
  );
}
