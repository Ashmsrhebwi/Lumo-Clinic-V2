import React, { useMemo, useRef, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { useDashboard } from '../context/DashboardContext';
import { motion, useScroll, useTransform } from 'motion/react';
import { Check, ArrowRight, Star, Clock, Trophy } from 'lucide-react';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { BlogInsights } from '../components/BlogInsights';
import { PremiumLoader } from '../components/ui/PremiumLoader';


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
    state.branding.name?.[language] || 'Gravity Clinic',
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
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0 w-full h-full" style={{ y: backgroundY }}>
          <img
            src={treatment.media_url || treatment.image || (treatment as any).image_url || ''}
            alt={(treatment.title as any)?.[language] || ''}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-secondary/60 mix-blend-multiply"></div>
        </motion.div>
        
        <motion.div style={{ y: textY, opacity }} className="relative z-10 text-center text-white px-4 pt-24">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-white/20 text-primary-foreground text-sm font-bold tracking-wider uppercase mb-6"
          >
            {typeof treatment.category === 'object' && treatment.category !== null ? (treatment.category as any)[language] : treatment.category}
          </motion.span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
            {(treatment.title as any)?.[language] || ''}
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white/90 font-medium line-clamp-3">
            {(treatment.description as any)?.[language] || ''}
          </p>
        </motion.div>
      </section>

      {/* Overview Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: language === 'ar' ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-8 italic text-secondary">
              {(treatment.title as any)?.[language] || ''}
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground mb-10 leading-relaxed">
              <p>{(treatment.description as any)?.[language] || ''}</p>
            </div>
            
            {treatment.features && (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {(Array.isArray(treatment.features) ? treatment.features : []).map((feature: any, i: number) => (
                  <li key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border/50">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-semibold text-secondary">{typeof feature === 'object' && feature !== null ? feature[language] : feature}</span>
                  </li>
                ))}
              </ul>
            )}

            <Link
              to="/appointment"
              className="inline-flex items-center px-10 py-5 bg-primary text-white font-bold rounded-full hover:shadow-2xl hover:shadow-primary/30 transition-all group"
            >
              {t('common.bookNow')}
              <ArrowRight className={`ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform ${language === 'ar' ? 'rotate-180' : ''}`} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-primary/10 rounded-[4rem] blur-3xl -z-10"></div>
            <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-zinc-900 relative">
               <img
                src={treatment.content_media_url || treatment.media_url || treatment.image || (treatment as any).image_url || ''}
                alt="Overview"
                className="w-full h-full object-cover aspect-[4/5]"
              />
              {/* Stats Overlay */}
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-primary font-bold text-2xl">{treatment.success_rate || (treatment as any).successRate}%</div>
                  <div className="text-xs font-bold text-muted-foreground uppercase">{t('stats.success')}</div>
                </div>
                <div className="text-center border-l border-border/50">
                  <div className="text-secondary font-bold text-2xl">{(treatment.duration as any)?.[language] || ''}</div>
                  <div className="text-xs font-bold text-muted-foreground uppercase">{t('stats.duration')}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Content Sections */}
      {treatment.content_sections && treatment.content_sections.length > 0 && (
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 space-y-24">
            {treatment.content_sections.map((section, idx) => {
              const hasImage = section.image || section.media_url;
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex flex-col ${hasImage ? (isEven ? 'lg:flex-row' : 'lg:flex-row-reverse') : 'max-w-4xl mx-auto'} gap-12 lg:gap-20 items-center`}
                >
                  {/* Image Part */}
                  {hasImage && (
                    <div className="w-full lg:w-1/2">
                      <div className="relative group">
                        <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-2xl group-hover:bg-primary/20 transition-all"></div>
                        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800">
                          <img 
                            src={section.image || section.media_url} 
                            alt={section.title?.[language] || ''} 
                            className="w-full h-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-700" 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Text Part */}
                  <div className={`w-full ${hasImage ? 'lg:w-1/2' : 'text-center'}`}>
                    {section.subtitle && (
                      <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-black tracking-widest uppercase mb-6">
                        {section.subtitle?.[language] || section.subtitle?.en || ''}
                      </span>
                    )}
                    <h2 className={`text-3xl md:text-5xl font-bold mb-8 text-secondary leading-tight ${!hasImage ? 'mx-auto' : ''}`}>
                      {section.title?.[language] || section.title?.en || ''}
                    </h2>
                    <div className={`text-lg text-muted-foreground leading-relaxed prose prose-zinc dark:prose-invert max-w-none ${!hasImage ? 'mx-auto' : ''}`}>
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
        <section className="py-24 bg-background overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary italic">
                {t('testimonials.title')}
              </h2>
              <p className="text-muted-foreground text-lg">{t('testimonials.subtitle')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTestimonials.map((testimonial, i) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-muted/50 p-8 rounded-[2.5rem] border border-border/50 flex flex-col h-full"
                >
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'fill-primary text-primary' : 'text-muted'}`} />
                    ))}
                  </div>
                  <blockquote className="text-lg font-medium text-secondary mb-8 flex-grow italic">
                    "{typeof testimonial.feedback === 'object' && testimonial.feedback ? (testimonial.feedback as any)[language] : 
                      typeof testimonial.text === 'object' && testimonial.text ? (testimonial.text as any)[language] : ''}"
                  </blockquote>
                  <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-secondary">
                        {typeof testimonial.patient_name === 'object' && testimonial.patient_name ? testimonial.patient_name[language] : 
                         typeof testimonial.name === 'object' && testimonial.name ? (testimonial.name as any)[language] : testimonial.name}
                      </div>
                      <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{t('testimonials.patient')}</div>
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
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 text-center md:text-left">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-secondary italic">
                  {t('home.results.title') || 'Transformational Results'}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t('home.results.subtitle') || 'See the life-changing results of our patients and their journey to excellence.'}
                </p>
              </div>
            </div>

            {state.results.filter(r => String(r.treatment_id) === String(treatment.id)).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {state.results
                  .filter(r => String(r.treatment_id) === String(treatment.id))
                  .map((result) => (
                    <div key={result.id} className="space-y-6">
                      <BeforeAfterSlider
                        beforeImage={result.before_image_url || ''}
                        afterImage={result.after_image_url || ''}
                        label={result.patient_name?.[language] || result.patient_name?.en || ''}
                      />
                      <div className="bg-muted/30 p-8 rounded-[2.5rem] border border-border/50">
                        <h4 className="text-xl font-bold text-secondary mb-3 italic">"{result.patient_name?.[language] || result.patient_name?.en || ''}"</h4>
                        <p className="text-muted-foreground text-sm italic leading-relaxed mb-6">"{result.story?.[language] || result.story?.en || ''}"</p>
                        <div className="flex items-center justify-between pt-6 border-t border-border/50">
                          <span className="text-xs font-black text-primary uppercase tracking-widest">
                            {(treatment.category as any)?.[language] || (treatment.category as any)?.en || (typeof treatment.category === 'string' ? treatment.category : '')}
                          </span>
                          <span className="text-xs text-muted-foreground font-bold tracking-tight">{clinicName} Exclusive</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : treatment.beforeAfter ? (
              <div className="max-w-4xl mx-auto rounded-[3rem] overflow-hidden shadow-2xl border-8 border-gray-50">
                <img src={treatment.beforeAfter} alt="Before and After Results" className="w-full h-auto object-cover" />
              </div>
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
