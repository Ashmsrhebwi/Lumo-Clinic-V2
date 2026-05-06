import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { useLanguage } from '../../context/LanguageContext';
import { clinicService } from '../../services/clinicService';
import { motion } from 'motion/react';
import { Save, RefreshCcw, Video, Type, MousePointer2, Eye, EyeOff, Upload, Trash2, Youtube } from 'lucide-react';
import { toast } from 'sonner';
import { 
  DashboardCard, 
  DashboardInput, 
  DashboardButton, 
  SectionHeader,
  LanguageTabs
} from './UI';
import { LanguageCode } from '../../context/DashboardContext';

export function HeroManager() {
  const { state, updateHero } = useDashboard();
  const { t } = useLanguage();
  const [hero, setHero] = useState<any>(state.hero);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeLang, setActiveLang] = useState<LanguageCode>('en');

  // Keep local form in sync with global context (essential for refresh/save reliability)
  React.useEffect(() => {
    if (!isSaving) {
      setHero(state.hero);
    }
  }, [state.hero, isSaving]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateHero(hero);
      toast.success(t('dashboard.hero.updated'));
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to update hero');
      setHero(state.hero); // Revert
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setHero(state.hero);
    toast.info(t('dashboard.discarded'));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await clinicService.uploadMedia(file) as any;
      const url = response?.full_url || response?.url || response?.data?.full_url;
      if (!url) throw new Error('No URL returned from server');

      const isVideo = file.type.startsWith('video/');
      if (isVideo) {
        // Explicitly clear others for mutual exclusivity
        setHero({ ...hero, videoUrl: url, youtubeUrl: null, image: null });
        toast.success('Device video uploaded');
      } else {
        // Explicitly clear others for mutual exclusivity
        setHero({ ...hero, image: url, videoUrl: null, youtubeUrl: null });
        toast.success('Background image uploaded');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerUpload = () => {
    document.getElementById('hero-image-upload')?.click();
  };

  // Helper to extract YouTube ID
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = getYoutubeId(hero.youtubeUrl || '');

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <SectionHeader 
          title={t('dashboard.hero.title')} 
          description={t('dashboard.hero.desc')}
        />
        <div className="mb-0">
          <LanguageTabs activeLang={activeLang} onLangChange={setActiveLang} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-7 space-y-8">
          <DashboardCard>
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DashboardInput
                    label="YouTube Video URL"
                    value={hero?.youtubeUrl ?? ''}
                    onChange={(e) => setHero({ ...hero, youtubeUrl: e.target.value, videoUrl: null, image: null })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    icon={Youtube}
                  />
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black text-secondary/40 uppercase tracking-widest flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5" />
                      Background Image / Video
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="file" 
                        id="hero-image-upload" 
                        className="hidden" 
                        accept="image/*,video/mp4,video/webm,video/mov,video/quicktime"
                        onChange={handleImageUpload}
                      />
                      <button 
                        onClick={triggerUpload}
                        disabled={isUploading}
                        className="flex-1 px-4 py-2.5 bg-secondary/5 hover:bg-primary/10 text-secondary hover:text-primary rounded-xl border border-dashed border-secondary/20 hover:border-primary/50 transition-all font-bold text-xs flex items-center justify-center gap-2"
                      >
                        {isUploading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {(hero.image || hero.videoUrl) ? 'Change Media' : 'Upload Image / Video'}
                      </button>
                      {(hero.image || hero.videoUrl) && (
                         <button 
                          onClick={() => setHero({...hero, image: '', videoUrl: ''})}
                          className="px-3 py-2.5 bg-red-500/5 hover:bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 transition-all"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                      )}
                    </div>
                    {hero?.videoUrl && (
                      <p className="text-[10px] text-green-600 font-bold mt-1">✓ Device video uploaded</p>
                    )}
                    {hero?.image && !hero?.videoUrl && (
                      <p className="text-[10px] text-primary font-bold mt-1">✓ Background image selected</p>
                    )}
                  </div>
                </div>

                <div className="h-px bg-secondary/5" />

                <DashboardInput
                  label={`${t('dashboard.hero.title_label')} (${activeLang.toUpperCase()})`}
                  value={hero?.title?.[activeLang] || ''}
                  onChange={(e) => setHero({ 
                    ...hero, 
                    title: { ...(hero?.title || {}), [activeLang]: e.target.value || '' } 
                  })}
                  placeholder="Main headline"
                  icon={Type}
                />

                <DashboardInput
                  label={`${t('dashboard.hero.subheader_label')} (${activeLang.toUpperCase()})`}
                  value={hero?.subheader?.[activeLang] || ''}
                  onChange={(e) => setHero({ 
                    ...hero, 
                    subheader: { ...(hero?.subheader || {}), [activeLang]: e.target.value || '' } 
                  })}
                  placeholder="Small text above title"
                  icon={Type}
                />

                <DashboardInput
                  label={`${t('dashboard.hero.subtitle_label')} (${activeLang.toUpperCase()})`}
                  value={hero?.subtitle?.[activeLang] || ''}
                  onChange={(e) => setHero({ 
                    ...hero, 
                    subtitle: { ...(hero?.subtitle || {}), [activeLang]: e.target.value || '' } 
                  })}
                  placeholder="Description text below title"
                  icon={Type}
                />

                <div className="grid grid-cols-1 gap-6">
                  {/* Primary Button removed per request for cleaner layout */}
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
                  {t('dashboard.hero.publish')}
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

        {/* Preview aspect */}
        <div className="xl:col-span-5 h-full">
          <DashboardCard variant="dark" className="sticky top-8 overflow-hidden !p-0 border-none aspect-video flex flex-col h-[400px]">
            <div className="relative flex-1 bg-black">
              {youtubeId ? (
                <iframe
                  className="absolute inset-0 w-full h-full opacity-60"
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}`}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : hero?.videoUrl ? (
                <video 
                  src={hero.videoUrl} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                  key={hero.videoUrl}
                />
              ) : hero?.image ? (
                <img 
                  src={hero.image} 
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                  alt="Hero Background"
                  key={hero.image}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-secondary to-black flex items-center justify-center">
                   <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">No media selected</p>
                </div>
              )}
              
              <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-8 space-y-4">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">{hero.subheader?.[activeLang] ?? ''}</p>
                <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow-lg">{hero.title?.[activeLang] ?? ''}</h3>
                <p className="text-sm text-white/80 font-medium max-w-[280px]">{hero.subtitle?.[activeLang] ?? ''}</p>
                <div className="flex gap-4 pt-4">
                  {/* Primary button hidden in all states */}
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-secondary to-transparent" />
            </div>
            <div className="p-6 bg-secondary/80 backdrop-blur-md border-t border-white/5">
               <h4 className="font-bold text-sm mb-1 italic">Desktop Live Preview</h4>
               <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Showing current changes in {activeLang.toUpperCase()}</p>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
