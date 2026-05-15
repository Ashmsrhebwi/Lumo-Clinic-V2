import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { toast } from 'sonner';
import { sanitizeText } from '../../lib/demoUtils';

export function Login() {
  const { t, language } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = t('auth.error.required');
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = t('auth.error.email');
    
    if (!password) newErrors.password = t('auth.error.required');
    else if (password.length < 6) newErrors.password = t('auth.error.password_min'); // I should add this key or use a generic one
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success(t('auth.success.login'));
      navigate('/otp', { state: { from } });
    } catch (error: any) {
      if (error.response && error.response.rate_limited) {
        setErrors({ general: error.message });
      } else if (error.status === 401 || error.status === 500 || error.response?.message) {
        setErrors({ general: error.response?.message || error.message || t('auth.error.invalid_credentials') });
      } else {
        setErrors({ general: 'Something went wrong. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-4 selection:bg-primary/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50 overflow-hidden pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/[0.03] backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Logo/Header */}
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 border border-primary/20"
            >
              <div className="w-8 h-8 rounded-lg bg-primary shadow-[0_0_20px_rgba(249,115,22,0.4)]" />
            </motion.div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-3">
              {t('auth.login.title')}
            </h1>
            <p className="text-white/40 text-sm leading-relaxed px-4">
              {t('auth.login.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                {errors.general}
              </motion.div>
            )}

            <div className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 px-1">
                  {t('auth.login.email')}
                </label>
                <div className="relative group">
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${errors.email ? 'text-red-400' : 'text-white/20 group-focus-within:text-primary'}`}>
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-white/[0.03] border ${errors.email ? 'border-red-500/30' : 'border-white/10 focus:border-primary/50'} rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 outline-none transition-all focus:bg-white/[0.06] focus:ring-4 focus:ring-primary/5`}
                    placeholder={sanitizeText("admin@gravity-clinic.com")}
                  />
                </div>
                {errors.email && <p className="text-[10px] text-red-400 font-bold px-1">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30">
                    {t('auth.login.password')}
                  </label>
                  <Link to="/forgot-password" className="text-[10px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest">
                    {t('auth.login.forgot_password')}
                  </Link>
                </div>
                <div className="relative group">
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${errors.password ? 'text-red-400' : 'text-white/20 group-focus-within:text-primary'}`}>
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full bg-white/[0.03] border ${errors.password ? 'border-red-500/30' : 'border-white/10 focus:border-primary/50'} rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-white/10 outline-none transition-all focus:bg-white/[0.06] focus:ring-4 focus:ring-primary/5`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/20 hover:text-white/40 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] text-red-400 font-bold px-1">{errors.password}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 rounded border-white/10 bg-white/[0.03] text-primary focus:ring-primary/20 accent-primary focus:ring-offset-0" 
              />
              <label htmlFor="remember" className="text-xs text-white/40 select-none hover:text-white/60 transition-colors">
                {t('auth.login.remember_me')}
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-2xl transition-all duration-300 transform active:scale-[0.98] shadow-[0_10px_30px_rgba(249,115,22,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <span className={`inline-flex items-center gap-2 transition-transform duration-300 ${isLoading ? 'opacity-0' : 'group-hover:translate-x-1'}`}>
                {t('auth.login.submit')}
                <ChevronRight className="w-5 h-5" />
              </span>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              )}
            </button>
          </form>

          {/* Social login or other options can go here if needed */}
        </div>

        <p className="text-center mt-10 text-white/20 text-xs font-medium tracking-wide">
          &copy; 2026 {sanitizeText('Gravity Clinic Global')} &bull; {t('dashboard.premium.access')}
        </p>
      </motion.div>
    </div>
  );
}
