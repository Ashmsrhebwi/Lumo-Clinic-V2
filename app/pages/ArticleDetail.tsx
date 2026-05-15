






import React, { useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { useDashboard } from '../context/DashboardContext';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Calendar, User, Clock, ArrowLeft, ChevronRight, Sparkles, User2, Bell, Share2, Facebook, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { clinicService } from '../services/clinicService';
import { toast } from 'sonner';
import { PremiumLoader } from '../components/ui/PremiumLoader';


const artBg = 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1600';

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
    return (article.author as any)?.[language] || 'Clinical Expert';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Cinematic Article Hero */}
      <section ref={heroRef} className="relative h-[80vh] min-h-[700px] flex items-end overflow-hidden bg-[#0B1C2D]">
        <motion.div className="absolute inset-0 w-full h-full" style={{ y: backgroundY }}>
          {article.media_url || (typeof article.image === 'string' ? article.image : '') ? (
            <img
              src={article.media_url || (typeof article.image === 'string' ? article.image : '')}
              alt={(article.title as any)?.[language] || (article.title as any)?.en || ''}
              className="w-full h-full object-cover scale-105 opacity-50 grayscale-[0.2]"
              onError={(e) => { (e.target as HTMLImageElement).src = artBg; }}
            />
          ) : (
            <div className="w-full h-full bg-[#0B1C2D]/20 flex items-center justify-center">
              <Calendar className="w-20 h-20 text-white/5" />
            </div>
          )}
          
          {/* Layered Cinematic Depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-[#0B1C2D]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(8,145,178,0.15)_0%,transparent_70%)]"></div>
          
          {/* Subtle Luxury Grid Overlay */}
          <div className="absolute inset-0 bg-navbar-grid opacity-[0.05]"></div>
        </motion.div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-32 lg:pb-40">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-wrap items-center gap-6 mb-12">
              <span className="px-6 py-2.5 bg-[#0891B2] text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-[#0891B2]/20 flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                {(article.category as any)?.[language] || (article.category as any)?.en || 'General'}
              </span>
              
              <div className="h-4 w-[1px] bg-white/20 hidden sm:block" />
              
              <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-[0.3em]">
                <Clock className="w-3.5 h-3.5 text-[#0891B2]/60" />
                {(article.read_time as any)?.[language] || (article.read_time as any)?.en || '5 min'} Read
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif italic text-white mb-16 leading-[0.9] tracking-tighter">
              {(article.title as any)?.[language] || ''}
            </h1>
            
            <div className="flex flex-wrap items-center gap-10 pt-16 border-t border-white/10">
              <div className="flex items-center gap-5 group/author">
                <div className="w-16 h-16 rounded-3xl bg-white/5 backdrop-blur-xl flex items-center justify-center border border-white/10 transition-all duration-500 group-hover/author:bg-[#0891B2] group-hover/author:border-transparent overflow-hidden">
                   <User2 className="w-7 h-7 text-white/40 group-hover/author:text-white" />
                </div>
                <div>
                  <div className="text-[10px] text-white/30 font-bold uppercase tracking-[0.4em] mb-1.5">WRITTEN BY</div>
                  <div className="text-white text-xl font-medium tracking-wide italic font-serif">{getAuthorName()}</div>
                </div>
              </div>
              
              <div className="h-16 w-[1px] bg-white/10 hidden lg:block" />
              
              <div className="flex flex-col">
                <div className="text-[10px] text-white/30 font-bold uppercase tracking-[0.4em] mb-1.5">PUBLISHED ON</div>
                <div className="text-white text-xl font-medium tracking-wide italic font-serif">{formatDate(article.created_at)}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Editorial Body Area */}
      <section className="relative z-20 -mt-24 pb-40">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
             initial={{ opacity: 0, y: 60 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
             className="bg-white rounded-[4rem] shadow-[0_60px_120px_-30px_rgba(11,28,45,0.12)] border border-[#0B1C2D]/[0.05] overflow-hidden"
          >
            {/* Premium Editorial Header */}
            <div className="px-12 py-10 border-b border-[#0B1C2D]/[0.03] bg-[#F8FAFC]/50 flex items-center justify-between flex-wrap gap-8">
              <nav className="flex items-center gap-4 text-[10px] font-bold text-[#0B1C2D]/30 tracking-[0.3em] uppercase">
                <Link to="/" className="hover:text-[#0891B2] transition-colors">Home</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link to="/blog" className="hover:text-[#0891B2] transition-colors">Editorial</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[#0B1C2D]/60 max-w-[250px] truncate">
                   Post Insights
                </span>
              </nav>
              
              <Link 
                to="/blog" 
                className="flex items-center gap-4 text-[10px] font-bold text-[#0B1C2D] uppercase tracking-[0.4em] group"
              >
                <div className="w-10 h-10 rounded-2xl border border-[#0B1C2D]/10 flex items-center justify-center group-hover:bg-[#0B1C2D] group-hover:text-white transition-all duration-700">
                  <ArrowLeft className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                </div>
                <span>Back to Editorial</span>
              </Link>
            </div>

            <div className="p-12 md:p-24 lg:p-32">
              {/* Editorial Lead */}
              <div className="mb-24">
                <p className="text-3xl md:text-5xl font-serif text-[#0B1C2D] leading-[1.2] italic border-l-[3px] border-[#0891B2]/40 pl-16 rtl:border-l-0 rtl:border-r-[3px] rtl:pl-0 rtl:pr-16 py-4">
                  {(article.excerpt as any)?.[language] || ''}
                </p>
              </div>

              {/* Main Content Render */}
              <div 
                className="prose prose-2xl prose-slate max-w-none 
                  prose-headings:text-[#0B1C2D] prose-headings:font-serif prose-headings:italic prose-headings:font-normal prose-headings:tracking-tight 
                  prose-p:text-[#0B1C2D]/60 prose-p:font-body prose-p:leading-[1.8] prose-p:mb-12 prose-p:text-xl md:prose-p:text-2xl prose-p:font-light
                  prose-strong:text-[#0B1C2D] prose-strong:font-bold
                  prose-img:rounded-[3rem] prose-img:shadow-2xl prose-img:my-20
                  prose-a:text-[#0891B2] prose-a:font-bold prose-a:no-underline hover:prose-a:underline transition-all
                  prose-blockquote:border-none prose-blockquote:bg-[#0B1C2D]/[0.02] prose-blockquote:p-16 md:prose-blockquote:p-24 prose-blockquote:rounded-[4rem] prose-blockquote:text-4xl md:prose-blockquote:text-5xl prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-[#0B1C2D] prose-blockquote:leading-[1.1] prose-blockquote:my-24 prose-blockquote:tracking-tighter
                  prose-ul:list-disc prose-li:text-[#0B1C2D]/60 prose-li:font-body prose-li:text-xl prose-li:mb-5
                "
                dangerouslySetInnerHTML={{ __html: (article.content as any)?.[language] || '' }}
              />

              {/* Share & Editorial Footer */}
              <div className="mt-32 pt-16 border-t border-[#0B1C2D]/[0.05] flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                <div className="flex flex-wrap items-center gap-5">
                  <span className="text-[10px] font-bold text-[#0B1C2D]/20 uppercase tracking-[0.5em] mr-4">COLLECTION</span>
                  <Link to="/blog" className="px-8 py-3 rounded-full bg-[#F8FAFC] text-[#0B1C2D]/50 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#0891B2] hover:text-white transition-all duration-700">
                    {(article.category as any)?.[language] || (article.category as any)?.en || 'Aesthetics'}
                  </Link>
                  <span className="px-8 py-3 rounded-full bg-[#F8FAFC] text-[#0B1C2D]/50 text-[10px] font-bold uppercase tracking-[0.3em]">
                    Exclusive
                  </span>
                </div>

                <div className="flex items-center gap-8">
                   <span className="text-[10px] font-bold text-[#0B1C2D]/20 uppercase tracking-[0.5em]">SHARE</span>
                   <div className="flex items-center gap-4">
                     <button className="w-11 h-11 rounded-2xl bg-[#0B1C2D]/[0.02] text-[#0B1C2D]/40 flex items-center justify-center hover:bg-[#0891B2] hover:text-white transition-all duration-500">
                        <Facebook className="w-5 h-5" />
                     </button>
                     <button className="w-11 h-11 rounded-2xl bg-[#0B1C2D]/[0.02] text-[#0B1C2D]/40 flex items-center justify-center hover:bg-[#0891B2] hover:text-white transition-all duration-500">
                        <Twitter className="w-5 h-5" />
                     </button>
                     <button className="w-11 h-11 rounded-2xl bg-[#0B1C2D]/[0.02] text-[#0B1C2D]/40 flex items-center justify-center hover:bg-[#0891B2] hover:text-white transition-all duration-500">
                        <Linkedin className="w-5 h-5" />
                     </button>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Related Articles - Redesigned to match /blog */}
          {relatedArticles.length > 0 && (
            <div className="mt-40 mb-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#0891B2]">DISCOVER MORE</span>
                    <div className="w-12 h-[1px] bg-[#0B1C2D]/10"></div>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-serif italic text-[#0B1C2D] leading-none">Editorial Journey</h2>
                </div>
                <Link to="/blog" className="btn-luxury px-12 py-5 group">
                  View All Insights
                  <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                {relatedArticles.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 1.2 }}
                    className="group flex flex-col h-full"
                  >
                    <Link 
                      to={`/blog/${item.slug}`} 
                      className="relative aspect-[16/11] overflow-hidden block rounded-[2.5rem] bg-[#0B1C2D]/5 shadow-[0_30px_60px_-15px_rgba(11,28,45,0.12)] transition-transform duration-700 group-hover:-translate-y-4"
                    >
                      <img
                        src={item.media_url || (item as any).image || artBg}
                        alt={(item.title as any)?.[language] || (item.title as any)?.en || ''}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                      />
                      <div className="absolute top-8 left-8">
                        <span className="px-6 py-2.5 bg-white/95 backdrop-blur-xl text-[#0B1C2D] text-[9px] font-bold uppercase tracking-[0.2em] rounded-full shadow-xl">
                          {(item.category as any)?.[language] || (item.category as any)?.en || 'Health'}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2D]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    </Link>
                    
                    <div className="pt-10 flex flex-col flex-1 px-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[#0B1C2D]/30 uppercase tracking-[0.3em] mb-6">
                        <Calendar className="w-3.5 h-3.5 text-[#0891B2]/50" />
                        {formatDate(item.created_at)}
                      </div>
                      <h3 className="font-serif italic text-[#0B1C2D] text-3xl mb-6 leading-[1.1] tracking-tight group-hover:text-[#0891B2] transition-colors duration-500 line-clamp-2">
                        <Link to={`/blog/${item.slug}`}>{(item.title as any)?.[language] || (item.title as any)?.en || ''}</Link>
                      </h3>
                      <p className="text-base text-[#0B1C2D]/50 font-body font-light line-clamp-2 mb-10">
                        {(item.excerpt as any)?.[language] || (item.excerpt as any)?.en || ''}
                      </p>
                      <div className="mt-auto pt-8 border-t border-[#0B1C2D]/[0.05]">
                         <Link to={`/blog/${item.slug}`} className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#0891B2] flex items-center gap-2 hover:gap-4 transition-all duration-500">
                            Read Insight
                            <ArrowRight className="w-3.5 h-3.5" />
                         </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Premium Luxury Newsletter */}
      <section className="py-40 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-[#0B1C2D] p-16 md:p-32 rounded-[5rem] relative overflow-hidden shadow-[0_60px_120px_-30px_rgba(11,28,45,0.4)] text-center">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 right-0 w-[60%] h-full bg-[#0891B2]/10 blur-[150px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[40%] h-[60%] bg-[#0891B2]/5 blur-[120px] translate-y-1/2 -translate-x-1/2" />
            <div className="absolute inset-0 bg-navbar-grid opacity-[0.05]" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center px-6 py-2.5 bg-white/5 rounded-full mb-12 border border-white/10"
              >
                <Bell className="w-4 h-4 text-[#0891B2] mr-3 rtl:mr-0 rtl:ml-3" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0891B2]">Stay Informed</span>
              </motion.div>

              <h2 className="text-5xl md:text-8xl font-serif text-white mb-10 leading-[0.95] italic">
                {t('articles.newsletter.title') || 'The Editorial Feed'}
              </h2>
              <p className="text-white/50 text-xl md:text-2xl mb-16 max-w-2xl mx-auto font-body font-light leading-relaxed">
                {t('articles.newsletter.subtitle') || 'Subscribe to our medical editorial for the latest health insights and clinic updates.'}
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
                className="flex flex-col sm:flex-row gap-5 p-3 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-xl max-w-2xl mx-auto"
              >
                <input 
                  type="email" 
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Enter your email address'}
                  className="bg-transparent text-white px-10 py-6 outline-none flex-1 font-body text-lg placeholder:text-white/20 rtl:text-right"
                />
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="btn-luxury !px-16 !py-6 !text-base disabled:opacity-50"
                >
                  {isSubscribing ? 'Subscribing...' : 'Join Insight'}
                </button>
              </form>
              
              <p className="mt-12 text-white/20 text-[10px] uppercase font-bold tracking-[0.5em]">
                Privacy Assured • Bespoke Communication
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
