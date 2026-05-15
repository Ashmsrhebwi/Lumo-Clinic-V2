import React, { useMemo, useRef, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { useDashboard } from '../context/DashboardContext';
import { motion, useScroll, useTransform } from 'motion/react';
import { Check, ArrowRight, Star, Clock, Trophy } from 'lucide-react';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { BlogInsights } from '../components/BlogInsights';
import { PremiumLoader } from '../components/ui/PremiumLoader';
import { sanitizeText } from '../lib/demoUtils';


export function TreatmentDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const { state, refreshTreatmentDetail } = useDashboard();
  
  const treatment = useMemo(() => 
    state.treatments.find((t: any) => t.slug === slug),
  [state.treatments, slug]);

  const fetchingRef = useRef<string | null>(null);

  // PROGRESSIVE HYDRATION: Fetch full details if content_sections are missing
  useEffect(() => {
    if (!slug) return;

    // 1. Only fetch if we don't have the "heavy" data yet
    // 2. Prevent double-firing for the same slug in the same mount cycle (Strict Mode)
    const needsHydration = !treatment || !treatment.content_sections || treatment.content_sections.length === 0;
    
    if (needsHydration && fetchingRef.current !== slug) {
      fetchingRef.current = slug;
      refreshTreatmentDetail(slug).finally(() => {
        // Optional: clear ref if we want to allow re-fetches on subsequent mounts
        // but for now, the data is in global context, so it won't be "needsHydration" anyway.
      });
    }
  }, [slug, treatment, refreshTreatmentDetail]);

  const clinicName = useMemo(() => 
    state.branding.name?.[language] || sanitizeText('Gravity Clinic'),
  [state.branding.name, language]);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const filteredTestimonials = useMemo(() => {
    if (!treatment) return [];
    return state.testimonials.filter(
      tes => String(tes.treatment_id) === String(treatment.id)
    );
  }, [state.testimonials, treatment?.id]);

  if (state.loading && !treatment) {
    return <PremiumLoader />;
  }

  if (!treatment) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Premium Luxury Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center bg-white overflow-hidden pt-[var(--navbar-height)]"
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
                <span className="label-eyebrow">
                  {typeof treatment.category === 'object' && treatment.category !== null ? (treatment.category as any)[language] : treatment.category}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-[var(--hero-title-size)] font-body font-bold text-[var(--navbar-navy)] leading-[1.02] tracking-tight mb-10"
              >
                {(() => {
                  const title = (treatment.title as any)?.[language] || '';
                  const words = title.split(' ');
                  if (words.length > 1) {
                    return (
                      <>
                        {words.slice(0, -1).join(' ')}{' '}
                        <em className="font-display italic font-normal text-[var(--navbar-cyan)] pr-1">
                          {words[words.length - 1]}
                        </em>
                      </>
                    );
                  }
                  return title;
                })()}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-xl text-[var(--navbar-navy)]/60 mb-14 max-w-xl font-body leading-relaxed"
              >
                {(treatment.description as any)?.[language] || ''}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-wrap gap-5"
              >
                <Link to="/appointment" className="btn-luxury px-14 py-6">
                  {t('common.bookNow')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/contact" className="btn-luxury-outline px-14 py-6">
                  {t('common.contactUs') || 'Concierge'}
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Visual Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 rounded-[var(--hero-image-radius)] overflow-hidden shadow-[0_40px_100px_-20px_rgba(11,28,45,0.15)] border border-[var(--navbar-navy)]/[0.06] aspect-[0.85] group">
                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  src={treatment.media_url || treatment.image || (treatment as any).image_url || ''}
                  className="w-full h-full object-cover grayscale-[0.15] group-hover:grayscale-0 transition-all duration-[1.5s] ease-out"
                  alt={(treatment.title as any)?.[language] || ''}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--navbar-navy)]/20 via-transparent to-transparent pointer-events-none"></div>
              </div>

              {/* Floating Success Rate Card */}
              {treatment.success_rate && (
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-[-20px] left-[-30px] z-20 bg-white/85 backdrop-blur-2xl p-9 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(11,23,45,0.12)] border border-[var(--navbar-navy)]/[0.05] max-w-[240px]"
                >
                  <div className="label-eyebrow mb-6">
                    {t('stats.success') || 'Success Rate'}
                  </div>
                  <div className="font-display text-[var(--navbar-navy)] leading-[0.85] mb-5" style={{ fontSize: 'clamp(4rem, 8vw, 5.25rem)' }}>
                    {treatment.success_rate}<span className="text-2xl align-super ml-1" style={{ opacity: 0.3 }}>%</span>
                  </div>
                  <div className="text-[11px] text-[var(--navbar-navy)]/45 leading-relaxed font-body">
                    Artistic vision meets medical precision for life-changing results.
                  </div>
                </motion.div>
              )}

              {/* Floating Duration Pill */}
              <div className="absolute top-10 right-[-16px] z-20 flex flex-col gap-5">
                <motion.div
                  whileHover={{ x: -10 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="bg-white/85 backdrop-blur-2xl py-6 px-7 rounded-[1.75rem] shadow-[0_15px_45px_-10px_rgba(11,28,45,0.1)] border border-[var(--navbar-navy)]/[0.04] w-[180px]"
                >
                  <div className="font-display text-[var(--navbar-navy)] leading-none mb-2.5" style={{ fontSize: '2.5rem', fontWeight: 300 }}>
                    {(treatment.duration as any)?.[language] || (treatment.duration as any)?.en || '1-2h'}
                  </div>
                  <div className="label-eyebrow">{t('stats.duration') || 'Procedure Time'}</div>
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
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--navbar-navy)]">Details</span>
          <motion.div 
            animate={{ height: [40, 60, 40] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1.5px] bg-gradient-to-b from-[var(--navbar-cyan)] to-transparent"
          ></motion.div>
        </div>
      </section>

      {/* Overview & Procedure Highlights */}
      <section className="py-40 relative overflow-hidden bg-white">
        {/* Subtle Background Detail */}
        <div className="absolute inset-0 hero-grid-lines-fine opacity-[0.3] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-20 items-start">
            
            {/* Left Content Column - Informational Focus */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="lg:w-1/2"
            >
              <div className="flex items-center gap-4 mb-9">
                <span className="block w-6 h-[1.5px] bg-[var(--navbar-cyan)]"></span>
                <span className="label-eyebrow">
                  {t('common.details') || 'Clinical Excellence'}
                </span>
              </div>

              <h2 className="text-[clamp(2.5rem,4vw,3.5rem)] font-body font-bold text-[var(--navbar-navy)] leading-[1.1] tracking-tight mb-8">
                The <em className="font-display italic font-normal text-[var(--navbar-cyan)]">{sanitizeText('Gravity')}</em> Standard in Care
              </h2>

              <div className="text-[17px] text-[var(--navbar-navy)]/60 leading-relaxed font-body mb-12 max-w-xl">
                {(treatment.description as any)?.[language] || ''}
              </div>

              {/* Stats Grid - Integrated and minimal */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[var(--navbar-navy)]/[0.05]">
                <div>
                  <div className="text-[var(--navbar-cyan)] font-display text-4xl leading-none mb-2">
                    {treatment.success_rate || (treatment as any).successRate}<span className="text-base ml-0.5">%</span>
                  </div>
                  <div className="label-eyebrow text-[9px]">{t('stats.success')}</div>
                </div>
                <div className="border-l border-[var(--navbar-navy)]/10 pl-8">
                  <div className="text-[var(--navbar-navy)] font-display text-2xl leading-none mb-2 pt-1">
                    {(treatment.duration as any)?.[language] || ''}
                  </div>
                  <div className="label-eyebrow text-[9px]">{t('stats.duration')}</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Feature Grid */}
            <div className="lg:w-1/2 w-full">
              {treatment.features && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {(Array.isArray(treatment.features) ? treatment.features : []).map((feature: any, i: number) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.8 }}
                      className="card-luxury p-8 flex flex-col items-start gap-6 group hover:scale-[1.02]"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-[var(--navbar-navy)]/[0.03] border border-[var(--navbar-navy)]/[0.05] flex items-center justify-center text-[var(--navbar-cyan)] group-hover:bg-[var(--navbar-cyan)] group-hover:text-white transition-all duration-500">
                        <Check className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-[var(--navbar-navy)]/80 text-xs uppercase tracking-[0.1em] leading-relaxed">
                        {typeof feature === 'object' && feature !== null ? feature[language] : feature}
                      </span>
                    </motion.div>
                  ))}
                  
                  {/* Decorative / Info Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="sm:col-span-2 mt-4 bg-[var(--navbar-navy)] p-10 rounded-[2.5rem] relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--navbar-cyan)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="text-left">
                        <p className="text-white font-display text-2xl mb-2 italic">Ready for a transformation?</p>
                        <p className="text-white/50 text-xs uppercase tracking-[0.2em]">Consult with our masters of aesthetic dentistry</p>
                      </div>
                      <Link to="/appointment" className="btn-luxury px-10 py-5 !bg-[var(--navbar-cyan)] !shadow-none hover:scale-105 transition-transform">
                        {t('common.bookNow')}
                      </Link>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Content Sections */}
      {treatment.content_sections && treatment.content_sections.length > 0 && (
        <section className="py-40 relative overflow-hidden bg-[#F8FAFC]">
          {/* Premium Grid & Depth Layer */}
          <div className="absolute inset-0 hero-grid-lines opacity-[0.12] pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-[radial-gradient(ellipse,rgba(8,145,178,0.03)_0%,transparent_70%)] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-40">
            {treatment.content_sections.map((section, idx) => {
              const hasImage = section.image || section.media_url;
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                  className={`flex flex-col ${hasImage ? (isEven ? 'lg:flex-row' : 'lg:flex-row-reverse') : 'max-w-4xl mx-auto'} gap-16 lg:gap-32 items-center`}
                >
                  {/* Image Part */}
                  {hasImage && (
                    <div className="w-full lg:w-1/2">
                      <div className="relative group">
                        <div className="absolute -inset-4 bg-[var(--navbar-cyan)]/5 rounded-[3rem] blur-2xl group-hover:bg-[var(--navbar-cyan)]/10 transition-all duration-700"></div>
                        <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_30px_70px_-15px_rgba(11,28,45,0.1)] border border-[var(--navbar-navy)]/[0.05]">
                          <img 
                            src={section.image || section.media_url} 
                            alt={section.title?.[language] || ''} 
                            className="w-full h-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-[1.5s] ease-out" 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Text Part */}
                  <div className={`w-full ${hasImage ? 'lg:w-1/2' : 'text-center'}`}>
                    {section.subtitle && (
                      <div className="flex items-center gap-4 mb-8 justify-start">
                        <span className="block w-4 h-[1px] bg-[var(--navbar-cyan)]"></span>
                        <span className="label-eyebrow">
                          {section.subtitle?.[language] || section.subtitle?.en || ''}
                        </span>
                      </div>
                    )}
                    <h2 className={`text-[clamp(2rem,4vw,3rem)] font-body font-bold text-[var(--navbar-navy)] leading-[1.1] tracking-tight mb-8 ${!hasImage ? 'mx-auto' : ''}`}>
                      {(() => {
                        const title = section.title?.[language] || section.title?.en || '';
                        const words = title.split(' ');
                        if (words.length > 1) {
                          return (
                            <>
                              {words.slice(0, -1).join(' ')}{' '}
                              <em className="font-display italic font-normal text-[var(--navbar-cyan)]">
                                {words[words.length - 1]}
                              </em>
                            </>
                          );
                        }
                        return title;
                      })()}
                    </h2>
                    <div className={`text-lg text-[var(--navbar-navy)]/60 leading-relaxed font-body prose prose-zinc dark:prose-invert max-w-none ${!hasImage ? 'mx-auto' : ''}`}>
                      {section.description?.[language] || section.description?.en || ''}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Testimonials for this treatment */}
      {filteredTestimonials.length > 0 && (
        <section className="py-40 relative overflow-hidden bg-white">
          <div className="absolute inset-0 hero-grid-lines opacity-[0.1] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                    {t('testimonials.title') || 'Patient Experiences'}
                  </span>
                </div>
                <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-body font-bold text-[var(--navbar-navy)] leading-[1.05] tracking-tight">
                  Patient <br />
                  <em className="font-display not-italic text-[var(--navbar-cyan)] italic font-light">Transformations</em>
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
                  {t('testimonials.subtitle') || 'Read the first-hand accounts of excellence from our international patients.'}
                </p>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredTestimonials.map((testimonial, i) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="card-luxury p-12 flex flex-col h-full relative group"
                >
                  <div className="flex gap-1 mb-10">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'fill-[var(--navbar-cyan)] text-[var(--navbar-cyan)]' : 'text-[var(--navbar-navy)]/10'}`} />
                    ))}
                  </div>
                  <blockquote className="text-xl font-display leading-[1.6] text-[var(--navbar-navy)]/80 mb-12 flex-grow italic">
                    "{typeof testimonial.feedback === 'object' && testimonial.feedback ? (testimonial.feedback as any)[language] : 
                      typeof testimonial.text === 'object' && testimonial.text ? (testimonial.text as any)[language] : ''}"
                  </blockquote>
                  <div className="flex items-center gap-6 pt-10 border-t border-[var(--navbar-navy)]/[0.05]">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--navbar-navy)] flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:bg-[var(--navbar-cyan)] transition-colors duration-500">
                      {((typeof testimonial.patient_name === 'object' && testimonial.patient_name ? testimonial.patient_name[language] : 
                         typeof testimonial.name === 'object' && testimonial.name ? (testimonial.name as any)[language] : testimonial.name || 'P')[0]).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-[var(--navbar-navy)] text-lg">
                        {typeof testimonial.patient_name === 'object' && testimonial.patient_name ? testimonial.patient_name[language] : 
                         typeof testimonial.name === 'object' && testimonial.name ? (testimonial.name as any)[language] : testimonial.name}
                      </div>
                      <div className="label-eyebrow text-[8px] mt-1">{t('testimonials.patient')}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Results / Before & After Section for this treatment */}
      {(state.results.filter(r => String(r.treatment_id) === String(treatment.id)).length > 0 || treatment.beforeAfter) && (
        <section className="py-40 relative overflow-hidden bg-[#F8FAFC]">
          <div className="absolute inset-0 hero-grid-lines-fine opacity-[0.4] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                    {t('home.results.title') || 'Transformational Results'}
                  </span>
                </div>
                <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-body font-bold text-[var(--navbar-navy)] leading-[1.05] tracking-tight">
                  Signature <br />
                  <em className="font-display not-italic text-[var(--navbar-cyan)] italic font-light">Success Stories</em>
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
                  {t('home.results.subtitle') || 'Witness the life-changing results of our patients and their journey to excellence.'}
                </p>
              </motion.div>
            </div>

            {state.results.filter(r => String(r.treatment_id) === String(treatment.id)).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
                {state.results
                  .filter(r => String(r.treatment_id) === String(treatment.id))
                  .map((result, idx) => (
                    <motion.div 
                      key={result.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.2, duration: 0.9 }}
                      className="space-y-10"
                    >
                      <div className="rounded-[3.5rem] overflow-hidden shadow-[0_30px_70px_-15px_rgba(11,28,45,0.15)] border-8 border-white bg-white">
                        <BeforeAfterSlider
                          beforeImage={result.before_image_url || ''}
                          afterImage={result.after_image_url || ''}
                          label={result.patient_name?.[language] || result.patient_name?.en || ''}
                        />
                      </div>
                      <div className="card-luxury p-12 relative overflow-hidden group">
                        <div className="absolute -bottom-6 -right-2 font-display text-[8rem] font-bold leading-none text-[var(--navbar-navy)] select-none pointer-events-none opacity-[0.03] group-hover:text-[var(--navbar-cyan)] group-hover:opacity-[0.05] transition-all duration-700">
                          {String(idx + 1).padStart(2, '0')}
                        </div>
                        <h4 className="text-2xl font-display font-medium text-[var(--navbar-navy)] mb-6 italic group-hover:text-[var(--navbar-cyan)] transition-colors duration-500">
                          "{result.patient_name?.[language] || result.patient_name?.en || ''}"
                        </h4>
                        <p className="text-[var(--navbar-navy)]/60 text-[15px] leading-relaxed font-body italic mb-10">
                          "{result.story?.[language] || result.story?.en || ''}"
                        </p>
                        <div className="flex items-center justify-between pt-10 border-t border-[var(--navbar-navy)]/[0.05]">
                          <span className="label-eyebrow text-[9px] opacity-100">
                            {(treatment.category as any)?.[language] || (treatment.category as any)?.en || (typeof treatment.category === 'string' ? treatment.category : '')}
                          </span>
                          <span className="text-[10px] text-[var(--navbar-navy)]/40 font-bold tracking-tight uppercase">{clinicName} Exclusive</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            ) : treatment.beforeAfter ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-5xl mx-auto rounded-[3.5rem] overflow-hidden shadow-2xl border-[12px] border-white"
              >
                <img src={treatment.beforeAfter} alt="Before and After Results" className="w-full h-auto object-cover" />
              </motion.div>
            ) : null}
          </div>
        </section>
      )}

      {/* Blog Insights Section */}
      <BlogInsights />

      {/* Floating CTA for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t border-border z-40">
        <Link
          to="/appointment"
          className="flex items-center justify-center w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30"
        >
          {t('common.bookNow')}
        </Link>
      </div>
    </div>
  );
}
