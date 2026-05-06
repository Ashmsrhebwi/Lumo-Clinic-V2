import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'motion/react';
import { Save, RefreshCcw, Palette, Type, Layout, Radius, Layers, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { 
  DashboardCard, 
  DashboardInput, 
  DashboardButton, 
  SectionHeader 
} from './UI';

export function SettingsManager() {
  const { state, updateSettings } = useDashboard();
  const { t } = useLanguage();
  const [settings, setSettings] = useState(state.settings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    updateSettings(settings);
    setIsSaving(false);
    toast.success(t('dashboard.settings.saved'));
  };

  const handleReset = () => {
    setSettings(state.settings);
    toast.info(t('dashboard.settings.reset'));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <SectionHeader 
        title={t('dashboard.settings.title')} 
        description={t('dashboard.settings.desc')}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-7 space-y-8">
          <DashboardCard>
            <div className="space-y-10">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Palette className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-secondary">{t('dashboard.settings.palette')}</h3>
                    <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">{t('dashboard.settings.core_tokens')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <DashboardInput
                      label={t('dashboard.settings.primary_hex')}
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      icon={Layers}
                    />
                    <div 
                      className="w-full h-12 rounded-xl shadow-inner border border-secondary/5"
                      style={{ backgroundColor: settings.primaryColor }}
                    />
                  </div>
                  <div className="space-y-4">
                    <DashboardInput
                      label={t('dashboard.settings.secondary_hex')}
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                      icon={Layers}
                    />
                    <div 
                      className="w-full h-12 rounded-xl shadow-inner border border-secondary/5"
                      style={{ backgroundColor: settings.secondaryColor }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-secondary/5 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Type className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-secondary">{t('dashboard.settings.typo_ui')}</h3>
                    <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">{t('dashboard.settings.base_fmt')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <DashboardInput
                    label={t('dashboard.settings.font_family')}
                    value={settings.fontFamily}
                    onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                    placeholder="e.g. Inter, Roboto"
                    icon={Type}
                  />
                  <DashboardInput
                    label={t('dashboard.settings.radius')}
                    value={settings.buttonRadius}
                    onChange={(e) => setSettings({ ...settings, buttonRadius: e.target.value })}
                    placeholder="e.g. 1rem, 24px"
                    icon={Radius}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <DashboardButton
                  onClick={handleSave}
                  loading={isSaving}
                  className="flex-1"
                  icon={Save}
                  size="lg"
                >
                  {t('dashboard.settings.publish')}
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

        <div className="xl:col-span-5">
           <DashboardCard variant="dark" className="sticky top-8 overflow-hidden h-full flex flex-col justify-between h-[450px]">
              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{t('dashboard.settings.preview')}</h3>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">{t('dashboard.settings.stylesheet')}</p>
                  </div>
                </div>

                <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all bg-primary" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-3/4 bg-white/20 rounded-full" />
                      <div className="h-3 w-1/2 bg-white/10 rounded-full" />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      className="px-6 py-3 font-bold text-xs uppercase tracking-widest text-white transition-all shadow-xl"
                      style={{ backgroundColor: settings.primaryColor, borderRadius: settings.buttonRadius }}
                    >
                      {t('dashboard.settings.primary_cta')}
                    </button>
                    <button 
                      className="px-6 py-3 font-bold text-xs uppercase tracking-widest border-2 transition-all"
                      style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: settings.buttonRadius }}
                    >
                      {t('dashboard.settings.outline')}
                    </button>
                  </div>

                  <p className="text-white/40 text-sm leading-relaxed" style={{ fontFamily: settings.fontFamily }}>
                    {t('dashboard.settings.preview_text')}
                  </p>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-white/5 flex flex-col items-center">
                <p className="text-center text-xs text-white/20 leading-relaxed max-w-[280px]">
                  {t('dashboard.settings.contrast_hint')}
                </p>
              </div>
           </DashboardCard>
        </div>
      </div>
    </div>
  );
}
