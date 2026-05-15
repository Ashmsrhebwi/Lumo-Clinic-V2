import { useLanguage } from '../context/LanguageContext';
import { useDashboard } from '../context/DashboardContext';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Shield, Activity, Clock, CheckCircle2 } from 'lucide-react';
import { PremiumLoader } from '../components/ui/PremiumLoader';
import { useState, useEffect } from 'react';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const STAGGER = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const TREATMENTS = [
  {
    id: 'rhinoplasty',
    title: { en: 'Rhinoplasty', ar: 'تجميل الأنف', fr: 'Rhinoplastie', ru: 'Ринопластика' },
    desc: { en: 'Refine and harmonize your facial profile with precision nose contouring.', ar: 'تحسين وتناسق ملامح وجهك بدقة.', fr: 'Affinez et harmonisez le profil de votre visage.', ru: 'Улучшите профиль лица с помощью точной коррекции носа.' },
    icon: Sparkles
  },
  {
    id: 'facelift',
    title: { en: 'Facelift (Rhytidectomy)', ar: 'شد الوجه', fr: 'Lifting du Visage', ru: 'Подтяжка лица' },
    desc: { en: 'Restore youthful contours and reverse signs of aging with advanced techniques.', ar: 'استعادة ملامح الشباب وعكس علامات الشيخوخة.', fr: 'Restaurez les contours de la jeunesse.', ru: 'Восстановите молодые контуры лица.' },
    icon: Activity
  },
  {
    id: 'breast-surgery',
    title: { en: 'Breast Aesthetics', ar: 'تجميل الثدي', fr: 'Chirurgie Mammaire', ru: 'Эстетика груди' },
    desc: { en: 'Augmentation, lift, or reduction tailored to your unique body proportions.', ar: 'تكبير، شد، أو تصغير مصمم لنسب جسمك.', fr: 'Augmentation, lifting ou réduction sur mesure.', ru: 'Увеличение, подтяжка или уменьшение груди.' },
    icon: Shield
  },
  {
    id: 'liposuction',
    title: { en: 'Liposuction & Body Contouring', ar: 'شفط الدهون ونحت الجسم', fr: 'Liposuccion', ru: 'Липосакция и контурная пластика' },
    desc: { en: 'Sculpt your ideal silhouette by safely removing stubborn localized fat.', ar: 'نحت قوامك المثالي عن طريق إزالة الدهون الموضعية.', fr: 'Sculptez votre silhouette idéale.', ru: 'Скульптурируйте свой идеальный силуэт.' },
    icon: Clock
  }
];

const JOURNEY = [
  {
    step: '01',
    title: { en: 'Private Consultation', ar: 'استشارة خاصة', fr: 'Consultation Privée', ru: 'Частная консультация' },
    desc: { en: 'A comprehensive evaluation of your aesthetic goals with our senior surgeons.', ar: 'تقييم شامل لأهدافك التجميلية مع كبار جراحينا.', fr: 'Une évaluation complète de vos objectifs.', ru: 'Комплексная оценка ваших эстетических целей.' }
  },
  {
    step: '02',
    title: { en: 'Bespoke Planning', ar: 'تخطيط مخصص', fr: 'Planification sur Mesure', ru: 'Индивидуальное планирование' },
    desc: { en: '3D simulation and a detailed surgical roadmap designed exclusively for you.', ar: 'محاكاة ثلاثية الأبعاد وخريطة طريق جراحية مفصلة.', fr: 'Simulation 3D et feuille de route chirurgicale.', ru: '3D моделирование и детальный план операции.' }
  },
  {
    step: '03',
    title: { en: 'The Procedure', ar: 'الإجراء', fr: 'L\'intervention', ru: 'Процедура' },
    desc: { en: 'Performed in our state-of-the-art JCI-accredited surgical suites.', ar: 'يتم إجراؤها في أجنحتنا الجراحية المعتمدة.', fr: 'Réalisée dans nos blocs opératoires de pointe.', ru: 'Проводится в современных операционных.' }
  },
  {
    step: '04',
    title: { en: 'Concierge Recovery', ar: 'رعاية ما بعد التعافي', fr: 'Récupération VIP', ru: 'VIP восстановление' },
    desc: { en: 'Dedicated nursing care in luxury recovery suites to ensure optimal healing.', ar: 'رعاية تمريضية مخصصة في أجنحة تعافي فاخرة.', fr: 'Soins infirmiers dédiés dans des suites de luxe.', ru: 'Специализированный уход в роскошных палатах.' }
  }
];

export function PlasticSurgery() {
  const { language, t } = useLanguage();
  const { state } = useDashboard();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
  }, []);

  const getVal = (val: any) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val[language] || val.en || '';
  };

  if (!mounted || state.loading) {
    return <PremiumLoader />;
  }

  const isRtl = language === 'ar';

  return (
    <div className="min-h-screen bg-[#F8F9FE]" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* 1. Cinematic Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden bg-[#0B1C2D]">
        {/* Subtle Ambient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1C2D] via-[#0B1C2D] to-[#050D14]"></div>
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#0891B2]/10 blur-[150px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[40%] h-[60%] bg-[#0891B2]/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute inset-0 bg-navbar-grid opacity-[0.03] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-4xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={STAGGER}
              className="space-y-8"
            >
              <motion.div variants={FADE_UP} className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#0891B2] shadow-[0_0_10px_rgba(8,145,178,0.5)]"></span>
                <span className="text-white/80 text-xs font-bold uppercase tracking-[0.3em]">
                  {language === 'ar' ? 'الجراحة التجميلية' : 'Plastic Surgery'}
                </span>
              </motion.div>

              <motion.h1 variants={FADE_UP} className="text-5xl md:text-7xl lg:text-[6rem] font-serif italic text-white leading-[1.05] tracking-tight">
                {language === 'ar' ? 'أعد اكتشاف' : 'Redefine Your'}<br />
                <span className="text-[#0891B2] not-italic font-medium">{language === 'ar' ? 'جمالك الحقيقي.' : 'True Aesthetics.'}</span>
              </motion.h1>

              <motion.p variants={FADE_UP} className="text-xl md:text-2xl text-white/50 font-body font-light max-w-2xl leading-relaxed">
                {language === 'ar' 
                  ? 'ارتقِ بثقتك من خلال جراحة تجميلية عالمية المستوى، تجمع بين الدقة الطبية والرعاية الفاخرة المخصصة.'
                  : 'Elevate your confidence with world-class plastic surgery, combining surgical precision with bespoke luxury concierge care.'}
              </motion.p>

              <motion.div variants={FADE_UP} className="pt-8">
                <Link
                  to="/appointment"
                  className="inline-flex items-center justify-center px-10 py-5 bg-[#0891B2] text-white font-bold uppercase tracking-[0.2em] text-xs rounded-full shadow-[0_20px_40px_-10px_rgba(8,145,178,0.4)] hover:bg-[#067794] transition-all duration-500 hover:-translate-y-1 group"
                >
                  {t('nav.booking') || 'Book Consultation'}
                  <ArrowRight className={`ml-4 w-5 h-5 transition-transform duration-500 group-hover:translate-x-1 ${isRtl ? 'rotate-180 ml-0 mr-4 group-hover:-translate-x-1' : ''}`} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Premium Treatments Grid */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#0891B2] mb-6">
              {language === 'ar' ? 'تخصصاتنا' : 'Our Specialties'}
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif text-[#0B1C2D]">
              {language === 'ar' ? 'إجراءات مصممة' : 'Masterfully Tailored'}<br />
              <span className="italic text-[#0891B2]">{language === 'ar' ? 'ببراعة' : 'Procedures'}</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TREATMENTS.map((treatment, idx) => (
              <motion.div
                key={treatment.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative bg-[#F8F9FE] p-12 rounded-[2rem] overflow-hidden border border-[#0B1C2D]/5 hover:border-[#0891B2]/30 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(11,28,45,0.05)]"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#0891B2]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 text-[#0B1C2D] group-hover:text-[#0891B2] transition-colors duration-500 relative z-10">
                  <treatment.icon className="w-8 h-8" />
                </div>
                
                <h4 className="text-2xl font-bold text-[#0B1C2D] mb-4 relative z-10">
                  {getVal(treatment.title)}
                </h4>
                <p className="text-[#0B1C2D]/60 font-body leading-relaxed mb-8 relative z-10 max-w-sm">
                  {getVal(treatment.desc)}
                </p>
                
                <Link
                  to="/contact"
                  className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#0891B2] group-hover:text-[#0B1C2D] transition-colors duration-300 relative z-10"
                >
                  {language === 'ar' ? 'استكشف المزيد' : 'Explore Procedure'}
                  <ArrowRight className={`w-4 h-4 ml-2 ${isRtl ? 'rotate-180 mr-2 ml-0' : ''}`} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The Journey Section */}
      <section className="py-32 bg-[#0B1C2D] relative overflow-hidden">
        <div className="absolute inset-0 bg-navbar-grid opacity-[0.02]"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#0891B2] mb-6">
                {language === 'ar' ? 'رحلة لومو' : 'The Lumo Journey'}
              </h2>
              <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight mb-8">
                {language === 'ar' ? 'تجربة طبية' : 'A Seamless VIP'}<br />
                <span className="italic text-[#0891B2]">{language === 'ar' ? 'فاخرة' : 'Experience'}</span>
              </h3>
              <p className="text-white/50 font-body font-light text-lg leading-relaxed mb-12">
                {language === 'ar' 
                  ? 'من لحظة وصولك إلى إسطنبول وحتى عودتك إلى وطنك، فريق الكونسيرج الطبي لدينا يضمن لك رحلة خالية من التوتر.'
                  : 'From your arrival in Istanbul to your journey home, our medical concierge ensures every detail is flawless, private, and stress-free.'}
              </p>
              <ul className="space-y-4">
                {[
                  { en: 'VIP Airport Transfers', ar: 'انتقالات المطار VIP' },
                  { en: '5-Star Luxury Accommodation', ar: 'إقامة فاخرة 5 نجوم' },
                  { en: 'Dedicated Translation Support', ar: 'دعم ترجمة مخصص' },
                  { en: '24/7 Aftercare Access', ar: 'وصول للرعاية 24/7' }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-white/80">
                    <CheckCircle2 className="w-5 h-5 text-[#0891B2]" />
                    <span>{getVal(item)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <div className="space-y-8">
                {JOURNEY.map((step, idx) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex gap-8 group"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-serif italic text-[#0891B2]/30 group-hover:text-[#0891B2] transition-colors duration-500">
                        {step.step}
                      </span>
                      {idx !== JOURNEY.length - 1 && (
                        <div className="w-[1px] h-full bg-white/5 mt-4 group-hover:bg-[#0891B2]/20 transition-colors duration-500"></div>
                      )}
                    </div>
                    <div className="pb-8">
                      <h4 className="text-2xl font-bold text-white mb-3">
                        {getVal(step.title)}
                      </h4>
                      <p className="text-white/40 font-body leading-relaxed">
                        {getVal(step.desc)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Luxury CTA */}
      <section className="py-32 bg-white text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-serif text-[#0B1C2D] mb-8">
            {language === 'ar' ? 'جاهز للبدء؟' : 'Ready to Transform?'}
          </h2>
          <p className="text-xl text-[#0B1C2D]/60 font-body font-light mb-12 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'تواصل مع مستشارينا الطبيين لبدء رحلة التجميل الفاخرة الخاصة بك.'
              : 'Connect with our medical consultants to begin your bespoke aesthetic journey in Istanbul.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/appointment"
              className="w-full sm:w-auto px-10 py-5 bg-[#0B1C2D] text-white font-bold uppercase tracking-[0.2em] text-xs rounded-full hover:bg-[#0891B2] transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(8,145,178,0.4)]"
            >
              {t('nav.booking') || 'Book Consultation'}
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-10 py-5 bg-transparent border border-[#0B1C2D]/10 text-[#0B1C2D] font-bold uppercase tracking-[0.2em] text-xs rounded-full hover:border-[#0891B2] hover:text-[#0891B2] transition-all duration-500"
            >
              {t('footer.contact') || 'Contact Us'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
