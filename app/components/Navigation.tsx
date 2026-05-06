import { Link, useLocation, useNavigate } from 'react-router';
import { useDashboard } from '../context/DashboardContext';
import { useLanguage, Language } from '../context/LanguageContext';
import { Menu, X, Globe, ChevronDown, Search, ArrowRight, Phone, Facebook, Instagram, Twitter, Youtube, Activity, Shield } from 'lucide-react';
import React, { useState, useEffect, useId, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';

const flags: Record<Language, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
  ru: '🇷🇺',
  ar: '🇸🇦',
};

const languageNames: Record<Language, string> = {
  en: 'English',
  fr: 'Français',
  ru: 'Русский',
  ar: 'العربية',
};

const Tooth = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M7 6.5C7.5 4 8.5 3 12 3s4.5 1 5 3.5c.5 3 .5 8.5-1.5 11.5S11 21 10.5 21s-3.5-1-4.5-4S5.5 9.5 7 6.5z" />
    <path d="M10 21c-1.5 0-3-1.5-3-4" />
    <path d="M14 21c1.5 0 3-1.5 3-4" />
  </svg>
);

export const Navigation = React.memo(function Navigation() {
  const { t, language, setLanguage } = useLanguage();
  const { state } = useDashboard();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const mobileMenuId = useId();
  const langMenuId = useId();
  const dropdownRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateDropdownPosition = useCallback((id: string | number) => {
    const button = dropdownRefs.current[id];
    if (button) {
      const rect = button.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom,
        left: rect.left
      });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      if (activeDropdown) {
        updateDropdownPosition(activeDropdown);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeDropdown, updateDropdownPosition]);

  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (activeDropdown) {
        updateDropdownPosition(activeDropdown);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeDropdown, updateDropdownPosition]);

  useEffect(() => {
    if (mobileMenuOpen || isSearchOpen) {
      document.body.style.setProperty('overflow', 'hidden', 'important');
      document.documentElement.style.setProperty('overflow', 'hidden', 'important');
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [mobileMenuOpen, isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (activeDropdown) {
        const button = document.querySelector(`[data-dropdown-id="${activeDropdown}"]`);
        if (
          dropdownRef.current && 
          !dropdownRef.current.contains(target) && 
          button && !button.contains(target)
        ) {
          setActiveDropdown(null);
        }
      }

      if (langMenuOpen && langMenuRef.current && !langMenuRef.current.contains(target)) {
        const langButton = document.querySelector('[data-lang-toggle]');
        if (langButton && !langButton.contains(target)) {
          setLangMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown, langMenuOpen]);

  const handleDropdownClick = useCallback((link: any) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const newDropdown = activeDropdown === link.id ? null : link.id;
      setActiveDropdown(newDropdown);
      if (newDropdown) {
        updateDropdownPosition(link.id);
      }
    };
  }, [activeDropdown, updateDropdownPosition]);

  const navLinks = useMemo(() =>
    state.navLinks.map((link: any) => ({
      id: link.id,
      label: link.label?.[language] || link.label?.en || link.label || "",
      isDropdown: !!link.children && link.children.length > 0,
      path: link.path,
      children: link.children?.map((item: any) => ({
        id: item.id || `${link.id}-${item.path}`,
        path: item.path,
        label: item.label?.[language] || item.label?.en || item.label || ""
      }))
    })), [state.navLinks, language]
  );

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();

    // Helper to safely match text across languages and fallbacks
    const matches = (obj: any, fields: string[]) => {
      return fields.some(field => {
        const value = obj[field];
        if (!value) return false;
        
        if (typeof value === 'object') {
          // Check all language keys in the object
          return Object.values(value).some(v => 
            typeof v === 'string' && v.toLowerCase().includes(term)
          );
        }
        
        return typeof value === 'string' && value.toLowerCase().includes(term);
      });
    };

    const navResults = state.navLinks.flatMap(l => {
      const children = l.children || [];
      return children.filter((item: any) => matches(item, ['label', 'path']))
        .map((item: any) => ({
          id: item.id || item.path,
          type: 'category',
          title: item.label?.[language] || item.label?.en || item.label || "",
          path: item.path,
          category: l.label?.[language] || l.label?.en || l.label || "",
          image: null
        }));
    });

    const treatments = (state.treatments || [])
      .filter(t => matches(t, ['title', 'slug', 'category', 'description']))
      .map(t => ({
        id: t.id,
        type: 'treatment',
        title: (t.title?.[language] || t.title?.en || t.slug || 'Treatment').replace(/-/g, ' '),
        path: `/treatment/${t.slug}`,
        category: typeof t.category === 'object' ? (t.category?.[language] || t.category?.en) : t.category,
        image: t.media_url || t.image
      }));

    const blogs = (state.blogs || [])
      .filter(b => matches(b, ['title', 'slug', 'category', 'excerpt']))
      .map(b => ({
        id: b.id,
        type: 'blog',
        title: (b.title?.[language] || b.title?.en || b.slug || 'Article').replace(/-/g, ' '),
        path: `/blog/${b.slug}`,
        category: typeof b.category === 'object' ? (b.category?.[language] || b.category?.en) : b.category,
        image: b.media_url || b.image
      }));

    // Deduplicate and prioritize: Treatments > Blogs > Categories
    const allResults = [...treatments, ...blogs, ...navResults];
    const uniqueResults = Array.from(new Map(allResults.map(r => [r.path, r])).values());

    return uniqueResults.slice(0, 8);
  }, [searchTerm, state.treatments, state.blogs, language]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      navigate(searchResults[0].path);
      setIsSearchOpen(false);
      setSearchTerm('');
    }
  }, [searchResults, navigate]);

  return (
    <nav
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      aria-label={t('nav.main') ?? 'Main navigation'}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-secondary/5'
          : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center flex-shrink-0 group relative z-[110] gap-2 md:gap-3">
            <div className={`p-1.5 md:p-2 rounded-xl transition-all ${scrolled ? 'bg-primary/10' : 'bg-white/10'}`}>
              <img 
                src={state.branding.logo || "/logo.png"} 
                alt={state.branding.name[language]} 
                className={`h-7 md:h-8 w-auto object-contain transition-all ${mobileMenuOpen ? 'brightness-0 invert' : ''}`} 
              />
            </div>
            <div className="flex flex-col">
              <span className={`text-base md:text-xl font-black tracking-tighter italic leading-none ${scrolled || mobileMenuOpen ? 'text-secondary' : 'text-white'}`}>
                {state.branding.name[language].split(' ')[0]}
              </span>
              <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] leading-none mt-0.5 md:mt-1 ${scrolled || mobileMenuOpen ? 'text-secondary/40' : 'text-white/40'}`}>
                {state.branding.name[language].split(' ').slice(1).join(' ')}
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link: any) => (
              <div key={link.id} className="relative px-1">
                {link.isDropdown ? (
                  <button
                    ref={(el) => { dropdownRefs.current[link.id] = el; }}
                    data-dropdown-id={link.id}
                    type="button"
                    className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-[13px] font-bold uppercase tracking-wider transition-all duration-300 ${scrolled ? 'text-secondary hover:bg-secondary/5' : 'text-white hover:bg-white/10'}`}
                    onClick={handleDropdownClick(link)}
                    aria-haspopup="true"
                    aria-expanded={activeDropdown === link.id}
                  >
                    <span>{link.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 opacity-50 ${activeDropdown === link.id ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    to={link.path || '#'}
                    className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-[13px] font-bold uppercase tracking-wider transition-all duration-300 ${scrolled ? 'text-secondary hover:bg-secondary/5' : 'text-white hover:bg-white/10'} ${location.pathname === link.path ? 'text-primary' : ''}`}
                  >
                    <span>{link.label}</span>
                  </Link>
                )}

                {mounted && createPortal(
                  <AnimatePresence>
                    {activeDropdown === link.id && (
                      <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          position: 'fixed',
                          top: `${dropdownPosition.top}px`,
                          left: `${dropdownPosition.left}px`,
                          zIndex: 9999
                        }}
                        className="pt-4 pointer-events-auto"
                      >
                        <div className="bg-white rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-border/40 p-6 min-w-[280px] backdrop-blur-3xl">
                          <div className="grid gap-2">
                            {link.children?.map((item: any) => (
                               <Link
                                 key={item.id}
                                 to={item.path}
                                 className="flex items-center justify-between px-5 py-4 rounded-[1.25rem] transition-all hover:bg-primary/5 group/item"
                               >
                                <span className="text-sm font-bold text-secondary group-hover/item:text-primary transition-colors">
                                  {item.label}
                                </span>
                                <ArrowRight className="w-4 h-4 text-primary opacity-0 -translate-x-4 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>,
                  document.body
                )}
              </div>
            ))}

            <div className="flex items-center ml-8 space-x-4 pl-6">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className={`p-2.5 rounded-xl transition-all ${scrolled ? 'text-secondary hover:bg-secondary/5' : 'text-white hover:bg-white/10'}`}
                aria-label={t('nav.search') ?? 'Open search'}
              >
                <Search className="w-5 h-5" />
              </button>

              <div className="relative">
                <button
                  data-lang-toggle
                  type="button"
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all ${scrolled ? 'text-secondary hover:bg-secondary/5' : 'text-white hover:bg-white/10'}`}
                  aria-haspopup="listbox"
                  aria-expanded={langMenuOpen}
                  aria-controls={langMenuId}
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-black uppercase">{language}</span>
                </button>

                <AnimatePresence>
                  {langMenuOpen && (
                    <motion.div
                      ref={langMenuRef}
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-4 w-48 bg-white/90 backdrop-blur-2xl border border-border/40 rounded-[2rem] shadow-2xl py-3 overflow-hidden"
                      id={langMenuId}
                    >
                      {(Object.keys(flags) as Language[]).map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => {
                            setLanguage(lang);
                            setLangMenuOpen(false);
                          }}
                          className={`w-full px-6 py-3 text-left hover:bg-primary/5 flex items-center justify-between group ${language === lang ? 'bg-primary/5 text-primary' : 'text-secondary font-bold'}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{flags[lang]}</span>
                            <span className="text-xs uppercase tracking-widest">{languageNames[lang]}</span>
                          </div>
                          {language === lang && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/appointment"
                className="ml-2 px-8 py-3 bg-primary text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
              >
                {t('nav.booking')}
              </Link>
            </div>
          </div>

          <div className="flex lg:hidden items-center space-x-4">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className={`p-2 rounded-xl relative z-[110] ${scrolled ? 'text-secondary' : 'text-white'}`}
              aria-label={t('nav.search') ?? 'Open search'}
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl transition-colors relative z-[110] ${scrolled ? 'text-secondary bg-secondary/5' : 'text-white bg-white/10'}`}
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls={mobileMenuId}
              aria-label={mobileMenuOpen ? (t('nav.closeMenu') ?? 'Close navigation menu') : (t('nav.openMenu') ?? 'Open navigation menu')}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed inset-0 z-[9999] bg-[#0F0E2C] flex flex-col pt-24 px-6 overflow-hidden md:px-12 pointer-events-auto"
            >
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-8 right-8 p-4 text-white/50 hover:text-white transition-colors flex items-center gap-3 group px-4 py-2 hover:bg-white/5 rounded-2xl"
                aria-label={t('nav.close') ?? 'Close menu'}
              >
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                  {language === 'ar' ? 'إغلاق' : (t('nav.close') ?? 'Close')}
                </span>
                <X className="w-6 h-6" />
              </button>

              <div className="flex-1 overflow-y-auto pb-12 custom-scrollbar">
                <div className="max-w-7xl mx-auto w-full space-y-10">
                  {navLinks.map((link: any) => (
                    <div key={link.id} className="space-y-4">
                      {link.isDropdown ? (
                        <>
                          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 px-2">
                            {link.label}
                          </div>
                          <div className="grid gap-2">
                            {link.children?.map((item: any) => (
                              <Link
                                key={item.id}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-3xl font-bold text-white hover:text-primary transition-all flex items-center justify-between py-3 px-2 group"
                              >
                                <span>{item.label}</span>
                                <ArrowRight className="w-6 h-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                              </Link>
                            ))}
                          </div>
                        </>
                      ) : (
                        <Link
                          to={link.path || '#'}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-4xl font-black text-white hover:text-primary transition-all block px-2 tracking-tighter uppercase"
                        >
                          {link.label}
                        </Link>
                      )}
                    </div>
                  ))}

                  <div className="pt-10 border-t border-white/10 space-y-10">
                    <div className="grid grid-cols-2 gap-4">
                      {(Object.keys(flags) as Language[]).map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => {
                            setLanguage(lang);
                            setMobileMenuOpen(false);
                          }}
                          className={`px-6 py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all border font-bold uppercase tracking-widest text-xs ${language === lang ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/10 text-white/60'}`}
                        >
                          <span className="text-xl">{flags[lang]}</span>
                          <span>{lang}</span>
                        </button>
                      ))}
                    </div>
                    <Link
                      to="/appointment"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center w-full py-6 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-[2rem] shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-transform"
                    >
                      {t('nav.booking')}
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {mounted && createPortal(
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10000] bg-[#0F0E2C]/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 pointer-events-auto"
            >
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-8 right-8 p-4 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <div className="w-full max-w-3xl space-y-12">
                <div className="space-y-4 text-center">
                  <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">{t('nav.search.title')}</h2>
                  <p className="text-white/40 text-lg uppercase tracking-widest font-bold">{t('nav.search.subtitle')}</p>
                </div>
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 text-primary" />
                  <input
                    autoFocus
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('nav.search.placeholder') || "Search treatments, articles..."}
                    className="w-full bg-white/5 border-b-2 border-white/10 py-10 pl-24 pr-10 text-3xl md:text-5xl text-white outline-none focus:border-primary transition-all placeholder:text-white/10 font-light"
                  />
                </form>

                <div className="max-h-[50vh] overflow-y-auto custom-scrollbar space-y-4">
                  {searchResults.length > 0 ? (
                    <div className="grid gap-3">
                      {searchResults.map((result) => (
                        <Link
                          key={`${result.type}-${result.id}`}
                          to={result.path}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center justify-between p-6 rounded-[1.5rem] bg-white/5 border border-white/5 hover:bg-primary/10 hover:border-primary/20 transition-all group"
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                              {result.type === 'treatment' ? <Activity className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">{result.category}</p>
                              <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{result.title}</h3>
                            </div>
                          </div>
                          <ArrowRight className="w-6 h-6 text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </Link>
                      ))}
                    </div>
                  ) : searchTerm.trim() ? (
                    <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-white/5">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
                        <Search className="w-8 h-8 text-white/20" />
                      </div>
                      <p className="text-white/40 font-bold uppercase tracking-[0.2em]">No results found for "{searchTerm}"</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </nav>
  );
});

const iconMap: Record<string, any> = {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
};
