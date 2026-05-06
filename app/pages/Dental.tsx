import { useLanguage } from '../context/LanguageContext';
import { motion, useScroll, useTransform } from 'motion/react';
import { Check, ArrowRight, Award, Clock, Star } from 'lucide-react';
import { Link } from 'react-router';
import { useRef, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { BlogInsights } from '../components/BlogInsights';
import { EditorialGrid } from '../components/EditorialGrid';

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
          en: 'At Gravity Clinic, our dental experts leverage decades of combined experience to deliver exceptional care. We are committed to prioritizing your oral health and aesthetic goals with personalized treatment plans tailored specifically to your unique needs.',
          ar: 'في عيادة جرافيتي، يستفيد خبراء الأسنان لدينا من عقود من الخبرة المشتركة لتقديم رعاية استثنائية. نحن ملتزمون بإعطاء الأولوية لصحة فمك وأهدافك الجمالية من خلال خطط علاج شخصية مصممة خصيصًا لتلبية احتياجاتك الفريدة.',
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
    <div className="min-h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Premium Hero Section with Parallax */}
      <section ref={heroRef} className="relative h-[75vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ y: backgroundY }}
        >
          <img
            src={state.sections['dental.hero']?.media_url || state.sections['dental.hero']?.image || dentBg}
            alt="Dental Clinic"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-[#0F0E2C]/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0F0E2C]"></div>
        </motion.div>

        <motion.div 
          style={{ y: textY, opacity }}
          className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white pt-24"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-white/20 text-primary-foreground text-xs font-black tracking-[0.3em] uppercase mb-8"
          >
            {t('dental.category') || 'Premium Dental Care'}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl mb-8 font-bold tracking-tighter drop-shadow-2xl italic"
          >
            {state.sections['dental.hero']?.title?.[language] || (state.navLinks.find(l => String(l.id) === '2')?.label[language]) || 'Dental Care'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 font-medium max-w-3xl mx-auto leading-relaxed"
          >
            {state.sections['dental.hero']?.subtitle?.[language] || t('dental.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex flex-wrap justify-center gap-4"
          >
            <Link to="/appointment" className="px-10 py-5 bg-primary text-white font-black rounded-full hover:shadow-2xl hover:shadow-primary/40 transition-all transform hover:-translate-y-1 uppercase tracking-widest text-xs">
              {t('common.bookNow')}
            </Link>
            <div className="px-10 py-5 bg-white/10 backdrop-blur-md text-white font-black rounded-full border border-white/20 uppercase tracking-widest text-xs">
              {t('common.expertCare')}
            </div>
          </motion.div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </section>

      {/* Treatments Grid */}
      <section className="py-32 bg-[#F8F9FE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-secondary mb-6 tracking-tighter italic">
              {t('dental.procedures.title') || 'World-Class Procedures'}
            </h2>
            <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {dentalTreatments.map((treatment, index) => (
              <motion.div
                key={treatment.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="group bg-white rounded-[3rem] shadow-2xl shadow-secondary/5 overflow-hidden border border-secondary/5 hover:border-primary/20 transition-all duration-500"
              >
                {/* Interactive Before/After Slider */}
                <div className="p-6">
                  <div className="rounded-[2rem] overflow-hidden shadow-inner">
                    <BeforeAfterSlider 
                      beforeImage={treatment.media_url || treatment.image || (treatment as any).image_url || ''} 
                      afterImage={treatment.before_after_media_url || treatment.beforeAfter || treatment.media_url || treatment.image || ''} 
                    />
                  </div>
                </div>

                {/* Treatment Info */}
                <div className="p-10 pt-4">
                  <div className="flex flex-col gap-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-secondary text-primary rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-500 shadow-xl shadow-primary/10">
                          <Star className="w-7 h-7 fill-current" />
                        </div>
                         <h3 className="text-3xl md:text-4xl font-black text-secondary tracking-tighter italic">
                           {treatment.title?.[language] || treatment.title?.en || ''}
                         </h3>
                      </div>
                      
                      <p className="text-muted-foreground text-lg mb-10 leading-relaxed max-w-xl font-medium">
                        {treatment.description?.[language] || treatment.description?.en || ''}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {Array.isArray(treatment.features) ? treatment.features.map((feature: any, fIndex: number) => (
                          <motion.div
                            key={fIndex}
                            className="flex items-center gap-4 group/item"
                          >
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary transition-all duration-300">
                              <Check className="w-3 h-3 text-primary group-hover/item:text-white transition-colors" />
                            </div>
                            <span className="text-secondary/80 font-bold text-sm tracking-tight group-hover/item:text-secondary transition-colors">
                              {typeof feature === 'object' && feature !== null ? (feature[language] || feature.en || '') : feature}
                            </span>
                          </motion.div>
                        )) : (
                          <div className="text-muted-foreground text-sm italic">{t('dental.features.fallback')}</div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-secondary/5">
                        <Link
                          to="/appointment"
                          className="px-10 py-5 bg-primary text-white font-black rounded-full hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-95 uppercase tracking-widest text-xs"
                        >
                          {t('common.bookNow')}
                        </Link>
                        <Link
                          to={`/treatment/${treatment.slug}`}
                          className="px-10 py-5 bg-secondary text-white font-black rounded-full hover:bg-secondary/90 transition-all uppercase tracking-widest text-xs"
                        >
                          {t('common.viewDetails')}
                        </Link>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex-1 bg-secondary/5 p-6 rounded-[2rem] border border-secondary/5">
                        <h4 className="font-black text-secondary text-xs uppercase tracking-widest mb-4 flex items-center">
                          <Award className={`w-4 h-4 text-primary ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                          {t('common.successRate')}
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black text-secondary/40 uppercase tracking-widest">{t('common.patientSatisfaction')}</span>
                            <span className="text-3xl font-black text-primary tracking-tighter italic">{treatment.success_rate}%</span>
                          </div>
                          <div className="w-full bg-secondary/10 rounded-full h-2 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${treatment.success_rate}%` }}
                              className="bg-primary h-full rounded-full" 
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                        <Clock className={`w-6 h-6 text-primary ${language === 'ar' ? 'ml-4' : 'mr-4'}`} />
                        <div>
                          <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-1">{t('common.duration')}</p>
                          <p className="text-lg font-black text-secondary tracking-tight">{(treatment.duration as any)?.[language] || (treatment.duration as any)?.en || ''}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Testimonial Section */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">{state.sections['home.testimonials']?.title?.[language]}</h2>
          <p className="text-lg text-muted-foreground mb-12">{state.sections['home.testimonials']?.subtitle?.[language]}</p>
          {testimonial && (
            <div className="bg-card p-8 rounded-2xl shadow-lg border border-border/50">
              <div className="flex items-center justify-center mb-4">
                <div className="flex">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-lg text-muted-foreground italic mb-4">
                "{typeof testimonial.text === 'object' && testimonial.text !== null ? (testimonial.text[language] || (testimonial.text as any).en) : (testimonial.feedback as any)?.[language] || (testimonial.feedback as any)?.en || ''}"
              </p>
              <p className="font-semibold">
                {typeof testimonial.name === 'object' && testimonial.name !== null ? (testimonial.name as any)[language] : (testimonial.patient_name as any)?.[language] || testimonial.patient_name || testimonial.name || ''}
              </p>
              <p className="text-sm text-muted-foreground">
                {typeof testimonial.treatment === 'object' && testimonial.treatment !== null ? (testimonial.treatment as any)[language] : (testimonial as any).treatment_name?.[language] || (testimonial as any).treatment_name?.en || testimonial.treatment || ''}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Detailed Content Sections */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-secondary mb-6 tracking-tighter italic">
              {state.sections['dental.care']?.title?.[language] || t('dental.care.title') || 'The Gravity Dental Experience'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              {state.sections['dental.care']?.subtitle?.[language] || 'Combining artistry with medical excellence to redefine your smile.'}
            </p>
          </div>

          <EditorialGrid sections={editorialSections} t={t} />
        </div>
      </section>

      {/* Blog Insights Section */}
      <BlogInsights />

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-secondary to-secondary/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: `url(${state.sections['dental.cta']?.media_url || state.sections['dental.cta']?.image || state.hero?.media_url || state.hero?.image || ctaImg})` }}></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{state.sections['home.cta']?.title?.[language] || t('home.cta.title')}</h2>
          <p className="text-xl text-white/80 mb-10">{state.sections['home.cta']?.subtitle?.[language] || t('home.cta.subtitle')}</p>
          <Link
            to="/appointment"
            className="inline-flex items-center px-8 py-4 bg-white text-primary font-semibold rounded-full hover:shadow-xl hover:shadow-primary/20 transform hover:-translate-y-1 transition-all"
          >
            {t('common.bookNow')}
            <ArrowRight className="ml-2 w-5 h-5 rtl:rotate-180" />
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
