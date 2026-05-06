import React, { useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Search, 
  ExternalLink,
  User,
  Menu,
  X,
  Globe
} from 'lucide-react';
import { Link } from 'react-router';
import { useDashboard } from '../context/DashboardContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

import { BrandingManager } from '../components/dashboard/BrandingManager';
import { HeroManager } from '../components/dashboard/HeroManager';
import { TreatmentManager } from '../components/dashboard/TreatmentManager';
import { ResultsManager } from '../components/dashboard/ResultsManager';
import { GenericManager } from '../components/dashboard/GenericManager';
import { SectionManager } from '../components/dashboard/SectionManager';
import { WhyChooseUsManager } from '../components/dashboard/WhyChooseUsManager';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('branding');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { state } = useDashboard();
  const { t } = useLanguage();
  const { logout } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'branding':
        return <BrandingManager key="branding" />;
      case 'hero':
        return <HeroManager key="hero" />;
      case 'treatments':
        return <TreatmentManager key="treatments" />;
      case 'results':
        return (
          <GenericManager
            key="results"
            type="results"
            title={t('dashboard.results.title')}
            description={t('dashboard.results.desc')}
          />
        );
      case 'testimonials':
        return (
          <GenericManager
            key="testimonials"
            type="testimonials"
            title={t('dashboard.nav.testimonials')}
            description={t('testimonials.subtitle')}
          />
        );
      case 'blog':
        return (
          <GenericManager
            key="blog"
            type="blogs"
            title={t('dashboard.nav.blog')}
            description={t('articles.hero.subtitle')}
          />
        );
      case 'locations':
        return (
          <GenericManager
            key="locations"
            type="locations"
            title={t('dashboard.nav.locations')}
            description={t('contact.locations')}
          />
        );
      case 'faqs':
        return (
          <GenericManager
            key="faqs"
            type="faqs"
            title={t('dashboard.nav.faqs')}
            description={t('contact.faq.subtitle')}
          />
        );
      case 'stats':
        return (
          <GenericManager
            key="stats"
            type="stats"
            title={t('dashboard.nav.stats')}
            description={t('stats.countries')}
          />
        );
      case 'process':
        return (
          <GenericManager
            key="process"
            type="processSteps"
            title={t('dashboard.nav.process')}
            description={t('booking.step1.desc')}
          />
        );
      case 'sections':
        return <SectionManager key="sections" />;
      case 'why-choose':
        return <WhyChooseUsManager key="why-choose" />;
      case 'doctors':
        return (
          <GenericManager
            key="doctors"
            type="doctors"
            title="Doctors & Specialists"
            description="Manage the medical team and their specialties."
          />
        );
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-secondary uppercase tracking-tight">{activeTab} Manager</h2>
            <p className="text-muted-foreground">Manage the content for the {activeTab} section.</p>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-secondary/5 border border-secondary/5 h-64 flex items-center justify-center italic text-muted-foreground">
               Component for {activeTab} is under construction...
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F9FE] overflow-hidden font-inter">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Sidebar - Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-secondary/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 z-50 lg:hidden"
            >
              <Sidebar activeTab={activeTab} setActiveTab={(tab) => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
              }} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 md:h-24 bg-white/70 backdrop-blur-xl border-b border-secondary/5 flex items-center justify-between px-6 md:px-10 shrink-0 z-30">
          <div className="flex items-center gap-4 md:gap-6 flex-1">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 bg-secondary/5 rounded-xl text-secondary hover:bg-primary/10 hover:text-primary transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative group max-w-xl w-full">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className={`w-5 h-5 transition-colors ${searchQuery ? 'text-primary' : 'text-slate-400'}`} />
              </div>
              <input
                type="text"
                placeholder={t('dashboard.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary/5 border-none rounded-2xl py-3.5 pl-12 pr-4 text-secondary placeholder:text-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-300"
              />
              {searchQuery && (
                <div className="absolute right-4 inset-y-0 flex items-center">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-md">{t('dashboard.searching')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <Link
              to="/"
              target="_blank"
              className="hidden md:flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-secondary/5 hover:bg-primary/10 active:scale-95 transition-all text-secondary/60 hover:text-primary border border-transparent"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-bold tracking-wide">{t('dashboard.live.site')}</span>
            </Link>

            <div className="h-10 w-px bg-secondary/5 hidden md:block" />

            <div className="flex items-center gap-4 pl-4 border-l border-secondary/5 lg:border-0 lg:pl-0">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-secondary tracking-tight">Shahm s.</p>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{t('dashboard.admin')}</p>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-br from-primary to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <button 
                  onClick={() => logout()}
                  className="relative w-11 h-11 bg-white rounded-2xl flex items-center justify-center p-0.5 border border-secondary/10 transform transition hover:scale-105 active:scale-95 group cursor-pointer"
                  title="Logout"
                >
                  <div className="w-full h-full bg-secondary/5 rounded-[14px] flex items-center justify-center overflow-hidden group-hover:bg-red-50 transition-colors">
                    <User className="w-6 h-6 text-primary group-hover:text-red-500" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <div key={activeTab} className="max-w-7xl mx-auto animate-in fade-in duration-300">
            {renderContent()}
          </div>
        </div>

        {/* Footer info */}
        <footer className="mt-auto px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-secondary/5 bg-white/50">
          <p className="text-secondary/20 text-[10px] font-bold uppercase tracking-[0.2em]">© 2026 Admin Portal v1.0.4</p>
          <div className="flex items-center gap-8">
            <button className="text-[10px] font-black text-secondary/20 uppercase tracking-[0.2em] hover:text-primary transition-colors">{t('dashboard.privacy')}</button>
            <button className="text-[10px] font-black text-secondary/20 uppercase tracking-[0.2em] hover:text-primary transition-colors">{t('dashboard.help')}</button>
          </div>
        </footer>
      </main>
    </div>
  );
}
