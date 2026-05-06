import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { clinicService } from '../../services/clinicService';

export function ForgotPassword() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await clinicService.forgotPassword({ email });
      setIsSubmitted(true);
    } catch (error) {
      // Regardless of failure (e.g., email not found), we display success to prevent user enumeration
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/[0.03] backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative">
          <Link 
            to="/login"
            className="absolute top-8 left-8 p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 border border-primary/20">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-white mb-3">
                  {t('auth.forgot.title')}
                </h1>
                <p className="text-white/40 text-sm leading-relaxed px-4 mb-10">
                  {t('auth.forgot.subtitle')}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 px-1">
                      {t('auth.login.email')}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-primary transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 focus:border-primary/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 outline-none transition-all focus:bg-white/[0.06] focus:ring-4 focus:ring-primary/5"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-2xl transition-all duration-300 transform active:scale-[0.98] shadow-[0_10px_30px_rgba(249,115,22,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    <span className={`inline-flex items-center gap-2 transition-transform duration-300 ${isLoading ? 'opacity-0' : 'group-hover:translate-x-1'}`}>
                      {t('auth.forgot.submit')}
                      <ArrowRight className="w-5 h-5" />
                    </span>
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin" />
                      </div>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-8 border border-green-500/20">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-black text-white mb-4">Check Your Inbox</h2>
                <p className="text-white/40 text-sm leading-relaxed mb-10 px-6">
                  Instructions to reset your password have been sent to <span className="text-white font-bold">{email}</span>.
                </p>
                <Link 
                  to="/login"
                  className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs hover:text-primary-dark transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('auth.forgot.back')}
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
