import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';

interface PremiumLoaderProps {
  fullScreen?: boolean;
}

/**
 * PremiumLoader component provides a high-end, cinematic loading experience
 * specifically tailored for the Gravity Clinic brand. 
 * 
 * Features:
 * - Breathing atmospheric background
 * - Elegant logo fade and scale-in
 * - High-precision motion easing
 * - Glassmorphism effects
 */
export function PremiumLoader({ fullScreen = true }: PremiumLoaderProps) {
  const { t } = useLanguage();

  return (
    <div
      className={`
        ${fullScreen ? 'fixed inset-0 z-[9999]' : 'relative w-full h-full min-h-[400px]'}
        flex flex-col items-center justify-center 
        bg-[#0B0A21] overflow-hidden
      `}
    >
      {/* Dynamic Background Atmospheric Layer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.15, 0.3, 0.15],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #F28522 0%, transparent 70%)',
          filter: 'blur(100px)'
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Reveal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1], // Custom "luxury" cubic bezier
          }}
          className="relative mb-12"
        >
          {/* Subtle Outer Glow */}
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />

          {/* Glassmorphism Badge for the logo */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-3xl flex items-center justify-center p-6 overflow-hidden">
            {/* Shimmer sweep effect */}
            <motion.div
              animate={{ x: ['100%', '-100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
            />

            <img
              src="https://gravity-clinic.com/storage/uploads/1775426603_gravity-logo-navbar-dark-1200.png"
              alt="Gravity Clinic"
              className="w-full h-full object-contain relative z-10"
            />
          </div>
        </motion.div>

        {/* Brand Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-white text-xl sm:text-2xl font-black tracking-[0.2em] uppercase mb-4 opacity-90">
            Gravity Clinic
          </h2>

          {/* Elegant Loading Indicator */}
          <div className="flex items-center justify-center gap-1.5 h-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scaleY: [1, 2, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
                className="w-10 h-[2px] bg-primary/60 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modern bottom accent */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <span className="text-[10px] text-white font-black tracking-[0.5em] uppercase">
          Excellence Defined
        </span>
      </div>
    </div>
  );
}
