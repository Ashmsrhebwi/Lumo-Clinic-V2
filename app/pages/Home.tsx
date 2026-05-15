import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, Play, Users, Award, Activity, CheckCircle, Shield, Building2, Paintbrush, Package, Calendar, User, Heart, Sparkles, ShieldCheck, MessageSquare, ClipboardList, Plane } from 'lucide-react';
import { LazyImage } from '../components/LazyImage';
import { LazyComponent } from '../components/LazyComponent';
import useEmblaCarousel from 'embla-carousel-react';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { useDashboard } from '../context/DashboardContext';
import { useDebounce } from '../hooks/usePerformance';
import { BlogInsights } from '../components/BlogInsights';
import { clinicService } from '../services/clinicService';
import { sanitizeText } from '../lib/demoUtils';

const ctaImage = 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200';

const CANONICAL_MAP: Record<string, string> = {
  'Dental Implant': 'dental-implant',
  'Hollywood Smile': 'hollywood-smile',
  'Male Hair Transplant': 'male-hair-transplant',
  'Female Hair Transplant': 'female-hair-transplant',
  'Beard & Moustache Transplant': 'beard-moustache-transplant',
  'Eyebrow Transplant': 'eyebrow-transplant'
};
export const Home = () => {
  const { language, t } = useLanguage();
  const { state } = useDashboard();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'start',
    direction: language === 'ar' ? 'rtl' : 'ltr'
  });

  // Re-initialize carousel when language changes for RTL support
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [emblaApi, language]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const connectionStatus = !state.loading && state.branding?.name?.[language] ? 'success' : 'idle';

  // Smooth scroll to hash logic
  useEffect(() => {
    if (!state.loading && window.location.hash === '#results') {
      const element = document.getElementById('results');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [state.loading]);

  const filteredResults = useMemo(() => {
    return state.results.filter(r => {
      const hasBefore = r.before_image_url || (r as any).before_image || (r as any).before_media_url || (r as any).image_url || (r as any).image;
      const hasAfter = r.after_image_url || (r as any).after_image || (r as any).after_media_url;
      return hasBefore && hasAfter;
    });
  }, [state.results]);

  return (
    <div className="min-h-screen bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* 
          Progressive Loading Logic: 
          The full-screen loader has been removed in favor of a route-level HydrateFallback 
          and component-level skeletons. This prevents the "blank screen" effect and 
          allows cached content to be visible immediately.
      */}


      {/* Backend Connection Indicator (Floating) - Optional, can be removed if too noisy */}

      {/* Premium Luxury Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center bg-white overflow-hidden pt-[var(--navbar-height)]"
      >
        {/* Luxury Background Accents */}
        <div className="absolute inset-0 hero-grid-lines opacity-[0.25] pointer-events-none"></div>
        <div className="absolute inset-0 hero-grid-lines-fine opacity-[0.6] pointer-events-none"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[70%] h-[130%] ambient-depth blur-[120px] pointer-events-none"></div>
        
        {/* Dynamic floating element for depth */}
        <motion.div 
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, 1, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-[10%] w-64 h-64 bg-[var(--navbar-cyan)]/5 rounded-full blur-[80px] pointer-events-none"
        ></motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">
            
            {/* Left Content Column */}
            <motion.div
              style={{ opacity }}
              className="flex flex-col text-left py-12"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-4 mb-10"
              >
                <div className="w-12 h-[1px] bg-[var(--navbar-cyan)] opacity-40"></div>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--navbar-cyan)]">
                  {state.sections['home.stats']?.subtitle?.[language] || 'World-Class Dental & Aesthetic Excellence'}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-[var(--hero-title-size)] font-body font-bold text-[var(--navbar-navy)] leading-[1.02] tracking-tight mb-10"
              >
                {state.hero?.title?.[language]?.includes(' ') ? (
                  <>
                    {state.hero.title[language].split(' ').slice(0, -1).join(' ')}{' '}
                    <em className="font-display italic font-normal text-[var(--navbar-cyan)] pr-1">
                      {state.hero.title[language].split(' ').slice(-1)}
                    </em>
                  </>
                ) : (
                  state.hero?.title?.[language] || 'Where Artistry Meets Medicine'
                )}
                <br />
                <span className="text-[var(--navbar-cyan)]/90">
                  {state.hero?.subheader?.[language] || ''}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-xl text-[var(--navbar-navy)]/60 mb-14 max-w-xl font-body leading-relaxed"
              >
                {state.hero?.subtitle?.[language] || ''}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-wrap gap-5 mb-20"
              >
                <Link to="/appointment" className="btn-luxury px-14 py-6">
                  {t('common.bookNow')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/doctors" className="btn-luxury-outline px-14 py-6">
                  {t('nav.doctors') || 'Our Experts'}
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="flex flex-wrap gap-10 pt-10 border-t border-[var(--navbar-navy)]/[0.06]"
              >
                {state.stats.slice(0, 3).map((stat, idx) => (
                  <div key={stat.id} className="flex flex-col gap-2">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display font-light text-[var(--navbar-navy)]" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
                        {stat.value}
                      </span>
                      <span className="text-[var(--navbar-cyan)] font-display font-light text-lg">{stat.suffix}</span>
                    </div>
                    <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[var(--navbar-navy)]/35">
                      {typeof stat.label === 'object' ? stat.label?.[language] : stat.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Visual Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 rounded-[var(--hero-image-radius)] overflow-hidden shadow-[0_40px_100px_-20px_rgba(11,28,45,0.15)] border border-[var(--navbar-navy)]/[0.06] aspect-[0.82] group">
                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  src={state.hero?.media_url || state.hero?.image || "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80"}
                  className="w-full h-full object-cover grayscale-[0.15] group-hover:grayscale-0 transition-all duration-[1.5s] ease-out"
                  alt="Lumo Clinic Excellence"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--navbar-navy)]/20 via-transparent to-transparent pointer-events-none"></div>
              </div>

              {/* Floating Outcome Card — refined glass */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-20px] left-[-30px] z-20 bg-white/85 backdrop-blur-2xl p-9 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(11,23,45,0.12)] border border-[var(--navbar-navy)]/[0.05] max-w-[240px]"
              >
                <div className="label-eyebrow mb-6">
                  {t('home.results.title') || 'Success Rate'}
                </div>
                <div className="font-display text-[var(--navbar-navy)] leading-[0.85] mb-5" style={{ fontSize: 'clamp(4rem, 8vw, 5.25rem)' }}>
                  98<span className="text-2xl align-super ml-1" style={{ opacity: 0.3 }}>%</span>
                </div>
                <div className="text-[11px] text-[var(--navbar-navy)]/45 leading-relaxed font-body">
                  Artistic vision meets medical precision for life-changing results.
                </div>
              </motion.div>

              {/* Floating Stat Pills — minimal, refined */}
              <div className="absolute top-10 right-[-16px] z-20 flex flex-col gap-5">
                <motion.div
                  whileHover={{ x: -10 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="bg-white/85 backdrop-blur-2xl py-6 px-7 rounded-[1.75rem] shadow-[0_15px_45px_-10px_rgba(11,28,45,0.1)] border border-[var(--navbar-navy)]/[0.04] w-[172px]"
                >
                  <div className="font-display text-[var(--navbar-navy)] leading-none mb-2.5" style={{ fontSize: '3rem', fontWeight: 300 }}>12<span className="text-base ml-1 text-[var(--navbar-cyan)]" style={{ opacity: 0.7 }}>yr</span></div>
                  <div className="label-eyebrow">Medical Expertise</div>
                </motion.div>
                <motion.div
                  whileHover={{ x: -10 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="bg-white/85 backdrop-blur-2xl py-6 px-7 rounded-[1.75rem] shadow-[0_15px_45px_-10px_rgba(11,28,45,0.1)] border border-[var(--navbar-navy)]/[0.04] w-[172px]"
                >
                  <div className="font-display text-[var(--navbar-navy)] leading-none mb-2.5" style={{ fontSize: '3rem', fontWeight: 300 }}>48<span className="text-base ml-1 text-[var(--navbar-cyan)]" style={{ opacity: 0.7 }}>+</span></div>
                  <div className="label-eyebrow">Nations Served</div>
                </motion.div>
              </div>

              {/* JCI Certification Badge — refined */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="absolute bottom-10 right-10 z-20 flex items-center gap-5 px-7 py-5 bg-white/85 backdrop-blur-2xl rounded-2xl border border-[var(--navbar-navy)]/[0.06] shadow-[0_12px_40px_-8px_rgba(11,28,45,0.12)] hover:scale-[1.02] transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--navbar-navy)] flex items-center justify-center text-[var(--navbar-cyan)] text-sm shadow-inner">
                  ✦
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="label-eyebrow" style={{ opacity: 1 }}>JCI Accredited</span>
                  <span className="text-[10px] text-[var(--navbar-navy)]/40 font-body">Premium Safety Standard</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--navbar-navy)]">Explore</span>
          <motion.div 
            animate={{ height: [40, 60, 40] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1.5px] bg-gradient-to-b from-[var(--navbar-cyan)] to-transparent"
          ></motion.div>
        </div>
      </section>

      {/* Excellence in Numbers Section */}
      <section className="py-40 relative overflow-hidden bg-[#F8FAFC]">
        <div className="absolute inset-0 hero-grid-lines-fine opacity-[0.4] pointer-events-none"></div>
        <div className="absolute inset-0 ambient-depth pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Editorial split header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-28 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="max-w-xl"
            >
              <div className="flex items-center gap-4 mb-9">
                <span className="block w-6 h-[1.5px] bg-[var(--navbar-cyan)]"></span>
                <span className="label-eyebrow">{t('home.stats.subtitle') || 'Our Global Impact'}</span>
              </div>
              <h2 className="font-body font-bold text-[var(--navbar-navy)] leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(2.75rem, 5.5vw, 4.25rem)' }}>
                {(() => {
                  const title = t('home.stats.title') || 'Excellence in Numbers';
                  const words = title.split(' ');
                  return (
                    <>
                      {words.slice(0, -1).join(' ')}{' '}
                      <em className="font-display not-italic text-[var(--navbar-cyan)] italic font-light">
                        {words[words.length - 1]}
                      </em>
                    </>
                  );
                })()}
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="max-w-sm lg:pb-4"
            >
              <p className="text-[var(--navbar-navy)]/55 text-[17px] leading-relaxed font-body border-l-2 border-[var(--navbar-cyan)]/20 pl-6">
                {state.sections['home.stats']?.subtitle?.[language] || 'Empowering transformations through clinical precision and artistic dedication across the globe.'}
              </p>
            </motion.div>
          </div>

          {/* Luxury stat cards — unified design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {state.stats.map((stat, idx) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="card-luxury p-12 group flex flex-col items-start"
              >
                {/* Decorative Element */}
                <div className="w-10 h-10 rounded-xl bg-[var(--navbar-navy)]/[0.03] border border-[var(--navbar-navy)]/[0.05] flex items-center justify-center mb-10 group-hover:bg-[var(--navbar-cyan)]/10 group-hover:border-[var(--navbar-cyan)]/20 transition-all duration-500">
                  <Activity className="w-4 h-4 text-[var(--navbar-navy)]/30 group-hover:text-[var(--navbar-cyan)]" />
                </div>

                <div className="flex items-baseline gap-1.5 mb-8">
                  <span className="font-display font-light text-[var(--navbar-navy)] group-hover:text-[var(--navbar-cyan)] transition-colors duration-500" style={{ fontSize: 'clamp(3.5rem, 7vw, 4.75rem)', lineHeight: 0.9 }}>
                    {stat.value}
                  </span>
                  <span className="font-display text-[var(--navbar-cyan)] text-2xl font-light">
                    {stat.suffix}
                  </span>
                </div>

                <div className="w-10 h-[1.5px] bg-[var(--navbar-navy)] opacity-[0.08] mb-6 group-hover:w-16 group-hover:bg-[var(--navbar-cyan)]/40 transition-all duration-700"></div>

                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--navbar-navy)]/40 group-hover:text-[var(--navbar-navy)] transition-colors">
                  {(typeof stat.label === 'object' && stat.label !== null ? stat.label?.[language] : stat.label) || ''}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-divider-luxury"></div>
      </div>
      {/* Medical Boutique: The Gravity Standard Section */}
      <section className="py-40 bg-white relative overflow-hidden">
        {/* Premium Background Elements */}
        <div className="absolute inset-0 hero-grid-lines opacity-[0.15] pointer-events-none"></div>
        <div className="absolute top-0 left-1/4 w-[50%] h-full bg-[radial-gradient(circle,rgba(8,145,178,0.02)_0%,transparent_70%)] blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-28 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="max-w-xl"
            >
              <div className="flex items-center gap-4 mb-9">
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--navbar-cyan)] opacity-60">
                  {t('feature.eyebrow') || 'The Standard of Care'}
                </span>
                <div className="w-12 h-[1px] bg-[var(--navbar-cyan)] opacity-30"></div>
              </div>
              
              <h2 className="text-[var(--hero-title-size)] font-body font-bold text-[var(--navbar-navy)] leading-[1.1] tracking-tight">
                {(() => {
                  const title = t('home.whyChooseUs.title') || sanitizeText('The Gravity Standard');
                  const words = title.split(' ');
                  return (
                    <>
                      {words.slice(0, -1).join(' ')}{' '}
                      <span className="font-display italic font-normal text-[var(--navbar-cyan)]">
                        {words[words.length - 1]}
                      </span>
                    </>
                  );
                })()}
              </h2>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="max-w-sm lg:pb-4"
            >
              <p className="text-[var(--navbar-navy)]/55 text-[17px] leading-relaxed font-body border-l-2 border-[var(--navbar-cyan)]/20 pl-6">
                {state.sections['home.whyChooseUs']?.subtitle?.[language] || 'Redefining clinical excellence through a bespoke blend of artistry and medical precision.'}
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(state.whyChooseUsFeatures || []).map((feature, idx) => {
              const Icon = ({ 
                Award, Building2, Paintbrush, Package, 
                Medal: Award, Stethoscope: Activity, Heart: Heart, 
                Sparkles: Sparkles, Shield: ShieldCheck, Star: Star 
              } as any)[feature.icon] || Award;
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 0.8 }}
                  className="group relative"
                >
                  <div className="card-luxury h-full p-12 flex flex-col items-start relative overflow-hidden">
                    {/* Decorative Numbering */}
                    <span className="absolute top-8 right-10 text-6xl font-display italic text-[var(--navbar-navy)]/[0.03] group-hover:text-[var(--navbar-cyan)]/[0.06] transition-colors duration-700 pointer-events-none select-none">
                      0{idx + 1}
                    </span>

                    {/* Icon Container */}
                    <div className="relative mb-12">
                      <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-[var(--navbar-navy)]/[0.05] flex items-center justify-center relative z-10 group-hover:scale-110 group-hover:shadow-lg group-hover:border-[var(--navbar-cyan)]/20 transition-all duration-700">
                        <Icon className="w-7 h-7 text-[var(--navbar-navy)] group-hover:text-[var(--navbar-cyan)] transition-colors duration-500" />
                      </div>
                      <div className="absolute inset-0 bg-[var(--navbar-cyan)]/20 blur-2xl rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-700"></div>
                    </div>
                    
                    <h3 className="text-2xl font-display font-medium text-[var(--navbar-navy)] mb-6 tracking-tight relative">
                      {feature.title?.[language] || (typeof feature.title === 'string' ? feature.title : feature.title?.en) || ''}
                      <div className="absolute bottom-[-10px] left-0 w-8 h-[2px] bg-[var(--navbar-cyan)]/20 group-hover:w-16 group-hover:bg-[var(--navbar-cyan)] transition-all duration-700"></div>
                    </h3>
                    
                    <p className="text-[var(--navbar-navy)]/60 text-[15px] leading-relaxed font-body mt-4">
                      {feature.desc?.[language] || (typeof feature.desc === 'string' ? feature.desc : feature.desc?.en) || ''}
                    </p>

                    <div className="mt-12 flex items-center gap-4 text-[var(--navbar-navy)]/35 group-hover:text-[var(--navbar-cyan)] transition-all duration-700">
                      <div className="w-6 h-[1px] bg-current opacity-30 group-hover:w-12 transition-all"></div>
                      <span className="text-[9px] font-bold uppercase tracking-[0.4em]">{t('common.learnMore') || 'Details'}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bespoke Process Section: Your Seamless Journey */}
      <section className="py-40 relative overflow-hidden bg-[#F8FAFC]">
        {/* Premium Grid & Depth Layer */}
        <div className="absolute inset-0 hero-grid-lines opacity-[0.12] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-[radial-gradient(ellipse,rgba(8,145,178,0.03)_0%,transparent_70%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Editorial Title Block */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-28 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="max-w-xl"
            >
              <div className="flex items-center gap-4 mb-9">
                <span className="block w-6 h-[1.5px] bg-[var(--navbar-cyan)]"></span>
                <span className="label-eyebrow">
                  {t('process.eyebrow') || 'Your Path to Excellence'}
                </span>
              </div>
              <h2 className="font-body font-bold text-[var(--navbar-navy)] leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(2.75rem, 5.5vw, 4.25rem)' }}>
                {(() => {
                  const title = t('home.process.title') || 'Your Seamless Journey';
                  const words = title.split(' ');
                  return (
                    <>
                      {words.slice(0, -1).join(' ')}{' '}
                      <em className="font-display not-italic text-[var(--navbar-cyan)] italic font-light">
                        {words[words.length - 1]}
                      </em>
                    </>
                  );
                })()}
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="max-w-sm lg:pb-4"
            >
              <p className="text-[var(--navbar-navy)]/55 text-[17px] leading-relaxed font-body border-l-2 border-[var(--navbar-cyan)]/20 pl-6">
                {state.sections['home.process']?.subtitle?.[language] || 'A meticulously curated path — from your first conversation to lasting, beautiful results.'}
              </p>
            </motion.div>
          </div>

          {/* Bespoke Card Grid */}
          <div className="relative">

            {/* Premium Timeline Rail — desktop only */}
            <div className="hidden lg:flex absolute top-0 left-0 right-0 items-center px-12 pointer-events-none" style={{ top: '3.25rem' }}>
              <div className="flex-1 flex items-center gap-0">
                {(state.processSteps || []).map((_, i) => (
                  <div key={i} className="flex-1 flex items-center">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-[var(--navbar-cyan)]/40 bg-white flex-shrink-0"></div>
                    {i < (state.processSteps?.length || 0) - 1 && (
                      <div className="flex-1 h-[1px] border-t border-dashed border-[var(--navbar-cyan)] opacity-[0.15]"></div>
                    )}
                  </div>
                ))}
                <div className="w-3.5 h-3.5 rounded-full border-2 border-[var(--navbar-cyan)]/40 bg-white flex-shrink-0"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(state.processSteps || []).map((step, idx) => {
                const stepIcons = [MessageSquare, ClipboardList, Plane, Sparkles];
                const StepIcon = stepIcons[idx % stepIcons.length];
                const stepLabel = ['Free Consultation', 'Treatment Planning', 'Arrival & Treatment', 'Recovery & Results'][idx] || '';

                return (
                  <motion.div
                    key={step.id || idx}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.18, duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="group relative pt-10"
                  >
                    {/* Top Accent Bar + Icon Row */}
                    <div className="flex items-center gap-5 mb-10">
                      <div
                        className="h-[4px] rounded-full transition-all duration-700 group-hover:w-14"
                        style={{
                          width: '2.5rem',
                          background: `linear-gradient(to right, var(--navbar-cyan), rgba(8,145,178,0.3))`
                        }}
                      ></div>
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-[var(--navbar-navy)]/[0.08] shadow-[0_10px_30px_-10px_rgba(11,28,45,0.12)] flex items-center justify-center transition-all duration-700 group-hover:shadow-[0_15px_35px_-10px_rgba(8,145,178,0.25)] group-hover:scale-110 group-hover:border-[var(--navbar-cyan)]/30">
                          <StepIcon className="w-6 h-6 text-[var(--navbar-navy)] group-hover:text-[var(--navbar-cyan)] transition-colors duration-500" />
                        </div>
                        <div className="absolute inset-0 bg-[var(--navbar-cyan)]/30 blur-xl rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-700"></div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="card-luxury p-10 overflow-hidden relative">
                      {/* Watermark Number */}
                      <span className="absolute -bottom-6 -right-2 font-display text-[8rem] font-bold leading-none text-[var(--navbar-navy)] select-none pointer-events-none transition-colors duration-700 group-hover:text-[var(--navbar-cyan)]" style={{ opacity: 0.03 }}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>

                      <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-[var(--navbar-cyan)] mb-4 opacity-80">
                        Phase {String(idx + 1).padStart(2, '0')}
                      </p>

                      <h3 className="text-2xl font-bold text-[var(--navbar-navy)] mb-5 leading-tight tracking-tight">
                        {step.title?.[language] || (typeof step.title === 'string' ? step.title : step.title?.en) || stepLabel}
                      </h3>

                      <div className="w-10 h-[1.5px] bg-[var(--navbar-navy)] opacity-[0.1] mb-6 transition-all duration-500 group-hover:w-16 group-hover:bg-[var(--navbar-cyan)]/40"></div>

                      <p className="text-[var(--navbar-navy)]/60 text-[15px] leading-relaxed font-body">
                        {step.description?.[language] || step.description?.en || step.desc?.[language] || step.desc?.en || ''}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>


      {/* Elite Medical Solutions — Luxury Treatment Showcase */}
      <section id="treatments" className="py-40 bg-white relative overflow-hidden">
        {/* Premium Background Elements */}
        <div className="absolute inset-0 hero-grid-lines opacity-[0.15] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[40%] h-full bg-[radial-gradient(circle,rgba(8,145,178,0.025)_0%,transparent_70%)] blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-28 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="max-w-xl"
            >
              <div className="flex items-center gap-4 mb-9">
                <span className="block w-6 h-[1.5px] bg-[var(--navbar-cyan)]"></span>
                <span className="label-eyebrow">
                  {t('home.treatments.subtitle') || 'Our Medical Specialties'}
                </span>
              </div>
              <h2 className="font-body font-bold text-[var(--navbar-navy)] leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(2.75rem, 5.5vw, 4.25rem)' }}>
                {(() => {
                  const title = t('home.treatments.title') || 'Elite Medical Solutions';
                  const words = title.split(' ');
                  return (
                    <>
                      {words.slice(0, -1).join(' ')}{' '}
                      <em className="font-display not-italic text-[var(--navbar-cyan)] italic font-light">
                        {words[words.length - 1]}
                      </em>
                    </>
                  );
                })()}
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="max-w-sm lg:pb-4"
            >
              <p className="text-[var(--navbar-navy)]/55 text-[17px] leading-relaxed font-body border-l-2 border-[var(--navbar-cyan)]/20 pl-6">
                {state.sections['home.treatments']?.subtitle?.[language] || 'Precision-driven treatments designed to enhance your natural beauty and well-being.'}
              </p>
            </motion.div>
          </div>

          {/* Treatment Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {state.treatments.slice(0, 6).map((treatment, idx) => {
               const title = typeof treatment.title === 'string' ? treatment.title : treatment.title?.[language] || treatment.title?.en || '';
               const description = typeof treatment.description === 'string' ? treatment.description : treatment.description?.[language] || treatment.description?.en || '';
               const category = typeof treatment.category === 'object' && treatment.category !== null ? (treatment.category as any)[language] : treatment.category;

              return (
                <motion.div
                  key={treatment.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="group relative h-[520px] rounded-[3.5rem] overflow-hidden shadow-[0_30px_70px_-15px_rgba(11,28,45,0.1)] hover:shadow-[0_40px_90px_-20px_rgba(8,145,178,0.22)] transition-all duration-[1.2s] ease-out border border-[var(--navbar-navy)]/[0.05]"
                >
                  <Link to={`/treatment/${treatment.slug}`} className="block h-full w-full">
                    <img
                      src={treatment.media_url || treatment.image || "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800"}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                      alt={title}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--navbar-navy)]/95 via-[var(--navbar-navy)]/30 to-transparent group-hover:via-[var(--navbar-navy)]/50 transition-colors duration-700"></div>
                    <div className="absolute inset-0 bg-[var(--navbar-cyan)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                    <div className="absolute inset-0 p-12 flex flex-col justify-end translate-y-6 group-hover:translate-y-0 transition-transform duration-700">
                      <div className="flex items-center gap-3 mb-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-100">
                        <span className="w-8 h-[1px] bg-[var(--navbar-cyan)]"></span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--navbar-cyan)]">
                          {category}
                        </span>
                      </div>

                      <h3 className="text-3xl font-display font-medium text-white mb-6 leading-tight tracking-tight">
                        {title}
                      </h3>

                      <p className="text-white/50 text-[15px] leading-relaxed mb-10 line-clamp-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-200 font-body">
                        {description}
                      </p>

                      <div className="inline-flex items-center gap-3 text-white text-[10px] font-bold uppercase tracking-[0.3em] group/btn opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-300">
                        <span className="relative">
                          {t('common.learnMore')}
                          <div className="absolute bottom-[-6px] left-0 w-full h-[1px] bg-[var(--navbar-cyan)] scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 origin-left"></div>
                        </span>
                        <ArrowRight className="w-4 h-4 text-[var(--navbar-cyan)] group-hover/btn:translate-x-2 transition-transform duration-500" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24 text-center"
          >
            <Link to="/#treatments" className="btn-luxury px-16 py-6">
              {t('common.viewAllTreatments') || 'Explore All Solutions'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Signature Transformations — Cinematic Before/After Showcase */}
      <section id="results" className="py-40 relative overflow-hidden bg-[#F8FAFC]">
        <div className="absolute inset-0 hero-grid-lines opacity-[0.1] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[50%] h-[70%] ambient-depth blur-[100px] pointer-events-none" style={{ transform: 'translate(20%, -10%)' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Editorial Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-28 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="max-w-xl"
            >
              <div className="flex items-center gap-4 mb-9">
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--navbar-cyan)] opacity-60">
                  {t('results.eyebrow') || 'Real Results'}
                </span>
                <div className="w-12 h-[1px] bg-[var(--navbar-cyan)] opacity-30"></div>
              </div>
              <h2 className="text-[var(--hero-title-size)] font-body font-bold text-[var(--navbar-navy)] leading-[1.05] tracking-tight">
                {(() => {
                  const title = state.sections['home.results']?.title?.[language] || 'Signature Transformations';
                  const words = title.split(' ');
                  return (
                    <>
                      {words.slice(0, -1).join(' ')}{' '}
                      <span className="font-display italic font-normal text-[var(--navbar-cyan)]">
                        {words[words.length - 1]}
                      </span>
                    </>
                  );
                })()}
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="max-w-sm lg:pb-4"
            >
              <p className="text-[var(--navbar-navy)]/55 text-[17px] leading-relaxed font-body border-l-2 border-[var(--navbar-cyan)]/20 pl-6">
                {t('home.results.description') || 'Witness the power of precision and artistry through our patient success stories.'}
              </p>
            </motion.div>
          </div>

          {/* Transformation Cases */}
          <div className="flex flex-col gap-32">
            {filteredResults.length === 0 ? (
              <div className="py-32 rounded-[3.5rem] border border-dashed border-[var(--navbar-navy)]/10 flex flex-col items-center justify-center text-center bg-white/40 backdrop-blur-md">
                <div className="w-20 h-20 rounded-3xl bg-[var(--navbar-cyan)]/5 flex items-center justify-center mb-8 border border-[var(--navbar-cyan)]/10">
                  <Star className="w-8 h-8 text-[var(--navbar-cyan)]/40" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--navbar-navy)] mb-4 tracking-tight">
                  {t('home.results.empty') || 'New Success Stories Coming Soon'}
                </h3>
                <p className="text-[var(--navbar-navy)]/50 text-base max-w-sm font-body leading-relaxed italic">
                  {t('home.results.empty_subtitle') || 'Our latest patient transformations are being prepared for the gallery.'}
                </p>
              </div>
            ) : (
              filteredResults.map((result, idx) => {
                const beforeImg = result.before_image_url || (result as any).before_image || (result as any).before_media_url || (result as any).image_url || (result as any).image || '';
                const afterImg = result.after_image_url || (result as any).after_image || (result as any).after_media_url || '';
                const patientName = (typeof result.patient_name === 'object' && result.patient_name !== null ? result.patient_name?.[language] || result.patient_name?.en : result.patient_name) || 'Case Study';
                const story = (typeof result.story === 'object' && result.story !== null ? result.story?.[language] || result.story?.en : result.story) || '';
                const treatmentTitle = (typeof result.treatment?.title === 'object' && result.treatment?.title !== null ? result.treatment?.title?.[language] || result.treatment?.title?.en : result.treatment?.title) || '';
                const treatmentCategory = (typeof result.treatment?.category === 'object' && result.treatment?.category !== null ? result.treatment?.category?.[language] || result.treatment?.category?.en : result.treatment?.category) || '';
                const isOdd = idx % 2 !== 0;

                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={`grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-12 lg:gap-24 items-center ${isOdd ? 'lg:direction-rtl' : ''}`}
                    style={isOdd ? { direction: 'rtl' } : {}}
                  >
                    {/* Slider — larger column */}
                    <div className="w-full relative group" style={isOdd ? { direction: 'ltr' } : {}}>
                      <div className="absolute -inset-4 bg-[var(--navbar-cyan)]/5 rounded-[3.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                      <BeforeAfterSlider
                        beforeImage={beforeImg}
                        afterImage={afterImg}
                        label={patientName}
                      />
                    </div>

                    {/* Patient Info Panel */}
                    <div
                      className="flex flex-col justify-center py-6 lg:py-16"
                      style={isOdd ? { direction: 'ltr' } : {}}
                    >
                      {/* Case Header */}
                      <div className="flex items-center gap-6 mb-10">
                        <span className="font-display text-[var(--navbar-navy)] select-none leading-none font-bold opacity-[0.04]" style={{ fontSize: '6rem' }}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="h-16 w-[2px] bg-[var(--navbar-cyan)] opacity-20"></div>
                        <div className="flex flex-col gap-2">
                          {treatmentCategory && (
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--navbar-cyan)]">{treatmentCategory}</span>
                          )}
                          {treatmentTitle && (
                            <span className="text-[var(--navbar-navy)]/40 text-xs font-body tracking-wider">{treatmentTitle}</span>
                          )}
                        </div>
                      </div>

                      {/* Patient Name */}
                      <h4 className="text-4xl font-display font-medium text-[var(--navbar-navy)] tracking-tight mb-8">
                        {patientName}
                      </h4>

                      {/* Story */}
                      {story && (
                        <div className="relative mb-10">
                          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--navbar-cyan)] to-transparent opacity-20"></div>
                          <p className="text-[var(--navbar-navy)]/60 text-[17px] italic leading-relaxed font-body pl-8">
                            "{story}"
                          </p>
                        </div>
                      )}

                      {/* Treatment Link */}
                      {result.treatment?.slug && (
                        <Link
                          to={`/treatment/${result.treatment.slug}`}
                          className="btn-luxury px-10 py-5 w-fit flex items-center gap-3"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                            {t('common.viewTreatmentDetails') || 'View Case Details'}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Patient Voices — Luxury Google Reviews Showcase */}
      <section className="py-40 relative overflow-hidden bg-white">
        <div className="absolute inset-0 hero-grid-lines opacity-[0.12] pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-1/2 bg-[radial-gradient(ellipse_at_top,rgba(8,145,178,0.03)_0%,transparent_70%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Editorial Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-28 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="max-w-xl"
            >
              <div className="flex items-center gap-4 mb-9">
                <span className="block w-6 h-[1.5px] bg-[var(--navbar-cyan)]"></span>
                <span className="label-eyebrow">
                  {state.sections['home.testimonials']?.subtitle?.[language] || 'Patient Voices'}
                </span>
              </div>
              <h2 className="font-body font-bold text-[var(--navbar-navy)] leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(2.75rem, 5.5vw, 4.25rem)' }}>
                {(() => {
                  const title = state.sections['home.testimonials']?.title?.[language] || 'What Our Patients Say';
                  const words = title.split(' ');
                  return (
                    <>
                      {words.slice(0, -1).join(' ')}{' '}
                      <em className="font-display not-italic text-[var(--navbar-cyan)] italic font-light">
                        {words[words.length - 1]}
                      </em>
                    </>
                  );
                })()}
              </h2>
            </motion.div>

            {/* Google Rating Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.2 }}
              className="flex items-center gap-8 lg:pb-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-white border border-[var(--navbar-navy)]/[0.08] shadow-[0_15px_35px_-10px_rgba(11,28,45,0.12)] flex items-center justify-center flex-shrink-0 group hover:shadow-[0_20px_45px_-10px_rgba(8,145,178,0.2)] transition-all duration-700">
                <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#FBBC05] fill-current" />
                  ))}
                </div>
                <span className="text-[var(--navbar-navy)] font-body text-[15px] font-bold">Rated 5.0 on Google</span>
                <span className="text-[var(--navbar-navy)]/40 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Verified Clinical Reviews</span>
              </div>
            </motion.div>
          </div>

          {/* Testimonial Carousel */}
          <div className="overflow-hidden cursor-grab active:cursor-grabbing px-4" ref={emblaRef}>
            <div className="flex gap-0">
              {useMemo(() => state.testimonials.filter(t => (t.name || t.patient_name) && (t.text || t.feedback)), [state.testimonials])
                .map((testimonial, tIdx) => {
                  const name = (typeof testimonial.name === 'object' && testimonial.name !== null ? testimonial.name?.[language] || testimonial.name?.en : testimonial.name) ||
                               (typeof testimonial.patient_name === 'object' && testimonial.patient_name !== null ? testimonial.patient_name?.[language] || testimonial.patient_name?.en : testimonial.patient_name) ||
                               'Valued Patient';

                  const text = (typeof testimonial.text === 'object' && testimonial.text !== null ? testimonial.text?.[language] || testimonial.text?.en : testimonial.text) ||
                               (typeof testimonial.feedback === 'object' && testimonial.feedback !== null ? testimonial.feedback?.[language] || testimonial.feedback?.en : testimonial.feedback) ||
                               'Exceptional service and life-changing results at Lumo Clinic.';

                  const rating = Math.max(1, Math.min(5, Number(testimonial.rating) || 5));

                  const treatmentLabel = (() => {
                    const tt = testimonial.treatment;
                    if (typeof tt === 'object' && tt !== null) {
                      if ('title' in tt) return (tt as any).title[language] || (tt as any).title.en;
                      return (tt as any)[language] || (tt as any).en;
                    }
                    return tt || '';
                  })();

                  const treatmentSlug = (() => {
                    const tt = testimonial.treatment;
                    return (typeof tt === 'object' && tt !== null && 'slug' in tt) ? (tt as any).slug : null;
                  })();

                  // Generate initials avatar color from name
                  const avatarColors = ['#0B1C2D', '#0891B2', '#1e4d6b', '#155e75', '#0e7490'];
                  const colorIndex = name.charCodeAt(0) % avatarColors.length;
                  const initials = name.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase();

                  return (
                    <div key={testimonial.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0 pl-10">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: tIdx * 0.1, duration: 0.8 }}
                        className="h-full card-luxury p-10 flex flex-col group border-transparent hover:border-[var(--navbar-cyan)]/10"
                      >
                        {/* Google Logo & Rating */}
                        <div className="flex items-center justify-between mb-8">
                          <svg width="70" height="22" viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
                            <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#EA4335"/>
                            <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#FBBC05"/>
                            <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285F4"/>
                            <path d="M225 3v65h-9.5V3h9.5z" fill="#34A853"/>
                            <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill="#EA4335"/>
                            <path d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z" fill="#4285F4"/>
                          </svg>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? 'text-[#FBBC05] fill-current' : 'text-[var(--navbar-navy)]/10'}`} />
                            ))}
                          </div>
                        </div>

                        {/* Review text */}
                        <div className="relative mb-10 flex-1">
                          <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-[var(--navbar-cyan)] to-transparent opacity-20"></div>
                          <p className="text-[var(--navbar-navy)]/65 text-[16px] leading-[1.8] font-body pl-8 italic">
                            "{text}"
                          </p>
                        </div>

                        {/* Patient info */}
                        <div className="mt-auto pt-8 border-t border-[var(--navbar-navy)]/[0.05] flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[var(--navbar-navy)]/[0.04] border border-[var(--navbar-navy)]/[0.08] flex items-center justify-center text-white text-sm font-bold shadow-sm" style={{ backgroundColor: avatarColors[colorIndex] }}>
                              {initials}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-[var(--navbar-navy)] text-[15px] leading-tight">{name}</span>
                              <span className="label-eyebrow !text-[var(--navbar-navy)]/40 mt-1 !text-[9px]">{treatmentLabel || 'Valued Patient'}</span>
                            </div>
                          </div>
                          
                          {treatmentSlug && (
                            <Link to={`/treatment/${treatmentSlug}`} className="w-10 h-10 rounded-xl bg-[var(--navbar-cyan)]/5 text-[var(--navbar-cyan)]/50 flex items-center justify-center hover:bg-[var(--navbar-cyan)] hover:text-white transition-all duration-500">
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center mt-16 gap-3 items-center">
            {useMemo(() => state.testimonials.filter(t => (t.name || t.patient_name) && (t.text || t.feedback)), [state.testimonials]).map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className="transition-all duration-500 rounded-full"
                style={{
                  width: selectedIndex === index ? '2.5rem' : '0.6rem',
                  height: '0.4rem',
                  backgroundColor: selectedIndex === index ? 'var(--navbar-cyan)' : 'var(--navbar-navy-40)',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <BlogInsights />

      {/* CTA — Cinematic Luxury Banner */}
      <section className="relative min-h-[600px] lg:min-h-[720px] overflow-hidden flex items-center bg-[var(--navbar-navy)]">
        {/* Cinematic Layering */}
        <div className="absolute inset-0 hero-grid-lines opacity-[0.05] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(8,145,178,0.1)_0%,transparent_70%)] pointer-events-none"></div>
        
        {ctaImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.08] pointer-events-none grayscale"
            style={{ backgroundImage: `url(${ctaImage})` }}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-32">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_auto] gap-20 items-center">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-4 mb-10">
                <span className="block w-8 h-[1.5px] bg-[var(--navbar-cyan)]"></span>
                <span className="label-eyebrow !text-[var(--navbar-cyan)] !opacity-80">
                  {t('home.cta.eyebrow') || 'Begin Your Journey'}
                </span>
              </div>

              <h2 className="text-white leading-[1.05] tracking-tight mb-10" style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5rem)', fontWeight: 700 }}>
                {(() => {
                  const raw = state.sections['home.cta']?.title?.[language] || t('home.cta.title') || 'Begin Your Aesthetic Evolution';
                  const words = raw.split(' ');
                  return (
                    <>
                      {words.slice(0, -2).join(' ')}{' '}
                      <em className="font-display italic font-light text-[var(--navbar-cyan)] not-italic">
                        {words.slice(-2).join(' ')}
                      </em>
                    </>
                  );
                })()}
              </h2>

              <p className="text-white/40 text-[18px] leading-[1.8] mb-14 max-w-lg font-body">
                {state.sections['home.cta']?.subtitle?.[language] || t('home.cta.subtitle') || 'A private consultation with our specialists is the first step toward a transformation that lasts a lifetime.'}
              </p>

              <div className="flex flex-wrap gap-6 items-center">
                <Link to="/appointment" className="btn-luxury px-12 py-5 text-sm">
                  {t('common.bookNow') || 'Secure Consultation'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>

                <Link to="/contact" className="btn-luxury-outline px-12 py-5 text-sm !border-white/10 !text-white hover:!border-[var(--navbar-cyan)] hover:!text-[var(--navbar-cyan)]">
                  {t('nav.contact') || 'Contact Concierge'}
                </Link>
              </div>
            </motion.div>

            {/* Desktop Trust Pillars */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="hidden lg:flex flex-col gap-6"
            >
              {[
                { val: '98%', label: 'Patient Satisfaction' },
                { val: '15+', label: 'Elite Surgeons' },
                { val: '40+', label: 'Countries Served' },
              ].map((pill, i) => (
                <div key={i} className="card-luxury p-8 flex flex-col gap-2 !bg-white/5 !border-white/5 backdrop-blur-xl min-w-[240px]">
                  <span className="text-4xl font-display font-medium text-[var(--navbar-cyan)]">{pill.val}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">{pill.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mobile Navigation Sticky Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-5 bg-white/80 backdrop-blur-2xl border-t border-[var(--navbar-navy)]/5 z-50">
        <Link
          to="/appointment"
          className="btn-luxury w-full py-4 flex justify-center items-center gap-3 shadow-2xl"
        >
          {t('common.bookNow')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
