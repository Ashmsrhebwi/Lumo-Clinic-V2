import { useLanguage } from '../context/LanguageContext';
import { motion, useScroll, useTransform } from 'motion/react';
import { Check, Star, Award, Clock, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { useRef, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { EditorialGrid } from '../components/EditorialGrid';
import { BlogInsights } from '../components/BlogInsights';

const femaleBg = 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?auto=format&fit=crop&q=80&w=1200';

export function FemaleHairTransplant() {
  const { language, t } = useLanguage();
  const { state } = useDashboard();
  
  const treatment = useMemo(() => 
    state.treatments.find(t => Number(t.id) === 4) ||
    state.treatments.find(t => t.slug === 'female-hair-transplant') ||
    (state.treatments.length > 0 ? state.treatments[0] : null)
  , [state.treatments]);

  const testimonial = useMemo(() => 
    state.testimonials.find(t => {
       const treatmentName = typeof t.treatment === 'object' ? (t.treatment as any)?.en : t.treatment;
       return treatmentName?.toLowerCase().includes('female') || treatmentName?.toLowerCase().includes('women');
    }) || state.testimonials[0], 
  [state.testimonials]);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const editorialSections = useMemo(() => {
    if (!treatment || !Array.isArray(treatment.content_sections) || treatment.content_sections.length === 0) {
      return [
        {
          title: { en: 'Empowering Your Confidence', ar: 'تمكين ثقتك بنفسك', fr: 'Renforcer votre confiance', ru: 'Укрепление Вашей Уверенности' },
          subtitle: { en: 'Female Hair Restoration', ar: 'ترميم شعر الإناث', fr: 'Restauration capillaire féminine', ru: 'Женское Восстановление Волос' },
          image: 'https://images.unsplash.com/photo-1516584224476-3573559744cb?auto=format&fit=crop&q=80&w=800',
          description: { 
            en: 'Hair loss can be particularly distressing for women. Our specialized female hair transplant procedures address thinning and receding lines with a delicate, artistic approach. We focus on restoring volume and density while maintaining your natural hairline and style.',
            ar: 'يمكن أن يكون تساقط الشعر مؤلمًا بشكل خاص للنساء. تعالج إجراءات زراعة الشعر المتخصصة للإناث لدينا ترقق الشعر وتراجعه بأسلوب فني دقيق. نحن نركز على استعادة الحجم والكثافة مع الحفاظ على خط شعرك وأسلوبك الطبيعي.',
          }
        },
        {
          title: { en: 'No-Shave FUE Techniques', ar: 'تقنيات FUE بدون حلاقة', fr: 'Techniques FUE sans rasage', ru: 'Методы FUE без Бритья' },
          subtitle: { en: 'Discreet Excellence', ar: 'تميز سري', fr: 'Excellence Discrète', ru: 'Сдержанное Превосходство' },
          image: 'https://images.unsplash.com/photo-1522337660859-0263f6953724?auto=format&fit=crop&q=80&w=800',
          description: {
            en: 'We understand that discretion is often paramount. Our clinic offers advanced "Unshaven FUE" techniques, allowing for hair restoration without the need for a full shave. This ensures a discreet recovery process while achieving remarkable, long-lasting density.',
            ar: 'نحن نتفهم أن السرية غالبًا ما تكون ذات أهمية قصوى. تكتمل عيادتنا بتقنيات "Unshaven FUE" المتقدمة، مما يسمح بترميم الشعر دون الحاجة إلى حلاقة كاملة. يضمن ذلك عملية تعافي سرية مع تحقيق كثافة رائعة وطويلة الأمد.',
          }
        }
      ];
    }

    return treatment.content_sections.map((s: any) => ({
      title: s.title || {},
      subtitle: s.subtitle || {},
      image: s.media_url || s.image || femaleBg,
      description: s.description || {},
      link: s.link || '/contact'
    }));
  }, [treatment?.content_sections, language]);

  if (!treatment) return null;

  return (
    <div className="min-h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Premium Hero */}
      <section ref={heroRef} className="relative h-[75vh] flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0 w-full h-full" style={{ y: backgroundY }}>
          <img
            src={treatment.media_url || treatment.image || femaleBg}
            alt={treatment.title?.[language] || treatment.title?.en}
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-[#3D0C2A]/70 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-secondary"></div>
        </motion.div>

        <motion.div style={{ y: textY, opacity }} className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white pt-24">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-block px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-white/20 text-primary-foreground text-xs font-black tracking-[0.3em] uppercase mb-8">
            {t('female.category') || 'Restorative Elegance'}
          </motion.div>
          <h1 className="text-6xl md:text-8xl mb-8 font-bold tracking-tighter drop-shadow-2xl italic">
            {treatment.title?.[language] || treatment.title?.en || ''}
          </h1>
          <p className="text-xl md:text-2xl text-white/80 font-medium max-w-3xl mx-auto leading-relaxed">
            {treatment.description?.[language] || treatment.description?.en || ''}
          </p>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section className="py-32 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-12 text-left rtl:text-right">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-secondary text-primary rounded-2xl flex items-center justify-center shadow-xl">
                       <Heart className="w-8 h-8" />
                    </div>
                    <h2 className="text-4xl font-black text-secondary tracking-tight italic">{t('common.compassionateCare')}</h2>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {Array.isArray(treatment.features) && (treatment.features as any[]).map((feature: any, i: number) => (
                      <motion.div key={i} className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-secondary/5 group hover:border-primary/20 transition-all">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                          <Check className="w-3 h-3 text-primary group-hover:text-white" />
                        </div>
                        <span className="font-bold text-secondary">{typeof feature === 'object' && feature !== null ? (feature[language] || feature.en || '') : feature}</span>
                      </motion.div>
                    ))}
                 </div>
              </div>
              <div className="bg-secondary text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 -rotate-45 translate-x-16 -translate-y-16"></div>
                 <h3 className="text-3xl font-black mb-8 italic">{t('female.restoration.title') || 'Natural Volume Guaranteed'}</h3>
                 <p className="text-lg opacity-80 leading-relaxed mb-12">
                   {t('female.details.text') || 'We specialize in female-specific hair densities and growth patterns, ensuring that your hair transplant results are indistinguishable from your original, healthy hair.'}
                 </p>
                 <Link to="/appointment" className="inline-flex items-center gap-4 text-primary font-black border-b-4 border-primary pb-1 hover:text-white hover:border-white transition-all text-lg italic">
                    {t('service.journey.start')} <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* Editorial Content */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EditorialGrid sections={editorialSections} t={t} />
        </div>
      </section>

      <section className="py-24 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-16 text-secondary tracking-tighter italic">{t('testimonials.title')}</h2>
          {testimonial && (
            <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-secondary/5 relative">
              <div className="flex justify-center gap-2 mb-8">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-primary text-primary" />)}
              </div>
              <p className="text-2xl font-black text-secondary italic leading-relaxed mb-8">"{typeof testimonial.text === 'object' && testimonial.text !== null ? (testimonial.text[language] || (testimonial.text as any).en) : (testimonial.feedback as any)?.[language] || (testimonial.feedback as any)?.en || ''}"</p>
              <p className="font-black text-primary uppercase tracking-widest text-sm">{typeof testimonial.name === 'object' && testimonial.name !== null ? (testimonial.name as any)[language] : (testimonial.patient_name as any)?.[language] || testimonial.patient_name || testimonial.name || ''}</p>
            </div>
          )}
        </div>
      </section>

      <BlogInsights />

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-secondary to-secondary/90 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('home.cta.title')}</h2>
          <p className="text-xl text-white/80 mb-10">{t('home.cta.subtitle')}</p>
          <Link to="/appointment" className="inline-flex items-center px-10 py-5 bg-white text-primary font-black rounded-full hover:shadow-2xl transition-all">
            {t('common.bookNow')} <ArrowRight className="ml-2 w-5 h-5 rtl:rotate-180" />
          </Link>
        </div>
      </section>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-border z-40">
        <Link to="/appointment" className="flex items-center justify-center w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30">
          {t('common.bookNow')}
        </Link>
      </div>
    </div>
  );
}
