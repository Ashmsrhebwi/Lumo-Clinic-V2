import React, { useState } from 'react';
import { useDashboard, LanguageCode } from '../../context/DashboardContext';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';
import { Save, RefreshCcw, Search, Globe, Image as ImageIcon, Share2, Type } from 'lucide-react';
import { toast } from 'sonner';
import { 
  DashboardCard, 
  DashboardInput, 
  DashboardButton, 
  SectionHeader,
  StatusBadge,
  LanguageTabs
} from './UI';

export function SEOManager() {
  const { state, updateSEO } = useDashboard();
  const { t } = useLanguage();
  const [seo, setSeo] = useState(state.seo);
  const [activeLang, setActiveLang] = useState<LanguageCode>('en');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    updateSEO(seo);
    setIsSaving(false);
    toast.success(t('dashboard.seo.save'));
  };

  const handleReset = () => {
    setSeo(state.seo);
    toast.info(t('dashboard.discarded'));
  };

  const handleTextChange = (field: 'title' | 'description', val: string) => {
    setSeo({
      ...seo,
      [field]: {
        ...seo[field],
        [activeLang]: val
      }
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <SectionHeader 
        title={t('dashboard.seo.title')} 
        description={t('dashboard.seo.desc')}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-7 space-y-8">
          <DashboardCard>
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-secondary">{t('dashboard.seo.metadata')}</h3>
                    <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">{t('dashboard.seo.general')}</p>
                  </div>
                </div>
                <LanguageTabs activeLang={activeLang} onLangChange={setActiveLang} />
              </div>

              <div className="space-y-8">
                <DashboardInput
                  label={`${t('dashboard.seo.meta_title')} (${activeLang.toUpperCase()})`}
                  value={seo.title[activeLang]}
                  onChange={(e) => handleTextChange('title', e.target.value)}
                  placeholder="e.g. Gravity Clinic"
                  icon={Type}
                />

                <div className="space-y-3">
                  <label className="text-sm font-bold text-secondary/60 ml-1">{t('dashboard.seo.meta_desc')} ({activeLang.toUpperCase()})</label>
                  <textarea
                    value={seo.description[activeLang]}
                    onChange={(e) => handleTextChange('description', e.target.value)}
                    className="w-full bg-secondary/5 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl p-6 text-secondary font-semibold outline-none transition-all placeholder:text-secondary/20 min-h-[120px] resize-none"
                    placeholder="e.g. Premium medical tourism in Istanbul..."
                  />
                </div>

                <DashboardInput
                  label={t('dashboard.seo.og_image')}
                  value={seo.ogImage}
                  onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                  placeholder="Image URL for social previews"
                  icon={ImageIcon}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <DashboardButton
                  onClick={handleSave}
                  loading={isSaving}
                  className="flex-1"
                  icon={Save}
                  size="lg"
                >
                  {t('dashboard.seo.save')}
                </DashboardButton>
                <DashboardButton
                  onClick={handleReset}
                  variant="outline"
                  icon={RefreshCcw}
                  size="lg"
                  className="sm:w-20 sm:!px-0"
                />
              </div>
            </div>
          </DashboardCard>
        </div>

        <div className="xl:col-span-5 space-y-8">
           <DashboardCard variant="white" className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                 <Search className="w-5 h-5 text-primary" />
                 <h4 className="font-bold text-secondary text-sm italic">{t('dashboard.seo.google_preview')}</h4>
              </div>
              <div className="space-y-2 p-6 bg-[#F8F9FF] rounded-3xl border border-secondary/5">
                <p className="text-[#1A0DAB] text-xl font-medium hover:underline cursor-pointer">{seo.title[activeLang]} | Premium Clinic</p>
                <p className="text-[#006621] text-sm mb-1 truncate">https://gravity.clinic › home</p>
                <p className="text-[#4D5156] text-sm leading-relaxed line-clamp-2">
                  {seo.description[activeLang]}
                </p>
              </div>
           </DashboardCard>

           <DashboardCard variant="dark" className="overflow-hidden !p-0">
             <div className="p-6 border-b border-white/5 flex items-center gap-3">
                <Share2 className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-sm">{t('dashboard.seo.social_preview')}</h4>
             </div>
             <div className="aspect-[1.91/1] w-full bg-black/40 relative">
                <img src={seo.ogImage} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black to-transparent">
                   <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">gravity.clinic</p>
                   <p className="text-white font-bold text-lg line-clamp-1">{seo.title[activeLang]}</p>
                </div>
             </div>
           </DashboardCard>
        </div>
      </div>
    </div>
  );
}
