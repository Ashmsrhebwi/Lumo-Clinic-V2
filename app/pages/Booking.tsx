import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { useState, useRef } from 'react';
import { Check, ArrowRight, ArrowLeft, User, Clipboard, CheckCircle, Shield, Clock, MapPin, Globe, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useDashboard } from '../context/DashboardContext';
import { clinicService } from '../services/clinicService';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Link } from 'react-router';

const bookingBg = 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1600';

export function Booking() {
  const { language, t } = useLanguage();
  const { state } = useDashboard();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);
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
        return;
      }
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

  const stepIcons = [User, Clipboard, Sparkles];

  const selectedTreatment = state.treatments.find(tr => toStrId(tr.id) === formData.treatment);

  return (
    <div className="min-h-screen bg-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Luxury Soft Hero Section */}
      <section ref={heroRef} className="relative h-[65vh] min-h-[550px] flex items-center justify-center overflow-hidden bg-[#F8FAFC]">
        {/* Layered Depth Background */}
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ y: backgroundY }}
        >
          <img
            src={bookingBg}
            alt={t('booking.title')}
            className="w-full h-full object-cover opacity-30 grayscale-[0.3]"
          />
          {/* Refined overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1C2D]/5 via-transparent to-white"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(8,145,178,0.05)_0%,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-navbar-grid opacity-[0.05]"></div>
        </motion.div>

        <motion.div
          style={{ y: textY, opacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-center gap-4"
          >
            <div className="w-8 h-[1px] bg-[#0B1C2D]/10"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#0891B2]">
              {t('booking.subtitle') || 'Private Consultation'}
            </span>
            <div className="w-8 h-[1px] bg-[#0B1C2D]/10"></div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-serif text-[#0B1C2D] leading-[0.95] tracking-tight italic mb-10"
          >
            {language === 'ar' ? 'حجز موعد' : 'Your Journey'}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-lg md:text-2xl text-[#0B1C2D]/50 max-w-2xl mx-auto font-body font-light leading-relaxed"
          >
            {state.sections['booking.hero']?.subtitle?.[language] || t('booking.subtitle') || 'Enter our concierge booking experience to schedule your bespoke treatment.'}
          </motion.p>
        </motion.div>
      </section>

      {/* Luxury Progress System */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] p-6 md:p-8 border border-[#0B1C2D]/[0.03] shadow-[0_20px_50px_-15px_rgba(11,28,45,0.05)]">
          <div className="flex items-center justify-between relative px-4 md:px-8">
            {/* Progress Line */}
            <div className="absolute top-1/2 left-8 right-8 h-[1.5px] bg-[#0B1C2D]/[0.04] -translate-y-1/2" />
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: (currentStep - 1) / (totalSteps - 1) }}
              className="absolute top-1/2 left-8 right-8 h-[1.5px] bg-[#0891B2]/30 origin-left -translate-y-1/2"
            />

            {[1, 2, 3].map((step) => {
              const Icon = stepIcons[step - 1];
              const isActive = step === currentStep;
              const isCompleted = step < currentStep;

              return (
                <div key={step} className="flex flex-col items-center relative z-10">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      backgroundColor: isActive ? '#0B1C2D' : (isCompleted ? '#0891B2' : '#FFFFFF'),
                      borderColor: isActive ? '#0B1C2D' : (isCompleted ? '#0891B2' : '#0B1C2D1a')
                    }}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-[1.5rem] flex items-center justify-center border transition-all duration-700 shadow-sm"
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <Icon className={`w-5 h-5 ${isActive ? 'text-[#0891B2]' : 'text-[#0B1C2D]/30'}`} />
                    )}
                  </motion.div>
                  
                  <motion.span
                    animate={{ opacity: isActive ? 1 : 0.4 }}
                    className={`mt-4 text-[9px] font-bold uppercase tracking-[0.3em] ${isActive ? 'text-[#0B1C2D]' : 'text-[#0B1C2D]/40'}`}
                  >
                    Step 0{step}
                  </motion.span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pb-40">
        <AnimatePresence mode="wait">
          {currentStep === 5 ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[4rem] p-12 md:p-24 text-center border border-[#0B1C2D]/[0.05] shadow-[0_40px_100px_-20px_rgba(11,28,45,0.08)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-navbar-grid opacity-[0.03] pointer-events-none"></div>
              
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 15, delay: 0.2 }}
                className="w-24 h-24 bg-[#0891B2]/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 border border-[#0891B2]/10"
              >
                <CheckCircle className="w-10 h-10 text-[#0891B2]" />
              </motion.div>

              <h2 className="text-4xl md:text-6xl font-serif text-[#0B1C2D] mb-8 leading-tight italic">
                {t('booking.success.title') || 'Reservation Confirmed'}
              </h2>

              <p className="text-lg md:text-xl text-[#0B1C2D]/50 max-w-xl mx-auto mb-16 font-body leading-relaxed">
                {t('booking.success.desc').replace('{name}', formData.firstName)}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left rtl:text-right mb-20">
                <div className="p-10 rounded-[2.5rem] bg-[#F8FAFC] border border-[#0B1C2D]/[0.03] hover:shadow-xl transition-all duration-700">
                  <Clock className="w-6 h-6 text-[#0891B2] mb-6" />
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#0B1C2D]/40 mb-3">{t('booking.responseTime.label')}</p>
                  <p className="font-bold text-[#0B1C2D] text-lg">{t('booking.responseTime.value')}</p>
                </div>

                <div className="p-10 rounded-[2.5rem] bg-[#F8FAFC] border border-[#0B1C2D]/[0.03] hover:shadow-xl transition-all duration-700">
                  <Shield className="w-6 h-6 text-[#0891B2] mb-6" />
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#0B1C2D]/40 mb-3">Privacy First</p>
                  <p className="font-bold text-[#0B1C2D] text-lg">Secure Channel</p>
                </div>

                <div className="p-10 rounded-[2.5rem] bg-[#F8FAFC] border border-[#0B1C2D]/[0.03] hover:shadow-xl transition-all duration-700">
                  <Globe className="w-6 h-6 text-[#0891B2] mb-6" />
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#0B1C2D]/40 mb-3">Support</p>
                  <p className="font-bold text-[#0B1C2D] text-lg">Multi-language</p>
                </div>
              </div>

              <Link to="/" className="btn-luxury px-16 py-6 inline-flex group">
                <ArrowLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${language === 'ar' ? '' : 'rotate-180'}`} />
                {t('booking.returnHome')}
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="bg-white rounded-[4rem] border border-[#0B1C2D]/[0.05] shadow-[0_50px_120px_-30px_rgba(11,28,45,0.1)] overflow-hidden"
            >
              <div className="p-10 md:p-20">
                <form onSubmit={handleSubmit} className="space-y-12">
                  {currentStep === 1 && (
                    <div className="space-y-12">
                      <div className="text-center max-w-lg mx-auto">
                        <h2 className="text-3xl md:text-4xl font-serif text-[#0B1C2D] italic mb-4">
                          Personal Details
                        </h2>
                        <p className="text-[#0B1C2D]/40 font-body text-sm leading-relaxed">Please provide your contact information to begin your private consultation journey.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0B1C2D]/40 pl-2 rtl:pl-0 rtl:pr-2">
                            {t('booking.firstName')}
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className={`w-full px-8 py-5 rounded-2xl bg-[#F8FAFC] border transition-all outline-none text-lg text-[#0B1C2D] font-body ${
                              errors.firstName ? 'border-red-400' : 'border-[#0B1C2D]/[0.05] focus:border-[#0891B2] focus:bg-white focus:ring-4 focus:ring-[#0891B2]/5'
                            }`}
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0B1C2D]/40 pl-2 rtl:pl-0 rtl:pr-2">
                            {t('booking.lastName')}
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className={`w-full px-8 py-5 rounded-2xl bg-[#F8FAFC] border transition-all outline-none text-lg text-[#0B1C2D] font-body ${
                              errors.lastName ? 'border-red-400' : 'border-[#0B1C2D]/[0.05] focus:border-[#0891B2] focus:bg-white focus:ring-4 focus:ring-[#0891B2]/5'
                            }`}
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0B1C2D]/40 pl-2 rtl:pl-0 rtl:pr-2">
                            {t('booking.email')}
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`w-full px-8 py-5 rounded-2xl bg-[#F8FAFC] border transition-all outline-none text-lg text-[#0B1C2D] font-body ${
                              errors.email ? 'border-red-400' : 'border-[#0B1C2D]/[0.05] focus:border-[#0891B2] focus:bg-white focus:ring-4 focus:ring-[#0891B2]/5'
                            }`}
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-3">
                          <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0B1C2D]/40 pl-2 rtl:pl-0 rtl:pr-2">
                            {t('booking.phone')}
                          </label>
                          <PhoneInput
                            country={'tr'}
                            value={formData.phone}
                            onChange={(phone) => handleInputChange('phone', '+' + phone)}
                            containerClass="!w-full"
                            inputClass={`!w-full !px-16 !py-8 !h-auto !rounded-2xl !bg-[#F8FAFC] !border !text-lg !text-[#0B1C2D] !font-inherit !transition-all !outline-none ${
                              errors.phone ? '!border-red-400' : '!border-[#0B1C2D]/[0.05] focus:!border-[#0891B2] focus:!bg-white focus:!ring-4 focus:!ring-[#0891B2]/5'
                            }`}
                            buttonClass={`!border-none !bg-transparent !px-4 ${language === 'ar' ? '!right-0 !left-auto' : '!left-0'}`}
                            dropdownClass="!rounded-2xl !border-[#0B1C2D]/10 !shadow-2xl !bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-12">
                      <div className="text-center max-w-lg mx-auto">
                        <h2 className="text-3xl md:text-4xl font-serif text-[#0B1C2D] italic mb-4">
                          Select Experience
                        </h2>
                        <p className="text-[#0B1C2D]/40 font-body text-sm leading-relaxed">Choose the specialized treatment you are interested in for your medical journey.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {state.treatments.filter(tr => [
                          'dental-implant', 'hollywood-smile', 'male-hair-transplant', 'female-hair-transplant'
                        ].some(s => tr.slug?.includes(s))).map((tr) => {
                          const tId = toStrId(tr.id);
                          const isSelected = formData.treatment === tId;
                          return (
                            <button
                              key={tId}
                              type="button"
                              onClick={() => handleInputChange('treatment', tId)}
                              className={`p-8 rounded-[2rem] border text-left transition-all duration-500 group relative overflow-hidden ${
                                isSelected ? 'border-[#0891B2] bg-[#0891B2]/5 shadow-xl scale-[1.02]' : 'border-[#0B1C2D]/[0.06] bg-white hover:border-[#0891B2]/30 hover:bg-[#F8FAFC]'
                              }`}
                            >
                              <div className="relative z-10 flex items-center justify-between">
                                <div className="space-y-2">
                                  <span className={`text-[9px] font-bold uppercase tracking-[0.3em] transition-colors ${isSelected ? 'text-[#0891B2]' : 'text-[#0B1C2D]/30'}`}>Clinical Series</span>
                                  <h3 className={`text-xl font-serif italic transition-colors ${isSelected ? 'text-[#0B1C2D]' : 'text-[#0B1C2D]/80'}`}>
                                    {tr.title?.[language] || tr.title?.en}
                                  </h3>
                                </div>
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-700 ${isSelected ? 'bg-[#0B1C2D] border-[#0B1C2D] scale-110 shadow-lg shadow-[#0B1C2D]/20' : 'border-[#0B1C2D]/10 group-hover:border-[#0891B2]/40'}`}>
                                  {isSelected && <Check className="w-4 h-4 text-white" />}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-12">
                      <div className="text-center max-w-lg mx-auto">
                        <h2 className="text-3xl md:text-4xl font-serif text-[#0B1C2D] italic mb-4">
                          Confirm Details
                        </h2>
                        <p className="text-[#0B1C2D]/40 font-body text-sm leading-relaxed">Review your information before finalizing your medical concierge reservation.</p>
                      </div>

                      <div className="bg-[#F8FAFC] rounded-[3rem] p-10 md:p-16 border border-[#0B1C2D]/[0.03] relative overflow-hidden">
                        <div className="absolute inset-0 bg-navbar-grid opacity-[0.03] pointer-events-none"></div>
                        
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                          <div className="md:col-span-2">
                            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#0B1C2D]/30 block mb-4">Concierge Member</span>
                            <p className="text-3xl md:text-4xl font-serif italic text-[#0B1C2D]">{formData.firstName} {formData.lastName}</p>
                          </div>

                          <div className="space-y-3">
                            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#0B1C2D]/30 block mb-1">Selected Treatment</span>
                            <p className="text-xl font-body font-bold text-[#0891B2]">{selectedTreatment?.title?.[language] || selectedTreatment?.title?.en || formData.treatment}</p>
                          </div>

                          <div className="space-y-3">
                            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#0B1C2D]/30 block mb-1">Contact Channel</span>
                            <p className="text-lg font-body text-[#0B1C2D]/80">{formData.email}</p>
                            <p className="text-lg font-body text-[#0B1C2D]/80" dir="ltr">{formData.phone}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 p-8 bg-[#0891B2]/5 rounded-[2rem] border border-[#0891B2]/10">
                        <div className="w-12 h-12 bg-[#0891B2] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#0891B2]/20">
                          <Shield className="w-6 h-6" />
                        </div>
                        <p className="text-sm text-[#0B1C2D]/60 leading-relaxed font-body">Your data is processed through our secure clinical channel. Our concierge team will reach out within 24 hours.</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col-reverse sm:flex-row items-center justify-between pt-16 border-t border-[#0B1C2D]/[0.05] gap-8">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      disabled={currentStep === 1}
                      className={`w-full sm:w-auto px-12 py-5 rounded-full font-bold transition-all flex items-center justify-center gap-3 group/btn text-base ${
                        currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-[#0B1C2D]/40 hover:text-[#0B1C2D]'
                      }`}
                    >
                      <ArrowLeft className={`w-4 h-4 transition-transform group-hover/btn:-translate-x-1 ${language === 'ar' ? 'rotate-180' : ''}`} />
                      {t('common.back')}
                    </button>

                    <button
                      type={currentStep === 3 ? "submit" : "button"}
                      onClick={currentStep === 3 ? undefined : handleNext}
                      disabled={isSubmitting || !isStepValid()}
                      className="btn-luxury w-full sm:w-auto px-20 py-6 text-base group/main"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          {currentStep === 3 ? t('booking.confirmBooking') : 'Continue Journey'}
                          {currentStep === 3 ? <CheckCircle className="w-5 h-5" /> : <ArrowRight className={`w-4 h-4 transition-transform group-hover/main:translate-x-1 ${language === 'ar' ? 'rotate-180' : ''}`} />}
                        </>
                      )}
                    </button>
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