import { useLanguage } from '../context/LanguageContext';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send, Shield, ChevronDown, Check } from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { useDashboard } from '../context/DashboardContext';
import { clinicService } from '../services/clinicService';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
const contactBg = 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200';

export function Contact() {
  const { language, t } = useLanguage();
  const { state } = useDashboard();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
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
    <div className="min-h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Premium Hero Section with Parallax */}
      <section ref={heroRef} className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ y: backgroundY }}
        >
          <img
            src={state.sections['contact.hero']?.media_url || state.sections['contact.hero']?.image || state.sections['about.contact']?.media_url || state.sections['about.contact']?.image || contactBg}
            alt={t('contact.title')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-secondary/80 mix-blend-multiply"></div>
        </motion.div>

        <motion.div 
          style={{ y: textY, opacity }}
          className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white pt-24"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4"
          >
            {state.sections['contact.hero']?.title?.[language] || state.sections['about.contact']?.title?.[language] || t('contact.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl md:text-2xl text-white/90 font-light px-4"
          >
            {state.sections['contact.hero']?.subtitle?.[language] || state.sections['about.contact']?.subtitle?.[language] || t('contact.subtitle')}
          </motion.p>
        </motion.div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card text-card-foreground border border-border rounded-2xl shadow-xl p-8 rtl:text-right"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-secondary italic">{t('contact.form.title')}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot Field - completely hidden from layout */}
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

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('contact.name')} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500/50' : 'border-border'} bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors`}
                    required
                  />
                  {errors.name && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('booking.email')} *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500/50' : 'border-border'} bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors`}
                    required
                  />
                  {errors.email && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{errors.email}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('booking.phone')} *
                  </label>
                  <PhoneInput
                    country={'tr'}
                    value={formData.phone}
                    onChange={(phone) => handleInputChange('phone', '+' + phone)}
                    inputProps={{
                      name: 'phone',
                      required: true,
                      autoComplete: 'tel',
                      id: 'contact_phone'
                    }}
                    containerClass="!w-full"
                    inputClass={`!w-full !px-14 !py-3 !rounded-lg !border ${errors.phone ? '!border-red-500/50' : '!border-border'} !bg-card !text-foreground focus:!ring-2 focus:!ring-primary focus:!border-primary !outline-none !transition-colors !h-auto !font-inherit`}
                    buttonClass={`!border-none !bg-transparent !rounded-l-lg !px-3 hover:!bg-muted/20 ${language === 'ar' ? '!right-0 !left-auto !border-l' : '!left-0 !border-r'} !border-border`}
                    dropdownClass="!rounded-xl !border-border !shadow-2xl !bg-white !text-secondary"
                    searchClass="!bg-muted/10 !border-border"
                  />
                  {errors.phone && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('contact.subject')} *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.subject ? 'border-red-500/50' : 'border-border'} bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors`}
                    required
                  />
                  {errors.subject && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('booking.message')} *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-500/50' : 'border-border'} bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors resize-none`}
                    required
                  />
                  {errors.message && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" /> : null}
                  {t('contact.send')}
                  {!isLoading && <Send className={`ml-2 w-5 h-5 ${language === 'ar' ? 'rotate-180 mr-2 ml-0' : ''}`} />}
                </button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8 rtl:text-right"
            >
              <div>
                <h2 className="text-3xl mb-6 italic">{t('contact.info.title')}</h2>
                <p className="text-muted-foreground mb-6">
                  {t('contact.info.desc')}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start rtl:flex-row-reverse">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="ml-4 rtl:ml-0 rtl:mr-4">
                    <h3 className="font-semibold mb-1">{t('contact.phone.label')}</h3>
                    <p className="text-muted-foreground" dir="ltr">{state.locations[0]?.phone || '+90 541 339 25 69'}</p>
                  </div>
                </div>

                <div className="flex items-start rtl:flex-row-reverse">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div className="ml-4 rtl:ml-0 rtl:mr-4">
                    <h3 className="font-semibold mb-1">{t('contact.email.label')}</h3>
                    <p className="text-muted-foreground">{state.locations[0]?.email || 'info@gravity-clinic.com'}</p>
                  </div>
                </div>

                <div className="flex items-start rtl:flex-row-reverse">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="ml-4 rtl:ml-0 rtl:mr-4">
                    <h3 className="font-semibold mb-1">{t('contact.workingHours')}</h3>
                    <p className="text-muted-foreground">{state.locations[0]?.hours?.[language] || t('contact.monSat')}</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                <img
                  src={contactBg}
                  alt="Our Location"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Global Locations */}
      <section className="py-20 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4 italic font-bold text-secondary">{t('contact.locations')}</h2>
          </div>

          {state.locations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">{t('contact.loadingLocations') || 'Loading locations…'}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {state.locations.map((location, index) => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card text-card-foreground border border-border rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow rtl:text-right"
                >
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl mb-2 font-bold text-secondary">{location.city?.[language] || location.city?.en || ''}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{location.country?.[language] || location.country?.en || ''}</p>
                  <div className="space-y-3 text-sm">
                    <p className="text-foreground/80 leading-relaxed">{location.address?.[language] || location.address?.en || ''}</p>
                    <p className="text-foreground/80 flex items-center rtl:flex-row-reverse">
                      <Phone className="w-4 h-4 mr-2 ml-0 rtl:mr-0 rtl:ml-2 text-primary" />
                      <span dir="ltr">{location.phone || ''}</span>
                    </p>
                    <p className="text-foreground/80 flex items-center rtl:flex-row-reverse">
                      <Mail className="w-4 h-4 mr-2 ml-0 rtl:mr-0 rtl:ml-2 text-primary" />
                      {location.email || ''}
                    </p>
                    <p className="text-foreground/80 flex items-center rtl:flex-row-reverse">
                      <Clock className="w-4 h-4 mr-2 ml-0 rtl:mr-0 rtl:ml-2 text-muted-foreground" />
                      {location.hours?.[language] || location.hours?.en || ''}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4 tracking-tight italic">
              {t('contact.faq')}
            </h2>
            <p className="text-muted-foreground text-lg">{t('contact.faq.subtitle')}</p>
          </div>

          {state.faqs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">{t('contact.loadingFaqs') || 'Loading FAQs…'}</p>
          ) : (
            <div className="space-y-4">
              {state.faqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-[2rem] border transition-all duration-300 ${
                    openFaq === index
                      ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    type="button"
                    aria-expanded={openFaq === index}
                    aria-controls={`contact_faq_${index}`}
                    className="w-full px-6 sm:px-8 py-5 sm:py-6 text-left rtl:text-right flex items-center justify-between group"
                  >
                    <span className={`text-base sm:text-lg font-bold transition-colors ${openFaq === index ? 'text-primary' : 'text-secondary font-semibold'} pr-4 rtl:pr-0 rtl:pl-4`}>
                      {faq.question?.[language] || faq.question?.en || ''}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${openFaq === index ? 'bg-primary text-white rotate-180' : 'bg-muted text-muted-foreground'}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                        id={`contact_faq_${index}`}
                      >
                        <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2">
                          <p className={`text-muted-foreground leading-relaxed text-base sm:text-lg border-primary/20 pl-4 sm:pl-6 rtl:pl-0 rtl:pr-4 rtl:sm:pr-6 ${language === 'ar' ? 'border-r-2' : 'border-l-2'}`}>
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
