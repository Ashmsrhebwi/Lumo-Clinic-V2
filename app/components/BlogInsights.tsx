import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, Clock, User2, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { useDashboard } from '../context/DashboardContext';

export const BlogInsights: React.FC = () => {
  const { language, t } = useLanguage();
  const { state } = useDashboard();

  const latestBlogs = useMemo(() => {
    return [...state.blogs]
      .filter(b => b.is_active)
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .slice(0, 3);
  }, [state.blogs]);

  if (latestBlogs.length === 0) return null;

  return (
    <section className="py-40 bg-[#F8FAFC] relative overflow-hidden">
      {/* Luxury Background Texture */}
      <div className="absolute inset-0 bg-navbar-grid opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[var(--navbar-cyan)]/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Header System */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-32 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-5 mb-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#0891B2]">
                {t('blog.eyebrow') || 'Medical Insights & Aesthetics'}
              </span>
              <div className="w-12 h-[1px] bg-[#0B1C2D]/10"></div>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-body font-bold text-[#0B1C2D] leading-[0.95] tracking-tight">
              Latest from <br />
              <em className="font-serif italic font-normal text-[#0891B2]">Our Editorial</em>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:pb-3"
          >
            <Link 
              to="/articles" 
              className="btn-luxury px-12 py-5 group"
            >
              {t('blog.viewAll') || 'Explore All Articles'}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform rtl:rotate-180" />
            </Link>
          </motion.div>
        </div>

        {/* Cinematic Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {latestBlogs.map((blog, idx) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="group flex flex-col h-full"
            >
              {/* Premium Image Container */}
              <Link 
                to={`/articles/${blog.slug}`} 
                className="relative aspect-[16/11] overflow-hidden block rounded-[2.5rem] bg-[#0B1C2D]/5 shadow-[0_30px_60px_-15px_rgba(11,28,45,0.15)] transition-transform duration-700 group-hover:-translate-y-3"
              >
                <img
                  src={blog.media_url || blog.image || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800'}
                  alt={blog.title[language] || blog.title.en}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                />
                
                {/* Editorial Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2D]/60 via-[#0B1C2D]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                
                <div className="absolute top-8 left-8 z-20">
                  <span className="px-6 py-2.5 bg-white/90 backdrop-blur-xl text-[#0B1C2D] text-[9px] font-bold uppercase tracking-[0.2em] rounded-full border border-white/30 shadow-xl shadow-black/5 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-[#0891B2]" />
                    {blog.category?.[language] || blog.category?.en || 'Clinical'}
                  </span>
                </div>

                <div className="absolute bottom-8 right-8 z-20 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                  <div className="w-14 h-14 bg-[#0891B2] text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-[#0891B2]/40">
                    <ArrowRight className="w-6 h-6 rtl:rotate-180" />
                  </div>
                </div>
              </Link>
              
              {/* Content Body */}
              <div className="pt-10 flex-1 flex flex-col px-4">
                <div className="flex items-center gap-6 mb-7">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-[#0B1C2D]/30 uppercase tracking-[0.3em]">
                    <Calendar className="w-3.5 h-3.5 text-[#0891B2]/60" />
                    {blog.created_at ? new Date(blog.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                  </div>
                  <div className="w-[1px] h-3 bg-[#0B1C2D]/10"></div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-[#0B1C2D]/30 uppercase tracking-[0.3em]">
                    <Clock className="w-3.5 h-3.5 text-[#0891B2]/60" />
                    {blog.read_time?.[language] || '5 Min Read'}
                  </div>
                </div>

                <h3 className="text-3xl md:text-[2.25rem] font-serif italic text-[#0B1C2D] mb-6 leading-[1.1] tracking-tight group-hover:text-[#0891B2] transition-colors duration-500">
                  <Link to={`/articles/${blog.slug}`}>
                    {blog.title[language] || blog.title.en}
                  </Link>
                </h3>
                
                <p className="text-[#0B1C2D]/50 text-base leading-relaxed mb-10 font-body font-light line-clamp-2">
                  {blog.excerpt?.[language] || blog.excerpt?.en || 'Explore the latest advancements in medical aesthetics and bespoke patient care at Lumo Clinic.'}
                </p>

                <div className="mt-auto pt-8 border-t border-[#0B1C2D]/[0.05] flex items-center justify-between">
                  <div className="flex items-center gap-4 group/author">
                    <div className="w-11 h-11 rounded-2xl bg-[#0B1C2D]/[0.02] border border-[#0B1C2D]/[0.05] flex items-center justify-center transition-all duration-500 group-hover/author:bg-white group-hover/author:shadow-lg">
                      <User2 className="w-5 h-5 text-[#0B1C2D]/20 group-hover/author:text-[#0891B2]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-[#0B1C2D]/30 uppercase tracking-[0.3em] mb-0.5">Author</span>
                      <span className="text-xs font-bold text-[#0B1C2D]/80">
                        {blog.author?.[language] || 'Clinical Expert'}
                      </span>
                    </div>
                  </div>

                  <Link 
                    to={`/articles/${blog.slug}`} 
                    className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#0891B2] flex items-center gap-2 hover:gap-4 transition-all duration-500"
                  >
                    {language === 'ar' ? 'اقرأ المزيد' : 'Read Insight'}
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
