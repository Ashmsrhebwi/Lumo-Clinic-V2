import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { Lock, ArrowLeft, ArrowRight, Loader2, Key } from 'lucide-react';
import { clinicService } from '../../services/clinicService';
import { toast } from 'sonner';

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      toast.error('Invalid reset link.');
      navigate('/login');
    }
  }, [token, email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }

    if (!token || !email) return;

    setIsLoading(true);
    try {
      await clinicService.resetPassword({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });
      toast.success('Password has been securely reset!');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50 overflow-hidden pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/[0.03] backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative">
          <Link 
            to="/login"
            className="absolute top-8 left-8 p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>

          <div className="mt-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 border border-primary/20">
              <Key className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-3">
              Reset Password
            </h1>
            <p className="text-white/40 text-sm leading-relaxed px-4 mb-10">
              Please enter your new secure password below to regain access to your dashboard.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 px-1">
                  New Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-primary transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-primary/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 outline-none transition-all focus:bg-white/[0.06] focus:ring-4 focus:ring-primary/5"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 px-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-primary transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-primary/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 outline-none transition-all focus:bg-white/[0.06] focus:ring-4 focus:ring-primary/5"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !password || !passwordConfirmation}
                className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-2xl transition-all duration-300 transform active:scale-[0.98] shadow-[0_10px_30px_rgba(249,115,22,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden mt-6"
              >
                <span className={`inline-flex items-center gap-2 transition-transform duration-300 ${isLoading ? 'opacity-0' : 'group-hover:translate-x-1'}`}>
                  Reset Password
                  <ArrowRight className="w-5 h-5" />
                </span>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
