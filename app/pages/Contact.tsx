import { useLanguage } from '../context/LanguageContext';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send, Shield, ChevronDown, Check, Sparkles } from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { useDashboard } from '../context/DashboardContext';
import { clinicService } from '../services/clinicService';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { sanitizeText } from '../lib/demoUtils';
const contactBg = 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1600';

export function Contact() {
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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    botField: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = t('auth.error.required');
    if (!formData.email) newErrors.email = t('auth.error.required');
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) newErrors.email = t('auth.error.email');
    if (!formData.phone) newErrors.phone = t('auth.error.required');
    if (!formData.subject) newErrors.subject = t('auth.error.required');
    if (!formData.message) newErrors.message = t('auth.error.required');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (formData.botField !== '') return;
    
    setIsLoading(true);
    try {
      await clinicService.submitLead({
        type: 'contact',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      }, language);
      
      toast.success(t('contact.success.msg'));
      setFormData({ name: '', email: '', phone: '', subject: '', message: '', botField: '' });
      setErrors({});
    } catch (error: any) {
      console.error('Contact submission failed:', error);
      
      if (error.status === 422 && error.errors) {
        const serverErrors = error.errors;
        const formattedErrors: Record<string, string> = {};
        Object.keys(serverErrors).forEach(key => {
          if (key === 'email') {
            formattedErrors[key] = t('auth.error.email');
          } else {
            formattedErrors[key] = Array.isArray(serverErrors[key]) ? serverErrors[key][0] : serverErrors[key];
          }
        });
        setErrors(formattedErrors);
        return;
      }
      
      toast.error(t('common.error.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Cinematic Premium Hero */}
      <section ref={heroRef} className="relative h-[75vh] min-h-[650px] flex items-center justify-center overflow-hidden bg-[#0B1C2D]">
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ y: backgroundY }}
        >
          <img
            src={state.sections['contact.hero']?.media_url || state.sections['contact.hero']?.image || state.sections['about.contact']?.media_url || state.sections['about.contact']?.image || contactBg}
            alt={t('contact.title')}
            className="w-full h-full object-cover opacity-60 grayscale-[0.2] scale-105"
          />
          {/* Deep Cinematic Gradients */}
          <div className="absolute inset-0 bg-[#0B1C2D]/50 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-[#0B1C2D]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(8,145,178,0.15)_0%,transparent_60%)]"></div>
          
          {/* Subtle Luxury Grid Overlay */}
          <div className="absolute inset-0 bg-navbar-grid opacity-[0.05]"></div>
        </motion.div>

        <motion.div 
          style={{ y: textY, opacity }}
          className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <span className="px-6 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] text-white/80 mb-8 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#0891B2]" />
              {language === 'ar' ? 'تواصل معنا' : 'CONCIERGE DESK'}
            </span>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif italic text-white mb-10 tracking-tighter leading-[0.9]">
              {language === 'ar' ? 'تواصل مع خبرائنا' : 'Connect'}
            </h1>

            <div className="w-px h-16 bg-gradient-to-b from-[#0891B2]/50 to-transparent mx-auto mb-10"></div>

            <p className="text-xl md:text-2xl text-white/70 font-body max-w-2xl mx-auto font-light leading-relaxed">
              {state.sections['contact.hero']?.subtitle?.[language] || state.sections['about.contact']?.subtitle?.[language] || t('contact.subtitle')}
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Boutique Contact Form and Info Section */}
      <section className="py-32 md:py-40 relative overflow-hidden -mt-20 z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 bg-white rounded-[4rem] shadow-[0_60px_120px_-30px_rgba(11,28,45,0.08)] border border-[#0B1C2D]/[0.03] p-10 md:p-16 lg:p-20 rtl:text-right"
            >
              <div className="mb-14 border-l-[3px] border-[#0891B2]/40 pl-8 rtl:border-l-0 rtl:border-r-[3px] rtl:pl-0 rtl:pr-8">
                <span className="text-[10px] font-bold text-[#0B1C2D]/40 uppercase tracking-[0.4em] block mb-4">
                  PRIVATE INQUIRY
                </span>
                <h2 className="text-4xl md:text-5xl font-serif text-[#0B1C2D] italic leading-tight">
                  {t('contact.form.title') || 'Send us a message'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Honeypot Field */}
                <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
                  <label htmlFor="bot_field_contact">{t('contact.bot_label')}</label>
                  <input 
                    type="text" 
                    id="bot_field_contact" 
                    name="bot_field_contact" 
                    value={formData.botField} 
                    onChange={(e) => handleInputChange('botField', e.target.value)} 
                    tabIndex={-1} 
                    autoComplete="off" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="relative group/input">
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="peer w-full bg-transparent border-b border-[#0B1C2D]/10 py-4 text-xl text-[#0B1C2D] focus:border-[#0891B2] outline-none transition-all placeholder-transparent font-light"
                      placeholder={t('contact.name')}
                      required
                    />
                    <label htmlFor="name" className="absolute left-0 -top-3.5 text-[10px] font-bold text-[#0B1C2D]/40 uppercase tracking-[0.3em] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#0B1C2D]/30 peer-placeholder-shown:top-4 peer-placeholder-shown:font-light peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-[#0891B2] rtl:right-0 rtl:left-auto">
                      {t('contact.name')} *
                    </label>
                    {errors.name && <p className="text-[10px] text-red-500 font-bold mt-2">{errors.name}</p>}
                  </div>

                  <div className="relative group/input">
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="peer w-full bg-transparent border-b border-[#0B1C2D]/10 py-4 text-xl text-[#0B1C2D] focus:border-[#0891B2] outline-none transition-all placeholder-transparent font-light"
                      placeholder={t('booking.email')}
                      required
                    />
                    <label htmlFor="email" className="absolute left-0 -top-3.5 text-[10px] font-bold text-[#0B1C2D]/40 uppercase tracking-[0.3em] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#0B1C2D]/30 peer-placeholder-shown:top-4 peer-placeholder-shown:font-light peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-[#0891B2] rtl:right-0 rtl:left-auto">
                      {t('booking.email')} *
                    </label>
                    {errors.email && <p className="text-[10px] text-red-500 font-bold mt-2">{errors.email}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                  <div className="relative z-10">
                    <label className="text-[10px] font-bold text-[#0B1C2D]/40 uppercase tracking-[0.3em] block mb-2 rtl:text-right">
                      {t('booking.phone')} *
                    </label>
                    <PhoneInput
                      country={'tr'}
                      value={formData.phone}
                      onChange={(phone) => handleInputChange('phone', '+' + phone)}
                      inputProps={{ name: 'phone', required: true, autoComplete: 'tel', id: 'contact_phone' }}
                      containerClass="!w-full"
                      inputClass={`!w-full !px-16 !py-4 !rounded-none !border-0 !border-b !bg-transparent !text-[#0B1C2D] !text-xl !font-light focus:!ring-0 focus:!border-[#0891B2] !outline-none !transition-all !h-auto ${errors.phone ? '!border-red-500' : '!border-[#0B1C2D]/10'}`}
                      buttonClass={`!border-none !bg-transparent !px-0 hover:!bg-transparent ${language === 'ar' ? '!right-0 !left-auto' : '!left-0'}`}
                      dropdownClass="!rounded-2xl !border-[#0B1C2D]/5 !shadow-2xl !bg-white !text-[#0B1C2D]"
                    />
                    {errors.phone && <p className="text-[10px] text-red-500 font-bold mt-2">{errors.phone}</p>}
                  </div>

                  <div className="relative group/input pt-[22px]">
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      className="peer w-full bg-transparent border-b border-[#0B1C2D]/10 py-4 text-xl text-[#0B1C2D] focus:border-[#0891B2] outline-none transition-all placeholder-transparent font-light"
                      placeholder={t('contact.subject')}
                      required
                    />
                    <label htmlFor="subject" className="absolute left-0 -top-3.5 text-[10px] font-bold text-[#0B1C2D]/40 uppercase tracking-[0.3em] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#0B1C2D]/30 peer-placeholder-shown:top-4 peer-placeholder-shown:font-light peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-[#0891B2] rtl:right-0 rtl:left-auto">
                      {t('contact.subject')} *
                    </label>
                    {errors.subject && <p className="text-[10px] text-red-500 font-bold mt-2">{errors.subject}</p>}
                  </div>
                </div>

                <div className="relative group/input pt-8">
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={4}
                    className="peer w-full bg-transparent border-b border-[#0B1C2D]/10 py-4 text-xl text-[#0B1C2D] focus:border-[#0891B2] outline-none transition-all placeholder-transparent font-light resize-none"
                    placeholder={t('booking.message')}
                    required
                  />
                  <label htmlFor="message" className="absolute left-0 -top-3.5 text-[10px] font-bold text-[#0B1C2D]/40 uppercase tracking-[0.3em] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-[#0B1C2D]/30 peer-placeholder-shown:top-4 peer-placeholder-shown:font-light peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-[#0891B2] rtl:right-0 rtl:left-auto">
                    {t('booking.message')} *
                  </label>
                  {errors.message && <p className="text-[10px] text-red-500 font-bold mt-2">{errors.message}</p>}
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-luxury w-full !py-6 !rounded-[2rem] flex items-center justify-center group overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-3 rtl:mr-0 rtl:ml-3" /> : null}
                    <span className="tracking-[0.3em] font-bold text-[11px] relative z-10">{t('contact.send')}</span>
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Premium Info Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 space-y-10 rtl:text-right"
            >
              <div className="mb-14">
                <h2 className="text-4xl md:text-5xl font-serif text-[#0B1C2D] italic mb-6 leading-tight">
                  {t('contact.info.title')}
                </h2>
                <p className="text-[#0B1C2D]/50 text-xl leading-relaxed font-light font-body">
                  {t('contact.info.desc')}
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {/* Phone Card */}
                <div className="bg-white rounded-[2.5rem] p-8 flex items-center gap-8 shadow-[0_20px_40px_-15px_rgba(11,28,45,0.05)] border border-[#0B1C2D]/[0.03] group hover:-translate-y-1 transition-all duration-500 rtl:flex-row-reverse">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-[#F8FAFC] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0891B2] transition-colors duration-500">
                    <Phone className="w-6 h-6 text-[#0891B2] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-[9px] font-bold text-[#0B1C2D]/30 uppercase tracking-[0.4em] mb-2">{t('contact.phone.label')}</h3>
                    <p className="text-xl font-serif text-[#0B1C2D] italic" dir="ltr">{state.locations[0]?.phone || sanitizeText('+90 541 339 25 69')}</p>
                  </div>
                </div>

                {/* Email Card */}
                <div className="bg-white rounded-[2.5rem] p-8 flex items-center gap-8 shadow-[0_20px_40px_-15px_rgba(11,28,45,0.05)] border border-[#0B1C2D]/[0.03] group hover:-translate-y-1 transition-all duration-500 rtl:flex-row-reverse">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-[#F8FAFC] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0891B2] transition-colors duration-500">
                    <Mail className="w-6 h-6 text-[#0891B2] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-[9px] font-bold text-[#0B1C2D]/30 uppercase tracking-[0.4em] mb-2">{t('contact.email.label')}</h3>
                    <p className="text-xl font-serif text-[#0B1C2D] italic">{state.locations[0]?.email || sanitizeText('info@gravity-clinic.com')}</p>
                  </div>
                </div>

                {/* Hours Card */}
                <div className="bg-white rounded-[2.5rem] p-8 flex items-center gap-8 shadow-[0_20px_40px_-15px_rgba(11,28,45,0.05)] border border-[#0B1C2D]/[0.03] group hover:-translate-y-1 transition-all duration-500 rtl:flex-row-reverse">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-[#F8FAFC] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0B1C2D] transition-colors duration-500">
                    <Clock className="w-6 h-6 text-[#0B1C2D]/60 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-[9px] font-bold text-[#0B1C2D]/30 uppercase tracking-[0.4em] mb-2">{t('contact.workingHours')}</h3>
                    <p className="text-xl font-serif text-[#0B1C2D] italic">{state.locations[0]?.hours?.[language] || t('contact.monSat')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Global Locations - Editorial Layout */}
      <section className="py-40 bg-white relative overflow-hidden border-t border-[#0B1C2D]/[0.03]">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <div className="w-12 h-[1px] bg-[#0891B2]/30 mx-auto mb-8"></div>
            <h2 className="text-5xl md:text-7xl font-serif text-[#0B1C2D] italic mb-6">
              {t('contact.locations') || 'Global Presence'}
            </h2>
            <p className="text-[#0B1C2D]/40 text-xl font-light font-body">Our world-class medical facilities</p>
          </div>

          {state.locations.length === 0 ? (
            <p className="text-center text-[#0B1C2D]/30 py-12 font-body font-light italic">Discovering our world-class facilities…</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {state.locations.map((location, index) => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-[#F8FAFC] rounded-[3rem] p-12 rtl:text-right flex flex-col group hover:shadow-[0_40px_80px_-20px_rgba(11,28,45,0.08)] transition-all duration-700"
                >
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-10 shadow-sm border border-[#0B1C2D]/[0.03] group-hover:bg-[#0B1C2D] group-hover:border-transparent transition-all duration-500">
                    <MapPin className="w-6 h-6 text-[#0B1C2D]/40 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-3xl font-serif text-[#0B1C2D] italic mb-4 leading-tight">{location.city?.[language] || location.city?.en || ''}</h3>
                  <p className="text-[#0891B2] text-[10px] font-bold uppercase tracking-[0.4em] mb-10">{location.country?.[language] || location.country?.en || ''}</p>
                  
                  <div className="space-y-5 pt-8 border-t border-[#0B1C2D]/[0.05] flex-1">
                    <p className="text-[#0B1C2D]/60 text-base leading-relaxed font-body font-light mb-8">{location.address?.[language] || location.address?.en || ''}</p>
                    <div className="space-y-4">
                      <p className="text-[#0B1C2D]/80 text-sm font-medium flex items-center gap-4 rtl:flex-row-reverse">
                        <Phone className="w-4 h-4 text-[#0891B2]" />
                        <span dir="ltr">{location.phone || ''}</span>
                      </p>
                      <p className="text-[#0B1C2D]/80 text-sm font-medium flex items-center gap-4 rtl:flex-row-reverse">
                        <Mail className="w-4 h-4 text-[#0891B2]" />
                        <span>{location.email || ''}</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Refined Luxury FAQ Section */}
      <section className="py-40 bg-[#F8FAFC] relative overflow-hidden border-t border-[#0B1C2D]/[0.03]">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#0891B2] block mb-6">Patient Inquiries</span>
            <h2 className="text-5xl md:text-7xl font-serif text-[#0B1C2D] mb-8 italic tracking-tight">
              {t('contact.faq') || 'Common Questions'}
            </h2>
            <p className="text-[#0B1C2D]/50 text-xl font-light font-body">Everything you need to know about our concierge services.</p>
          </div>

          {state.faqs.length === 0 ? (
            <p className="text-center text-[#0B1C2D]/30 py-12 font-body italic">Compiling frequently asked insights…</p>
          ) : (
            <div className="space-y-6">
              {state.faqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`bg-white rounded-[2rem] border transition-all duration-700 overflow-hidden ${
                    openFaq === index
                      ? 'border-[#0891B2]/30 shadow-[0_30px_60px_-15px_rgba(8,145,178,0.1)]'
                      : 'border-[#0B1C2D]/[0.03] hover:border-[#0891B2]/20 hover:shadow-lg'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    type="button"
                    aria-expanded={openFaq === index}
                    className="w-full px-10 py-8 text-left rtl:text-right flex items-center justify-between group"
                  >
                    <span className={`text-2xl font-serif italic transition-colors duration-500 ${openFaq === index ? 'text-[#0891B2]' : 'text-[#0B1C2D]'} pr-8 rtl:pr-0 rtl:pl-8`}>
                      {faq.question?.[language] || faq.question?.en || ''}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-700 border ${openFaq === index ? 'bg-[#0891B2] text-white border-[#0891B2] rotate-180' : 'bg-transparent text-[#0B1C2D]/30 border-[#0B1C2D]/10 group-hover:border-[#0891B2]/30 group-hover:text-[#0891B2]'}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-10 pb-10 pt-2">
                          <p className={`text-[#0B1C2D]/60 leading-[1.8] text-xl font-light font-body border-[#0891B2]/30 pl-8 rtl:pl-0 rtl:pr-8 ${language === 'ar' ? 'border-r-2' : 'border-l-2'}`}>
                            {faq.answer?.[language] || faq.answer?.en || ''}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
