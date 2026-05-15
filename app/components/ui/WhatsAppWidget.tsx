import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaWhatsapp } from 'react-icons/fa';
import { X, ChevronRight, MessageCircle } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useLanguage } from '../../context/LanguageContext';

export const WhatsAppWidget: React.FC = () => {
  const { state } = useDashboard();
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const defaultNumber = '905447924666';

  const whatsappNumberRaw =
    language === 'ru'
      ? (state?.whatsapp?.ruPhoneNumber || state?.whatsapp?.phoneNumber || '')
      : (state?.whatsapp?.phoneNumber || '');

  const whatsappNumber = whatsappNumberRaw.replace(/[^0-9]/g, '');
  const finalPhoneNumber = whatsappNumber.length >= 10 ? whatsappNumber : defaultNumber;

  const branding = state.branding;
  const clinicName = branding?.name?.[language] || branding?.name?.en || 'Lumo Clinic';
  const defaultMessage = `Hello ${clinicName}, I would like to get more information.`;
  const whatsappMessage =
    state?.whatsapp?.message?.[language] ||
    state?.whatsapp?.message?.en ||
    defaultMessage;

  const whatsappUrl = `https://wa.me/${finalPhoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const clinicLogo = branding?.logo || '';


  // Root.tsx positions this widget — no fixed wrapper here
  return (
    <div className="flex flex-col items-end gap-3" dir="ltr">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[320px] sm:w-[360px] bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(11,28,45,0.15)] overflow-hidden border border-[var(--navbar-navy)]/[0.05] mb-4"
          >
            {/* Editorial Luxury Header */}
            <div className="bg-white p-8 pb-6 border-b border-[var(--navbar-navy)]/[0.03] relative">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 bg-white/50 hover:bg-[var(--navbar-navy)]/5 rounded-full transition-all duration-400 group/close"
                aria-label="Close chat"
              >
                <X className="w-4 h-4 text-[var(--navbar-navy)]/30 group-hover/close:text-[var(--navbar-navy)] transition-colors" />
              </button>

              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-3xl bg-[#f8fafc] p-2.5 shadow-[0_8px_24px_-8px_rgba(11,28,45,0.1)] shrink-0 overflow-hidden border border-[var(--navbar-navy)]/[0.05]">
                    <img src={clinicLogo} alt={clinicName} className="w-full h-full object-contain" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-[3px] border-white rounded-full shadow-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-body font-bold text-lg tracking-tight text-[var(--navbar-navy)] leading-none">{clinicName}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--navbar-cyan)] opacity-70">Expert Consultation</p>
                </div>
              </div>
            </div>

            {/* Premium Chat Body */}
            <div className="p-8 bg-[#fdfdfd] relative min-h-[160px] flex flex-col justify-end">
              {/* Subtle texture */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ 
                backgroundImage: `radial-gradient(var(--navbar-navy) 0.5px, transparent 0.5px)`, 
                backgroundSize: '24px 24px' 
              }} />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="relative bg-white p-6 rounded-[2rem] rounded-bl-none shadow-[0_10px_30px_-10px_rgba(11,28,45,0.05)] border border-[var(--navbar-navy)]/[0.04] max-w-[92%]"
              >
                <div className="flex flex-col gap-3">
                  <p className="text-[14px] text-[var(--navbar-navy)]/65 leading-relaxed font-body">
                    Hello! We're here to assist with your aesthetic journey. How can we help you today?
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--navbar-cyan)]/50">Lumo Support Team</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Refined Action Footer */}
            <div className="p-8 bg-white">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full group relative"
              >
                <div className="absolute inset-0 bg-[var(--navbar-cyan)]/20 blur-2xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative bg-[var(--navbar-navy)] text-white py-4.5 px-8 rounded-2xl flex items-center justify-between font-bold text-[11px] uppercase tracking-[0.25em] shadow-[0_12px_32px_-8px_rgba(11,28,45,0.3)] transition-all duration-500 hover:bg-[#162a3d] hover:-translate-y-0.5 active:translate-y-0 overflow-hidden">
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                      <FaWhatsapp className="w-3.5 h-3.5 text-[#25D366]" />
                    </div>
                    <span>Continue to Chat</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/40 group-hover:translate-x-1 transition-transform relative z-10" />
                  
                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Luxury Trigger Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative group focus:outline-none"
        aria-label="Toggle WhatsApp"
      >
        <div className={`relative w-16 h-16 rounded-full shadow-[0_20px_50px_-10px_rgba(11,28,45,0.25)] flex items-center justify-center transition-all duration-700 border border-white/20 z-10 ${isOpen ? 'bg-[var(--navbar-navy)]' : 'bg-white'}`}>
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ opacity: 0, rotate: -45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 45 }}>
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div key="chat" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center justify-center">
                <FaWhatsapp className="w-7 h-7 text-[#25D366]" />
              </motion.div>
            )}
          </AnimatePresence>

          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--navbar-cyan)] border-[3px] border-white rounded-full flex items-center justify-center shadow-lg z-20">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </div>
          )}
        </div>
      </motion.button>
    </div>
  );
};
