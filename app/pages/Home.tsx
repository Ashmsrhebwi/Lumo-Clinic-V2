import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, Play, Users, Award, Activity, CheckCircle, Shield, Building2, Paintbrush, Package, Calendar, User, Heart, Sparkles, ShieldCheck } from 'lucide-react';
import { LazyImage } from '../components/LazyImage';
import { LazyComponent } from '../components/LazyComponent';
import useEmblaCarousel from 'embla-carousel-react';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { useDashboard } from '../context/DashboardContext';
import { useDebounce } from '../hooks/usePerformance';
import { BlogInsights } from '../components/BlogInsights';
import { clinicService } from '../services/clinicService';

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

      {/* Premium Hero Section with Parallax */}
      <section
        ref={heroRef}
        className="relative min-h-[70vh] md:min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Parallax Background */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{ y: backgroundY }}
        >
          {/* Priority: YouTube > device video > image > gradient */}
          {state.hero?.youtubeUrl ? (() => {
            const getYoutubeId = (url: string) => {
              const m = url?.match(/(?:youtu\.be\/|v\/|watch\?v=|&v=)([^#&?]{11})/);
              return m ? m[1] : null;
            };
            const yid = getYoutubeId(state.hero.youtubeUrl);
            return yid ? (
              <iframe
                className="absolute inset-0 w-full h-full object-cover"
                src={`https://www.youtube.com/embed/${yid}?autoplay=1&mute=1&controls=0&loop=1&playlist=${yid}&playsinline=1`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                style={{ pointerEvents: 'none' }}
              />
            ) : null;
          })() : state.hero?.videoUrl ? (
            <video
              autoPlay loop muted playsInline
              key={state.hero.videoUrl}
              className="w-full h-full object-cover origin-center"
            >
              <source src={state.hero.videoUrl} type="video/mp4" />
            </video>
          ) : (state.hero?.media_url || state.hero?.image) ? (
            <img
              src={state.hero?.media_url || state.hero?.image}
              className="w-full h-full object-cover origin-center"
              alt="Hero Background"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E1C4B] to-[#2d2b7a]" />
          )}
          {/* Luxury dark overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1E1C4B]/80 via-[#1E1C4B]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
        </motion.div>


        {/* Hero Content */}
        <motion.div
          style={{ y: textY, opacity }}
          className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white pt-20"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 sm:mb-6 leading-tight drop-shadow-xl font-bold"
          >
            {!state.hero?.title?.[language] ? (
              <div className="space-y-4">
                <div className="h-16 w-3/4 mx-auto bg-white/10 rounded-2xl animate-pulse" />
                <div className="h-16 w-1/2 mx-auto bg-primary/20 rounded-2xl animate-pulse" />
              </div>
            ) : (
              <>
                <span className="block">{state.hero?.title?.[language] || ''}</span>
                <span className="block text-primary mt-2">
                  {state.hero?.subheader?.[language] || ''}
                </span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto font-light leading-relaxed px-2"
          >
            {state.hero?.subtitle?.[language] || ''}
          </motion.p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {state.sections['home.stats']?.title?.[language] || ''}
            </h2>
            <p className="text-white/60 text-sm">
              {state.sections['home.stats']?.subtitle?.[language] || ''}
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10 rtl:divide-x-reverse">
            {state.stats.map((stat, idx) => {
              const Icon = [Users, Award, Activity, CheckCircle][idx % 4];
              return (
                <motion.div 
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex flex-col items-center text-center ${idx > 0 && idx % 4 !== 0 ? 'pt-8 lg:pt-0' : ''}`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#3B3A5A] flex items-center justify-center mb-6 shadow-lg">
                    <Icon className="w-8 h-8 text-[#F97316]" />
                  </div>
                  <h3 className="text-4xl sm:text-5xl font-extrabold text-white mb-2 tracking-tight">
                    {stat.value}{stat.suffix}
                  </h3>
                  <p className="text-sm font-bold text-white/50 tracking-widest uppercase">
                    {(typeof stat.label === 'object' && stat.label !== null ? stat.label?.[language] : stat.label) || ''}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-secondary">
              {state.sections['home.whyChooseUs']?.title?.[language] || t('feature.title') || 'Why Choose Us'}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              {state.sections['home.whyChooseUs']?.subtitle?.[language] || t('feature.subtitle') || 'Excellence in every detail of your transformation journey.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {(state.whyChooseUsFeatures || []).map((feature, idx) => {
              const Icon = ({ 
                Award, Building2, Paintbrush, Package, 
                Medal: Award, Stethoscope: Activity, Heart: Heart, 
                Sparkles: Sparkles, Shield: ShieldCheck, Star: Star 
              } as any)[feature.icon] || Award;
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-8 rounded-3xl shadow-xl shadow-secondary/5 border border-border/40 hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col"
                >
                  <div className="w-14 h-14 rounded-[1.25rem] bg-secondary flex items-center justify-center mb-6 shadow-md shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-3">{feature.title?.[language] || (typeof feature.title === 'string' ? feature.title : feature.title?.en) || ''}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc?.[language] || (typeof feature.desc === 'string' ? feature.desc : feature.desc?.en) || ''}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Steps Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-secondary">
              {state.sections['home.process']?.title?.[language] || 'Our Process'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
              {state.sections['home.process']?.subtitle?.[language] || 'Your journey to excellence, simplified into clear, professional steps.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {state.processSteps.map((step, idx) => {
              const Icon = ({ Calendar, User, Shield, Star, CheckCircle } as any)[(step as any).iconName || (step as any).icon_name || step.icon] || CheckCircle;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group"
                >
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-secondary/5 border border-border/40 hover:border-primary/20 transition-all duration-500 h-full">
                    <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute top-8 right-8 text-6xl font-black text-secondary/5 group-hover:text-primary/10 transition-colors">
                      {idx + 1}
                    </div>
                    <h3 className="text-xl font-bold text-secondary mb-3">{step.title?.[language] || step.title?.en || ''}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description?.[language] || step.description?.en || ''}</p>
                  </div>
                  {idx < state.processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border/40 z-0" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Featured Treatments */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-secondary">
              {state.sections['home.treatments']?.title?.[language] || ''}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {state.sections['home.treatments']?.subtitle?.[language] || ''}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {state.treatments.length === 0 ? (
              // Skeleton Treatment Cards
              [...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-2xl bg-muted/20 animate-pulse border border-border/50" />
              ))
            ) : (
              state.treatments.map((treatment, index) => (
                <motion.div
                  key={treatment.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className="aspect-[4/5] overflow-hidden relative">
                    <LazyImage
                      src={treatment.media_url || treatment.image || (treatment as any).image_url || ''}
                      alt={typeof treatment.title === 'string' ? treatment.title : treatment.title?.[language] || treatment.title?.en || ''}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] uppercase tracking-widest font-bold rounded-full border border-white/20">
                        {typeof treatment.category === 'object' && treatment.category !== null ? (treatment.category as any)[language] : treatment.category}
                      </span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E1C4B]/95 via-[#1E1C4B]/40 to-transparent flex items-end">
                    <div className="p-8 text-white w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-2xl font-bold mb-2">{typeof treatment.title === 'string' ? treatment.title : treatment.title?.[language] || treatment.title?.en || ''}</h3>
                      <p className="text-sm text-white/80 mb-6 line-clamp-2 font-light">{typeof treatment.description === 'string' ? treatment.description : treatment.description?.[language] || treatment.description?.en || ''}</p>
                      <Link
                        to={`/treatment/${treatment.slug}`}
                        className="inline-flex items-center text-sm font-semibold text-primary hover:text-white transition-colors group/link"
                      >
                        {t('common.learnMore')}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Results / Before & After Section */}
      <section id="results" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-secondary tracking-tight">
                {state.sections['home.results']?.title?.[language] || ''}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                {state.sections['home.results']?.subtitle?.[language] || ''}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            {filteredResults.length === 0 ? (
              // Show a premium placeholder if no results exist
              <div className="col-span-full py-20 px-4 rounded-[3rem] bg-secondary/[0.02] border-2 border-dashed border-secondary/5 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                  <Star className="w-10 h-10 text-primary/30" />
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3">{t('home.results.empty') || 'New Success Stories Coming Soon'}</h3>
                <p className="text-muted-foreground italic max-w-sm">{t('home.results.empty_subtitle') || 'Our latest patient transformations are currently being documented for our gallery. Please check back shortly.'}</p>
              </div>
            ) : (
              filteredResults.map((result) => {
                  const beforeImg = result.before_image_url || (result as any).before_image || (result as any).before_media_url || (result as any).image_url || (result as any).image || '';
                  const afterImg = result.after_image_url || (result as any).after_image || (result as any).after_media_url || '';
                  const patientName = (typeof result.patient_name === 'object' && result.patient_name !== null ? result.patient_name?.[language] || result.patient_name?.en : result.patient_name) || 'Case Study';
                  const story = (typeof result.story === 'object' && result.story !== null ? result.story?.[language] || result.story?.en : result.story) || '';

                  return (
                    <div key={result.id} className="space-y-6">
                      <BeforeAfterSlider
                        beforeImage={beforeImg}
                        afterImage={afterImg}
                        label={patientName}
                      />
                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-4">
                        <h4 className="text-lg font-bold text-secondary mb-3">"{patientName}"</h4>
                        {story && <p className="text-muted-foreground text-sm italic leading-relaxed mb-6">"{story}"</p>}
                        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#F97316] uppercase tracking-wide mb-1">
                              {(typeof result.treatment?.category === 'object' && result.treatment?.category !== null ? result.treatment?.category?.[language] || result.treatment?.category?.en : result.treatment?.category) || ''}
                            </span>
                            <span className="text-xs text-muted-foreground font-medium">
                              {(typeof result.treatment?.title === 'object' && result.treatment?.title !== null ? result.treatment?.title?.[language] || result.treatment?.title?.en : result.treatment?.title) || ''}
                            </span>
                          </div>
                          {result.treatment?.slug && (
                            <Link 
                              to={`/treatment/${result.treatment.slug}`}
                              className="text-xs font-black text-secondary border-b-2 border-primary pb-0.5 hover:text-primary transition-colors flex items-center gap-1 group"
                            >
                              {t('common.learnMore')}
                              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-secondary">
              {state.sections['home.testimonials']?.title?.[language] || ''}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              {state.sections['home.testimonials']?.subtitle?.[language] || ''}
            </p>
          </div>

          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex">
              {useMemo(() => state.testimonials.filter(t => (t.name || t.patient_name) && (t.text || t.feedback)), [state.testimonials])
                .map((testimonial) => {
                  const name = (typeof testimonial.name === 'object' && testimonial.name !== null ? testimonial.name?.[language] || testimonial.name?.en : testimonial.name) || 
                               (typeof testimonial.patient_name === 'object' && testimonial.patient_name !== null ? testimonial.patient_name?.[language] || testimonial.patient_name?.en : testimonial.patient_name) || 
                               'Valued Patient';
                  
                  const text = (typeof testimonial.text === 'object' && testimonial.text !== null ? testimonial.text?.[language] || testimonial.text?.en : testimonial.text) || 
                               (typeof testimonial.feedback === 'object' && testimonial.feedback !== null ? testimonial.feedback?.[language] || testimonial.feedback?.en : testimonial.feedback) || 
                               'Exceptional service and life-changing results at Gravity Clinic.';
                               
                  const rating = Math.max(1, Math.min(5, Number(testimonial.rating) || 5));

                  return (
                    <div key={testimonial.id} className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] min-w-0 pl-3 sm:pl-6 first:pl-0">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="h-full bg-white p-8 sm:p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/40 relative flex flex-col group"
                      >
                        <div className="mb-8">
                          <div className="flex items-center gap-1 mb-6 text-[#F97316]">
                            {[...Array(rating)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 fill-current" />
                            ))}
                          </div>
                          <p className="text-secondary/70 text-lg sm:text-xl font-medium leading-relaxed italic line-clamp-6">
                            "{text}"
                          </p>
                        </div>

                        <div className="mt-auto pt-8 border-t border-gray-50">
                          <div className="flex items-end justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-extrabold text-secondary text-lg leading-tight mb-1">
                                {name}
                              </p>
                              <p className="text-[11px] text-[#F97316] font-bold tracking-widest uppercase">
                                {(() => {
                                  const tt = testimonial.treatment;
                                  if (typeof tt === 'object' && tt !== null) {
                                    if ('title' in tt) return tt.title[language] || tt.title.en;
                                    return tt[language] || (tt as any).en;
                                  }
                                  return tt || '';
                                })()}
                              </p>
                            </div>
                            {(() => {
                              const tt = testimonial.treatment;
                              const slug = (typeof tt === 'object' && tt !== null && 'slug' in tt) ? tt.slug : null;
                              if (slug) {
                                return (
                                  <Link 
                                    to={`/treatment/${slug}`}
                                    className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all group/learn"
                                    title={t('common.learnMore')}
                                  >
                                    <ArrowRight className="w-5 h-5 group-hover/learn:translate-x-0.5 transition-transform" />
                                  </Link>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="flex justify-center mt-12 space-x-2">
            {state.testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${selectedIndex === index ? 'w-8 bg-primary' : 'bg-primary/20 hover:bg-primary/40'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Blog Insights Section */}
      <BlogInsights />

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-secondary to-secondary/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none" style={{ backgroundImage: `url(${ctaImage})` }}></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            {state.sections['home.cta']?.title?.[language] || t('home.cta.title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-8 sm:mb-10">
            {state.sections['home.cta']?.subtitle?.[language] || t('home.cta.subtitle')}
          </p>
          <Link
            to="/appointment"
            className="inline-block"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-white text-primary font-semibold rounded-full hover:shadow-xl shadow-md transition-shadow cursor-pointer"
            >
              {t('common.bookNow')}
              <ArrowRight className="ml-2 w-5 h-5 lg:mr-0 rtl:rotate-180" />
            </motion.div>
          </Link>
        </div>
      </section>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t border-border z-40">
        <Link
          to="/appointment"
          className="flex items-center justify-center w-full py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/30"
        >
          {t('common.bookNow')}
        </Link>
      </div>
    </div>
  );
}
