import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { useState, useRef } from 'react';
import { Check, ArrowRight, ArrowLeft, User, Clipboard, CheckCircle, Shield, Clock, MapPin, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { useDashboard } from '../context/DashboardContext';
import { clinicService } from '../services/clinicService';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const bookingBg = 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200';

export function Booking() {
  const { language, t } = useLanguage();
  const { state } = useDashboard();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    treatment: '',
    date: '',
    message: '',
    botField: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 3;

  const toStrId = (id: string | number | undefined | null): string => String(id ?? '');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = t('auth.error.required');
      if (!formData.lastName) newErrors.lastName = t('auth.error.required');
      if (!formData.email) newErrors.email = t('auth.error.required');
      else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) newErrors.email = t('auth.error.email');
      if (!formData.phone) newErrors.phone = t('auth.error.required');
      else if (formData.phone.length < 7) newErrors.phone = t('auth.error.phone');
    }

    if (step === 2 && !formData.treatment) {
      newErrors.treatment = t('auth.error.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }
    }
  };

  const handlePrevious = () => {
    setErrors({});
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    if (formData.botField !== '') return;

    setIsSubmitting(true);
    try {
      await clinicService.submitLead({
        type: 'booking',
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        treatment: state.treatments.find(t => toStrId(t.id) === formData.treatment)?.title?.en || formData.treatment,
      }, language);

      toast.success(t('booking.success.toast'));
      setCurrentStep(5);
    } catch (error: any) {
      console.error('Booking submission failed:', error);
      
      // Handle Laravel 422 Validation Errors
      if (error.status === 422 && error.errors) {
        const serverErrors = error.errors;
        const formattedErrors: Record<string, string> = {};
        
        const step1Fields = ['firstName', 'lastName', 'email', 'phone', 'name'];
        const step2Fields = ['treatment'];
        let targetStep = 0;

        Object.keys(serverErrors).forEach(key => {
          const message = Array.isArray(serverErrors[key]) ? serverErrors[key][0] : serverErrors[key];
          
          if (key === 'email') {
            formattedErrors[key] = t('auth.error.email');
          } else if (key === 'name') {
            formattedErrors['firstName'] = message;
            formattedErrors['lastName'] = message;
          } else {
            formattedErrors[key] = message;
          }

          if (step1Fields.includes(key)) targetStep = 1;
          else if (step2Fields.includes(key) && targetStep !== 1) targetStep = 2;
        });
        
        setErrors(formattedErrors);
        if (targetStep > 0) setCurrentStep(targetStep);
        return; // Early return for validation errors
      }

      // Generic error handling for other status codes
      toast.error(t('common.error.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      return !!(
        formData.firstName &&
        formData.lastName &&
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email) &&
        formData.phone.length >= 7
      );
    }
    if (currentStep === 2) {
      return !!formData.treatment;
    }
    return true;
  };

  const stepIcons = [User, Clipboard, CheckCircle];

  const selectedTreatment = state.treatments.find(tr => toStrId(tr.id) === formData.treatment);

  return (
    <div className="min-h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <section ref={heroRef} className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{ y: backgroundY }}
        >
          <img
            src={
              state.sections['booking.hero']?.media_url ||
              state.sections['booking.hero']?.image ||
              state.sections['about.appointment']?.media_url ||
              state.sections['about.appointment']?.image ||
              bookingBg
            }
            alt={t('booking.title')}
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
            {state.sections['booking.hero']?.title?.[language] ||
              state.sections['about.appointment']?.title?.[language] ||
              t('booking.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl md:text-2xl text-white/90 font-light px-4"
          >
            {state.sections['booking.hero']?.subtitle?.[language] ||
              state.sections['about.appointment']?.subtitle?.[language] ||
              t('booking.subtitle')}
          </motion.p>
        </motion.div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 md:-mt-12 relative z-20">
        <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl p-4 md:p-8 border border-border/40 backdrop-blur-xl bg-white/90">
          <div className="flex items-center justify-between relative px-2 md:px-0 rtl:flex-row-reverse">
            <div className="absolute top-5 md:top-6 left-0 right-0 h-0.5 bg-muted -z-10" />
            {[1, 2, 3].map((step) => {
              const Icon = stepIcons[step - 1];
              const isActive = step <= currentStep;
              const isCompleted = step < currentStep;

              return (
                <div key={step} className="flex flex-col items-center group">
                  <motion.div
                    animate={{
                      scale: step === currentStep ? 1.1 : 1,
                      backgroundColor: isActive ? 'var(--primary)' : 'var(--muted)',
                    }}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      isActive ? 'text-white shadow-xl shadow-primary/30' : 'text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 md:w-6 md:h-6" />
                    ) : (
                      <Icon className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </motion.div>
                  <span
                    className={`mt-2 md:mt-3 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {t(`booking.step${step}`).split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <AnimatePresence mode="wait">
          {currentStep === 5 ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 text-center shadow-2xl border border-primary/20 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary" />

              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-12 h-12 text-primary" />
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary mb-4 italic">
                {t('booking.success.title')}
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                {t('booking.success.desc').replace('{name}', formData.firstName)}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left rtl:text-right mb-12">
                <div className="p-6 bg-muted/30 rounded-2xl border border-border/50">
                  <Clock className="w-5 h-5 text-primary mb-3" />
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    {t('booking.responseTime.label')}
                  </p>
                  <p className="font-bold text-secondary">{t('booking.responseTime.value')}</p>
                </div>

                <div className="p-6 bg-muted/30 rounded-2xl border border-border/50">
                  <MapPin className="w-5 h-5 text-primary mb-3" />
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    {t('booking.consultation.label')}
                  </p>
                  <p className="font-bold text-secondary">{t('booking.consultation.value')}</p>
                </div>

                <div className="p-6 bg-muted/30 rounded-2xl border border-border/50">
                  <Globe className="w-5 h-5 text-primary mb-3" />
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    {t('booking.international.label')}
                  </p>
                  <p className="font-bold text-secondary">{t('booking.international.value')}</p>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => window.location.href = '/'}
                  className="group relative px-12 py-4 bg-secondary text-white font-bold rounded-full overflow-hidden transition-all hover:shadow-[0_0_40px_-10px_rgba(var(--secondary),0.5)] cursor-pointer"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <ArrowLeft className={`w-5 h-5 ${language === 'ar' ? '' : 'rotate-180'}`} />
                    {t('booking.returnHome')}
                  </span>
                  <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden border border-border/40"
            >
              <div className="p-6 sm:p-12">
                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                  {currentStep === 1 && (
                    <div className="space-y-8">
                      <div className="text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-2 italic">
                          {t('booking.step1')}
                        </h2>
                        <p className="text-muted-foreground">{t('booking.step1.desc')}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-4">
                          <label htmlFor="booking_firstName" className="text-sm font-bold uppercase tracking-widest text-muted-foreground pl-1 rtl:pl-0 rtl:pr-1">
                            {t('booking.firstName')}
                          </label>
                          <input
                            id="booking_firstName"
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border bg-muted/10 ${
                              errors.firstName ? 'border-red-500/50' : 'border-border'
                            } focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-base sm:text-lg`}
                          />
                          {errors.firstName && <p className="text-[10px] text-red-500 font-bold px-1">{errors.firstName}</p>}
                        </div>

                        <div className="space-y-4">
                          <label htmlFor="booking_lastName" className="text-sm font-bold uppercase tracking-widest text-muted-foreground pl-1 rtl:pl-0 rtl:pr-1">
                            {t('booking.lastName')}
                          </label>
                          <input
                            id="booking_lastName"
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border bg-muted/10 ${
                              errors.lastName ? 'border-red-500/50' : 'border-border'
                            } focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-base sm:text-lg`}
                          />
                          {errors.lastName && <p className="text-[10px] text-red-500 font-bold px-1">{errors.lastName}</p>}
                        </div>

                        <div className="space-y-4 sm:col-span-2">
                          <label htmlFor="booking_email" className="text-sm font-bold uppercase tracking-widest text-muted-foreground pl-1 rtl:pl-0 rtl:pr-1">
                            {t('booking.email')}
                          </label>
                          <input
                            type="email"
                            id="booking_email"
                            required
                            autoComplete="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border bg-muted/10 ${
                              errors.email ? 'border-red-500/50' : 'border-border'
                            } focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-base sm:text-lg`}
                          />
                          {errors.email && <p className="text-[10px] text-red-500 font-bold px-1">{errors.email}</p>}
                        </div>

                        <div className="space-y-4 sm:col-span-2">
                          <label htmlFor="booking_phone" className="text-sm font-bold uppercase tracking-widest text-muted-foreground pl-1 rtl:pl-0 rtl:pr-1">
                            {t('booking.phone')}
                          </label>
                          <PhoneInput
                            country={'tr'}
                            value={formData.phone}
                            onChange={(phone) => handleInputChange('phone', '+' + phone)}
                            inputProps={{
                              name: 'phone',
                              required: true,
                              autoComplete: 'tel',
                              id: 'booking_phone'
                            }}
                            containerClass="!w-full"
                            inputClass={`!w-full !px-14 sm:!px-16 !py-6 sm:!py-8 !rounded-2xl !border !bg-muted/10 ${
                              errors.phone ? '!border-red-500/50' : '!border-border'
                            } focus:!border-primary focus:!ring-4 focus:!ring-primary/5 !outline-none !transition-all !text-base sm:!text-lg !h-auto !font-inherit`}
                            buttonClass={`!border-none !bg-transparent !rounded-l-2xl !px-3 hover:!bg-muted/20 ${
                              language === 'ar' ? '!right-0 !left-auto !border-l' : '!left-0 !border-r'
                            } !border-border`}
                            dropdownClass="!rounded-xl !border-border !shadow-2xl !bg-white !text-secondary"
                            searchClass="!bg-muted/10 !border-border"
                          />
                          {errors.phone && <p className="text-[10px] text-red-500 font-bold px-1">{errors.phone}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-8">
                      <div className="text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-2 italic">
                          {t('booking.step2')}
                        </h2>
                        <p className="text-muted-foreground">{t('booking.step2.desc')}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {state.treatments.length === 0 ? (
                          <div className="sm:col-span-2 py-8 text-center text-muted-foreground">
                            <p className="text-sm">{t('booking.loadingTreatments') || 'Loading available treatments…'}</p>
                          </div>
                        ) : (
                          state.treatments
                            .filter(tr => {
                              return [
                                'dental-implant',
                                'hollywood-smile',
                                'male-hair-transplant',
                                'female-hair-transplant',
                                'beard-moustache-transplant',
                                'eyebrow-transplant'
                              ].some(allowedSlug =>
                                tr.slug?.includes(allowedSlug) ||
                                (tr.title?.en || '').toLowerCase().includes(allowedSlug.replace(/-/g, ' '))
                              );
                            })
                            .map((treatment) => {
                              const tId = toStrId(treatment.id);
                              const isSelected = formData.treatment === tId;

                              return (
                                <button
                                  key={tId}
                                  type="button"
                                  onClick={() => handleInputChange('treatment', tId)}
                                  className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border-2 text-left rtl:text-right transition-all flex items-center justify-between group cursor-pointer ${
                                    isSelected ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:border-primary/30'
                                  }`}
                                >
                                  <span className={`font-bold text-sm sm:text-base ${isSelected ? 'text-primary' : 'text-secondary'}`}>
                                    {treatment.title?.[language] || treatment.title?.en || ''}
                                  </span>
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                    isSelected ? 'bg-primary border-primary' : 'border-border group-hover:border-primary/50'
                                  }`}>
                                    {isSelected && <Check className="w-4 h-4 text-white" />}
                                  </div>
                                </button>
                              );
                            })
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-8">
                      <div className="text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-2 italic">
                          {t('booking.step3')}
                        </h2>
                        <p className="text-muted-foreground">{t('booking.step3.desc')}</p>
                      </div>

                      <div className="bg-muted/30 rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 space-y-6 border border-border/50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-12 gap-y-6 rtl:text-right">
                          <div className="sm:col-span-2">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                              {t('booking.firstName')} & {t('booking.lastName')}
                            </p>
                            <p className="text-lg sm:text-xl font-bold text-secondary">
                              {formData.firstName} {formData.lastName}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                              {t('booking.treatment')}
                            </p>
                            <p className="text-lg sm:text-xl font-bold text-primary">
                              {selectedTreatment?.title?.[language] || selectedTreatment?.title?.en || formData.treatment}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                              {t('booking.email')}
                            </p>
                            <p className="text-base sm:text-lg font-bold text-secondary break-all">
                              {formData.email}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                              {t('booking.phone')}
                            </p>
                            <p className="text-base sm:text-lg font-bold text-secondary" dir="ltr">
                              {formData.phone}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 sm:p-6 bg-primary/5 rounded-2xl border border-primary/10 rtl:flex-row-reverse">
                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                        <p className="text-sm text-secondary leading-relaxed">
                          {t('booking.securityFlag')}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between pt-8 sm:pt-12 border-t border-border gap-4 rtl:sm:flex-row-reverse">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      disabled={currentStep === 1}
                      className={`w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base ${
                        currentStep === 1 ? 'hidden sm:flex sm:opacity-0 sm:pointer-events-none' : 'text-secondary hover:bg-muted bg-muted/30 sm:bg-transparent'
                      }`}
                    >
                      <ArrowLeft className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                      {t('common.back')}
                    </button>

                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={!isStepValid()}
                        className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 bg-primary text-white font-bold rounded-full hover:shadow-2xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group text-sm sm:text-base cursor-pointer rtl:flex-row-reverse"
                      >
                        {t('booking.continuePhase')}
                        <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform ${language === 'ar' ? 'rotate-180' : ''}`} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 bg-primary text-white font-bold rounded-full hover:shadow-2xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer rtl:flex-row-reverse"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            {t('booking.confirmBooking')}
                            <CheckCircle className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}