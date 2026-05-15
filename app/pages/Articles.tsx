import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Calendar, User, ArrowRight, Shield, Bell, ChevronRight, Clock, Sparkles, Search } from 'lucide-react';
import { useState, useRef, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { clinicService } from '../services/clinicService';
import { toast } from 'sonner';
import { PremiumLoader } from '../components/ui/PremiumLoader';


const artBg = 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1600';

export function Articles() {
  const { language, t } = useLanguage();
  const { state } = useDashboard();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterError, setNewsletterError] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const categories = useMemo(() => {
    const cats = ['all'];
    state.blogs.forEach(blog => {
      const cat = typeof blog.category === 'object' ? blog.category?.en?.toLowerCase() : (blog.category as string)?.toLowerCase();
      if (cat && !cats.includes(cat)) cats.push(cat);
    });
    return cats;
  }, [state.blogs]);

  const filteredArticles = useMemo(() => {
    return selectedCategory === 'all' 
      ? state.blogs 
      : state.blogs.filter(blog => {
          const cat = typeof blog.category === 'object' ? blog.category?.en?.toLowerCase() : (blog.category as string)?.toLowerCase();
          return cat === selectedCategory.toLowerCase();
        });
  }, [selectedCategory, state.blogs]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Luxury Cinematic Hero */}
      <section ref={heroRef} className="relative h-[65vh] min-h-[550px] flex items-center justify-center overflow-hidden bg-[#0B1C2D]">
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ y: backgroundY }}
        >
          <img
            src={state.sections['articles.hero']?.image || state.sections['articles.hero']?.media_url || artBg}
            alt={t('nav.articles')}
            className="w-full h-full object-cover opacity-40 grayscale-[0.2]"
          />
          {/* Layered Gradient Depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1C2D]/60 via-transparent to-[#F8FAFC]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(8,145,178,0.1)_0%,transparent_70%)]"></div>
          
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-navbar-grid opacity-[0.05]"></div>
        </motion.div>

        <motion.div 
          style={{ y: textY, opacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-center gap-4"
          >
            <div className="w-8 h-[1px] bg-white/20"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#0891B2]">
              {language === 'ar' ? 'منصة لومو كلينيك التحريرية' : 'The Clinical Editorial'}
            </span>
            <div className="w-8 h-[1px] bg-white/20"></div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-6xl sm:text-8xl md:text-9xl font-serif text-white mb-8 tracking-tighter leading-[0.9] italic"
          >
             {state.sections['articles.hero']?.title?.[language] || 'Insights'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-lg md:text-2xl text-white/60 font-body max-w-2xl mx-auto px-4 font-light leading-relaxed"
          >
            {state.sections['articles.hero']?.subtitle?.[language] || 'Explore the latest advancements in medical aesthetics and bespoke care.'}
          </motion.p>
        </motion.div>
      </section>

      {/* Premium Segmented Filter */}
      <section className="sticky top-[var(--navbar-height)] z-40 py-10 -mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="bg-white/80 backdrop-blur-2xl p-2 rounded-[2rem] border border-[#0B1C2D]/[0.05] shadow-[0_20px_50px_-15px_rgba(11,28,45,0.08)] flex flex-wrap justify-center gap-1.5">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-8 py-3.5 rounded-2xl transition-all duration-700 font-bold text-[10px] tracking-[0.3em] uppercase relative group overflow-hidden ${
                    selectedCategory === category ? 'text-white' : 'text-[#0B1C2D]/40 hover:text-[#0B1C2D]'
                  }`}
                >
                  {selectedCategory === category && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-[#0B1C2D] shadow-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">
                    {category === 'all' 
                      ? t('articles.filter.all') 
                      : category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Grid Section */}
      <section className="py-40 relative">
        <div className="absolute inset-0 bg-navbar-grid opacity-[0.02] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {state.blogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32">
              {state.loading ? (
                <PremiumLoader fullScreen={false} />
              ) : (
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#0B1C2D]/30">{t('articles.empty') || 'No articles found.'}</p>
              )}
            </div>
          ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16"
          >
            <AnimatePresence mode="popLayout">
              {filteredArticles.map((article, idx) => (
                <motion.div
                  key={article.id}
                  layout
                  variants={item}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex flex-col h-full"
                >
                  <Link to={`/blog/${article.slug}`} className="relative aspect-[16/11] overflow-hidden block rounded-[3rem] bg-[#0B1C2D]/5 shadow-[0_30px_60px_-15px_rgba(11,28,45,0.12)] transition-transform duration-700 group-hover:-translate-y-4">
                    <img
                      src={article.media_url || (typeof article.image === 'string' ? article.image : '') || artBg}
                      alt={(article.title as any)?.[language] || (article.title as any)?.en || ''}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                      onError={(e) => { (e.target as HTMLImageElement).src = artBg; }}
                    />
                    
                    {/* Editorial Badges */}
                    <div className="absolute top-8 left-8 z-20">
                      <span className="px-6 py-2.5 bg-white/95 backdrop-blur-xl text-[#0B1C2D] text-[9px] font-bold uppercase tracking-[0.2em] rounded-full border border-white/30 shadow-xl flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-[#0891B2]" />
                        {(article.category as any)?.[language] || (article.category as any)?.en || 'General'}
                      </span>
                    </div>

                    <div className="absolute bottom-8 right-8 z-20 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                      <div className="w-14 h-14 bg-[#0891B2] text-white rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-[#0891B2]/40">
                        <ArrowRight className={`w-6 h-6 ${language === 'ar' ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2D]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  </Link>

                  <div className="pt-12 flex-1 flex flex-col px-4">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[#0B1C2D]/30 uppercase tracking-[0.3em]">
                        <Calendar className="w-3.5 h-3.5 text-[#0891B2]/50" />
                        {article.created_at ? new Date(article.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                      </div>
                      <div className="w-1 h-1 rounded-full bg-[#0B1C2D]/10"></div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[#0B1C2D]/30 uppercase tracking-[0.3em]">
                        <Clock className="w-3.5 h-3.5 text-[#0891B2]/50" />
                        {(article.read_time as any)?.[language] || (article.read_time as any)?.en || '5 min'}
                      </div>
                    </div>

                    <h3 className="text-3xl md:text-[2.25rem] font-serif italic text-[#0B1C2D] mb-6 leading-[1.1] tracking-tight group-hover:text-[#0891B2] transition-colors duration-500">
                      <Link to={`/blog/${article.slug}`}>
                        {(article.title as any)?.[language] || (article.title as any)?.en || ''}
                      </Link>
                    </h3>

                    <p className="text-base text-[#0B1C2D]/50 font-body font-light leading-relaxed mb-10 line-clamp-3">
                      {(article.excerpt as any)?.[language] || (article.excerpt as any)?.en || ''}
                    </p>

                    <div className="mt-auto pt-10 border-t border-[#0B1C2D]/[0.05] flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-[#0B1C2D]/[0.02] border border-[#0B1C2D]/[0.06] flex items-center justify-center">
                           <User className="w-5 h-5 text-[#0B1C2D]/20" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-[#0B1C2D]/30 uppercase tracking-widest mb-0.5">Author</span>
                          <span className="text-xs font-bold text-[#0B1C2D]/80">{(article.author as any)?.[language] || (article.author as any)?.en || 'Lumo Clinic'}</span>
                        </div>
                      </div>
                      
                      <Link 
                        to={`/blog/${article.slug}`} 
                        className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#0891B2] flex items-center gap-2 hover:gap-4 transition-all duration-500"
                      >
                        {language === 'ar' ? 'اقرأ المزيد' : 'Read Insight'}
                        <ArrowRight className={`w-3.5 h-3.5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          )}
        </div>
      </section>

      {/* Luxury Newsletter Engagement */}
      <section className="py-40 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0B1C2D] p-16 md:p-32 rounded-[4rem] relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(11,28,45,0.4)]">
            {/* Ambient Background Depth */}
            <div className="absolute top-0 right-0 w-[60%] h-full bg-[#0891B2]/10 blur-[150px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[40%] h-[60%] bg-[#0891B2]/5 blur-[120px] translate-y-1/2 -translate-x-1/2" />
            <div className="absolute inset-0 bg-navbar-grid opacity-[0.05]" />
            
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center px-6 py-2.5 bg-white/5 rounded-full mb-12 border border-white/10"
              >
                <Bell className="w-4 h-4 text-[#0891B2] mr-3 rtl:mr-0 rtl:ml-3" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0891B2]">Stay Informed</span>
              </motion.div>
              
              <h2 className="text-4xl md:text-8xl font-serif text-white mb-10 leading-[0.95] italic">
                {t('articles.newsletter.title') || 'The Editorial Feed'}
              </h2>
              <p className="text-lg md:text-2xl text-white/50 mb-16 max-w-2xl mx-auto font-body font-light leading-relaxed">
                {t('articles.newsletter.subtitle') || 'Subscribe to our medical insights for the latest in aesthetics and clinic excellence.'}
              </p>

              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newsletterEmail || isSubscribing) return;
                  setIsSubscribing(true);
                  try {
                    await clinicService.submitLead({ type: 'newsletter', email: newsletterEmail }, language);
                    toast.success(t('contact.success.msg'));
                    setNewsletterEmail('');
                  } catch (error) {
                    toast.error(t('common.error.generic'));
                  } finally {
                    setIsSubscribing(false);
                  }
                }}
                className="flex flex-col sm:flex-row gap-5 p-3 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-xl"
              >
                <input
                  type="email"
                  placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Enter your email address'}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-transparent text-white px-10 py-6 outline-none flex-1 font-body text-lg placeholder:text-white/20 rtl:text-right"
                />
                <button 
                  type="submit" 
                  disabled={isSubscribing}
                  className="btn-luxury !px-16 !py-6 !text-base disabled:opacity-50"
                >
                    {isSubscribing ? 'Subscribing...' : t('articles.newsletter.cta')}
                </button>
              </form>
              
              <p className="mt-12 text-white/20 text-[10px] uppercase font-bold tracking-[0.5em]">
                {t('articles.newsletter.footer') || 'Privacy Assured • Bespoke Communication'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
