import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useDashboard } from '../../context/DashboardContext';

interface PremiumLoaderProps {
  fullScreen?: boolean;
}

/**
 * PremiumLoader component: Ultra-minimal, high-end luxury medical aesthetic.
 * Focuses on calm, expensive-feeling motion and pure typography.
 */
export function PremiumLoader({ fullScreen = true }: PremiumLoaderProps) {
  const { t, language } = useLanguage();
  
  // Safe access to Dashboard Context
  let dashboardState: any = null;
  try {
    const context = useDashboard();
    dashboardState = context?.state;
  } catch (e) {
    // Fallback if context is not ready
  }

  const clinicName = dashboardState?.branding?.name?.[language] || 
                    dashboardState?.branding?.name?.en || 
                    "Lumo Clinic";
  const logoUrl = dashboardState?.branding?.logo;

  return (
    <div
      className={`
        ${fullScreen ? 'fixed inset-0 z-[9999]' : 'relative w-full h-full min-h-[400px]'}
        flex flex-col items-center justify-center 
        bg-[#FFFFFF] overflow-hidden
      `}
    >
      {/* Ultra-subtle luxury grid texture */}
      <div className="absolute inset-0 bg-navbar-grid opacity-[0.03] pointer-events-none" />
      
      {/* Minimal Pinpoint Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(8,145,178,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Minimal Logo Presentation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-6 h-12 flex items-center justify-center"
        >
          {logoUrl ? (
            <motion.img
              src={logoUrl}
              alt={clinicName}
              animate={{ 
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-auto object-contain grayscale-[0.2] brightness-[1.05]"
            />
          ) : (
            <span className="text-2xl font-serif font-medium tracking-tight text-[#0B1C2D]">
              Lumo<span className="text-[#0891B2]">.</span>
            </span>
          )}
        </motion.div>

        {/* Dynamic Clinic Name - Elegant Serif */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.4 }}
          className="text-center"
        >
          <h2 className="text-[#0B1C2D] text-lg sm:text-xl font-serif font-medium tracking-[0.02em] mb-1">
            {clinicName}
          </h2>
          <motion.p 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-[#0891B2] text-[10px] font-bold uppercase tracking-[0.4em] pl-[0.4em]"
          >
            {t('loading.preparing') || "Preparing your experience"}
          </motion.p>
        </motion.div>

        {/* Ultra-Thin Elegant Progress Line */}
        <div className="mt-12 w-40 sm:w-56 h-[1px] bg-[#0B1C2D]/[0.06] relative overflow-hidden rounded-full">
          <motion.div
            initial={{ left: '-100%' }}
            animate={{ left: '100%' }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: [0.45, 0, 0.55, 1],
            }}
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-[#0891B2]/40 to-transparent"
          />
        </div>
      </div>

      {/* Subtle Bottom Identity */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <span className="text-[9px] text-[#0B1C2D] font-bold tracking-[0.8em] uppercase whitespace-nowrap pl-[0.8em]">
          Excellence
        </span>
      </motion.div>
    </div>
  );
}


