






import React, { useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { useDashboard } from '../context/DashboardContext';
import { motion, useScroll, useTransform } from 'motion/react';
import { Calendar, User, Clock, ArrowLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { clinicService } from '../services/clinicService';
import { toast } from 'sonner';
import { PremiumLoader } from '../components/ui/PremiumLoader';


const artBg = 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200';

export function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const { state } = useDashboard();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  const article = state.blogs.find(b => b.slug === slug);
  const relatedArticles = state.blogs.filter(b => b.slug !== slug).slice(0, 3);
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Blogs are fetched in Phase 2 (background). Show a spinner while the blogs
  // array is still empty so we don't redirect prematurely on direct navigation.
  const blogsReady = state.blogs.length > 0 || (!state.loading && !state.error);

  if (state.loading || !blogsReady) {
    return <PremiumLoader />;
  }

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : language === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const getAuthorName = () => {
    return (article.author as any)?.[language] || 'Gravity Clinic';
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Article Hero */}
      <section ref={heroRef} className="relative h-[70vh] flex items-end overflow-hidden">
        <motion.div className="absolute inset-0 w-full h-full" style={{ y: backgroundY }}>
          {article.media_url || (typeof article.image === 'string' ? article.image : '') ? (
            <img
              src={article.media_url || (typeof article.image === 'string' ? article.image : '')}
              alt={(article.title as any)?.[language] || (article.title as any)?.en || ''}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = artBg;
              }}
            />
          ) : (
            <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
              <Calendar className="w-20 h-20 text-secondary/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent"></div>
        </motion.div>
        
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-6 mb-8 rtl:flex-row-reverse">
              {article.treatment?.slug ? (
                <Link 
                  to={`/treatment/${article.treatment.slug}`}
                  className="px-6 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-[0.2em] backdrop-blur-md border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/10"
                >
                  {(article.treatment.title as any)?.[language] || (article.treatment.title as any)?.en}
                </Link>
              ) : (
                <span className="px-6 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-[0.2em] backdrop-blur-md border border-primary/20">
                  {(article.category as any)?.[language] || (article.category as any)?.en || 'General'}
                </span>
              )}
              <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                <Calendar className="w-4 h-4" />
                {article.created_at ? new Date(article.created_at).toLocaleDateString() : ''}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-10 leading-[1.1] tracking-tight">
              {(article.title as any)?.[language] || ''}
            </h1>
            
            <div className="flex items-center gap-6 pt-10 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 overflow-hidden">
                   <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-white font-bold">{getAuthorName()}</div>
                  <div className="text-white/50 text-xs font-black uppercase tracking-widest">{t('dashboard.admin')}</div>
                </div>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div>
                <div className="text-white/50 text-xs font-black uppercase tracking-widest mb-1">Published On</div>
                <div className="text-white font-bold">{formatDate(article.created_at)}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="relative z-20 -mt-10 bg-[#F8F9FE]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-secondary/5 border border-secondary/5 overflow-hidden">
            {/* Breadcrumbs & Navigation */}
            <div className="px-10 py-6 border-b border-secondary/5 bg-secondary/[0.01] flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                <Link to="/" className="hover:text-primary transition-colors">HOME</Link>
                <ChevronRight className="w-3 h-3" />
                <Link to="/blog" className="hover:text-primary transition-colors">BLOG</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-secondary truncate max-w-[200px] uppercase tracking-widest">
                  {(() => { const t = (article.title as any)?.[language] || ''; return t.length > 30 ? t.substring(0, 30) + '…' : t; })()}
                </span>
              </div>
              
              <Link 
                to="/blog" 
                className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest hover:gap-3 transition-all"
              >
                <ArrowLeft className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                Back to Blog
              </Link>
            </div>

            <div className="p-10 md:p-20">
              {/* Lead/Excerpt */}
              <div className="mb-16">
                <p className="text-2xl md:text-3xl font-medium text-slate-600 leading-relaxed italic border-l-4 border-primary pl-10 rtl:border-l-0 rtl:border-r-4 rtl:pl-0 rtl:pr-10">
                  {(article.excerpt as any)?.[language] || ''}
                </p>
              </div>

              {/* Main Content Body */}
              <div 
                className="prose prose-2xl prose-slate max-w-none 
                  prose-headings:text-secondary prose-headings:font-bold prose-headings:tracking-tight 
                  prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-8
                  prose-strong:text-secondary prose-strong:font-bold
                  prose-img:rounded-[2rem] prose-img:shadow-2xl
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-10 prose-blockquote:rounded-[2rem] prose-blockquote:text-2xl prose-blockquote:font-medium prose-blockquote:italic
                "
                dangerouslySetInnerHTML={{ __html: (article.content as any)?.[language] || '' }}
              />

              {/* Share & Footer Tags */}
              <div className="mt-20 pt-10 border-t border-secondary/5 flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div className="flex flex-wrap gap-3">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest self-center mr-4">Tags:</span>
                  <span className="px-5 py-2 rounded-xl bg-secondary/5 text-secondary text-[10px] font-bold uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">
                    {(article.category as any)?.[language] || (article.category as any)?.en || ''}
                  </span>
                  <span className="px-5 py-2 rounded-xl bg-secondary/5 text-secondary text-[10px] font-bold uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">
                    Gravity Clinic
                  </span>
                  <span className="px-5 py-2 rounded-xl bg-secondary/5 text-secondary text-[10px] font-bold uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">
                    {language.toUpperCase()}
                  </span>
                </div>
                

              </div>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-24 mb-24">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-bold text-secondary tracking-tight">MORE ARTICLES</h2>
                <Link to="/blog" className="text-sm font-black text-primary uppercase tracking-widest border-b-2 border-primary pb-1">VIEW ALL</Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedArticles.map((item) => (
                  <Link 
                    key={item.id} 
                    to={`/blog/${item.slug}`}
                    className="group bg-white rounded-[2rem] overflow-hidden border border-secondary/5 shadow-xl shadow-secondary/5 flex flex-col h-full hover:-translate-y-2 transition-all duration-500"
                  >
                    <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.media_url || (item as any).image || ''}
                      alt={(item.title as any)?.[language] || (item.title as any)?.en || ''}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[10px] font-black text-primary uppercase tracking-widest shadow-sm">
                        {(item.category as any)?.[language] || (item.category as any)?.en || ''}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-secondary text-lg mb-3 line-clamp-2 leading-relaxed group-hover:text-primary transition-colors">
                      {(item.title as any)?.[language] || (item.title as any)?.en || ''}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1 italic">
                      {(item.excerpt as any)?.[language] || (item.excerpt as any)?.en || ''}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-secondary/5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span>{formatDate(item.created_at)}</span>
                      <span>{(item.read_time as any)?.[language] || (item.read_time as any)?.en || ''}</span>
                    </div>
                  </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter / CTA */}
      <section className="bg-secondary py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">WANT MORE HEALTH INSIGHTS?</h2>
          <p className="text-white/60 text-lg mb-12 max-w-2xl mx-auto uppercase tracking-[0.1em]">Suscribe to our newsletter to receive the latest updates from Gravity Clinic direct to your inbox.</p>
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              if (!newsletterEmail) return;
              setIsSubscribing(true);
              try {
                await clinicService.submitLead({
                  type: 'newsletter',
                  email: newsletterEmail
                });
                toast.success(t('contact.success.msg'));
                setNewsletterEmail('');
              } catch (error) {
                toast.error(t('common.error.generic'));
              } finally {
                setIsSubscribing(false);
              }
            }}
            className="relative max-w-lg mx-auto"
          >
            <input 
              type="email" 
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="YOUR EMAIL ADDRESS"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all uppercase text-xs font-black tracking-widest"
            />
            <button 
              type="submit"
              disabled={isSubscribing}
              className="absolute right-2 top-2 bottom-2 px-8 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSubscribing ? t('common.loading') : 'Join Now'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
