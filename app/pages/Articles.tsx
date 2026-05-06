import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Calendar, User, ArrowRight, Shield, Bell, ChevronRight } from 'lucide-react';
import { useState, useRef, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { clinicService } from '../services/clinicService';
import { toast } from 'sonner';
import { PremiumLoader } from '../components/ui/PremiumLoader';


const artBg = 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200';

export function Articles() {
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
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Premium Hero Section with Parallax */}
      <section ref={heroRef} className="relative h-[45vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ y: backgroundY }}
        >
          <img
            src={state.sections['articles.hero']?.image || state.sections['articles.hero']?.media_url || artBg}
            alt={t('nav.articles')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-secondary/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </motion.div>

        <motion.div 
          style={{ y: textY, opacity }}
          className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white pt-20"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4"
          >
             {state.sections['articles.hero']?.title?.[language] || t('nav.articles')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-white/90 font-light max-w-3xl mx-auto px-4"
          >
            {state.sections['articles.hero']?.subtitle?.[language] || t('articles.hero.subtitle')}
          </motion.p>
        </motion.div>
      </section>

      {/* Premium Category Filter */}
      <section className="sticky top-20 z-40 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="bg-white/80 backdrop-blur-2xl p-2 rounded-[2rem] border border-border/40 shadow-xl flex flex-wrap justify-center gap-2 rtl:flex-row-reverse">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  type="button"
                  aria-pressed={selectedCategory === category}
                  className={`px-6 sm:px-8 py-2 sm:py-3 rounded-2xl transition-all font-bold text-[10px] sm:text-xs tracking-widest uppercase cursor-pointer ${
                    selectedCategory === category
                      ? 'bg-primary text-white shadow-2xl shadow-primary/40'
                      : 'text-muted-foreground hover:text-secondary hover:bg-muted/50'
                  }`}
                >
                  {category === 'all' 
                    ? t('articles.filter.all') 
                    : category === 'dental' 
                    ? t('articles.filter.dental') 
                    : category === 'hair'
                    ? t('articles.filter.hair')
                    : category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {state.blogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
              {state.loading ? (
                <PremiumLoader fullScreen={false} />
              ) : (
                <p className="text-sm font-semibold uppercase tracking-widest">{t('articles.empty') || 'No articles yet — check back soon.'}</p>
              )}
            </div>
          ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10"
          >
            <AnimatePresence mode="popLayout">
              {filteredArticles.map((article) => (
                <Link
                  to={`/blog/${article.slug}`}
                  key={article.id}
                  className="group block"
                >
                  <motion.article
                    layout
                    variants={item}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="h-full bg-white rounded-[2.5rem] border border-border/40 overflow-hidden hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 hover:-translate-y-2 flex flex-col"
                  >
                    <div className="aspect-[16/11] overflow-hidden relative">
                      <img
                        src={article.media_url || (typeof article.image === 'string' ? article.image : '') || artBg}
                        alt={(article.title as any)?.[language] || (article.title as any)?.en || ''}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = artBg;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="absolute top-6 right-6 rtl:right-auto rtl:left-6">
                        <div className="px-4 py-1 bg-white/90 backdrop-blur-md text-secondary rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                          {(article.read_time as any)?.[language] || (article.read_time as any)?.en || '5 min'}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 lg:p-10 rtl:text-right flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-6 rtl:flex-row-reverse">
                        {article.treatment?.slug ? (
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                            {(article.treatment.title as any)?.[language] || (article.treatment.title as any)?.en}
                          </span>
                        ) : (
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                            {(article.category as any)?.[language] || (article.category as any)?.en || 'General'}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary mb-4 leading-tight group-hover:text-primary transition-colors line-clamp-2 italic">
                        {(article.title as any)?.[language] || (article.title as any)?.en || ''}
                      </h3>

                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 sm:mb-8 line-clamp-3 flex-1 italic">
                        {(article.excerpt as any)?.[language] || (article.excerpt as any)?.en || ''}
                      </p>

                      <div className="pt-6 sm:pt-8 border-t border-muted flex items-center justify-between rtl:flex-row-reverse">
                        <div className="flex items-center gap-3 rtl:flex-row-reverse">
                          <div className="w-10 h-10 rounded-full bg-muted border-2 border-primary/20 flex items-center justify-center overflow-hidden">
                             <User className="w-5 h-5 text-primary" />
                          </div>
                          <div className="rtl:text-right">
                            <p className="text-xs font-bold text-secondary">{(article.author as any)?.[language] || (article.author as any)?.en || 'Gravity Clinic'}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                              {article.created_at ? new Date(article.created_at).toLocaleDateString() : ''}
                            </p>
                          </div>
                        </div>
                        <div
                          className="w-12 h-12 rounded-2xl bg-muted group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center"
                        >
                          <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform ${language === 'ar' ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </AnimatePresence>
          </motion.div>
          )}
        </div>
      </section>

      {/* Premium Newsletter Section */}
      <section className="py-24 relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-secondary p-12 md:p-20 rounded-[4rem] relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[150px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center px-4 py-2 bg-white/5 rounded-full mb-8 rtl:flex-row-reverse"
              >
                <Bell className="w-4 h-4 text-primary mr-2 rtl:mr-0 rtl:ml-2" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">{t('articles.newsletter.badge')}</span>
              </motion.div>
              
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight italic">
                {t('articles.newsletter.title')}
              </h2>
              <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
                {t('articles.newsletter.subtitle')}
              </p>

              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  setNewsletterError('');
                  
                  if (!newsletterEmail) {
                    setNewsletterError(t('auth.error.required'));
                    return;
                  }

                  // Robust email validation
                  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(newsletterEmail)) {
                    setNewsletterError(t('auth.error.email'));
                    return;
                  }

                  setIsSubscribing(true);
                  try {
                    await clinicService.submitLead({
                      type: 'newsletter',
                      email: newsletterEmail
                    }, language);
                    toast.success(t('contact.success.msg'));
                    setNewsletterEmail('');
                    setNewsletterError('');
                  } catch (error: any) {
                    if (error.status === 422 && error.errors?.email) {
                      setNewsletterError(t('auth.error.email'));
                    } else {
                      toast.error(t('common.error.generic'));
                    }
                  } finally {
                    setIsSubscribing(false);
                  }
                }}
                className="flex flex-col sm:flex-row gap-4 p-2 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md rtl:flex-row-reverse"
              >
                <label className="sr-only" htmlFor="articles_newsletter_email">
                  Email
                </label>
                <input
                  type="email"
                  id="articles_newsletter_email"
                  autoComplete="email"
                  required
                  placeholder="name@exclusive.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className={`bg-transparent text-white px-8 py-4 outline-none flex-1 font-medium placeholder:text-white/20 rtl:text-right ${newsletterError ? 'border-b-2 border-red-500' : ''}`}
                />
                {newsletterError && (
                  <div className="absolute top-full left-0 right-0 mt-2 text-center">
                    <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{newsletterError}</p>
                  </div>
                )}
                  <button 
                    type="submit" 
                    disabled={isSubscribing}
                    className="px-12 py-4 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20 cursor-pointer disabled:opacity-50"
                  >
                     {isSubscribing ? t('common.loading') : t('articles.newsletter.cta')}
                  </button>
              </form>
              <p className="mt-6 text-white/30 text-[10px] uppercase font-bold tracking-[0.2em]">
                {t('articles.newsletter.footer')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
