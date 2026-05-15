import { useLanguage } from '../context/LanguageContext';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Star, Award, Users, Globe, X, Medal, GraduationCap, ArrowRight, Activity, ShieldCheck, Building2, Paintbrush, Package, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { useRef, useState, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { PremiumLoader } from '../components/ui/PremiumLoader';
import { getLang } from '../lib/demoUtils';

const docBg = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1200';

export function Doctors() {
  const { language, t } = useLanguage();
  const { state } = useDashboard();
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [activeDoctorId, setActiveDoctorId] = useState<string | null>(null);

  const toggleDoctor = (doctorId: string | number) => {
    const id = String(doctorId);
    setActiveDoctorId((current) => (current === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Luxury Cinematic Hero Section */}
      <section ref={heroRef} className="relative h-[85vh] min-h-[700px] flex items-center justify-center overflow-hidden bg-[#0B1C2D]">
        {/* Layered Background Elements */}
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ y: backgroundY }}
        >
          <img
            src={docBg}
            alt={t('doctors.title')}
            className="w-full h-full object-cover grayscale-[0.4] brightness-[0.7]"
          />
          {/* Multi-gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1C2D]/60 via-transparent to-[#0B1C2D]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1C2D]/80 via-transparent to-[#0B1C2D]/80"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0B1C2D_100%)] opacity-70"></div>
          
          {/* Luxury Texture & Glow */}
          <div className="absolute inset-0 bg-navbar-grid opacity-[0.15] mix-blend-overlay"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(8,145,178,0.1)_0%,transparent_70%)] pointer-events-none" />
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          style={{ y: textY, opacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-10 inline-flex items-center gap-4"
          >
            <div className="w-10 h-[1px] bg-[#0891B2] opacity-40"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#0891B2]">
              {language === 'ar' ? 'نخبة الأطباء العالميين' : 'World-Class Expertise'}
            </span>
            <div className="w-10 h-[1px] bg-[#0891B2] opacity-40"></div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-serif text-white mb-10 tracking-tight leading-[0.9] italic"
          >
            {language === 'ar' ? 'فريق الحكماء' : 'The Visionaries'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg md:text-2xl text-white/50 font-body max-w-2xl mx-auto px-4 font-light leading-relaxed mb-16"
          >
            {state.sections['doctors.hero']?.subtitle?.[language] || t('doctors.subtitle') || 'Our specialists combine decades of expertise with an artistic vision for medical excellence.'}
          </motion.p>

          {/* Scroll Indicator */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-4 opacity-30"
          >
            <div className="w-[1px] h-16 bg-gradient-to-b from-[#0891B2] to-transparent"></div>
          </motion.div>
        </motion.div>
      </section>

      {/* Editorial Section Intro */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-navbar-grid opacity-[0.02] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-8">
                <span className="block w-6 h-[1.5px] bg-[#0891B2]"></span>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#0B1C2D]/40">Clinical Distinction</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif text-[#0B1C2D] leading-[1.1] italic">
                {language === 'ar' ? 'نخبة من الرواد في مجال الطب التجميلي' : 'A Collective of Medical Excellence'}
              </h2>
            </div>
            <div className="max-w-sm lg:pb-4">
              <p className="text-[#0B1C2D]/50 text-[17px] leading-relaxed font-body border-l-2 border-[#0891B2]/20 pl-6 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-6">
                Every doctor at Lumo Clinic is a recognized leader in their field, dedicated to patient-centric results and innovative procedures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialist Grid - Elevated Profile Cards */}
      <section className="pb-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {state.loading ? (
            <PremiumLoader fullScreen={false} />
          ) : state.doctors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-20 h-20 bg-[#0891B2]/5 rounded-full flex items-center justify-center mb-6 text-[#0891B2]/20">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B1C2D] mb-2">{t('doctors.empty.title') || 'Our Specialists'}</h3>
              <p className="text-[#0B1C2D]/40 italic max-w-md font-body">{t('doctors.empty.subtitle') || 'Our team of world-class doctors is currently being updated.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
              {state.doctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div 
                    className="group relative bg-white border border-[#0B1C2D]/[0.06] rounded-[3rem] p-5 transition-all duration-700 hover:shadow-[0_40px_90px_-20px_rgba(11,28,45,0.12)] hover:-translate-y-2"
                    onMouseEnter={() => setActiveDoctorId(String(doctor.id))}
                    onMouseLeave={() => setActiveDoctorId(null)}
                  >
                    {/* Premium Image Presentation */}
                    <div className="relative aspect-[0.85] rounded-[2.5rem] overflow-hidden mb-10 shadow-sm">
                      <img
                        src={doctor.media_url || doctor.image || (doctor as any).image_url || ''}
                        alt={getLang(doctor.name, language)}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 grayscale-[0.1] group-hover:grayscale-0"
                      />
                      {/* Subtitle / Overlay on image */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2D]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      
                      {/* Corner Badge */}
                      <div className="absolute top-6 right-6 flex items-center bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-sm">
                        <Star className="w-3 h-3 text-[#0891B2] mr-2 rtl:mr-0 rtl:ml-2 fill-[#0891B2]" />
                        <span className="text-[10px] font-bold text-[#0B1C2D] tracking-wider">{doctor.rating}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="px-5 pb-5">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[9px] font-bold text-[#0891B2] uppercase tracking-[0.4em]">
                          {(doctor.specialty as any)?.[language] || (doctor.specialty as any)?.en || ''}
                        </span>
                        <div className="w-6 h-[1px] bg-[#0891B2]/20"></div>
                      </div>
                      
                      <h3 className="text-3xl font-serif text-[#0B1C2D] mb-8 leading-tight italic tracking-tight">
                        {getLang(doctor.name, language)}
                      </h3>

                      {/* Doctor Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 pt-8 border-t border-[#0B1C2D]/[0.04]">
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#0B1C2D]/30">{t('common.experience')}</span>
                          <span className="text-sm font-bold text-[#0B1C2D] flex items-center gap-2">
                            <Medal className="w-3.5 h-3.5 text-[#0891B2]/60" />
                            {doctor.experience} {t('common.years')}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#0B1C2D]/30">{t('common.patients')}</span>
                          <span className="text-sm font-bold text-[#0B1C2D] flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-[#0891B2]/60" />
                            {doctor.patients}+
                          </span>
                        </div>
                      </div>

                      {/* Hover Action Reveal */}
                      <div className="mt-10 overflow-hidden">
                        <Link 
                          to="/appointment" 
                          className="flex items-center justify-between w-full p-4 rounded-2xl bg-[#0B1C2D]/[0.03] text-[#0B1C2D] group/btn hover:bg-[#0B1C2D] hover:text-white transition-all duration-500"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-[0.3em] ml-2">{t('common.bookNow')}</span>
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover/btn:bg-[#0891B2] group-hover/btn:text-white transition-all">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Sophisticated Profile Overlay - Now cleaner */}
                    <AnimatePresence>
                      {activeDoctorId === String(doctor.id) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 1.02 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.02 }}
                          className="absolute inset-0 z-20 bg-white rounded-[3rem] p-10 flex flex-col justify-between shadow-2xl border border-[#0B1C2D]/[0.05]"
                        >
                          <div className="relative">
                            <button
                              onClick={() => setActiveDoctorId(null)}
                              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-[#0B1C2D]/[0.03] flex items-center justify-center text-[#0B1C2D]/40 hover:bg-[#0B1C2D]/10 transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>

                            <div className="mb-10">
                              <div className="w-12 h-12 bg-[#0891B2]/5 rounded-2xl flex items-center justify-center mb-6">
                                <GraduationCap className="text-[#0891B2] w-6 h-6" />
                              </div>
                              <p className="text-[10px] font-bold text-[#0891B2] uppercase tracking-[0.4em] mb-3">Academic Excellence</p>
                              <p className="text-xl font-serif text-[#0B1C2D] italic">Master Class Certification</p>
                            </div>

                            <p className="text-[#0B1C2D]/60 text-lg font-body leading-relaxed mb-10 italic">
                              "{(doctor.bio as any)?.[language] || (doctor.bio as any)?.en || ''}"
                            </p>

                            <div className="space-y-6">
                              <div>
                                <div className="flex flex-wrap gap-2">
                                  {Array.isArray(doctor.specialties) && doctor.specialties.slice(0, 3).map((spec: any, i: number) => (
                                    <span key={i} className="px-4 py-2 bg-[#0B1C2D]/[0.03] rounded-xl text-[9px] font-bold text-[#0B1C2D]/70 uppercase tracking-widest border border-[#0B1C2D]/[0.05]">
                                      {typeof spec === 'object' ? spec[language] : spec}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center gap-3 text-[#0B1C2D]/40">
                                <Globe className="w-3.5 h-3.5" />
                                <div className="flex flex-wrap gap-3">
                                  {Array.isArray(doctor.languages) && doctor.languages.map((lang: any, i: number) => (
                                    <span key={i} className="text-[9px] font-bold uppercase tracking-[0.2em]">
                                      {typeof lang === 'object' ? lang[language] : lang}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <Link to="/appointment" className="btn-luxury w-full !py-5">
                            {t('common.viewProfile')}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Foundations - Why Our Doctors */}
      <section className="py-40 bg-[#F8FAFC] relative overflow-hidden">
        <div className="absolute inset-0 bg-navbar-grid opacity-[0.03]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-28">
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="flex items-center justify-center gap-4 mb-8"
            >
              <div className="w-8 h-[1px] bg-[#0891B2] opacity-30"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-[#0891B2]">The Gold Standard</span>
              <div className="w-8 h-[1px] bg-[#0891B2] opacity-30"></div>
            </motion.div>
            <motion.h2 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 1 }}
               className="text-[var(--hero-title-size)] font-serif text-[#0B1C2D] leading-tight tracking-tight italic"
            >
              Built on Clinical Trust
            </motion.h2>
          </div>
 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {(state.whyChooseUsFeatures || []).slice(0, 4).map((feature: any, idx: number) => {
              const Icon = ({ 
                Award, Building2, Paintbrush, Package, 
                Medal: Medal, Stethoscope: Activity, Heart: Heart, 
                Sparkles: Sparkles, Shield: ShieldCheck, Star: Star 
              } as any)[feature.icon] || Award;
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.12, duration: 0.9 }}
                  className="card-luxury p-12 text-center group bg-white/50 backdrop-blur-sm border border-white/40"
                >
                  <div className="w-16 h-16 bg-white shadow-sm border border-[#0B1C2D]/[0.05] rounded-[1.5rem] flex items-center justify-center mx-auto mb-10 group-hover:scale-110 group-hover:shadow-xl transition-all duration-700">
                    <Icon className="w-7 h-7 text-[#0B1C2D] group-hover:text-[#0891B2] transition-colors" />
                  </div>
                  <h3 className="text-2xl font-serif text-[#0B1C2D] mb-5 italic tracking-tight">
                    {feature.title?.[language] || (typeof feature.title === 'string' ? feature.title : feature.title?.en) || ''}
                  </h3>
                  <p className="text-[#0B1C2D]/50 text-[14px] font-body leading-relaxed">
                    {feature.desc?.[language] || (typeof feature.desc === 'string' ? feature.desc : feature.desc?.en) || ''}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cinematic Final CTA */}
      <section className="py-40 relative overflow-hidden bg-[#0B1C2D]">
        {/* Visual Depth Elements */}
        <div className="absolute inset-0 opacity-20">
          <img src={docBg} alt="Lumo Excellence" className="w-full h-full object-cover grayscale brightness-50" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1C2D] via-[#0B1C2D]/90 to-[#0B1C2D]"></div>
        <div className="absolute inset-0 bg-navbar-grid opacity-[0.05] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 1 }}
          >
            <div className="mb-10 inline-flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.8em] text-[#0891B2]">The Consultation</span>
            </div>
            
            <h2 className="text-5xl md:text-8xl font-serif text-white mb-10 tracking-tight leading-[0.95] italic">
              {language === 'ar' ? 'ابدأ رحلة التغيير اليوم' : 'Begin Your Transformation'}
            </h2>
            
            <p className="text-white/40 text-lg md:text-xl mb-16 max-w-2xl mx-auto font-body font-light leading-relaxed">
              Schedule an exclusive consultation with our specialists to discuss your bespoke medical journey.
            </p>
            
            <Link to="/appointment" className="btn-luxury !px-20 !py-7 !text-base">
              {t('common.bookNow')}
              <ArrowRight className="w-5 h-5 ml-3" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
