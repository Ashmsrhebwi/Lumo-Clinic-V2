import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LazyImage } from './LazyImage';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  label?: string;
}

export function BeforeAfterSlider({ beforeImage, afterImage, label }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const position = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(2, Math.min(98, position)));
    if (!hasInteracted) setHasInteracted(true);
  }, [hasInteracted]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  }, [isDragging, updatePosition]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX);
  }, [updatePosition]);

  // Subtle intro animation on mount
  useEffect(() => {
    if (!beforeImage || !afterImage) return;
    const timer = setTimeout(() => {
      setSliderPosition(42);
      setTimeout(() => setSliderPosition(50), 800);
    }, 1200);
    return () => clearTimeout(timer);
  }, [beforeImage, afterImage]);

  if (!beforeImage || !afterImage) {
    return (
      <div className="relative aspect-[5/4] w-full rounded-[2.5rem] overflow-hidden bg-[var(--navbar-navy)]/[0.02] border border-dashed border-[var(--navbar-navy)]/10 flex flex-col items-center justify-center text-center p-10">
        <div className="w-14 h-14 rounded-2xl bg-[var(--navbar-cyan)]/5 flex items-center justify-center mb-5 border border-[var(--navbar-cyan)]/10">
          <svg className="w-6 h-6 text-[var(--navbar-cyan)]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h4 className="label-eyebrow mb-2">Results Processing</h4>
        <p className="text-[var(--navbar-navy)]/40 text-sm max-w-xs italic font-body leading-relaxed">
          Transformation images are being prepared for the gallery.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[5/4] w-full rounded-[2.5rem] overflow-hidden select-none border border-[var(--navbar-navy)]/[0.05]"
      style={{ cursor: isDragging ? 'ew-resize' : 'col-resize' }}
      onMouseMove={handleMouseMove}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchMove={handleTouchMove}
    >
      {/* After Image (full background) */}
      <LazyImage
        src={afterImage}
        alt="After"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Before Image (clip-revealed) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <LazyImage
          src={beforeImage}
          alt="Before"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Slight warm tint on "before" side for perceptual contrast */}
        <div className="absolute inset-0 bg-[var(--navbar-navy)]/[0.08] mix-blend-multiply pointer-events-none"></div>
      </div>

      {/* Architectural Divider Line */}
      <div
        className="absolute inset-y-0 z-20 flex flex-col items-center"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        {/* Line above handle */}
        <div className="flex-1 w-[1.5px] bg-white/60 backdrop-blur-sm shadow-[0_0_12px_rgba(255,255,255,0.5)]"></div>

        {/* Premium Handle */}
        <div
          className="relative flex-shrink-0 w-12 h-12 bg-white rounded-full shadow-[0_8px_32px_rgba(11,28,45,0.2),0_0_0_1px_rgba(11,28,45,0.06)] flex items-center justify-center"
          style={{ transform: isDragging ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)' }}
        >
          {/* Left arrow */}
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="mr-1">
            <path d="M6 1L1 6L6 11" stroke="rgba(11,28,45,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {/* Right arrow */}
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="ml-1">
            <path d="M2 1L7 6L2 11" stroke="rgba(11,28,45,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Line below handle */}
        <div className="flex-1 w-[1.5px] bg-white/60 backdrop-blur-sm shadow-[0_0_12px_rgba(255,255,255,0.5)]"></div>
      </div>

      {/* Before label — bottom left */}
      <div className="absolute bottom-5 left-5 z-30">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/25 backdrop-blur-xl rounded-full border border-white/10 text-white/75 text-[8px] font-bold uppercase tracking-[0.35em]">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M5 1L2 4L5 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Before
        </span>
      </div>

      {/* After label — bottom right */}
      <div className="absolute bottom-5 right-5 z-30">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur-xl rounded-full border border-white/20 text-white text-[8px] font-bold uppercase tracking-[0.35em]">
          After
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M3 1L6 4L3 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>

      {/* Patient Name Badge — centered top */}
      {label && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30">
          <span className="inline-flex items-center px-5 py-2 bg-[var(--navbar-navy)]/40 backdrop-blur-xl rounded-full border border-white/10 text-white text-[9px] font-bold uppercase tracking-[0.35em]">
            {label}
          </span>
        </div>
      )}

      {/* Drag hint — fades out after interaction */}
      <AnimatePresence>
        {!hasInteracted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          >
            <div className="px-4 py-2 bg-[var(--navbar-navy)]/50 backdrop-blur-md rounded-full border border-white/10">
              <span className="text-white/70 text-[8px] font-bold uppercase tracking-[0.3em]">Drag to compare</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
