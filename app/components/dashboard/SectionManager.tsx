import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useDashboard, LanguageCode } from '../../context/DashboardContext';
import { SectionHeader, DashboardInput, DashboardButton, LanguageTabs } from './UI';
import { Save, Layout, Upload, Trash2 } from 'lucide-react';
import { clinicService } from '../../services/clinicService';
import { toast } from 'sonner';

const SECTION_LABELS: Record<string, string> = {
  'home.treatments': 'Home Treatments',
  'home.cta': 'Home Call to Action',
  'home.whyChooseUs': 'Why Choose Us',
  'home.testimonials': 'Home Testimonials',
  'home.stats': 'Home Statistics',
  'home.process': 'Home Our Process',
  'home.results': 'Patient Results Section',
  'articles.hero': 'Blog Page Hero'
};

const IMAGE_SUPPORTED_SECTIONS = [
  'articles.hero',
  'hair.hero',
  'hair.cta',
  'dental.hero',
  'dental.cta',
  'contact.hero',
  'booking.hero',
  'about.contact',
  'about.appointment'
];

export const SectionManager: React.FC = () => {
  const { t, language } = useLanguage();
  const { state, updateSection } = useDashboard();
  const [activeTab, setActiveTab] = useState(Object.keys(state.sections)[0] || 'home.treatments');
  const [editLang, setEditLang] = useState<LanguageCode>(language as LanguageCode);
  const [localSectionData, setLocalSectionData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const supportsImage = IMAGE_SUPPORTED_SECTIONS.includes(activeTab);

  // Sync local data when the section tab changes or the language changes or global state changes initially
  React.useEffect(() => {
    if (state.sections[activeTab]) {
      setLocalSectionData(state.sections[activeTab]);
    }
  }, [activeTab, state.sections]);

  const handleLocalUpdate = (field: 'title' | 'subtitle', value: string) => {
    if (!localSectionData) return;
    const updatedValue = { ...(localSectionData[field] || {}), [editLang]: value };
    setLocalSectionData({ ...localSectionData, [field]: updatedValue });
  };

  const handleSave = async () => {
    if (!localSectionData) return;
    setIsSaving(true);
    try {
      await updateSection(activeTab, localSectionData);
      toast.success(t('dashboard.saved'));
    } catch (err) {
      toast.error('Failed to save section');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await clinicService.uploadMedia(file) as any;
      const url = response?.full_url || response?.url || response?.data?.full_url;
      if (!url) throw new Error('No URL returned from server');
      
      setLocalSectionData({ ...localSectionData, image: url, media_url: url });
      toast.success('Section image uploaded');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title={t('dashboard.sections')} 
        description={t('dashboard.sections.desc')}
      />

      <div className="flex flex-wrap gap-2 pb-2 border-b border-white/5">
        {Object.keys(state.sections).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
              activeTab === key 
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                : 'text-secondary/80 bg-secondary/5 border-secondary/10 hover:bg-primary/10 hover:text-primary'
            }`}
          >
            {SECTION_LABELS[key] || key.split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      {localSectionData && (
        <div className="bg-white/5 rounded-[2rem] p-8 border border-white/10 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Layout className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {SECTION_LABELS[activeTab] || activeTab}
                </h3>
                <p className="text-xs font-medium text-white/30 uppercase tracking-[0.2em]">{t('dashboard.sections.manage')}</p>
              </div>
            </div>
            <LanguageTabs activeLang={editLang} onLangChange={(lang: LanguageCode) => setEditLang(lang)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 px-1">
                {t('dashboard.sections.title')} ({editLang.toUpperCase()})
              </label>
              <DashboardInput
                value={localSectionData.title?.[editLang] || ''}
                onChange={(e: any) => handleLocalUpdate('title', e.target.value)}
                placeholder="Enter section title"
                className="!py-5 !rounded-2xl"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 px-1">
                {t('dashboard.sections.subtitle')} ({editLang.toUpperCase()})
              </label>
              <DashboardInput
                value={localSectionData.subtitle?.[editLang] || ''}
                onChange={(e: any) => handleLocalUpdate('subtitle', e.target.value)}
                placeholder="Enter section subtitle"
                className="!py-5 !rounded-2xl"
              />
            </div>
          </div>

          {supportsImage && (
            <div className="space-y-3 animate-in fade-in zoom-in-95 duration-500">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 px-1">
                Section Background / Hero Image
              </label>
              <div className="flex gap-4">
                <div className="relative flex-1 group">
                  <div className={`
                    w-full h-32 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center overflow-hidden
                    ${localSectionData.image || localSectionData.media_url ? 'border-primary/20 bg-primary/5' : 'border-white/10 bg-white/5'}
                  `}>
                    {localSectionData.image || localSectionData.media_url ? (
                      <img 
                        src={localSectionData.image || localSectionData.media_url} 
                        className="w-full h-full object-cover" 
                        alt="Section Preview"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-white/20">
                        <Upload className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">No Image Set</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-48">
                  <input 
                    type="file" 
                    id="section-image-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <DashboardButton
                    variant="outline"
                    onClick={() => document.getElementById('section-image-upload')?.click()}
                    loading={isUploading}
                    icon={Upload}
                    className="w-full justify-center !text-[10px]"
                  >
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </DashboardButton>
                  {(localSectionData.image || localSectionData.media_url) && (
                    <DashboardButton
                      variant="outline"
                      onClick={() => setLocalSectionData({ ...localSectionData, image: null, media_url: null })}
                      icon={Trash2}
                      className="w-full justify-center !text-[10px] !text-red-400 !border-red-400/20 hover:!bg-red-400/10"
                    >
                      Remove
                    </DashboardButton>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="pt-8 border-t border-white/5 flex justify-end items-center gap-4">
             <p className="text-xs text-white/20 italic font-medium">Changes are not saved until you click the button</p>
             <DashboardButton 
              variant="primary" 
              onClick={handleSave}
              icon={Save}
              loading={isSaving}
              size="lg"
            >
              {t('dashboard.save')}
            </DashboardButton>
          </div>
        </div>
      )}
    </div>
  );
};
