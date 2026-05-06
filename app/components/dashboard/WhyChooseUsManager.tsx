import React, { useState, useEffect } from 'react';
import { useDashboard, LanguageCode } from '../../context/DashboardContext';
import { useLanguage } from '../../context/LanguageContext';
import { SectionHeader, DashboardCard, DashboardInput, DashboardButton, LanguageTabs } from './UI';
import { Save, Award, Building2, Paintbrush, Package, HelpCircle, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const ICON_MAP: Record<string, any> = {
  Award,
  Building2,
  Paintbrush,
  Package,
  HelpCircle
};

export const WhyChooseUsManager: React.FC = () => {
  const { t, language } = useLanguage();
  const { state, updateWhyChooseUsFeatures } = useDashboard();
  
  // Use a local state that doesn't blindly sync with global state after initial mount
  const [features, setFeatures] = useState<any[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editLang, setEditLang] = useState<LanguageCode>(language as LanguageCode);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize features once when global state is available
  useEffect(() => {
    if (state.whyChooseUsFeatures && state.whyChooseUsFeatures.length > 0 && features.length === 0 && !hasUnsavedChanges) {
      setFeatures(JSON.parse(JSON.stringify(state.whyChooseUsFeatures)));
    }
  }, [state.whyChooseUsFeatures, features.length, hasUnsavedChanges]);

  const handleUpdate = (index: number, field: string, value: string) => {
    setFeatures(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      if (!updated[index]) return prev;

      if (field === 'icon') {
        updated[index].icon = value;
      } else {
        // Ensure field exists as an object
        if (!updated[index][field] || typeof updated[index][field] !== 'object') {
          updated[index][field] = { en: '', ar: '', fr: '', ru: '' };
        }
        updated[index][field][editLang] = value;
      }
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  const addFeature = () => {
    const newFeature = {
      icon: 'Award',
      title: { en: 'New Feature', ar: '', fr: '', ru: '' },
      desc: { en: '', ar: '', fr: '', ru: '' }
    };
    setFeatures(prev => [...prev, newFeature]);
    setHasUnsavedChanges(true);
  };

  const deleteFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Ensure the structure is perfectly preserved before sending
      const payload = features.map(f => ({
        icon: f.icon || 'Award',
        title: f.title || { en: '', ar: '', fr: '', ru: '' },
        desc: f.desc || { en: '', ar: '', fr: '', ru: '' }
      }));
      
      await updateWhyChooseUsFeatures(payload);
      setHasUnsavedChanges(false);
      toast.success(t('dashboard.saved'));
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Failed to save features');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <SectionHeader 
          title="Why Choose Us Features" 
          description="Manage the features displayed in the Why Choose Us section on the homepage."
        />
        <div className="flex items-center gap-4">
          <DashboardButton
            variant="secondary"
            onClick={addFeature}
            icon={Plus}
          >
            Add Feature
          </DashboardButton>
          <LanguageTabs activeLang={editLang} onLangChange={setEditLang} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, idx) => {
          const Icon = ICON_MAP[feature.icon] || HelpCircle;
          return (
            <DashboardCard key={idx} className="space-y-6 group relative">
              <button
                onClick={() => deleteFeature(idx)}
                className="absolute top-4 right-4 p-2 text-red-500/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                title="Delete Feature"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 border-b border-secondary/5 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-secondary text-lg">Feature {idx + 1}</h3>
                  <select 
                    value={feature.icon}
                    onChange={(e) => handleUpdate(idx, 'icon', e.target.value)}
                    className="text-xs bg-secondary/5 border-none rounded-lg px-2 py-1 outline-none text-secondary/60 hover:text-primary transition-colors mt-1 pointer-events-auto"
                  >
                    {Object.keys(ICON_MAP).map(key => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-secondary/40 uppercase tracking-widest px-1">Title ({editLang.toUpperCase()})</label>
                  <DashboardInput
                    value={feature.title?.[editLang] || ''}
                    onChange={(e) => handleUpdate(idx, 'title', e.target.value)}
                    placeholder="Enter feature title"
                    className="!py-4 !rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-secondary/40 uppercase tracking-widest px-1">Description ({editLang.toUpperCase()})</label>
                  <textarea
                    value={feature.desc?.[editLang] || ''}
                    onChange={(e) => handleUpdate(idx, 'desc', e.target.value)}
                    className="w-full px-4 py-3 bg-secondary/5 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none min-h-[100px] text-sm text-secondary resize-none"
                    placeholder="Enter feature description"
                  />
                </div>
              </div>
            </DashboardCard>
          );
        })}
        {features.length === 0 && (
          <div className="col-span-full py-20 text-center bg-secondary/5 rounded-[3rem] border-2 border-dashed border-secondary/10">
            <HelpCircle className="w-12 h-12 text-secondary/20 mx-auto mb-4" />
            <h3 className="text-secondary/40 font-bold italic">No features added yet. Click "Add Feature" to start.</h3>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4 gap-4 items-center">
        {hasUnsavedChanges && (
          <p className="text-xs text-primary italic font-bold animate-pulse">You have unsaved changes</p>
        )}
        <DashboardButton 
          variant="primary" 
          onClick={handleSave}
          icon={Save}
          loading={isSaving}
          className="shadow-xl"
          disabled={!hasUnsavedChanges && features.length > 0}
        >
          {t('dashboard.save')}
        </DashboardButton>
      </div>
    </div>
  );
};
