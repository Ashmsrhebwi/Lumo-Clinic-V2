import { motion, HTMLMotionProps } from 'motion/react';
import { LucideIcon } from 'lucide-react';

// --- Dashboard Button ---
interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  loading?: boolean;
}

export const DashboardButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  loading, 
  className = '', 
  ...props 
}: ButtonProps) => {
  const variants = {
    primary: 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90',
    secondary: 'bg-secondary text-white hover:bg-secondary/90',
    outline: 'bg-transparent border-2 border-secondary/10 text-secondary hover:bg-secondary/5',
    ghost: 'bg-transparent text-secondary/60 hover:bg-secondary/5 hover:text-secondary',
    danger: 'bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600',
    success: 'bg-green-500 text-white shadow-lg shadow-green-500/20 hover:bg-green-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-2xl gap-2',
    lg: 'px-8 py-4 text-base rounded-[1.25rem] gap-3',
    xl: 'px-10 py-5 text-lg rounded-[1.5rem] gap-4',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5'} />}
      {children as React.ReactNode}
    </motion.button>
  );
};

// --- Dashboard Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
}

export const DashboardInput = ({ label, error, icon: Icon, className = '', ...props }: InputProps) => {
  return (
    <div className="space-y-2 w-full">
      {label && <label className="text-sm font-bold text-secondary/60 ml-1">{label}</label>}
      <div className="relative group">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/30 group-focus-within:text-primary transition-colors" />}
        <input
          className={`w-full bg-secondary/5 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl py-4 ${Icon ? 'pl-12' : 'px-6'} pr-6 text-secondary font-semibold outline-none transition-all placeholder:text-secondary/20 ${error ? 'border-red-500/50 bg-red-50/50' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-bold ml-1">{error}</p>}
    </div>
  );
};

// --- Dashboard Card ---
interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'white' | 'dark' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const DashboardCard = ({ children, className = '', variant = 'white', padding = 'md' }: CardProps) => {
  const variants = {
    white: 'bg-white shadow-xl shadow-secondary/5 border border-secondary/5',
    dark: 'bg-[#1E1C4B] text-white shadow-2xl border border-white/5',
    glass: 'bg-white/10 backdrop-blur-xl border border-white/10 text-white',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4 md:p-6',
    md: 'p-8 md:p-10',
    lg: 'p-12 md:p-16',
  };

  return (
    <div className={`${variants[variant]} ${paddings[padding]} rounded-[2.5rem] transition-all ${className}`}>
      {children}
    </div>
  );
};

// --- Status Badge ---
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  className?: string;
}

export const StatusBadge = ({ children, variant = 'info', className = '' }: BadgeProps) => {
  const styles = {
    success: 'bg-green-500/10 text-green-600',
    warning: 'bg-orange-500/10 text-orange-600',
    error: 'bg-red-500/10 text-red-600',
    info: 'bg-primary/10 text-primary',
    neutral: 'bg-secondary/5 text-secondary/40',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// --- Section Header ---
interface HeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const SectionHeader = ({ title, description, actions }: HeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-secondary tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground max-w-2xl leading-relaxed">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-4 w-full md:w-auto">{actions}</div>}
    </div>
  );
};

// --- Language Tabs ---
export const LanguageTabs = ({ 
  activeLang, 
  onLangChange 
}: { 
  activeLang: 'en' | 'ar' | 'fr' | 'ru';
  onLangChange: (lang: 'en' | 'ar' | 'fr' | 'ru') => void;
}) => {
  const langs: { code: 'en' | 'ar' | 'fr' | 'ru', label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
    { code: 'fr', label: 'Français' },
    { code: 'ru', label: 'Русский' }
  ];

  return (
    <div className="flex bg-secondary/5 p-1.5 rounded-2xl w-fit border border-secondary/5 backdrop-blur-sm">
      {langs.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => onLangChange(lang.code)}
          className={`px-5 py-2.5 rounded-[1.15rem] text-xs font-bold transition-all duration-300 border ${
            activeLang === lang.code 
              ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]' 
              : 'text-secondary/70 bg-secondary/5 border-secondary/10 hover:text-primary hover:bg-primary/5'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};
