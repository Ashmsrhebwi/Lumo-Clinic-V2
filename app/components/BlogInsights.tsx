import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, User, Clock, Bookmark } from 'lucide-react';
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
    <section className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl text-left rtl:text-right">
            <h3 className="text-primary font-black tracking-[0.3em] uppercase mb-6 text-xs bg-primary/10 inline-block px-4 py-1 rounded-full">
              {t('blog.category') || 'Medical Insights'}
            </h3>
            <h2 className="text-4xl md:text-6xl font-black text-secondary tracking-tighter italic leading-none">
              {t('blog.title') || 'Latest from our Clinic'}
            </h2>
          </div>
          <Link 
            to="/articles" 
            className="group flex items-center gap-3 text-secondary font-black hover:text-primary transition-all duration-300 text-lg italic border-b-4 border-primary/20 hover:border-primary pb-1"
          >
            {t('blog.viewAll') || 'Explore All Articles'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {latestBlogs.map((blog, idx) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group flex flex-col h-full bg-[#FAF9F6] rounded-[3rem] overflow-hidden border border-secondary/5 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/5"
            >
              <Link to={`/articles/${blog.slug}`} className="relative aspect-[16/10] overflow-hidden block">
                <img
                  src={blog.media_url || blog.image || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800'}
                  alt={blog.title[language] || blog.title.en}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-secondary text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl">
                    {blog.category?.[language] || blog.category?.en || 'Health'}
                  </span>
                </div>
              </Link>
              
              <div className="p-10 flex-1 flex flex-col">
                <div className="flex items-center gap-6 mb-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-primary" />
                    {blog.created_at ? new Date(blog.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { month: 'long', day: 'numeric' }) : 'Recently'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-primary" />
                    {blog.read_time?.[language] || '5 min'}
                  </div>
                </div>

                <h3 className="text-2xl font-black text-secondary mb-6 group-hover:text-primary transition-colors leading-tight italic">
                  <Link to={`/articles/${blog.slug}`}>
                    {blog.title[language] || blog.title.en}
                  </Link>
                </h3>
                
                <p className="text-secondary/70 line-clamp-2 mb-8 font-medium leading-relaxed">
                  {blog.excerpt?.[language] || blog.excerpt?.en}
                </p>

                <div className="mt-auto pt-8 border-t border-secondary/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest">
                      {blog.author?.[language] || 'Gravity Expert'}
                    </span>
                  </div>
                  <Link to={`/articles/${blog.slug}`} className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all transform group-hover:rotate-12">
                    <ArrowRight className="w-5 h-5 rtl:rotate-180" />
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
