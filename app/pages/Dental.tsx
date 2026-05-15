import { useLanguage } from '../context/LanguageContext';
import { motion, useScroll, useTransform } from 'motion/react';
import { Check, ArrowRight, Award, Clock, Star } from 'lucide-react';
import { Link } from 'react-router';
import { useRef, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { BlogInsights } from '../components/BlogInsights';
import { EditorialGrid } from '../components/EditorialGrid';
import { sanitizeText } from '../lib/demoUtils';

const dentBg = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200';
const ctaImg = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800';

export function Dental() {
  const { language, t } = useLanguage();
  const { state } = useDashboard();
  
  const dentalTreatments = useMemo(() => 
    state.treatments.filter(t => {
      const category = typeof t.category === 'object' ? t.category?.en : t.category;
      return category === 'Dental' || category === 'الأسنان';
    }), 
  [state.treatments]);
  
  const testimonial = useMemo(() => 
    state.testimonials.find(t => {
      const treatmentName = typeof t.treatment === 'object' ? (t.treatment as any)?.en : t.treatment;
      return treatmentName?.toLowerCase().includes('dental');
    }) || state.testimonials[0], 
  [state.testimonials]);

  const editorialSections = useMemo(() => {
    const dashboardSections = state.sections['dental.content'];
    if (Array.isArray(dashboardSections) && dashboardSections.length > 0) {
      return dashboardSections.map((s: any) => ({
        title: s.title || {},
        subtitle: s.subtitle || {},
        image: s.media_url || s.image || dentBg,
        description: s.description || {},
        link: s.link || '/contact'
      }));
    }

    // Fallback to existing hardcoded content structure
    return [
      {
        title: { en: 'Why Choose Our Dental Clinic?', ar: 'لماذا تختار عيادة الأسنان لدينا؟', fr: 'Pourquoi choisir notre clinique dentaire?', ru: 'Почему стоит выбрать нашу стоматологическую клинику?' },
        subtitle: { en: 'Unmatched Expertise', ar: 'خبرة لا مثيل لها', fr: 'Expertise Inégalée', ru: 'Непревзойденный опыт' },
        image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
        description: { 
          en: 'At Lumo Clinic, our dental experts leverage decades of combined experience to deliver exceptional care. We are committed to prioritizing your oral health and aesthetic goals with personalized treatment plans tailored specifically to your unique needs.',
          ar: 'في عيادة Lumo، يستفيد خبراء الأسنان لدينا من عقود من الخبرة المشتركة لتقديم رعاية استثنائية. نحن ملتزمون بإعطاء الأولوية لصحة فمك وأهدافك الجمالية من خلال خطط علاج شخصية مصممة خصيصًا لتلبية احتياجاتك الفريدة.',
        }
      },
      {
        title: { en: 'State-of-the-Art Technology', ar: 'تكنولوجيا متطورة', fr: 'Технология де Пуэнт', ru: 'Передовые Технологии' },
        subtitle: { en: 'Modern Innovations', ar: 'ابتكارات حديثة', fr: 'Innovations Modernes', ru: 'Современные Инновации' },
        image: 'https://images.unsplash.com/photo-1471864190281-ad5fe9bb0724?auto=format&fit=crop&q=80&w=800',
        description: {
          en: 'We embrace the latest advancements in dental technology, ensuring every procedure is minimally invasive, fast, and remarkably effective. Our facilities are equipped with 3D imaging, laser dentistry, and digital impression systems for precision and maximum comfort.',
          ar: 'نحن نتبنى أحدث التطورات في تكنولوجيا طب الأسنان، مما يضمن أن كل إجراء يكون طفيف التوغل وسريعًا وفعالًا بشكل ملحوظ. تم تجهيز مرافقنا بالتصوير ثلاثي الأبعاد وطب الأسنان بالليزر وأنظمة الانطباع الرقمي لضمان الدقة والراحة القصوى.',
        }
      },
      {
        title: { en: 'A Comfortable Experience', ar: 'تجربة مريحة', fr: 'Une Expérience Confortable', ru: 'Комфортный Опыт' },
        subtitle: { en: 'Patient-First Approach', ar: 'نهج يضع المريض أولاً', fr: 'Approche Centrée sur le Patient', ru: 'Подход, Ориентированный на Пациента' },
        image: 'https://images.unsplash.com/photo-1516549221187-dde193636db2?auto=format&fit=crop&q=80&w=800',
        description: {
          en: 'Your comfort is our top priority. From our tranquil waiting areas to our highly trained support staff, everything is designed to make your visit anxiety-free and pleasant. We offer conscious sedation options for patients who experience dental phobias.',
          ar: 'راحتك هي أولويتنا القصوى. من مناطق الانتظار الهادئة لدينا إلى موظفي الدعم المدربين تدريباً عالياً، تم تصميم كل شيء لجعل زيارتك خالية من القلق وممتعة. نحن نقدم خيارات التهدئة الواعية للمرضى الذين يعانون من رهاب الأسنان.',
        }
      }
    ];
  }, [state.sections, language]);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Cinematic Luxury Hero Section */}
      <section ref={heroRef} className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-[var(--navbar-navy)]">
        {/* Advanced Parallax Background */}
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ y: backgroundY }}
        >
          <img
            src={state.sections['dental.hero']?.media_url || state.sections['dental.hero']?.image || dentBg}
            alt="Elite Dental Artistry"
            className="w-full h-full object-cover scale-110 grayscale-[0.3] brightness-[0.8]"
          />
          
          {/* Multi-layered Cinematic Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--navbar-navy)] via-[var(--navbar-navy)]/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--navbar-navy)] via-[var(--navbar-navy)]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--navbar-navy)_100%)] opacity-80"></div>
          
          {/* Luxury Textures */}
          <div className="absolute inset-0 hero-grid-lines opacity-[0.2] pointer-events-none"></div>
          <div className="absolute inset-0 bg-white/[0.02] mix-blend-overlay pointer-events-none"></div>
        </motion.div>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div 
            style={{ y: textY, opacity }}
            className="flex flex-col items-center text-center pt-20"
          >
            {/* Glass Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.03] backdrop-blur-md border border-white/10 mb-12 shadow-2xl"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--navbar-cyan)] animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/80">
                {t('dental.category') || 'Boutique Oral Rehabilitation'}
              </span>
            </motion.div>

            {/* Editorial Headline */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative mb-12"
            >
              <h1 
                className="text-white leading-[0.95] tracking-tight"
                style={{ fontSize: 'clamp(3.5rem, 9vw, 7.5rem)', fontWeight: 700 }}
              >
                {(() => {
                  const title = state.sections['dental.hero']?.title?.[language] || (state.navLinks.find(l => String(l.id) === '2')?.label[language]) || 'Elite Dental Care';
                  const words = title.split(' ');
                  if (words.length > 2) {
                    return (
                      <>
                        <span className="block opacity-90">{words.slice(0, -1).join(' ')}</span>
                        <span className="block font-display italic font-light text-[var(--navbar-cyan)] relative mt-4">
                          {words[words.length - 1]}
                          {/* Decorative underline */}
                          <motion.span 
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ delay: 1, duration: 1.5 }}
                            className="absolute -bottom-4 left-0 h-[2px] bg-gradient-to-r from-[var(--navbar-cyan)]/60 to-transparent"
                          />
                        </span>
                      </>
                    );
                  }
                  return (
                    <>
                      {words[0]}{' '}
                      <em className="font-display italic font-light text-[var(--navbar-cyan)] not-italic">{words[1]}</em>
                    </>
                  );
                })()}
              </h1>
            </motion.div>

            {/* Refined Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1.2 }}
              className="text-white/60 text-[18px] md:text-[24px] max-w-3xl mx-auto leading-relaxed font-body mb-16 px-4"
            >
              {state.sections['dental.hero']?.subtitle?.[language] || t('dental.subtitle') || 'Experience the intersection of medical precision and artistic vision.'}
            </motion.p>

            {/* Premium CTA Group */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.2 }}
              className="flex flex-wrap justify-center gap-8 mb-24"
            >
              <Link to="/appointment" className="btn-luxury px-16 py-7 text-sm group">
                <span className="relative z-10 flex items-center gap-3">
                  {t('common.bookNow')}
                  <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
                </span>
              </Link>
              
              <Link to="/contact" className="btn-luxury-outline px-16 py-7 text-sm !text-white !border-white/20 hover:!border-[var(--navbar-cyan)] hover:!text-[var(--navbar-cyan)] backdrop-blur-sm">
                {t('common.viewPortfolio') || 'View Restorations'}
              </Link>
            </motion.div>

            {/* Floating Trust Details */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 pt-16 border-t border-white/10 w-full max-w-5xl"
            >
              {[
                { label: t('common.experience') || 'Experience', value: '15+ Years' },
                { label: t('common.successRate') || 'Success Rate', value: '99.8%' },
                { label: t('common.specialists') || 'Experts', value: 'Master Class' },
                { label: t('common.technology') || 'Technology', value: 'AI-Guided' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 mb-2">{stat.label}</p>
                  <p className="text-xl font-display text-white tracking-wide">{stat.value}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Luxury Cinematic Scroll */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6"
        >
          <div className="relative w-[1px] h-24">
            <div className="absolute inset-0 bg-white/10" />
            <motion.div 
              animate={{ 
                height: ["0%", "100%", "0%"],
                top: ["0%", "0%", "100%"]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-0 left-0 w-full bg-[var(--navbar-cyan)] shadow-[0_0_10px_var(--navbar-cyan)]"
            />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-white/30 rotate-180 [writing-mode:vertical-lr]">Discover Elite Care</span>
        </motion.div>
      </section>

      {/* Elite Procedures Showcase */}
      <section className="py-40 relative overflow-hidden bg-white">
        {/* Ambient Depth Elements */}
        <div className="absolute inset-0 hero-grid-lines opacity-[0.12] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[40%] h-full bg-[radial-gradient(circle,rgba(8,145,178,0.03)_0%,transparent_70%)] blur-[120px] pointer-events-none"></div>

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
                  {t('dental.procedures.eyebrow') || 'Advanced Oral Care'}
                </span>
              </div>
              <h2 className="font-body font-bold text-[var(--navbar-navy)] leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(2.75rem, 5.5vw, 4.25rem)' }}>
                {(() => {
                  const title = t('dental.procedures.title') || 'World-Class Procedures';
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
                {t('dental.procedures.subtitle') || 'Precision-driven dental solutions designed to restore function and perfect your aesthetic.'}
              </p>
            </motion.div>
          </div>

          {/* Treatment Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {dentalTreatments.map((treatment, index) => {
              const title = treatment.title?.[language] || treatment.title?.en || '';
              const description = treatment.description?.[language] || treatment.description?.en || '';
              
              return (
                <motion.div
                  key={treatment.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="group flex flex-col h-full bg-white rounded-[3.5rem] border border-[var(--navbar-navy)]/[0.05] shadow-[0_30px_70px_-15px_rgba(11,28,45,0.06)] hover:shadow-[0_40px_90px_-20px_rgba(8,145,178,0.15)] transition-all duration-[1s] ease-out overflow-hidden"
                >
                  {/* Before/After Showcase */}
                  <div className="p-4 flex-shrink-0">
                    <div className="rounded-[3rem] overflow-hidden relative shadow-[0_20px_50px_-10px_rgba(11,28,45,0.1)] group-hover:shadow-none transition-shadow duration-700">
                      <BeforeAfterSlider 
                        beforeImage={treatment.media_url || treatment.image || (treatment as any).image_url || ''} 
                        afterImage={treatment.before_after_media_url || treatment.beforeAfter || treatment.media_url || treatment.image || ''} 
                        label={title}
                      />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-10 lg:p-14 pt-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--navbar-cyan)]/5 flex items-center justify-center text-[var(--navbar-cyan)] border border-[var(--navbar-cyan)]/10 group-hover:bg-[var(--navbar-cyan)] group-hover:text-white transition-all duration-500">
                          <Star className="w-5 h-5 fill-current" />
                        </div>
                        <h3 className="text-3xl font-display font-medium text-[var(--navbar-navy)] tracking-tight">
                          {title}
                        </h3>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--navbar-cyan)]">{t('common.successRate')}</span>
                        <span className="text-2xl font-display text-[var(--navbar-navy)]">{treatment.success_rate}%</span>
                      </div>
                    </div>

                    <p className="text-[var(--navbar-navy)]/55 text-base leading-[1.8] font-body mb-10 line-clamp-3">
                      {description}
                    </p>

                    {/* Features List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-12">
                      {Array.isArray(treatment.features) && treatment.features.slice(0, 4).map((feature: any, fIndex: number) => (
                        <div key={fIndex} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-[var(--navbar-cyan)]/10 flex items-center justify-center">
                            <Check className="w-3 h-3 text-[var(--navbar-cyan)]" />
                          </div>
                          <span className="text-[13px] font-bold text-[var(--navbar-navy)]/60 uppercase tracking-tight">
                            {typeof feature === 'object' && feature !== null ? (feature[language] || feature.en || '') : feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer Info & Actions */}
                    <div className="mt-auto pt-10 border-t border-[var(--navbar-navy)]/[0.05] flex flex-wrap items-center justify-between gap-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[var(--navbar-navy)]/[0.03] flex items-center justify-center text-[var(--navbar-navy)]/40 border border-[var(--navbar-navy)]/[0.05]">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--navbar-navy)]/30">{t('common.duration')}</p>
                          <p className="text-sm font-bold text-[var(--navbar-navy)]">{(treatment.duration as any)?.[language] || (treatment.duration as any)?.en || 'Consultation Required'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                         <Link to={`/treatment/${treatment.slug}`} className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--navbar-navy)]/40 hover:text-[var(--navbar-cyan)] transition-colors">
                           {t('common.viewDetails')}
                         </Link>
                         <Link to="/appointment" className="btn-luxury px-8 py-4 text-[10px]">
                           {t('common.bookNow')}
                         </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Patient Voices — Luxury Google Reviews Showcase */}
      <section className="py-40 relative overflow-hidden bg-[#F8FAFC]">
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
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--navbar-cyan)] opacity-60">
                  {t('results.eyebrow') || 'Real Clinical Results'}
                </span>
                <div className="w-12 h-[1px] bg-[var(--navbar-cyan)] opacity-30"></div>
              </div>
              <h2 className="font-body font-bold text-[var(--navbar-navy)] leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(2.75rem, 5.5vw, 4.25rem)' }}>
                Patient <br />
                <em className="font-display not-italic text-[var(--navbar-cyan)] italic font-light">Transformations</em>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.2 }}
              className="flex items-center gap-8 lg:pb-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-white border border-[var(--navbar-navy)]/[0.08] shadow-[0_15px_35px_-10px_rgba(11,28,45,0.12)] flex items-center justify-center flex-shrink-0">
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

          {testimonial && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="card-luxury p-12 md:p-16 relative group">
                {/* Quote Icon */}
                <div className="absolute top-10 right-10 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700">
                  <svg width="120" height="90" viewBox="0 0 120 90" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 0C13.4315 0 0 13.4315 0 30V90H60V30H30C30 13.4315 43.4315 0 60 0H30ZM90 0C73.4315 0 60 13.4315 60 30V90H120V30H90C90 13.4315 103.4315 0 120 0H90Z" />
                  </svg>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-10">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-[#FBBC05] fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-[var(--navbar-navy)]/70 text-2xl md:text-3xl font-display leading-[1.6] mb-12 italic">
                    "{typeof testimonial.text === 'object' && testimonial.text !== null ? (testimonial.text[language] || (testimonial.text as any).en) : (testimonial.feedback as any)?.[language] || (testimonial.feedback as any)?.en || ''}"
                  </p>

                  <div className="flex items-center gap-6 pt-10 border-t border-[var(--navbar-navy)]/[0.05]">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--navbar-navy)] text-white flex items-center justify-center text-xl font-bold shadow-xl">
                      {((typeof testimonial.name === 'object' && testimonial.name !== null ? (testimonial.name as any)[language] : (testimonial.patient_name as any)?.[language] || testimonial.patient_name || testimonial.name || 'P')[0]).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[var(--navbar-navy)]">
                        {typeof testimonial.name === 'object' && testimonial.name !== null ? (testimonial.name as any)[language] : (testimonial.patient_name as any)?.[language] || testimonial.patient_name || testimonial.name || ''}
                      </h4>
                      <p className="text-[var(--navbar-navy)]/40 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
                        {typeof testimonial.treatment === 'object' && testimonial.treatment !== null ? (testimonial.treatment as any)[language] : (testimonial as any).treatment_name?.[language] || (testimonial as any).treatment_name?.en || testimonial.treatment || ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Detailed Content Sections */}
      <section className="py-40 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <span className="w-8 h-[1px] bg-[var(--navbar-cyan)]"></span>
              <span className="label-eyebrow">
                {t('dental.care.eyebrow') || 'Clinical Excellence'}
              </span>
              <span className="w-8 h-[1px] bg-[var(--navbar-cyan)]"></span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-body font-bold text-[var(--navbar-navy)] leading-[1.05] tracking-tight mb-10"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
            >
              {state.sections['dental.care']?.title?.[language] || t('dental.care.title') || 'The Elite Dental Experience'}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[var(--navbar-navy)]/55 text-[18px] max-w-2xl mx-auto font-body leading-relaxed"
            >
              {state.sections['dental.care']?.subtitle?.[language] || 'Combining medical artistry with revolutionary technology to redefine your clinical journey.'}
            </motion.p>
          </div>

          <EditorialGrid sections={editorialSections} t={t} />
        </div>
      </section>

      {/* Blog Insights Section */}
      <BlogInsights />

      {/* Final Cinematic CTA */}
      <section className="py-40 relative overflow-hidden bg-[var(--navbar-navy)]">
        {/* Background Imagery with Depth */}
        <div className="absolute inset-0 opacity-40">
          <img 
            src={state.sections['dental.cta']?.media_url || state.sections['dental.cta']?.image || state.hero?.media_url || state.hero?.image || ctaImg} 
            alt="Elite Dental Clinic"
            className="w-full h-full object-cover grayscale-[0.5] scale-110"
          />
        </div>
        
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--navbar-navy)] via-[var(--navbar-navy)]/80 to-[var(--navbar-navy)]"></div>
        <div className="absolute inset-0 hero-grid-lines opacity-[0.1] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--navbar-navy)_100%)] opacity-60"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center justify-center gap-4 mb-10">
              <span className="w-12 h-[1px] bg-[var(--navbar-cyan)] opacity-40"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-[var(--navbar-cyan)]">
                {t('home.cta.eyebrow') || 'Begin Your Journey'}
              </span>
              <span className="w-12 h-[1px] bg-[var(--navbar-cyan)] opacity-40"></span>
            </div>

            <h2 className="text-white font-body font-bold leading-[1.1] tracking-tight mb-12" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
              {state.sections['home.cta']?.title?.[language] || t('home.cta.title') || 'Ready to Redefine Your Smile?'}
            </h2>

            <p className="text-white/50 text-[18px] md:text-[22px] max-w-2xl mx-auto leading-relaxed font-body mb-16">
              {state.sections['home.cta']?.subtitle?.[language] || t('home.cta.subtitle') || 'Join our elite circle of patients and experience the pinnacle of dental excellence.'}
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/appointment" className="btn-luxury px-14 py-6 text-sm">
                {t('common.bookNow')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link to="/contact" className="btn-luxury-outline px-14 py-6 text-sm !text-white !border-white/20 hover:!border-[var(--navbar-cyan)] hover:!text-[var(--navbar-cyan)]">
                {t('common.contactUs') || 'Contact Concierge'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mobile Sticky CTA — Refined Luxury Version */}
      <div className="md:hidden fixed bottom-8 left-4 right-4 z-[100]">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-[var(--navbar-navy)]/90 backdrop-blur-xl border border-white/10 p-2 rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)]"
        >
          <Link
            to="/appointment"
            className="flex items-center justify-between w-full p-4 bg-[var(--navbar-cyan)] text-[var(--navbar-navy)] rounded-[1.5rem] font-bold shadow-lg"
          >
            <span className="text-[11px] uppercase tracking-[0.2em] ml-2">{t('common.bookNow')}</span>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
