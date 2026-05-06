import { useDashboard } from '../../context/DashboardContext';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'motion/react';
import { Image as ImageIcon, Search, Copy, ExternalLink, Filter, Grid, List as ListIcon } from 'lucide-react';
import { toast } from 'sonner';
import { 
  DashboardCard, 
  DashboardInput, 
  SectionHeader,
  StatusBadge
} from './UI';

export function MediaManager() {
  const { state } = useDashboard();
  const { t } = useLanguage();
  
  // Extract all images from state for a central repository
  const images = new Set<string>();
  if (state.branding.logo) images.add(state.branding.logo);
  state.treatments.forEach(t => images.add(t.image));
  state.results.forEach(r => {
    images.add(r.beforeImage);
    images.add(r.afterImage);
  });
  state.testimonials.forEach(t => images.add(t.image));
  if (state.seo.ogImage) images.add(state.seo.ogImage);

  const imageList = Array.from(images);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success(t('dashboard.media.copy_url') + ' ' + t('dashboard.treatments.success'));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <SectionHeader 
        title={t('dashboard.media.title')} 
        description={t('dashboard.media.desc')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <DashboardCard className="!p-0 overflow-hidden">
          <div className="p-8 border-b border-secondary/5 bg-secondary/[0.02] flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-secondary text-xl">{t('dashboard.media.repository')}</h3>
                  <div className="flex items-center gap-2">
                    <StatusBadge variant="success">{imageList.length} {t('dashboard.media.assets')}</StatusBadge>
                    <StatusBadge variant="neutral">{t('dashboard.media.storage')}: 2.4 MB</StatusBadge>
                  </div>
                </div>
             </div>

             <div className="flex items-center gap-3 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/30" />
                 <input 
                   disabled
                   placeholder={t('dashboard.media.filter')}
                   className="w-full bg-white border border-secondary/10 rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium outline-none focus:border-primary/40 transition-all opacity-50 cursor-not-allowed"
                 />
               </div>
               <div className="flex bg-white border border-secondary/10 rounded-xl p-1 shrink-0">
                  <button className="p-2 bg-secondary/5 text-primary rounded-lg transition-all">
                    <Grid className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-secondary/20 hover:text-secondary/40 transition-all">
                    <ListIcon className="w-4 h-4" />
                  </button>
               </div>
             </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {imageList.map((url, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative"
                >
                  <div className="aspect-square rounded-3xl overflow-hidden bg-secondary/5 border border-secondary/5 group-hover:border-primary/40 transition-all shadow-sm group-hover:shadow-xl group-hover:shadow-primary/5">
                    <img 
                      src={url} 
                      alt={`Asset ${i}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    <div className="absolute inset-0 bg-secondary/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                      <button 
                        onClick={() => copyToClipboard(url)}
                        className="p-3 bg-white rounded-2xl text-secondary hover:bg-primary hover:text-white transition-all transform hover:scale-110"
                        title={t('dashboard.media.copy_url')}
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-white/10 border border-white/20 rounded-2xl text-white hover:bg-white hover:text-secondary transition-all transform hover:scale-110"
                        title={t('dashboard.media.view_orig')}
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                  <div className="mt-3 px-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary/30 truncate">
                      {url.includes('data:') ? 'DATA IMAGE' : url.split('/').pop()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="p-10 bg-secondary/[0.02] border-t border-secondary/5 flex items-center justify-between">
             <p className="text-xs font-bold text-secondary/40 flex items-center gap-2 underline decoration-primary/30 decoration-2 underline-offset-4">
               <Filter className="w-3.5 h-3.5" />
               {t('dashboard.media.showing_all')}
             </p>
             <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:tracking-[0.2em] transition-all">
               {t('dashboard.media.reload')}
             </button>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
