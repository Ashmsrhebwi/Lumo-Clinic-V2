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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 bg-white/80 backdrop-blur-xl bg-navbar-grid border-b ${scrolled ? 'border-[var(--navbar-border)] shadow-[0_12px_40px_-12px_rgba(11,28,45,0.08)]' : 'border-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-[var(--navbar-height-mobile)] lg:h-[var(--navbar-height)]">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center flex-shrink-0 group relative z-[110] gap-3">
            {state.branding.logo && (
              <img 
                src={state.branding.logo} 
                alt={state.branding.name?.[language] || state.branding.name?.en || 'Clinic Logo'} 
                className="h-8 md:h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-105" 
              />
            )}
            <span className="text-lg md:text-xl font-serif font-medium tracking-tight text-[var(--navbar-navy)] flex items-center">
              {state.branding.name?.[language] || state.branding.name?.en || (!state.branding.logo && (
                <>
                  Lumo<span className="text-[var(--navbar-cyan)]">.</span>
                </>
              ))}
            </span>
          </Link>

          <div className="hidden xl:flex items-center justify-center flex-1 px-4 lg:px-6 space-x-0">
            {navLinks.map((link: any) => (
              <div key={link.id} className="relative">
                {link.isDropdown ? (
                  <button
                    ref={(el) => { dropdownRefs.current[link.id] = el; }}
                    data-dropdown-id={link.id}
                    type="button"
                    className="flex items-center gap-1.5 px-3 lg:px-4 py-2 text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--navbar-navy)] hover:text-[var(--navbar-cyan)] transition-all duration-300 group"
                    onClick={handleDropdownClick(link)}
                    aria-haspopup="true"
                    aria-expanded={activeDropdown === link.id}
                  >
                    <span className="whitespace-nowrap">{link.label}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 text-[var(--navbar-navy)]/40 group-hover:text-[var(--navbar-cyan)] ${activeDropdown === link.id ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    to={link.path || '#'}
                    className={`flex items-center px-3 lg:px-4 py-2 text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--navbar-navy)] hover:text-[var(--navbar-cyan)] transition-all duration-300 ${location.pathname === link.path ? 'text-[var(--navbar-cyan)]' : ''}`}
                  >
                    <span className="whitespace-nowrap">{link.label}</span>
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
                                className="flex items-center justify-between px-5 py-4 rounded-[1.25rem] transition-all hover:bg-[var(--navbar-cyan)]/5 group/item"
                              >
                                <span className="text-sm font-bold text-[var(--navbar-navy)] group-hover/item:text-[var(--navbar-cyan)] transition-colors">
                                  {item.label}
                                </span>
                                <ArrowRight className="w-4 h-4 text-[var(--navbar-cyan)] opacity-0 -translate-x-4 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
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

            <div className="flex items-center space-x-1 pl-4">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-[var(--navbar-navy)] hover:text-[var(--navbar-cyan)] transition-all"
                aria-label={t('nav.search') ?? 'Open search'}
              >
                <Search className="w-4 h-4" />
              </button>

              <div className="relative">
                <button
                  data-lang-toggle
                  type="button"
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 text-[var(--navbar-navy)] hover:text-[var(--navbar-cyan)] transition-all"
                  aria-haspopup="listbox"
                  aria-expanded={langMenuOpen}
                  aria-controls={langMenuId}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wide">{language}</span>
                </button>

                <AnimatePresence>
                  {langMenuOpen && (
                    <motion.div
                      ref={langMenuRef}
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-4 w-48 bg-white border border-border/40 rounded-2xl shadow-2xl py-3 overflow-hidden"
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
                          className={`w-full px-6 py-3 text-left hover:bg-[var(--navbar-cyan)]/5 flex items-center justify-between group ${language === lang ? 'bg-[var(--navbar-cyan)]/5 text-[var(--navbar-navy)]' : 'text-[var(--navbar-navy)]/60 font-bold'}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{flags[lang]}</span>
                            <span className="text-xs uppercase tracking-widest">{languageNames[lang]}</span>
                          </div>
                          {language === lang && <div className="w-1.5 h-1.5 rounded-full bg-[var(--navbar-navy)]" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/appointment"
                className="ml-3 px-6 py-2.5 bg-[var(--navbar-navy)] text-white text-[10.5px] font-bold uppercase tracking-[0.12em] rounded-full shadow-[var(--navbar-cta-shadow)] hover:bg-[var(--navbar-cyan)] hover:shadow-[0_6px_20px_-4px_rgba(8,145,178,0.35)] active:scale-95 transition-all duration-300"
              >
                {t('nav.booking')}
              </Link>
            </div>
          </div>

          <div className="flex xl:hidden items-center space-x-3">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 relative z-[110] text-[var(--navbar-navy)]"
              aria-label={t('nav.search') ?? 'Open search'}
            >
              <Search className="w-6 h-6" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 transition-colors relative z-[110] text-[var(--navbar-navy)]"
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls={mobileMenuId}
              aria-label={mobileMenuOpen ? (t('nav.closeMenu') ?? 'Close navigation menu') : (t('nav.openMenu') ?? 'Open navigation menu')}
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
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
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed inset-0 z-[9999] bg-white bg-navbar-grid flex flex-col pt-24 px-6 overflow-hidden md:px-12 pointer-events-auto"
            >
              {/* Luxury Ambient Glow for Mobile Menu */}
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(8,145,178,0.05)_0%,transparent_70%)] pointer-events-none"></div>
              
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-8 right-8 p-4 text-[var(--navbar-navy)]/40 hover:text-[var(--navbar-cyan)] transition-colors flex items-center gap-3 group px-4 py-2 hover:bg-[var(--navbar-cyan)]/5 rounded-2xl relative z-[120]"
                aria-label={t('nav.close') ?? 'Close menu'}
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                  {language === 'ar' ? 'إغلاق' : (t('nav.close') ?? 'Close')}
                </span>
                <X className="w-7 h-7" />
              </button>

              <div className="flex-1 overflow-y-auto pb-12 custom-scrollbar relative z-[110]">
                <div className="max-w-7xl mx-auto w-full space-y-12">
                  {navLinks.map((link: any, idx: number) => (
                    <motion.div 
                      key={link.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                      className="space-y-6"
                    >
                      {link.isDropdown ? (
                        <>
                          <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--navbar-cyan)] opacity-60 px-2">
                            {link.label}
                          </div>
                          <div className="grid gap-3">
                            {link.children?.map((item: any) => (
                              <Link
                                key={item.id}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-3xl font-bold text-[var(--navbar-navy)] hover:text-[var(--navbar-cyan)] transition-all flex items-center justify-between py-4 px-2 group border-b border-[var(--navbar-navy)]/[0.03]"
                              >
                                <span>{item.label}</span>
                                <ArrowRight className="w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[var(--navbar-cyan)]" />
                              </Link>
                            ))}
                          </div>
                        </>
                      ) : (
                        <Link
                          to={link.path || '#'}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-4xl font-bold text-[var(--navbar-navy)] hover:text-[var(--navbar-cyan)] transition-all block px-2 tracking-tighter uppercase group flex items-center justify-between"
                        >
                          <span>{link.label}</span>
                          <ArrowRight className="w-8 h-8 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[var(--navbar-cyan)]" />
                        </Link>
                      )}
                    </motion.div>
                  ))}

                  <div className="pt-12 border-t border-[var(--navbar-navy)]/10 space-y-12">
                    <div className="grid grid-cols-2 gap-4">
                      {(Object.keys(flags) as Language[]).map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => {
                            setLanguage(lang);
                            setMobileMenuOpen(false);
                          }}
                          className={`px-6 py-6 rounded-3xl flex items-center justify-center gap-4 transition-all border font-bold uppercase tracking-widest text-xs ${language === lang ? 'bg-[var(--navbar-navy)] border-[var(--navbar-navy)] text-white shadow-lg' : 'bg-white border-[var(--navbar-navy)]/10 text-[var(--navbar-navy)]/60 hover:border-[var(--navbar-cyan)]/30 hover:text-[var(--navbar-cyan)]'}`}
                        >
                          <span className="text-2xl">{flags[lang]}</span>
                          <span>{lang}</span>
                        </button>
                      ))}
                    </div>
                    <Link
                      to="/appointment"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center w-full py-7 bg-[var(--navbar-navy)] text-white font-bold uppercase tracking-[0.25em] rounded-full shadow-[0_20px_40px_-10px_rgba(11,28,45,0.3)] hover:bg-[var(--navbar-cyan)] hover:shadow-[0_20px_40px_-10px_rgba(8,145,178,0.3)] hover:-translate-y-1 transition-all duration-500"
                    >
                      {t('nav.booking')}
                      <ArrowRight className="ml-3 w-5 h-5" />
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
              className="fixed inset-0 z-[10000] bg-white/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 pointer-events-auto"
            >
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-8 right-8 p-4 text-[var(--navbar-navy)]/40 hover:text-[var(--navbar-cyan)] transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <div className="w-full max-w-3xl space-y-12">
                <div className="space-y-4 text-center">
                  <h2 className="text-4xl md:text-6xl font-bold text-[var(--navbar-navy)] tracking-tight">{t('nav.search.title')}</h2>
                  <p className="text-[var(--navbar-cyan)] text-lg uppercase tracking-widest font-bold">{t('nav.search.subtitle')}</p>
                </div>
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 text-[var(--navbar-navy)]" />
                  <input
                    autoFocus
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('nav.search.placeholder') || "Search treatments, articles..."}
                    className="w-full bg-[var(--navbar-navy)]/5 border-b-2 border-border/40 py-10 pl-24 pr-10 text-3xl md:text-5xl text-[var(--navbar-navy)] outline-none focus:border-[var(--navbar-navy)] transition-all placeholder:text-[var(--navbar-navy)]/10 font-light"
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
                          className="flex items-center justify-between p-6 rounded-3xl bg-[var(--navbar-navy)]/5 border border-border/10 hover:bg-[var(--navbar-navy)]/10 hover:border-[var(--navbar-cyan)]/20 transition-all group"
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-xl bg-[var(--navbar-navy)]/5 flex items-center justify-center text-[var(--navbar-navy)] group-hover:text-[var(--navbar-cyan)] group-hover:scale-110 transition-all">
                              {result.type === 'treatment' ? <Activity className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--navbar-cyan)] mb-1">{result.category}</p>
                              <h3 className="text-xl font-bold text-[var(--navbar-navy)] group-hover:text-[var(--navbar-cyan)] transition-colors">{result.title}</h3>
                            </div>
                          </div>
                          <ArrowRight className="w-6 h-6 text-[var(--navbar-cyan)] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </Link>
                      ))}
                    </div>
                  ) : searchTerm.trim() ? (
                    <div className="text-center py-20 bg-[var(--navbar-navy)]/5 rounded-[2.5rem] border border-border/10">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--navbar-navy)]/10 mb-6">
                        <Search className="w-8 h-8 text-[var(--navbar-navy)]/20" />
                      </div>
                      <p className="text-[var(--navbar-navy)]/40 font-bold uppercase tracking-[0.2em]">No results found for "{searchTerm}"</p>
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
