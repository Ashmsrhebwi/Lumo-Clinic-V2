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

  const defaultMessage = 'Hello Gravity Clinic, I would like to get more information.';
  const whatsappMessage =
    state?.whatsapp?.message?.[language] ||
    state?.whatsapp?.message?.en ||
    defaultMessage;

  const whatsappUrl = `https://wa.me/${finalPhoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const branding = state.branding;
  const clinicName = branding?.name?.[language] || 'Gravity Clinic';
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
            className="w-[320px] sm:w-[360px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden border border-secondary/5 mb-2"
          >
            {/* Branded Header */}
            <div className="bg-secondary p-6 text-white relative">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Close WhatsApp chat"
              >
                <X className="w-5 h-5 opacity-50" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white p-2 shadow-inner shrink-0 overflow-hidden">
                  <img src={clinicLogo} alt={clinicName} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-black text-lg tracking-tight leading-tight">{clinicName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Typically replies in 5m</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Body */}
            <div className="p-6 bg-[#f0f2f5] relative min-h-[120px]">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' }} />

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative bg-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[85%]"
              >
                <p className="text-sm text-secondary leading-relaxed">
                  Hi there! 👋<br />
                  How can we help you today?
                </p>
                <span className="text-[9px] text-secondary/30 mt-2 block font-bold uppercase tracking-widest">Gravity Clinic Support</span>
              </motion.div>
            </div>

            {/* Action Footer */}
            <div className="p-6 bg-white">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 px-6 rounded-2xl flex items-center justify-between font-bold text-sm shadow-xl shadow-[#25D366]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 fill-white/10" />
                  <span>Start Chat on WhatsApp</span>
                </div>
                <ChevronRight className="w-5 h-5 opacity-50" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="relative group focus:outline-none"
        aria-label="Open WhatsApp Chat"
      >
        {/* Advanced Pulse Rings */}
        {!isOpen && (
          <>
            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.3, 0, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-[#25D366] rounded-full blur-xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.1, 0.4]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute inset-0 bg-[#25D366] rounded-full blur-md"
            />
          </>
        )}

        <div className={`relative p-4 sm:p-5 text-white rounded-full shadow-[0_10px_40px_rgba(37,211,102,0.4)] flex items-center justify-center transition-all duration-500 border border-white/20 z-10 ${isOpen ? 'bg-secondary' : 'bg-[#25D366]'}`}>
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X className="w-7 h-7" />
              </motion.div>
            ) : (
              <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <FaWhatsapp className="w-7 h-7" />              </motion.div>
            )}
          </AnimatePresence>

          {/* Notification Badge */}
          {!isOpen && (
            <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center shadow-lg z-20">
              <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            </div>
          )}
        </div>
      </motion.button>
    </div>
  );
};
