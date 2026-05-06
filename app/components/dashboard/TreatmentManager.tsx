import React, { useState } from 'react';
import { useDashboard, Treatment } from '../../context/DashboardContext';
import { useLanguage } from '../../context/LanguageContext';
import { clinicService } from '../../services/clinicService';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Stethoscope, 
  Clock, 
  Upload,
  Filter,
  Save,
  X,
  RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { 
  DashboardCard, 
  DashboardInput, 
  DashboardButton,
  SectionHeader,
  StatusBadge,
  LanguageTabs
} from './UI';
import { LanguageCode } from '../../context/DashboardContext';

// Normalize frontend treatment data to backend field names
function toBackendPayload(t: any) {
  const ml = { en: '', ar: '', fr: '', ru: '' };
  
  return {
    title: t.title || ml,
    description: t.description || ml,
    category: t.category || ml,
    duration: t.duration || ml,
    features: t.features || ml,
    content_sections: Array.isArray(t.content_sections) ? t.content_sections.map((s: any) => ({
      title: s.title || ml,
      subtitle: s.subtitle || ml,
      description: s.description || ml,
      image: s.image || '',
      media_id: s.media_id || null
    })) : [],
    success_rate: t.success_rate ?? t.successRate ?? 0,
    media_id: t.media_id || null,
    content_media_id: t.content_media_id || null,
    after_media_id: t.after_media_id || null,
    is_active: t.is_active ?? true,
  };
}

export function TreatmentManager() {
  const { state, addGeneric, updateGeneric, deleteGeneric } = useDashboard();
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeLang, setActiveLang] = useState<LanguageCode>('en');
  const [editingTreatment, setEditingTreatment] = useState<any | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const treatments = (state.treatments || []) as any[];

  const filteredTreatments = treatments.filter(tr => {
    const titleVal = (typeof tr.title === 'object' ? (tr.title[activeLang] || tr.title['en'] || '') : (tr.title || ''));
    const catVal = (typeof tr.category === 'object' ? (tr.category[activeLang] || tr.category['en'] || '') : (tr.category || ''));
    const matchSearch = titleVal.toLowerCase().includes(search.toLowerCase()) ||
                        catVal.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || catVal === filter;
    return matchSearch && matchFilter;
  });

  const categories = Array.from(new Set(treatments.map(tr => {
    const cat = tr.category;
    return (typeof cat === 'object' ? (cat[activeLang] || cat['en'] || '') : (cat || ''));
  }))).filter(Boolean);

  const CANONICAL_TREATMENTS = [
    { slug: 'dental-implant', title: { en: 'Dental Implant', ar: 'زراعة الأسنان', fr: 'Implant Dentaire', ru: 'Зубной имплантат' } },
    { slug: 'hollywood-smile', title: { en: 'Hollywood Smile', ar: 'ابتسامة هوليود', fr: 'Sourire Hollywood', ru: 'Голливудская улыбка' } },
    { slug: 'male-hair-transplant', title: { en: 'Male Hair Transplant', ar: 'زراعة الشعر للرجال', fr: 'Greffe de Cheveux Homme', ru: 'Пересадка волос у мужчин' } },
    { slug: 'female-hair-transplant', title: { en: 'Female Hair Transplant', ar: 'زراعة الشعر للنساء', fr: 'Greffe de Cheveux Femme', ru: 'Пересадка волос у женщин' } },
    { slug: 'beard-moustache-transplant', title: { en: 'Beard & Moustache Transplant', ar: 'زراعة اللحية والشارب', fr: 'Greffe de Barbe et Moustache', ru: 'Пересадка бороды и усов' } },
    { slug: 'eyebrow-transplant', title: { en: 'Eyebrow Transplant', ar: 'زراعة الحواجب', fr: 'Greffe de Sourcils', ru: 'Пересадка бровей' } }
  ];

  const usedCategories = treatments.map(t => typeof t.category === 'object' ? t.category?.en : t.category);
  const canAdd = treatments.length < 6;

  const handleAdd = async () => {
    if (!canAdd) {
      toast.error('Maximum limit of 6 canonical treatments reached.');
      return;
    }

    // Find first unused canonical treatment
    const firstUnused = CANONICAL_TREATMENTS.find(ct => !usedCategories.includes(ct.title.en));
    if (!firstUnused) return;

    const payload = toBackendPayload({
      title: firstUnused.title,
      description: { en: '', ar: '', fr: '', ru: '' },
      category: firstUnused.title,
      slug: firstUnused.slug,
      duration: { en: '1 session', ar: '', fr: '', ru: '' },
      success_rate: 99,
    });
    try {
      await addGeneric('treatment', payload);
      toast.success(t('dashboard.treatments.draft_created'));
    } catch (err) {
      toast.error('Failed to create treatment');
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Delete this treatment?')) return;
    try {
      await deleteGeneric('treatment', id);
      toast.success(t('dashboard.treatments.removed'));
    } catch (err) {
      toast.error('Failed to delete treatment');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingTreatment) return;
    setIsUploading(true);
    try {
      const res = await clinicService.uploadMedia(file) as any;
      const url = res?.full_url || res?.url || res?.data?.full_url;
      const mediaId = res?.id || res?.data?.id;
      if (url) {
        setEditingTreatment({ ...editingTreatment, image: url, media_id: mediaId });
        toast.success('Image uploaded');
      }
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const validate = () => {
    if (!editingTreatment) return false;
    const newErrors: Record<string, string> = {};
    const title = editingTreatment.title;
    if (!title?.en && !title?.ar) newErrors.title = t('auth.error.required');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!editingTreatment || !validate()) return;
    setIsSaving(true);
    try {
      const payload = toBackendPayload(editingTreatment);
      const numId = Number(editingTreatment.id);
      await updateGeneric('treatment', numId, payload);
      setEditingTreatment(null);
      setErrors({});
      toast.success(t('dashboard.treatments.saved'));
    } catch (err) {
      toast.error('Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    setEditingTreatment(null);
    setErrors({});
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <SectionHeader 
          title={t('dashboard.treatments.title')} 
          description={t('dashboard.treatments.desc')}
          actions={
            canAdd ? (
              <DashboardButton onClick={handleAdd} icon={Plus}>
                {t('dashboard.treatments.new')}
              </DashboardButton>
            ) : (
              <div className="px-5 py-2.5 bg-secondary/5 rounded-2xl border border-secondary/10 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary/40">Canonical Limit Reached (6/6)</span>
              </div>
            )
          }
        />
        <div className="mb-10">
          <LanguageTabs activeLang={activeLang} onLangChange={setActiveLang} />
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <div className="w-full lg:flex-1">
          <DashboardInput 
            placeholder={t('dashboard.treatments.search_placeholder')} 
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 shrink-0">
          <button 
            onClick={() => setFilter('all')}
            className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap border ${filter === 'all' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'text-secondary/70 bg-secondary/5 border-secondary/10 hover:bg-primary/10 hover:text-primary'}`}
          >
            {t('dashboard.treatments.all_services')}
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap border ${filter === cat ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'text-secondary/70 bg-secondary/5 border-secondary/10 hover:bg-primary/10 hover:text-primary'}`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredTreatments.map((treatment) => {
            const titleStr = typeof treatment.title === 'object'
              ? (treatment.title[activeLang] || treatment.title['en'] || 'Untitled')
              : (treatment.title || 'Untitled');
            const catStr = typeof treatment.category === 'object'
              ? (treatment.category[activeLang] || treatment.category['en'] || '')
              : (treatment.category || '');
            const successRate = treatment.success_rate ?? treatment.successRate;
            return (
              <motion.div
                layout
                key={treatment.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <DashboardCard padding="none" className="group overflow-hidden flex flex-col h-full bg-white hover:shadow-2xl transition-all">
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary/5">
                    {(treatment.image || treatment.media_url) ? (
                      <img 
                        src={treatment.image || treatment.media_url}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={titleStr}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-secondary/20">
                        <Stethoscope className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <StatusBadge variant="info">{catStr}</StatusBadge>
                    </div>
                    <div className="absolute bottom-4 left-6 right-6 text-white text-shadow-lg">
                      <h4 className="font-bold text-lg leading-tight drop-shadow-lg">{titleStr}</h4>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
                        <Stethoscope className="w-3.5 h-3.5 text-primary" />
                        <span>{successRate ?? '—'}% {t('dashboard.treatments.success')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold truncate">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        {typeof treatment.duration === 'object' 
                          ? (treatment.duration[activeLang] || treatment.duration['en'] || '')
                          : (treatment.duration || '')}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <DashboardButton 
                        variant="outline" 
                        size="sm" 
                        icon={Edit2}
                        onClick={async () => {
  try {
    const fullTreatment = await clinicService.getAdminTreatment(treatment.id);
    setEditingTreatment({ ...fullTreatment });
  } catch (err) {
    toast.error('Failed to load full treatment details');
  }
}}
                        className="flex-1 !rounded-xl"
                      >
                        {t('dashboard.edit')} {activeLang.toUpperCase()}
                      </DashboardButton>
                      <DashboardButton 
                        variant="ghost" 
                        size="sm" 
                        icon={Trash2}
                        onClick={() => handleDelete(treatment.id)}
                        className="!rounded-xl text-red-500 hover:bg-red-50"
                      />
                    </div>
                  </div>
                </DashboardCard>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {canAdd ? (
          <motion.button
            onClick={handleAdd}
            className="border-4 border-dashed border-secondary/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 group hover:border-primary/20 hover:bg-primary/[0.02] transition-all min-h-[400px]"
          >
            <div className="w-20 h-20 bg-secondary/5 rounded-3xl flex items-center justify-center group-hover:bg-primary/10 transition-all">
              <Plus className="w-10 h-10 text-secondary/20 group-hover:text-primary" />
            </div>
            <h4 className="font-bold text-secondary text-xl">{t('dashboard.treatments.add_treatment')}</h4>
          </motion.button>
        ) : (
          <div className="border-4 border-dashed border-secondary/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 opacity-40 grayscale min-h-[400px]">
            <div className="w-20 h-20 bg-secondary/5 rounded-3xl flex items-center justify-center">
              <Plus className="w-10 h-10 text-secondary/20" />
            </div>
            <div className="text-center px-6">
              <h4 className="font-bold text-secondary text-xl mb-2">Maximum Services Reached</h4>
              <p className="text-xs font-medium max-w-[200px]">All 6 canonical treatment pages have been created.</p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingTreatment && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary/80 backdrop-blur-sm pt-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl"
            >
              <DashboardCard className="max-h-[85vh] overflow-y-auto relative">
                <div className="sticky top-0 bg-white z-10 pb-6 mb-6 border-b border-secondary/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-secondary">{t('dashboard.treatments.edit')}</h2>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">
                      ID: {editingTreatment.id}
                    </p>
                  </div>
                  <LanguageTabs activeLang={activeLang} onLangChange={setActiveLang} />
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Hero Image */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-secondary/40 uppercase tracking-widest flex items-center gap-2">
                        <Upload className="w-3.5 h-3.5" />
                        Hero Image
                      </label>
                      {(editingTreatment.image || editingTreatment.media_url) && (
                        <img
                          src={editingTreatment.image || editingTreatment.media_url}
                          className="w-full h-24 object-cover rounded-2xl mb-2"
                          alt="Hero"
                        />
                      )}
                      <div className="flex gap-2">
                        <input
                          type="file"
                          id="treatment-image-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <button
                          onClick={() => document.getElementById('treatment-image-upload')?.click()}
                          disabled={isUploading}
                          className="flex-1 px-3 py-2 bg-secondary/5 hover:bg-primary/10 text-secondary hover:text-primary rounded-xl border border-dashed border-secondary/20 transition-all font-bold text-[9px] flex items-center justify-center gap-2"
                        >
                          {isUploading ? <RefreshCcw className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                          Hero
                        </button>
                      </div>
                    </div>

                    {/* Content Image */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-secondary/40 uppercase tracking-widest flex items-center gap-2">
                        <Edit2 className="w-3.5 h-3.5" />
                        Content Image
                      </label>
                      {(editingTreatment.content_media_url || editingTreatment.content_image) && (
                        <img
                          src={editingTreatment.content_media_url || editingTreatment.content_image}
                          className="w-full h-24 object-cover rounded-2xl mb-2"
                          alt="Content"
                        />
                      )}
                      <div className="flex gap-2">
                        <input
                          type="file"
                          id="treatment-content-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setIsUploading(true);
                            try {
                              const res = await clinicService.uploadMedia(file) as any;
                              const url = res?.full_url || res?.url || res?.data?.full_url;
                              const mediaId = res?.id || res?.data?.id;
                              setEditingTreatment({ ...editingTreatment, content_media_url: url, content_media_id: mediaId });
                              toast.success('Content image uploaded');
                            } catch (err) {
                              toast.error('Upload failed');
                            } finally {
                              setIsUploading(false);
                            }
                          }}
                        />
                        <button
                          onClick={() => document.getElementById('treatment-content-upload')?.click()}
                          disabled={isUploading}
                          className="flex-1 px-3 py-2 bg-secondary/5 hover:bg-primary/10 text-secondary hover:text-primary rounded-xl border border-dashed border-secondary/20 transition-all font-bold text-[9px] flex items-center justify-center gap-2"
                        >
                          {isUploading ? <RefreshCcw className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                          Content
                        </button>
                      </div>
                    </div>

                    {/* After Image */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-secondary/40 uppercase tracking-widest flex items-center gap-2">
                        <Plus className="w-3.5 h-3.5" />
                        B/A Results
                      </label>
                      {(editingTreatment.beforeAfter || editingTreatment.after_media_url) && (
                        <img
                          src={editingTreatment.beforeAfter || editingTreatment.after_media_url}
                          className="w-full h-24 object-cover rounded-2xl mb-2"
                          alt="After"
                        />
                      )}
                      <div className="flex gap-2">
                        <input
                          type="file"
                          id="treatment-after-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setIsUploading(true);
                            try {
                              const res = await clinicService.uploadMedia(file) as any;
                              const url = res?.full_url || res?.url || res?.data?.full_url;
                              const mediaId = res?.id || res?.data?.id;
                              setEditingTreatment({ ...editingTreatment, beforeAfter: url, after_media_id: mediaId });
                              toast.success('Before/After image uploaded');
                            } catch (err) {
                              toast.error('Upload failed');
                            } finally {
                              setIsUploading(false);
                            }
                          }}
                        />
                        <button
                          onClick={() => document.getElementById('treatment-after-upload')?.click()}
                          disabled={isUploading}
                          className="flex-1 px-3 py-2 bg-secondary/5 hover:bg-primary/10 text-secondary hover:text-primary rounded-xl border border-dashed border-secondary/20 transition-all font-bold text-[9px] flex items-center justify-center gap-2"
                        >
                          {isUploading ? <RefreshCcw className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                          B/A
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <DashboardInput
                        label={`${t('dashboard.treatments.title_label')} (${activeLang.toUpperCase()})`}
                        value={typeof editingTreatment.title === 'object' ? (editingTreatment.title[activeLang] || '') : (editingTreatment.title || '')}
                        onChange={(e) => setEditingTreatment({ 
                          ...editingTreatment, 
                          title: { ...(typeof editingTreatment.title === 'object' ? editingTreatment.title : {}), [activeLang]: e.target.value } 
                        })}
                      />
                      {errors.title && <p className="text-[10px] text-red-500 font-bold px-1">{errors.title}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black text-secondary/40 uppercase tracking-widest px-1">
                        {t('dashboard.treatments.category_label')}
                      </label>
                      <select
                        className="w-full bg-secondary/5 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl px-6 py-4 text-secondary font-semibold outline-none transition-all"
                        value={typeof editingTreatment.category === 'object' ? (editingTreatment.category?.en || '') : (editingTreatment.category || '')}
                        onChange={(e) => {
                          const selected = CANONICAL_TREATMENTS.find(t => t.title.en === e.target.value);
                          if (selected) {
                            setEditingTreatment({ 
                              ...editingTreatment, 
                              category: selected.title,
                              slug: selected.slug // Sync slug in UI
                            });
                          }
                        }}
                      >
                        <option value="" disabled>Select Canonical Target</option>
                        {CANONICAL_TREATMENTS.map(ct => {
                          const isUsed = usedCategories.includes(ct.title.en);
                          const isCurrent = (typeof editingTreatment.category === 'object' ? editingTreatment.category?.en : editingTreatment.category) === ct.title.en;
                          
                          if (isUsed && !isCurrent) return null;
                          
                          return (
                            <option key={ct.slug} value={ct.title.en}>{ct.title.en}</option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1 opacity-60">
                      <DashboardInput
                        label="Canonical Slug (Auto-Synced)"
                        value={editingTreatment.slug || ''}
                        readOnly
                        className="bg-secondary/10 cursor-not-allowed"
                      />
                      <p className="text-[9px] text-primary font-bold px-1 uppercase tracking-tighter">Required for system navigation</p>
                    </div>
                    <div className="space-y-1">
                      <DashboardInput
                        label={t('dashboard.treatments.success_rate')}
                        type="number"
                        value={editingTreatment.success_rate ?? editingTreatment.successRate ?? ''}
                        onChange={(e) => setEditingTreatment({ 
                          ...editingTreatment, 
                          success_rate: parseInt(e.target.value),
                          successRate: parseInt(e.target.value)
                        })}
                      />
                      {errors.successRate && <p className="text-[10px] text-red-500 font-bold px-1">{errors.successRate}</p>}
                    </div>
                    <DashboardInput
                      label={`${t('dashboard.treatments.duration_label')} (${activeLang.toUpperCase()})`}
                      value={typeof editingTreatment.duration === 'object' ? (editingTreatment.duration[activeLang] || '') : ''}
                      onChange={(e) => setEditingTreatment({ 
                        ...editingTreatment, 
                        duration: { ...(typeof editingTreatment.duration === 'object' ? editingTreatment.duration : { en: '', ar: '', fr: '', ru: '' }), [activeLang]: e.target.value } 
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-secondary/40 uppercase tracking-widest px-1">Short Intro / Subtitle ({activeLang.toUpperCase()})</label>
                    <textarea
                      className="w-full bg-secondary/5 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl p-6 text-secondary font-semibold outline-none transition-all min-h-[100px]"
                      value={typeof editingTreatment.description === 'object' ? (editingTreatment.description[activeLang] || '') : ''}
                      onChange={(e) => setEditingTreatment({ 
                        ...editingTreatment, 
                        description: { ...(typeof editingTreatment.description === 'object' ? editingTreatment.description : { en: '', ar: '', fr: '', ru: '' }), [activeLang]: e.target.value } 
                      })}
                      placeholder="Enter a brief introduction..."
                    />
                  </div>

                  {/* Features Editor */}
                  <div className="space-y-4 pt-4 border-t border-secondary/5">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-xs font-black text-secondary/40 uppercase tracking-widest">Procedure Features ({activeLang.toUpperCase()})</label>
                      <button 
                        onClick={() => {
                          const currentArr = Array.isArray(editingTreatment.features?.[activeLang]) ? editingTreatment.features[activeLang] : (typeof editingTreatment.features?.[activeLang] === 'string' ? [editingTreatment.features[activeLang]] : []);
                          const updated = { 
                            ...(editingTreatment.features || {}), 
                            [activeLang]: [...currentArr, ''] 
                          };
                          setEditingTreatment({ ...editingTreatment, features: updated });
                        }}
                        className="p-1 px-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all"
                      >
                        + Add Feature
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(Array.isArray(editingTreatment.features?.[activeLang]) ? editingTreatment.features?.[activeLang] : []).map((feature: string, idx: number) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            className="flex-1 bg-secondary/5 border-none rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20"
                            value={feature}
                            onChange={(e) => {
                              const arr = [...editingTreatment.features[activeLang]];
                              arr[idx] = e.target.value;
                              setEditingTreatment({ ...editingTreatment, features: { ...editingTreatment.features, [activeLang]: arr } });
                            }}
                            placeholder="e.g. 99% Success Rate"
                          />
                          <button 
                            onClick={() => {
                              const arr = editingTreatment.features[activeLang].filter((_: any, i: number) => i !== idx);
                              setEditingTreatment({ ...editingTreatment, features: { ...editingTreatment.features, [activeLang]: arr } });
                            }}
                            className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content Sections Editor */}
                  <div className="space-y-4 pt-4 border-t border-secondary/5">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-xs font-black text-secondary/40 uppercase tracking-widest">Page Body Content ({activeLang.toUpperCase()})</label>
                      <button 
                        onClick={() => {
                          const sections = Array.isArray(editingTreatment.content_sections) ? [...editingTreatment.content_sections] : [];
                          const newSection = { 
                            title: { en: '', ar: '', fr: '', ru: '' },
                            subtitle: { en: '', ar: '', fr: '', ru: '' },
                            description: { en: '', ar: '', fr: '', ru: '' },
                            image: '',
                            media_id: null
                          };
                          setEditingTreatment({ ...editingTreatment, content_sections: [...sections, newSection] });
                        }}
                        className="p-1 px-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all"
                      >
                        + Add Section Block
                      </button>
                    </div>
                    <div className="space-y-6">
                      {(Array.isArray(editingTreatment.content_sections) ? editingTreatment.content_sections : []).map((section: any, idx: number) => (
                        <div key={idx} className="bg-secondary/5 rounded-3xl p-6 space-y-4 relative group/block border border-transparent hover:border-primary/10 transition-all">
                          <button 
                            onClick={() => {
                              const sections = editingTreatment.content_sections.filter((_: any, i: number) => i !== idx);
                              setEditingTreatment({ ...editingTreatment, content_sections: sections });
                            }}
                            className="absolute top-4 right-4 p-2 text-red-500/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover/block:opacity-100 z-10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                          <div className="flex flex-col md:flex-row gap-6">
                            {/* Section Image */}
                            <div className="w-full md:w-40 shrink-0 space-y-2">
                              {section.image ? (
                                <img src={section.image} className="w-full h-32 object-cover rounded-xl" alt="Section" />
                              ) : (
                                <div className="w-full h-32 bg-white rounded-xl flex items-center justify-center text-secondary/20 border border-dashed border-secondary/10">
                                  <Upload className="w-6 h-6" />
                                </div>
                              )}
                              <input 
                                type="file" 
                                id={`section-upload-${idx}`} 
                                className="hidden" 
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  setIsUploading(true);
                                  try {
                                    const res = await clinicService.uploadMedia(file) as any;
                                    const url = res?.full_url || res?.url || res?.data?.full_url;
                                    const mediaId = res?.id || res?.data?.id;
                                    const sections = [...editingTreatment.content_sections];
                                    sections[idx] = { ...sections[idx], image: url, media_id: mediaId };
                                    setEditingTreatment({ ...editingTreatment, content_sections: sections });
                                    toast.success('Section image uploaded');
                                  } catch (err) {
                                    toast.error('Upload failed');
                                  } finally {
                                    setIsUploading(false);
                                  }
                                }}
                              />
                              <button 
                                onClick={() => document.getElementById(`section-upload-${idx}`)?.click()}
                                className="w-full py-2 bg-white text-[10px] font-bold text-secondary uppercase tracking-widest rounded-lg border border-secondary/10 hover:bg-primary/5 transition-all"
                              >
                                Upload Image
                              </button>
                            </div>

                            <div className="flex-1 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-black text-secondary/30 uppercase tracking-widest px-1">Section Title</label>
                                  <input 
                                    className="w-full bg-white border-none rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                                    value={section.title?.[activeLang] || ''}
                                    onChange={(e) => {
                                      const sections = [...editingTreatment.content_sections];
                                      sections[idx] = { ...sections[idx], title: { ...sections[idx].title, [activeLang]: e.target.value } };
                                      setEditingTreatment({ ...editingTreatment, content_sections: sections });
                                    }}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-black text-secondary/30 uppercase tracking-widest px-1">Section Subtitle</label>
                                  <input 
                                    className="w-full bg-white border-none rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                                    value={section.subtitle?.[activeLang] || ''}
                                    onChange={(e) => {
                                      const sections = [...editingTreatment.content_sections];
                                      sections[idx] = { ...sections[idx], subtitle: { ...sections[idx].subtitle, [activeLang]: e.target.value } };
                                      setEditingTreatment({ ...editingTreatment, content_sections: sections });
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-black text-secondary/30 uppercase tracking-widest px-1">Section Description</label>
                                <textarea 
                                  className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 shadow-sm min-h-[100px]"
                                  value={section.description?.[activeLang] || ''}
                                  onChange={(e) => {
                                    const sections = [...editingTreatment.content_sections];
                                    sections[idx] = { ...sections[idx], description: { ...sections[idx].description, [activeLang]: e.target.value } };
                                    setEditingTreatment({ ...editingTreatment, content_sections: sections });
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <DashboardButton onClick={handleUpdate} loading={isSaving} className="flex-1" icon={Save}>
                    {t('dashboard.save')}
                  </DashboardButton>
                  <DashboardButton variant="outline" onClick={closeModal} icon={X}>
                    {t('dashboard.cancel')}
                  </DashboardButton>
                </div>
              </DashboardCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
