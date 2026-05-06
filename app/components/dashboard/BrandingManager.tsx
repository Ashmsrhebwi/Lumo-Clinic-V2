import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { clinicService } from '../../services/clinicService';
import { useLanguage } from '../../context/LanguageContext';
import { DashboardInput, DashboardButton, LanguageTabs } from './UI';
import { Upload, Save, X, Trash2, Layout, Type, Image as ImageIcon, CheckCircle2, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { LanguageCode } from '../../context/DashboardContext';

export function BrandingManager() {
  const { state, updateBranding } = useDashboard();
  const { t } = useLanguage();
  const [activeLang, setActiveLang] = useState<LanguageCode>('en');
  const branding = state.branding;

  const handleNameChange = (val: string) => {
    updateBranding({
      name: {
        ...branding.name,
        [activeLang]: val
      }
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await clinicService.uploadMedia(file) as any;
      // API returns { id, full_url } — support both shapes
      const url = response?.full_url || response?.url || response?.data?.full_url || response?.data?.url;
      if (url) {
        updateBranding({ logo: url });
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const triggerUpload = () => {
    document.getElementById('logo-upload-input')?.click();
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Layout className="w-6 h-6 text-primary" />
             </div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t('dashboard.branding.title')}</h2>
          </div>
          <p className="text-slate-500 max-w-2xl font-medium leading-relaxed">
            {t('dashboard.branding.desc')}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <DashboardButton variant="secondary" icon={X}>{t('dashboard.discard')}</DashboardButton>
           <DashboardButton variant="primary" icon={Save}>{t('dashboard.publish')}</DashboardButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Identity Card */}
          <section className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full translate-x-1/2 -translate-y-1/2 transition-colors group-hover:bg-primary/10" />
            
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                     <Type className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{t('dashboard.branding.general')}</h3>
               </div>
               <LanguageTabs activeLang={activeLang} onLangChange={setActiveLang} />
            </div>
            
            <div className="space-y-8">
              <DashboardInput
                label={`${t('dashboard.branding.name')} (${activeLang.toUpperCase()})`}
                value={typeof branding.name === 'object' ? (branding.name[activeLang] || '') : (branding.name || '')}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Gravity Clinic"
                icon={Type}
              />

              <div className="space-y-4">
                <label className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  {t('dashboard.branding.logo')}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="file"
                    id="logo-upload-input"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                  <div 
                    onClick={triggerUpload}
                    className="relative group/upload h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-4 transition-all hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden"
                  >
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover/upload:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-slate-400 group-hover/upload:text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-700">{t('dashboard.branding.upload')}</p>
                      <p className="text-xs text-slate-400 mt-1">{t('dashboard.branding.hint')}</p>
                    </div>
                  </div>
                  
                  <div className="h-48 bg-slate-900 rounded-3xl p-8 flex flex-col justify-between relative group/preview">
                    <div className="absolute top-4 right-4 opacity-0 group-hover/preview:opacity-100 transition-opacity">
                       <button className="p-2 bg-white/10 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      {branding.logo ? (
                        <img src={branding.logo} alt="Logo" className="max-h-16 w-auto" />
                      ) : (
                        <div className="text-center space-y-2">
                          <ImageIcon className="w-8 h-8 text-white/10 mx-auto" />
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{t('dashboard.branding.preview')}</p>
                        </div>
                      )}
                    </div>
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                       <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{t('dashboard.branding.navbar_view')}</span>
                       <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Live Preview Column */}
        <div className="space-y-6">
           <div className="bg-slate-900 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group min-h-[400px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 transition-all group-hover:bg-primary/20" />
              
              <div className="relative space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                       <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{t('dashboard.branding.realtime')}</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                 </div>

                 <div className="space-y-2">
                    <h4 className="text-xl font-bold text-white tracking-tight">{t('dashboard.branding.preview')}</h4>
                    <p className="text-xs text-white/40 leading-relaxed font-bold">
                       {t('dashboard.branding.preview_desc')}
                    </p>
                 </div>

                 <div className="mt-12 p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md overflow-hidden">
                    <div className="bg-white/5 p-4 rounded-xl flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center p-1.5 shadow-lg shadow-primary/20">
                             <img src={branding.logo} className="w-full h-full object-contain invert" alt="" />
                          </div>
                          <span className="font-black text-xs text-white uppercase tracking-tighter">{branding.name[activeLang] || 'Gravity Clinic'}</span>
                       </div>
                       <div className="flex gap-4">
                          <div className="h-1.5 w-8 bg-white/10 rounded-full" />
                          <div className="h-1.5 w-8 bg-white/10 rounded-full" />
                       </div>
                    </div>
                 </div>

                 <div className="mt-8 space-y-4">
                    <div className="flex justify-between text-[10px] font-black text-white/20 uppercase tracking-widest border-b border-white/5 pb-2">
                       <span>{t('dashboard.branding.score')}</span>
                       <span className="text-primary">94%</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-white/20 uppercase tracking-widest border-b border-white/5 pb-2">
                       <span>{t('dashboard.branding.seo_opt')}</span>
                       <span className="text-green-500">{t('dashboard.branding.ready')}</span>
                    </div>
                 </div>
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                 <button className="w-full py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                    {t('dashboard.save')}
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
