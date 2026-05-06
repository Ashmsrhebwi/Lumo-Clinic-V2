import React, { useState } from 'react';
import { useDashboard, DashboardState } from '../../context/DashboardContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ExternalLink,
  Save,
  X,
  Type,
  Info,
  User,
  Link as LinkIcon,
  Award,
  Star,
  Users,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin
} from 'lucide-react';
import { clinicService } from '../../services/clinicService';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { 
  DashboardCard, 
  DashboardInput, 
  DashboardButton, 
  StatusBadge,
  LanguageTabs
} from './UI';

interface GenericManagerProps {
  type: keyof Pick<DashboardState, 'testimonials' | 'faqs' | 'locations' | 'blogs' | 'stats' | 'processSteps' | 'results' | 'treatments' | 'doctors'>;
  title: string;
  description: string;
}

export function GenericManager({ type, title, description }: GenericManagerProps) {
  const { state, addGeneric, updateGeneric, deleteGeneric } = useDashboard();
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [localEditData, setLocalEditData] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editTab, setEditTab] = useState<'en' | 'ar' | 'fr' | 'ru'>(language as any);

  // Map plural type to singular for context methods
  const singularType = type === 'processSteps' 
    ? 'processStep' 
    : type.endsWith('s') 
        ? type.slice(0, -1) 
        : type;

  // Safe access to the correct array in state
  const items = (state[type] as any[]) || [];

  const filteredItems = items.filter(item => {
    const searchStr = searchTerm.toLowerCase();

    // Helper to resolve string value from potential multilingual object or other type
    const resolveValue = (raw: any): string => {
      if (raw === null || raw === undefined) return '';
      if (typeof raw === 'string') return raw;
      if (typeof raw === 'number') return raw.toString();
      if (typeof raw === 'object') {
        // Use current language, or fallback to English, or any key, or empty string
        return raw[language] || raw['en'] || Object.values(raw)[0] || '';
      }
      return '';
    };

    const val = resolveValue(item.name || item.title || item.question || item.label || item.patient_name || '');
    
    return val.toLowerCase().includes(searchStr);
  });

  const handleAdd = () => {
    const defaultMultiLang = { en: '', ar: '', fr: '', ru: '' };
    let defaultData: any = {};

    const firstTreatment = state.treatments.length > 0 ? state.treatments[0] : null;
    const firstTreatmentTitle = firstTreatment ? firstTreatment.title : { en: 'Dental Implant', ar: 'زراعة الأسنان', fr: 'Implant Dentaire', ru: 'Зубной имплантат' };
    const firstTreatmentId = firstTreatment ? firstTreatment.id : null;

    // Set type-specific defaults matching BACKEND field names
    if (type === 'testimonials') {
      defaultData.patient_name = { ...defaultMultiLang, en: 'New Patient' };
      defaultData.feedback = { ...defaultMultiLang };
      defaultData.rating = 5;
      defaultData.treatment_id = firstTreatmentId;
    } else if (type === 'faqs') {
      defaultData.question = { ...defaultMultiLang };
      defaultData.answer = { ...defaultMultiLang };
    } else if (type === 'stats') {
      defaultData.value = '0';
      defaultData.suffix = '+';
      defaultData.label = { ...defaultMultiLang };
      defaultData.is_active = true;
    } else if (type === 'processSteps') {
      defaultData.title = { ...defaultMultiLang };
      defaultData.description = { ...defaultMultiLang };
      defaultData.order = items.length + 1;
      defaultData.icon_name = 'Check';
    } else if (type === 'locations') {
      defaultData.city = { ...defaultMultiLang };
      defaultData.address = { ...defaultMultiLang };
      defaultData.country = { ...defaultMultiLang };
      defaultData.hours = { ...defaultMultiLang };
      defaultData.phone = "";
      defaultData.email = '';
      defaultData.map_url = '';
    } else if (type === 'blogs') {
      defaultData.title = { ...defaultMultiLang };
      defaultData.excerpt = { ...defaultMultiLang };
      defaultData.category = firstTreatmentTitle;
      defaultData.content = { ...defaultMultiLang };
      defaultData.read_time = { ...defaultMultiLang, en: '5 min' };
      defaultData.author = { ...defaultMultiLang, en: 'Gravity Clinic' };
      defaultData.is_active = true;
    } else if (type === 'results') {
      defaultData.treatment_id = firstTreatmentId;
      defaultData.patient_name = { ...defaultMultiLang, en: 'New Result' };
      defaultData.story = { ...defaultMultiLang };
      defaultData.before_image_url = '';
      defaultData.after_image_url = '';
      defaultData.before_media_id = null;
      defaultData.after_media_id = null;
    } else if (type === 'doctors') {
      defaultData.name = 'New Doctor';
      defaultData.specialty = { ...defaultMultiLang };
      defaultData.bio = { ...defaultMultiLang };
      defaultData.specialties = { ...defaultMultiLang };
      defaultData.languages = { ...defaultMultiLang };
      defaultData.experience = '0';
      defaultData.patients = '0';
      defaultData.rating = 5;
      defaultData.image_id = null;
    } else if (type === 'treatments') {
      defaultData.title = { ...defaultMultiLang };
      defaultData.description = { ...defaultMultiLang };
      defaultData.duration = { ...defaultMultiLang };
      defaultData.slug = 'new-treatment-' + Date.now();
      defaultData.success_rate = 100;
      defaultData.category = { ...defaultMultiLang, en: 'Dental' };
      defaultData.template_type = 'standard';
    }

    setLocalEditData(defaultData);
    setEditingId('new');
    setErrors({});
    setEditTab(language as any);
  };

  const handleEdit = (id: string) => {
    const item = items.find(i => i.id?.toString() === id.toString());
    if (item) {
      setLocalEditData({ ...item });
      setEditingId(id);
      setErrors({});
      setEditTab(language as any);
    }
  };

  const closeModal = () => {
    setEditingId(null);
    setLocalEditData(null);
    setErrors({});
  };

  const handleDelete = (id: string) => {
    if (confirm(t('dashboard.delete') + '?')) {
      deleteGeneric(singularType as any, id);
      toast.error(t('dashboard.delete'));
    }
  };

  const currentEditingItem = localEditData;

  return (
    <motion.div 
      key={type}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-8 max-w-7xl mx-auto pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-secondary tracking-tight">{title}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input 
              type="text"
              placeholder={t('dashboard.generic.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-secondary/5 border-none rounded-2xl w-64 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
          <DashboardButton onClick={handleAdd} icon={Plus} variant="primary">
            {t('dashboard.add')}
          </DashboardButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => {
            const resolveValue = (raw: any): string => {
              if (raw === null || raw === undefined) return '';
              if (typeof raw === 'string') return raw;
              if (typeof raw === 'number') return raw.toString();
              if (typeof raw === 'object') {
                return raw[language] || raw['en'] || Object.values(raw)[0] || '';
              }
              return '';
            };

            const itemTitle = resolveValue(item.patient_name || item.name || item.title || item.question || item.label || '') || `${title} #${index + 1}`;

            return (
              <motion.div
                key={item.id || index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <DashboardCard className="group h-full flex flex-col !rounded-[2.5rem]">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-2">
                      <Type className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(item.id)}
                        className="p-2 hover:bg-primary/10 text-primary rounded-xl transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-secondary text-lg mb-2 line-clamp-1">{itemTitle}</h3>
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-secondary/5">
                    <StatusBadge variant="info">{t('dashboard.system.online')}</StatusBadge>
                    <button 
                      onClick={() => handleEdit(item.id)}
                      className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                    >
                      {t('dashboard.generic.open_form')}
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </DashboardCard>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-secondary/5 rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-secondary mb-2">{t('dashboard.generic.not_found')}</h3>
            <p className="text-muted-foreground">{t('dashboard.generic.start_adding')}</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingId && currentEditingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-secondary/40 backdrop-blur-xl"
            />
            
            <motion.div
              key={type}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-secondary/5 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold text-secondary">{t('dashboard.edit')}</h2>
                    <StatusBadge variant="info">{type}</StatusBadge>
                  </div>
                  <p className="text-sm text-muted-foreground">{t('dashboard.generic.editing')} {editTab.toUpperCase()}</p>
                </div>
                <button 
                  onClick={closeModal}
                  className="p-3 hover:bg-secondary/5 rounded-2xl transition-colors"
                >
                  <X className="w-6 h-6 text-secondary" />
                </button>
              </div>

              {/* Language Selector */}
              <div className="px-8 py-4 bg-secondary/[0.02] border-b border-secondary/5">
                <LanguageTabs activeLang={editTab} onLangChange={setEditTab} />
              </div>

              {/* Form Content */}
              <div className="p-8 overflow-y-auto space-y-8">
                {/* Dynamically render fields based on type */}
                {type === 'testimonials' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Patient Name</label>
                       <DashboardInput
                        value={(currentEditingItem.patient_name?.[editTab] || currentEditingItem.name) ?? ''}
                        onChange={(e) => setLocalEditData({ ...currentEditingItem, patient_name: { ...(currentEditingItem.patient_name || {}), [editTab]: e.target.value }, name: e.target.value })}
                        icon={Type}
                        className={`!py-4 !rounded-2xl ${errors.name ? 'border-red-500/50 ring-2 ring-red-500/10' : ''}`}
                      />
                      {errors.name && <p className="text-[10px] text-red-500 font-bold px-1 mt-1">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Linked Treatment</label>
                        <select
                          value={currentEditingItem.treatment_id || ''}
                          onChange={(e) => setLocalEditData({ ...currentEditingItem, treatment_id: e.target.value })}
                          className="w-full px-6 py-4 bg-secondary/5 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none font-bold text-secondary"
                        >
                          <option value="">Select Treatment</option>
                          {state.treatments.map(t => {
                            const title = typeof t.title === 'object' ? (t.title[editTab] || t.title.en) : t.title;
                            return <option key={t.id} value={t.id}>{title}</option>;
                          })}
                        </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Testimonial Text ({editTab.toUpperCase()})</label>
                      <textarea
                        value={((currentEditingItem.feedback || currentEditingItem.text)?.[editTab]) ?? ''}
                        onChange={(e) => {
                          const newFeedback = { ...(currentEditingItem.feedback || currentEditingItem.text || {}), [editTab]: e.target.value };
                          setLocalEditData({ ...currentEditingItem, feedback: newFeedback, text: newFeedback });
                        }}
                        className="w-full px-6 py-4 bg-secondary/5 border-none rounded-[2rem] focus:ring-2 focus:ring-primary/20 transition-all outline-none min-h-[150px] resize-none"
                      />
                    </div>
                  </div>
                )}

                {type === 'faqs' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Question ({editTab.toUpperCase()})</label>
                      <DashboardInput
                        value={(currentEditingItem.question?.[editTab]) ?? ''}
                        onChange={(e) => {
                          const val = { ...(currentEditingItem.question || {}), [editTab]: e.target.value };
                          setLocalEditData({ ...currentEditingItem, question: val });
                        }}
                        icon={Type}
                        className="!py-4 !rounded-2xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Answer ({editTab.toUpperCase()})</label>
                      <textarea
                        value={(currentEditingItem.answer?.[editTab]) ?? ''}
                        onChange={(e) => {
                          const val = { ...(currentEditingItem.answer || {}), [editTab]: e.target.value };
                          setLocalEditData({ ...currentEditingItem, answer: val });
                        }}
                        className="w-full px-6 py-4 bg-secondary/5 border-none rounded-[2rem] focus:ring-2 focus:ring-primary/20 transition-all outline-none min-h-[150px] resize-none"
                      />
                    </div>
                  </div>
                )}

                {type === 'stats' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Value</label>
                        <DashboardInput
                          value={currentEditingItem.value ?? ''}
                          onChange={(e) => setLocalEditData({ ...currentEditingItem, value: e.target.value })}
                          icon={Type}
                          className="!py-4 !rounded-2xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Suffix</label>
                        <DashboardInput
                          value={currentEditingItem.suffix ?? ''}
                          onChange={(e) => setLocalEditData({ ...currentEditingItem, suffix: e.target.value })}
                          icon={Plus}
                          className="!py-4 !rounded-2xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Label ({editTab.toUpperCase()})</label>
                      <DashboardInput
                        value={(currentEditingItem.label?.[editTab]) ?? ''}
                        onChange={(e) => {
                          const val = { ...(currentEditingItem.label || {}), [editTab]: e.target.value };
                          setLocalEditData({ ...currentEditingItem, label: val });
                        }}
                        icon={Info}
                        className="!py-4 !rounded-2xl"
                      />
                    </div>
                  </div>
                )}

                {type === 'processSteps' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Step Number</label>
                        <DashboardInput
                          type="number"
                          value={currentEditingItem.order ?? currentEditingItem.step ?? ''}
                          onChange={(e) => setLocalEditData({ ...currentEditingItem, order: parseInt(e.target.value), step: parseInt(e.target.value) })}
                          icon={Type}
                          className="!py-4 !rounded-2xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Icon Name</label>
                        <DashboardInput
                          value={currentEditingItem.icon_name || currentEditingItem.icon || ''}
                          onChange={(e) => setLocalEditData({ ...currentEditingItem, icon_name: e.target.value, icon: e.target.value })}
                          icon={Info}
                          className="!py-4 !rounded-2xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Step Title ({editTab.toUpperCase()})</label>
                      <DashboardInput
                        value={currentEditingItem.title?.[editTab] || ''}
                        onChange={(e) => {
                          const val = { ...(currentEditingItem.title || {}), [editTab]: e.target.value };
                          setLocalEditData({ ...currentEditingItem, title: val });
                        }}
                        icon={Type}
                        className="!py-4 !rounded-2xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Description ({editTab.toUpperCase()})</label>
                      <textarea
                        value={currentEditingItem.description?.[editTab] || ''}
                        onChange={(e) => {
                          const val = { ...(currentEditingItem.description || {}), [editTab]: e.target.value };
                          setLocalEditData({ ...currentEditingItem, description: val });
                        }}
                        className="w-full px-6 py-4 bg-secondary/5 border-none rounded-[2rem] focus:ring-2 focus:ring-primary/20 transition-all outline-none min-h-[120px] resize-none"
                      />
                    </div>
                  </div>
                )}

                {type === 'results' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Linked Treatment</label>
                        <select
                           value={currentEditingItem.treatment_id || ''}
                           onChange={(e) => setLocalEditData({ ...currentEditingItem, treatment_id: e.target.value })}
                           className="w-full px-6 py-4 bg-secondary/5 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none font-bold text-secondary"
                         >
                           <option value="">Select Treatment</option>
                           {state.treatments.map(t => {
                             const title = typeof t.title === 'object' ? (t.title[editTab] || t.title.en) : t.title;
                             return <option key={t.id} value={t.id}>{title}</option>;
                           })}
                         </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Patient Name ({editTab.toUpperCase()})</label>
                      <DashboardInput
                        value={currentEditingItem.patient_name?.[editTab] || ''}
                        onChange={(e) => {
                          const val = { ...(currentEditingItem.patient_name || {}), [editTab]: e.target.value };
                          setLocalEditData({ ...currentEditingItem, patient_name: val });
                        }}
                        icon={Type}
                        className="!py-4 !rounded-2xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Patient Story ({editTab.toUpperCase()})</label>
                      <textarea
                        value={currentEditingItem.story?.[editTab] || ''}
                        onChange={(e) => {
                          const val = { ...(currentEditingItem.story || {}), [editTab]: e.target.value };
                          setLocalEditData({ ...currentEditingItem, story: val });
                        }}
                        className="w-full px-6 py-4 bg-secondary/5 border-none rounded-[2rem] focus:ring-2 focus:ring-primary/20 transition-all outline-none min-h-[120px] resize-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      {/* Before Image */}
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1 flex items-center gap-2">
                           Before Image
                        </label>
                        <div className="relative aspect-video rounded-3xl overflow-hidden bg-secondary/5 border-2 border-dashed border-secondary/10 group">
                           {currentEditingItem.before_image_url ? (
                             <img src={currentEditingItem.before_image_url} className="w-full h-full object-cover" />
                           ) : (
                             <div className="absolute inset-0 flex items-center justify-center text-secondary/30">
                               <Plus className="w-8 h-8" />
                             </div>
                           )}
                           <input 
                             type="file" 
                             className="absolute inset-0 opacity-0 cursor-pointer" 
                             onChange={async (e) => {
                               const file = e.target.files?.[0];
                               if (!file) return;
                               const toastId = toast.loading('Uploading before image...');
                               try {
                                 const res = await (clinicService as any).uploadMedia(file);
                                 const url = res?.full_url || res?.url || res?.data?.full_url;
                                 const mediaId = res?.id || res?.data?.id;
                                 setLocalEditData({ ...currentEditingItem, before_image_url: url, before_media_id: mediaId });
                                 toast.success('Before image uploaded', { id: toastId });
                               } catch (err) {
                                 toast.error('Upload failed', { id: toastId });
                               }
                             }}
                           />
                        </div>
                      </div>

                      {/* After Image */}
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">After Image</label>
                        <div className="relative aspect-video rounded-3xl overflow-hidden bg-secondary/5 border-2 border-dashed border-secondary/10 group">
                           {currentEditingItem.after_image_url ? (
                             <img src={currentEditingItem.after_image_url} className="w-full h-full object-cover" />
                           ) : (
                             <div className="absolute inset-0 flex items-center justify-center text-secondary/30">
                               <Plus className="w-8 h-8" />
                             </div>
                           )}
                           <input 
                             type="file" 
                             className="absolute inset-0 opacity-0 cursor-pointer" 
                             onChange={async (e) => {
                               const file = e.target.files?.[0];
                               if (!file) return;
                               const toastId = toast.loading('Uploading after image...');
                               try {
                                 const res = await (clinicService as any).uploadMedia(file);
                                 const url = res?.full_url || res?.url || res?.data?.full_url;
                                 const mediaId = res?.id || res?.data?.id;
                                 setLocalEditData({ ...currentEditingItem, after_image_url: url, after_media_id: mediaId });
                                 toast.success('After image uploaded', { id: toastId });
                               } catch (err) {
                                 toast.error('Upload failed', { id: toastId });
                               }
                             }}
                           />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {type === 'locations' && (
                  <div className="space-y-6">
                     <div className="space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">City ({editTab.toUpperCase()})</label>
                      <DashboardInput
                        value={(currentEditingItem.city || currentEditingItem.title)?.[editTab] || ''}
                        onChange={(e) => {
                          const val = { ...(currentEditingItem.city || currentEditingItem.title || {}), [editTab]: e.target.value };
                          setLocalEditData({ ...currentEditingItem, city: val, title: val });
                        }}
                        icon={Type}
                        className="!py-4 !rounded-2xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Address ({editTab.toUpperCase()})</label>
                      <DashboardInput
                        value={currentEditingItem.address?.[editTab] || ''}
                        onChange={(e) => {
                          const val = { ...(currentEditingItem.address || {}), [editTab]: e.target.value };
                          setLocalEditData({ ...currentEditingItem, address: val });
                        }}
                        icon={Info}
                        className="!py-4 !rounded-2xl"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Phone</label>
                        <DashboardInput
                          value={currentEditingItem.phone || ''}
                          onChange={(e) => setLocalEditData({ ...currentEditingItem, phone: e.target.value })}
                          icon={Info}
                          className="!py-4 !rounded-2xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Email</label>
                        <DashboardInput
                          value={currentEditingItem.email || ''}
                          onChange={(e) => setLocalEditData({ ...currentEditingItem, email: e.target.value })}
                          icon={LinkIcon}
                          className="!py-4 !rounded-2xl"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {type === 'blogs' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Article Title ({editTab.toUpperCase()})</label>
                      <DashboardInput
                        value={currentEditingItem.title?.[editTab] || ''}
                        onChange={(e) => {
                          const val = { ...(currentEditingItem.title || {}), [editTab]: e.target.value };
                          setLocalEditData({ ...currentEditingItem, title: val });
                        }}
                        icon={Type}
                        className="!py-4 !rounded-2xl"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Linked Treatment (Category)</label>
                        <select
                          value={currentEditingItem.treatment_id || ''}
                          onChange={(e) => {
                            const selectedTreatment = state.treatments.find(t => String(t.id) === String(e.target.value));
                            if (selectedTreatment) {
                              setLocalEditData({ 
                                ...currentEditingItem, 
                                treatment_id: selectedTreatment.id,
                                category: selectedTreatment.title 
                              });
                            }
                          }}
                          className="w-full px-6 py-4 bg-secondary/5 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none font-bold text-secondary"
                        >
                          <option value="">Select Treatment</option>
                          {state.treatments.map(t => {
                            const title = typeof t.title === 'object' ? t.title[editTab] || t.title.en : t.title;
                            return <option key={t.id} value={t.id}>{title}</option>;
                          })}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Read Time ({editTab.toUpperCase()})</label>
                        <DashboardInput
                          value={currentEditingItem.read_time?.[editTab] || ''}
                          onChange={(e) => {
                            const val = { ...(currentEditingItem.read_time || {}), [editTab]: e.target.value };
                            setLocalEditData({ ...currentEditingItem, read_time: val });
                          }}
                          icon={Type}
                          className="!py-4 !rounded-2xl"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Excerpt ({editTab.toUpperCase()})</label>
                      <textarea
                        value={currentEditingItem.excerpt?.[editTab] || ''}
                        onChange={(e) => {
                          const val = { ...(currentEditingItem.excerpt || {}), [editTab]: e.target.value };
                          setLocalEditData({ ...currentEditingItem, excerpt: val });
                        }}
                        className="w-full px-6 py-4 bg-secondary/5 border-none rounded-[2rem] focus:ring-2 focus:ring-primary/20 transition-all outline-none min-h-[100px] resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Content ({editTab.toUpperCase()})</label>
                      <textarea
                        value={currentEditingItem.content?.[editTab] || ''}
                        onChange={(e) => {
                          const val = { ...(currentEditingItem.content || {}), [editTab]: e.target.value };
                          setLocalEditData({ ...currentEditingItem, content: val });
                        }}
                        placeholder="Write article content here (HTML supported)..."
                        className="w-full px-6 py-4 bg-secondary/5 border-none rounded-[2rem] focus:ring-2 focus:ring-primary/20 transition-all outline-none min-h-[300px] font-mono text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Author ({editTab.toUpperCase()})</label>
                        <DashboardInput
                          value={currentEditingItem.author?.[editTab] || ''}
                          onChange={(e) => {
                            const val = { ...(currentEditingItem.author || {}), [editTab]: e.target.value };
                            setLocalEditData({ ...currentEditingItem, author: val });
                          }}
                          icon={User}
                          className="!py-4 !rounded-2xl"
                        />
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Article Image</label>
                         <div className="relative aspect-video rounded-3xl overflow-hidden bg-secondary/5 border-2 border-dashed border-secondary/10 group">
                            {currentEditingItem.media_url ? (
                              <img src={currentEditingItem.media_url} className="w-full h-full object-cover" />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-secondary/30">
                                <Plus className="w-8 h-8" />
                              </div>
                            )}
                            <input 
                              type="file" 
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const toastId = toast.loading('Uploading images...');
                                try {
                                  const res = await (clinicService as any).uploadMedia(file);
                                  const url = res?.full_url || res?.url || res?.data?.full_url;
                                  const mediaId = res?.id || res?.data?.id;
                                  setLocalEditData({ ...currentEditingItem, media_url: url, image_id: mediaId });
                                  toast.success('Image uploaded', { id: toastId });
                                } catch (err) {
                                  toast.error('Upload failed', { id: toastId });
                                }
                              }}
                            />
                         </div>
                      </div>
                    </div>
                  </div>
                )}

                {type === 'doctors' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Doctor Name</label>
                      <DashboardInput
                        value={currentEditingItem.name ?? ''}
                        onChange={(e) => setLocalEditData({ ...currentEditingItem, name: e.target.value })}
                        icon={User}
                        className="!py-4 !rounded-2xl"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Specialty ({editTab.toUpperCase()})</label>
                        <DashboardInput
                          value={currentEditingItem.specialty?.[editTab] || ''}
                          onChange={(e) => {
                            const val = { ...(currentEditingItem.specialty || {}), [editTab]: e.target.value };
                            setLocalEditData({ ...currentEditingItem, specialty: val });
                          }}
                          icon={Award}
                          className="!py-4 !rounded-2xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Rating (1-5)</label>
                        <DashboardInput
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={currentEditingItem.rating ?? 5}
                          onChange={(e) => setLocalEditData({ ...currentEditingItem, rating: parseFloat(e.target.value) })}
                          icon={Star}
                          className="!py-4 !rounded-2xl"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Experience (Years)</label>
                        <DashboardInput
                          value={currentEditingItem.experience ?? ''}
                          onChange={(e) => setLocalEditData({ ...currentEditingItem, experience: e.target.value })}
                          icon={Info}
                          className="!py-4 !rounded-2xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Patients Count</label>
                        <DashboardInput
                          value={currentEditingItem.patients ?? ''}
                          onChange={(e) => setLocalEditData({ ...currentEditingItem, patients: e.target.value })}
                          icon={Users}
                          className="!py-4 !rounded-2xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Biography ({editTab.toUpperCase()})</label>
                      <textarea
                        value={currentEditingItem.bio?.[editTab] || ''}
                        onChange={(e) => {
                          const val = { ...(currentEditingItem.bio || {}), [editTab]: e.target.value };
                          setLocalEditData({ ...currentEditingItem, bio: val });
                        }}
                        className="w-full px-6 py-4 bg-secondary/5 border-none rounded-[2rem] focus:ring-2 focus:ring-primary/20 transition-all outline-none min-h-[120px] resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Profile Image</label>
                      <div className="relative aspect-video rounded-3xl overflow-hidden bg-secondary/5 border-2 border-dashed border-secondary/10 group">
                        {(currentEditingItem.media_url || currentEditingItem.image) ? (
                          <img src={currentEditingItem.media_url || currentEditingItem.image} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-secondary/30">
                            <Plus className="w-8 h-8" />
                          </div>
                        )}
                        <input 
                          type="file" 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const toastId = toast.loading('Uploading images...');
                            try {
                              const res = await (clinicService as any).uploadMedia(file);
                              const url = res?.full_url || res?.url || res?.data?.full_url;
                              const mediaId = res?.id || res?.data?.id;
                              setLocalEditData({ ...currentEditingItem, media_url: url, image_id: mediaId });
                              toast.success('Image uploaded', { id: toastId });
                            } catch (err) {
                              toast.error('Upload failed', { id: toastId });
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {type === 'treatments' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Treatment Title ({editTab.toUpperCase()})</label>
                        <DashboardInput
                          value={currentEditingItem.title?.[editTab] || ''}
                          onChange={(e) => {
                            const val = { ...(currentEditingItem.title || {}), [editTab]: e.target.value };
                            setLocalEditData({ ...currentEditingItem, title: val });
                          }}
                          icon={Type}
                          className="!py-4 !rounded-2xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Slug (URL)</label>
                        <DashboardInput
                          value={currentEditingItem.slug || ''}
                          onChange={(e) => setLocalEditData({ ...currentEditingItem, slug: e.target.value })}
                          icon={LinkIcon}
                          className="!py-4 !rounded-2xl font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Category ({editTab.toUpperCase()})</label>
                        <DashboardInput
                          value={currentEditingItem.category?.[editTab] || ''}
                          onChange={(e) => {
                            const val = { ...(currentEditingItem.category || {}), [editTab]: e.target.value };
                            setLocalEditData({ ...currentEditingItem, category: val });
                          }}
                          icon={Info}
                          className="!py-4 !rounded-2xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Template Type</label>
                        <select
                          value={currentEditingItem.template_type || 'standard'}
                          onChange={(e) => setLocalEditData({ ...currentEditingItem, template_type: e.target.value })}
                          className="w-full px-6 py-4 bg-secondary/5 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none"
                        >
                          <option value="standard">Standard</option>
                          <option value="dental">Dental</option>
                          <option value="hair">Hair</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Duration ({editTab.toUpperCase()})</label>
                        <DashboardInput
                          value={currentEditingItem.duration?.[editTab] || ''}
                          onChange={(e) => {
                            const val = { ...(currentEditingItem.duration || {}), [editTab]: e.target.value };
                            setLocalEditData({ ...currentEditingItem, duration: val });
                          }}
                          icon={Info}
                          className="!py-4 !rounded-2xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Success Rate (%)</label>
                        <DashboardInput
                          type="number"
                          value={currentEditingItem.success_rate ?? 100}
                          onChange={(e) => setLocalEditData({ ...currentEditingItem, success_rate: parseFloat(e.target.value) })}
                          icon={Star}
                          className="!py-4 !rounded-2xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Short Description ({editTab.toUpperCase()})</label>
                      <textarea
                        value={currentEditingItem.description?.[editTab] || ''}
                        onChange={(e) => {
                          const val = { ...(currentEditingItem.description || {}), [editTab]: e.target.value };
                          setLocalEditData({ ...currentEditingItem, description: val });
                        }}
                        className="w-full px-6 py-4 bg-secondary/5 border-none rounded-[2rem] focus:ring-2 focus:ring-primary/20 transition-all outline-none min-h-[100px] resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-secondary uppercase tracking-widest px-1">Header Image</label>
                      <div className="relative aspect-video rounded-3xl overflow-hidden bg-secondary/5 border-2 border-dashed border-secondary/10 group">
                        {(currentEditingItem.media_url || currentEditingItem.image) ? (
                          <img src={currentEditingItem.media_url || currentEditingItem.image} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-secondary/30">
                            <Plus className="w-8 h-8" />
                          </div>
                        )}
                        <input 
                          type="file" 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const toastId = toast.loading('Uploading images...');
                            try {
                              const res = await (clinicService as any).uploadMedia(file);
                              const url = res?.full_url || res?.url || res?.data?.full_url;
                              const mediaId = res?.id || res?.data?.id;
                              setLocalEditData({ ...currentEditingItem, media_url: url, media_id: mediaId });
                              toast.success('Image uploaded', { id: toastId });
                            } catch (err) {
                              toast.error('Upload failed', { id: toastId });
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}


              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-secondary/5 bg-secondary/[0.01] flex justify-end">
                <DashboardButton 
                  onClick={async () => {
                    // Simple validation
                    if (type === 'testimonials' && !currentEditingItem.patient_name?.en && !currentEditingItem.name) {
                      setErrors({ name: t('auth.error.required') });
                      return;
                    }
                    if (type === 'stats' && !currentEditingItem.value) {
                      setErrors({ value: t('auth.error.required') });
                      return;
                    }
                    if (type === 'doctors' && !currentEditingItem.name) {
                      setErrors({ name: t('auth.error.required') });
                      return;
                    }

                    // Save to API
                    try {
                      // Get current data from local state
                      const payload = { ...currentEditingItem };
                      
                      // FINAL HARDENING for Stats fields (ensuring no NULL in database)
                      if (type === 'stats') {
                        payload.value = (payload.value === null || payload.value === undefined || String(payload.value).trim() === '') ? "0" : String(payload.value);
                        payload.suffix = (payload.suffix === null || payload.suffix === undefined) ? "" : String(payload.suffix);
                        payload.label = payload.label || { en: "", ar: "", fr: "", ru: "" };
                        
                        // Ensure numerical consistency
                        if (isNaN(Number(payload.value))) {
                          payload.value = "0";
                        }
                      }

                      // FINAL HARDENING for Doctors
                      if (type === 'doctors') {
                        payload.rating = isNaN(Number(payload.rating)) ? 5 : Number(payload.rating);
                        payload.experience = payload.experience || "0";
                        payload.patients = payload.patients || "0";
                        
                        // Ensure all multilingual fields are objects
                        const defaultMulti = { en: "", ar: "", fr: "", ru: "" };
                        payload.specialty = typeof payload.specialty === 'object' ? payload.specialty : defaultMulti;
                        payload.bio = typeof payload.bio === 'object' ? payload.bio : defaultMulti;
                        payload.specialties = typeof payload.specialties === 'object' ? payload.specialties : defaultMulti;
                        payload.languages = typeof payload.languages === 'object' ? payload.languages : defaultMulti;
                        
                        // Remove the relationship object to avoid 422 validation errors in the backend
                        if (payload.image) delete payload.image;
                      }

                      if (editingId === 'new') {
                        // Creating new item
                        await addGeneric(singularType as any, payload);
                        toast.success('Successfully created ' + singularType);
                      } else {
                        // Updating existing item
                        const numId = Number(editingId);
                        if (!isNaN(numId) && numId > 0) {
                          await updateGeneric(singularType as any, numId, payload);
                          toast.success('Successfully updated ' + singularType);
                        } else {
                          throw new Error('Invalid item ID');
                        }
                      }
                      closeModal();
                    } catch (err) {
                      toast.error('Save failed. Please check your inputs.');
                      console.error(err);
                    }
                  }}
                  icon={Save}
                  variant="primary"
                  className="shadow-xl"
                >
                  {t('dashboard.save')}
                </DashboardButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
