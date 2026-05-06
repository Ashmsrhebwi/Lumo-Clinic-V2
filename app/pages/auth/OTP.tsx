import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { ShieldCheck, ChevronRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { toast } from 'sonner';

export function OTP() {
  const { t, language } = useLanguage();
  const { verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const from = location.state?.from || '/dashboard';

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError(t('auth.error.otp_incomplete'));
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await verifyOtp(code);
      toast.success(t('auth.success.otp'));
      navigate(from, { replace: true });
    } catch (error: any) {
      if (error.response && error.response.max_attempts) {
        toast.error(error.message);
        navigate('/login', { replace: true });
      } else {
        setError(error.message || t('auth.error.invalid_otp'));
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    const success = await resendOtp();
    if (success) {
      setTimer(60);
      toast.info(t('auth.otp.resend_success'));
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-4 selection:bg-primary/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50 overflow-hidden pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/[0.03] backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative">
          <button 
            onClick={() => navigate('/login')}
            className="absolute top-8 left-8 p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>

          <div className="text-center mb-10 mt-6">
            <motion.div 
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 border border-primary/20"
            >
              <ShieldCheck className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-3">
              {t('auth.otp.title')}
            </h1>
            <p className="text-white/40 text-sm leading-relaxed px-4">
              {t('auth.otp.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="flex justify-between gap-2" dir="ltr">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  autoFocus={i === 0}
                  className={`w-12 h-14 sm:w-14 sm:h-16 bg-white/[0.03] border ${error ? 'border-red-500/30' : 'border-white/10 focus:border-primary/50'} rounded-2xl text-center text-2xl font-black text-white outline-none transition-all focus:bg-white/[0.06] focus:ring-4 focus:ring-primary/5`}
                />
              ))}
            </div>

            <div className="text-center space-y-4">
              <button
                type="button"
                onClick={handleResend}
                disabled={timer > 0}
                className={`text-xs uppercase tracking-widest font-black transition-colors ${timer > 0 ? 'text-white/10 cursor-not-allowed' : 'text-primary hover:text-primary-dark cursor-pointer'}`}
              >
                {timer > 0 
                  ? t('auth.otp.resend_in').replace('{seconds}', timer.toString())
                  : t('auth.otp.resend')
                }
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.join('').length < 6}
              className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-2xl transition-all duration-300 transform active:scale-[0.98] shadow-[0_10px_30px_rgba(249,115,22,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <span className={`inline-flex items-center gap-2 transition-transform duration-300 ${isLoading ? 'opacity-0' : 'group-hover:translate-x-1'}`}>
                {t('auth.otp.submit')}
                <ChevronRight className="w-5 h-5" />
              </span>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-10 text-white/20 text-xs font-medium tracking-wide">
          {t('dashboard.system.online')} &bull; SSL Encrypted
        </p>
      </motion.div>
    </div>
  );
}
