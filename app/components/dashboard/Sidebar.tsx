import React from 'react';
import { 
  LayoutDashboard, 
  List, 
  Image, 
  Star, 
  Stethoscope, 
  Award,
  FileText, 
  Phone, 
  MapPin, 
  HelpCircle,
  LogOut,
  ChevronRight,
  Tv,
  MessageCircle,
  Settings as SettingsIcon,
  Search as SearchIcon,
  Users as UsersIcon,
  HardDrive,
  BarChart3,
  Workflow,
  Type,
  Settings,
  Grid,
  TrendingUp,
  Share2,
  Globe
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { t } = useLanguage();

  const navItems = [
    { id: 'branding', label: t('dashboard.nav.branding'), icon: LayoutDashboard },
    { id: 'hero', label: t('dashboard.nav.hero'), icon: Tv },
    { id: 'treatments', label: t('dashboard.nav.treatments'), icon: Stethoscope },
    { id: 'why-choose', label: 'Why Choose Us', icon: Award },
    { id: 'doctors', label: 'Doctors', icon: UsersIcon },
    { id: 'results', label: t('dashboard.nav.results'), icon: Image },
    { id: 'testimonials', label: t('dashboard.nav.testimonials'), icon: Star },
    { id: 'blog', label: t('dashboard.nav.blog'), icon: FileText },
    { id: 'locations', label: t('dashboard.nav.locations'), icon: MapPin },
    { id: 'faqs', label: t('dashboard.nav.faqs'), icon: HelpCircle },
    { id: 'stats', label: t('dashboard.nav.stats'), icon: BarChart3 },
    { id: 'process', label: t('dashboard.nav.process'), icon: Workflow },
    { id: 'sections', label: t('dashboard.nav.sections'), icon: Type },
  ];

  return (
    <div className="w-full lg:w-80 h-full bg-[#1A1842] text-white flex flex-col p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 -z-10" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-500/5 blur-[60px] rounded-full translate-y-1/2 -translate-x-1/2 -z-10" />
      
      <div className="flex items-center gap-4 mb-10 px-2 shrink-0">
        <div className="w-11 h-11 bg-gradient-to-br from-primary/20 to-primary/40 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-lg shadow-primary/10">
           <LayoutDashboard className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight leading-none mb-1">Gravity Clinic</h1>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">{t('dashboard.system.online')}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] px-4 mb-3">{t('dashboard.main.control')}</p>
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.03)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 group ${
                activeTab === item.id 
                  ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`p-2 rounded-xl transition-colors ${activeTab === item.id ? 'bg-white/20' : 'group-hover:bg-white/5'}`}>
                  <item.icon className={`w-4 h-4 transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                </div>
                <span className="font-bold text-sm tracking-wide">{item.label}</span>
              </div>
              {activeTab === item.id && (
                <motion.div 
                  layoutId="activeItem" 
                  className="w-1 h-4 bg-white/40 rounded-full" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/5 space-y-4 shrink-0">
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300 group">
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-bold text-sm">{t('dashboard.nav.logout')}</span>
        </button>
        
        <div className="p-5 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/20 blur-[20px] rounded-full -translate-y-1/2 translate-x-1/2 transition-all group-hover:bg-primary/30" />
          <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">Build v1.2.4</p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/60">{t('dashboard.premium.access')}</span>
            <ChevronRight className="w-3.5 h-3.5 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
