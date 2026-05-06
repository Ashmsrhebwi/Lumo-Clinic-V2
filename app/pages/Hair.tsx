import { useLanguage } from '../context/LanguageContext';
import { motion, useScroll, useTransform } from 'motion/react';
import { Check, ArrowRight, Star, Award, Clock, UserCheck } from 'lucide-react';
import { Link } from 'react-router';
import { useRef, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { BlogInsights } from '../components/BlogInsights';
import { EditorialGrid } from '../components/EditorialGrid';

const heroImg = 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=1200';
const ctaImg = 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=800';

export function Hair() {
  const { language, t } = useLanguage();
  const { state } = useDashboard();
  
  const hairTreatments = useMemo(() => 
    state.treatments.filter(t => {
      const category = typeof t.category === 'object' ? t.category?.en : t.category;
      return category === 'Hair' || category === 'الشعر';
    }), 
  [state.treatments]);
  
  const testimonial = useMemo(() => 
    state.testimonials.find(t => {
       const treatmentName = typeof t.treatment === 'object' ? (t.treatment as any)?.en : t.treatment;
       return treatmentName?.toLowerCase().includes('hair');
    }) || state.testimonials[0], 
  [state.testimonials]);

  const editorialSections = useMemo(() => {
    const dashboardSections = state.sections['hair.content'];
    if (Array.isArray(dashboardSections) && dashboardSections.length > 0) {
      return dashboardSections.map((s: any) => ({
        title: s.title || {},
        subtitle: s.subtitle || {},
        image: s.media_url || s.image || heroImg,
        description: s.description || {},
        link: s.link || '/contact'
      }));
    }

    // Fallback to existing hardcoded content structure
    return [
      {
        title: { en: 'Why Choose Our Hair Transplant Center?', ar: 'لماذا تختار مركز زراعة الشعر لدينا؟', fr: 'Pourquoi choisir notre centre de greffe de cheveux ?', ru: 'Почему стоит выбрать наш центр трансплантации волос?' },
        subtitle: { en: 'Pioneering Expertise', ar: 'خبرة رائدة', fr: 'Expertise Pionnière', ru: 'Новаторский Опыт' },
        image: 'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?auto=format&fit=crop&q=80&w=800',
        description: { 
          en: 'Gravity Clinic stands at the forefront of natural hair restoration. Our highly qualified surgeons have performed thousands of successful transplant procedures, restoring confidence and maintaining the most natural-looking results through meticulous hairline design.',
          ar: 'تقف عيادة جرافيتي في طليعة ترميم الشعر الطبيعي. أجرى جراحونا المؤهلون تأهيلا عاليا الآلاف من عمليات زراعة الشعر الناجحة، واستعادوا الثقة وحافظوا على النتائج الأكثر طبيعية من خلال تصميم دقيق لخط الشعر.',
        }
      },
      {
        title: { en: 'Advanced Surgical Methodologies', ar: 'منهجيات جراحية متقدمة', fr: 'Méthodologies Chirurgicales Avancées', ru: 'Передовые Хирургические Методологии' },
        subtitle: { en: 'FUE & DHI Excellence', ar: 'امتياز FUE و DHI', fr: 'Excellence FUE & DHI', ru: 'Превосходство FUE и DHI' },
        image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800',
        description: {
          en: 'We utilize revolutionary FUE (Follicular Unit Extraction) and DHI (Direct Hair Implantation) techniques. These methods guarantee high graft survival rates, zero linear scarring, and reduced recovery times, ensuring an unparalleled and optimal growth yield.',
          ar: 'نحن نستخدم تقنيات FUE الثورية و DHI المتقدمة. تضمن هذه الطرق معدلات بقاء عالية للطعوم، وعدم وجود ندبات خطية، وتقليل أوقات التعافي، مما يضمن في النهاية إنتاجية نمو لا مثيل لها ومثالية.',
        }
      },
      {
        title: { en: 'A Comfortable, VIP Experience', ar: 'تجربة مريحة تركز على المريض', fr: 'Une expérience confortable centrée sur le patient', ru: 'Комфортный Опыт, Ориентированный на Пациента' },
        subtitle: { en: 'Luxury Clinical Suites', ar: 'أجنحة طبية فاخرة', fr: 'Suites Cliniques de Luxe', ru: 'Роскошные Клинические Апартаменты' },
        image: 'https://images.unsplash.com/photo-1516549221187-dde193636db2?auto=format&fit=crop&q=80&w=800',
        description: {
          en: 'From the moment you arrive, you are treated like a true VIP. We offer painless local anesthesia mechanisms while providing you with luxury suites during the procedure to relax, watch movies, or catch up on sleep while we craft your new look.',
          ar: 'منذ لحظة وصولك، يتم التعامل معك وكأنك شخصية مهمة حقًا. نحن نقدم آليات تخدير موضعي غير مؤلمة مع تزويدك بأجنحة فاخرة أثناء الإجراء للاسترخاء أو مشاهدة الأفلام أو تعويض النوم أثناء صياغة مظهرك الجديد.',
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
            src={state.sections['hair.hero']?.media_url || state.sections['hair.hero']?.image || heroImg}
            alt="Hair Restoration"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-[#1A1817]/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1A1817]"></div>
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
            {t('hair.category') || 'Master Hair Restoration'}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl mb-8 font-bold tracking-tighter drop-shadow-2xl italic"
          >
            {state.sections['hair.hero']?.title?.[language] || state.navLinks.find(l => String(l.id) === '3')?.label[language] || 'Hair Transplant'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 font-medium max-w-3xl mx-auto leading-relaxed"
          >
            {state.sections['hair.hero']?.subtitle?.[language] || t('hair.subtitle')}
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
              {t('common.freeConsultation')}
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
      <section className="py-32 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-secondary mb-6 tracking-tighter italic">
              {t('hair.procedures.title') || 'Precision Techniques'}
            </h2>
            <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {hairTreatments.map((treatment, index) => (
              <motion.div
                key={treatment.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="group bg-white rounded-[3rem] shadow-2xl shadow-secondary/5 overflow-hidden border border-secondary/5 hover:border-primary/20 transition-all duration-500"
              >
                {/* Interactive Before/After Slider */}
                <div className="p-6 relative">
                  <div className="rounded-[2rem] overflow-hidden shadow-inner">
                    <BeforeAfterSlider 
                      beforeImage={treatment.media_url || treatment.image || (treatment as any).image_url || ''} 
                      afterImage={treatment.before_after_media_url || treatment.beforeAfter || treatment.media_url || treatment.image || ''} 
                    />
                  </div>
                  <div className={`absolute top-10 ${language === 'ar' ? 'left-10' : 'right-10'} bg-primary text-white z-10 px-4 py-2 rounded-2xl text-xs font-black shadow-2xl flex items-center transform hover:scale-110 transition-transform`}>
                    <Star className={`w-3 h-3 fill-white ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                    {treatment.success_rate}% {t('common.growth')}
                  </div>
                </div>

                {/* Treatment Info */}
                <div className="p-10 pt-4">
                  <div className="flex flex-col gap-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-secondary text-primary rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-500 shadow-xl shadow-primary/10">
                          <UserCheck className="w-7 h-7" />
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
                              {typeof feature === 'object' && feature !== null ? (feature[language] || feature.en) : feature}
                            </span>
                          </motion.div>
                        )) : (
                          <div className="text-muted-foreground text-sm italic">{t('hair.features.fallback')}</div>
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
                            <span className="text-[10px] font-black text-secondary/40 uppercase tracking-widest">{t('common.successfulResults')}</span>
                            <span className="text-3xl font-black text-primary tracking-tighter italic">{treatment.success_rate}%</span>
                          </div>
                          <div className="w-full bg-secondary/10 rounded-full h-2 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${treatment.success_rate}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              className="bg-primary h-full rounded-full" 
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                        <Clock className={`w-6 h-6 text-primary ${language === 'ar' ? 'ml-4' : 'mr-4'}`} />
                        <div>
                          <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-1">{t('common.procedure')}</p>
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

      {/* Why Choose Us for Hair */}
      <section className="py-32 bg-secondary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 transform translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter italic">{state.sections['hair.features']?.title?.[language] || t('feature.title')}</h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium">
              {state.sections['hair.features']?.subtitle?.[language] || 'Setting the global standard for natural hairline design and graft density.'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                title: { en: 'Expert Surgeons', ar: 'جراحون خبراء', fr: 'Chirurgiens experts', ru: 'Экспертные хирурги' }, 
                desc: { en: 'Highly experienced surgeons specializing in hair restoration with over 10,000 successful cases.', ar: 'جراحون ذوو خبرة عالية متخصصون في ترميم الشعر مع أكثر من 10,000 حالة ناجحة.', fr: 'Chirurgiens hautement expérimentés spécialisés dans la restauration capillaire avec plus de 10 000 cas réussis.', ru: 'Высококвалифицированные хирурги, специализирующиеся на восстановлении волос, имеющие за плечами более 10 000 успешных случаев.' },
                icon: Award
              },
              { 
                title: { en: 'Advanced Tech', ar: 'تقنيات متقدمة', fr: 'Technologie avancée', ru: 'Передовые технологии' }, 
                desc: { en: 'Using the latest Sapphire FUE & DHI technologies for higher density and natural flow.', ar: 'استخدام أحدث تقنيات الياقوت FUE و DHI للحصول على كثافة أعلى وتدفق طبيعي.', fr: 'Utilisation des dernières technologies Sapphire FUE et DHI pour une densité accrue et un flux naturel.', ru: 'Использование новейших технологий Sapphire FUE и DHI для достижения более высокой плотности и естественности.' },
                icon: Star
              },
              { 
                title: { en: 'Lifetime Warranty', ar: 'ضمان مدى الحياة', fr: 'Garantie à vie', ru: 'Пожизненная гарантия' }, 
                desc: { en: 'We provide a comprehensive lifetime growth guarantee for every follicle we transplant.', ar: 'نحن نقدم ضمان نمو شامل مدى الحياة لكل بصيلة نقوم بزراعتها.', fr: 'Nous offrons une garantie de croissance à vie complète pour chaque follicule que nous transplantons.', ru: 'Мы предоставляем комплексную пожизненную гарантию роста для каждой пересаженной нами волосяной луковицы.' },
                icon: Check
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 hover:bg-white/10 transition-all duration-500"
              >
                <div className="w-20 h-20 bg-primary text-white rounded-3xl flex items-center justify-center mb-8 transform group-hover:rotate-12 transition-transform shadow-2xl shadow-primary/20">
                  <item.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl mb-4 font-black tracking-tight italic">{item.title[language]}</h3>
                <p className="text-white/60 leading-relaxed font-medium">{item.desc[language]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Testimonial */}
      <section className="py-32 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-16 text-secondary tracking-tighter italic">
            {state.sections['home.testimonials']?.title?.[language] || t('testimonials.title')}
          </h2>
          {testimonial && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="relative p-12 md:p-20 rounded-[4rem] bg-[#FAF9F6] border border-secondary/5 shadow-2xl shadow-secondary/5"
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-primary rounded-full flex items-center justify-center border-8 border-white p-4">
                 <Star className="w-full h-full text-white fill-white" />
              </div>
              
              <div className="flex items-center justify-center mb-10 gap-2">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-primary fill-primary" />
                ))}
              </div>
              
              <p className="text-2xl md:text-3xl text-secondary font-black leading-[1.4] mb-12 tracking-tight italic">
                "{typeof testimonial.text === 'object' && testimonial.text !== null ? (testimonial.text as any)?.[language] : (testimonial.feedback as any)?.[language] || ''}"
              </p>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-1.5 bg-primary rounded-full mb-6"></div>
                <p className="text-xl font-black text-secondary tracking-tight">
                  {typeof testimonial.name === 'object' && testimonial.name !== null ? (testimonial.name as any)?.[language] : (testimonial.patient_name as any)?.[language] || testimonial.name || ''}
                </p>
                <p className="text-sm font-black text-primary uppercase tracking-[0.2em] mt-2">
                  {typeof testimonial.treatment === 'object' && testimonial.treatment !== null ? (testimonial.treatment as any)?.[language] : (testimonial as any).treatment_name?.[language] || testimonial.treatment || ''}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Detailed Content Sections */}
      <section className="py-32 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EditorialGrid sections={editorialSections} t={t} />
        </div>
      </section>

      {/* Blog Insights Section */}
      <BlogInsights />

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-secondary to-secondary/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: `url(${state.sections['hair.cta']?.media_url || state.sections['hair.cta']?.image || state.hero?.media_url || state.hero?.image || ctaImg})` }}></div>
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
