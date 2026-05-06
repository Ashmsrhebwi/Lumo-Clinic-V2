import React, { useState } from 'react';
import { useDashboard, NavLink } from '../../context/DashboardContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Edit2, 
  ExternalLink, 
  Save, 
  X, 
  Link as LinkIcon, 
  MousePointer2,
  ChevronDown,
  ChevronRight,
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { 
  DashboardCard, 
  DashboardInput, 
  DashboardButton, 
  SectionHeader,
  LanguageTabs,
  StatusBadge 
} from './UI';
import { LanguageCode } from '../../context/DashboardContext';

export function NavbarManager() {
  const { state, addNavLink, updateNavLink, deleteNavLink } = useDashboard();
  const { t } = useLanguage();
  const [newLabel, setNewLabel] = useState<Record<LanguageCode, string>>({ en: '', ar: '', fr: '', ru: '' });
  const [newPath, setNewPath] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState<Record<LanguageCode, string>>({ en: '', ar: '', fr: '', ru: '' });
  const [editPath, setEditPath] = useState('');
  const [activeLang, setActiveLang] = useState<LanguageCode>('en');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showSubForm, setShowSubForm] = useState<string | null>(null);
  const [newSubLabel, setNewSubLabel] = useState<Record<LanguageCode, string>>({ en: '', ar: '', fr: '', ru: '' });
  const [newSubPath, setNewSubPath] = useState('');

  const handleAdd = () => {
    if (!newLabel[activeLang] && !newLabel['en']) {
      toast.error(t('dashboard.nav.err_label'));
      return;
    }
    const id = Math.random().toString(36).substring(2, 11);
    addNavLink({ id, label: newLabel as any, path: newPath });
    setNewLabel({ en: '', ar: '', fr: '', ru: '' });
    setNewPath('');
    toast.success(t('dashboard.nav.added'));
  };

  const startEdit = (link: NavLink) => {
    setEditingId(link.id);
    setEditLabel(link.label);
    setEditPath(link.path || '');
  };

  const saveEdit = (id: string, currentLink: NavLink) => {
    updateNavLink(id, { ...currentLink, label: editLabel as any, path: editPath || undefined });
    setEditingId(null);
    toast.success(t('dashboard.nav.updated'));
  };

  const handleAddSubItem = (parentId: string, parentLink: NavLink) => {
    if (!newSubLabel[activeLang] && !newSubLabel['en']) {
      toast.error(t('dashboard.nav.err_label'));
      return;
    }
    const items = [...(parentLink.items || []), { 
      label: newSubLabel as any, 
      path: newSubPath 
    }];
    updateNavLink(parentId, { ...parentLink, items, path: undefined });
    setNewSubLabel({ en: '', ar: '', fr: '', ru: '' });
    setNewSubPath('');
    setShowSubForm(null);
    toast.success(t('dashboard.nav.sub_added'));
  };

  const removeSubItem = (parentId: string, parentLink: NavLink, index: number) => {
    const items = [...(parentLink.items || [])];
    items.splice(index, 1);
    updateNavLink(parentId, { ...parentLink, items: items.length > 0 ? items : undefined });
    toast.success(t('dashboard.nav.sub_removed'));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <SectionHeader 
        title={t('dashboard.nav.title')} 
        description={t('dashboard.nav.desc')}
        actions={<LanguageTabs activeLang={activeLang} onLangChange={setActiveLang} />}
      />

      <div className="grid grid-cols-1 gap-8">
        <DashboardCard padding="sm" className="!rounded-[2rem]">
          <div className="flex flex-col md:flex-row items-end gap-6">
            <div className="flex-1 w-full space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Plus className="w-4 h-4 text-primary" />
                <span className="text-xs font-black uppercase tracking-widest text-secondary/40">{t('dashboard.nav.quick_add')} ({activeLang.toUpperCase()})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DashboardInput
                  placeholder={t('dashboard.nav.label_placeholder')}
                  value={newLabel[activeLang]}
                  onChange={(e) => setNewLabel({ ...newLabel, [activeLang]: e.target.value })}
                  icon={MousePointer2}
                  className="!py-3 !rounded-xl"
                />
                <DashboardInput
                  placeholder={t('dashboard.nav.path_placeholder')}
                  value={newPath}
                  onChange={(e) => setNewPath(e.target.value)}
                  icon={LinkIcon}
                  className="!py-3 !rounded-xl"
                />
              </div>
            </div>
            <DashboardButton 
              onClick={handleAdd}
              icon={Plus}
              size="lg"
              className="w-full md:w-auto shrink-0 !py-3.5"
            >
              {t('dashboard.nav.add_btn')}
            </DashboardButton>
          </div>
        </DashboardCard>

        <DashboardCard className="overflow-hidden !p-0">
          <div className="p-8 border-b border-secondary/5 flex items-center justify-between bg-secondary/[0.02]">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-secondary">{t('dashboard.nav.hierarchy')}</h3>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{t('dashboard.nav.managing_in')} {activeLang.toUpperCase()}</p>
                </div>
             </div>
             <StatusBadge variant="info">{state.navLinks.length} {t('dashboard.nav.main_links')}</StatusBadge>
          </div>

          <div className="divide-y divide-secondary/5">
            {state.navLinks.map((link) => (
              <motion.div 
                layout
                key={link.id}
                className="group"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-6 hover:bg-secondary/[0.01] transition-colors">
                  <div className="hidden md:flex shrink-0 p-2 text-secondary/10 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {editingId === link.id ? (
                    <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <DashboardInput 
                        value={editLabel[activeLang]} 
                        onChange={(e) => setEditLabel({ ...editLabel, [activeLang]: e.target.value })}
                        className="!py-2.5 !rounded-xl !text-sm"
                        label={`${t('dashboard.nav.label')} (${activeLang.toUpperCase()})`}
                      />
                      <div className="flex items-center gap-3">
                        <DashboardInput 
                          value={editPath} 
                          onChange={(e) => setEditPath(e.target.value)}
                          placeholder={t('dashboard.nav.path_placeholder')}
                          className="!py-2.5 !rounded-xl !text-sm flex-1"
                          label={t('dashboard.nav.url_path')}
                        />
                        <div className="flex items-end h-full pt-6">
                           <DashboardButton 
                            size="sm" 
                            icon={Save} 
                            onClick={() => saveEdit(link.id, link)}
                            className="!rounded-xl !p-3"
                          />
                          <DashboardButton 
                            size="sm" 
                            variant="ghost" 
                            icon={X} 
                            onClick={() => setEditingId(null)}
                            className="!rounded-xl !p-3 ml-2"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-secondary">{link.label[activeLang]}</span>
                          {link.items ? (
                             <StatusBadge variant="info" className="!py-0.5 !px-2 !text-[9px]">{t('dashboard.nav.dropdown')}</StatusBadge>
                          ) : (
                             <span className="text-xs font-medium text-muted-foreground font-mono">{link.path}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                         {link.items && (
                            <DashboardButton
                              size="sm"
                              variant="outline"
                              icon={expandedId === link.id ? ChevronDown : ChevronRight}
                              onClick={() => setExpandedId(expandedId === link.id ? null : link.id)}
                              className="!rounded-xl !py-2"
                            >
                              {t('dashboard.nav.sub_items')}
                            </DashboardButton>
                         )}
                         <DashboardButton
                          size="sm"
                          variant="outline"
                          icon={Edit2}
                          onClick={() => startEdit(link)}
                          className="!rounded-xl !py-2"
                        >
                          {t('dashboard.edit')}
                        </DashboardButton>
                        {!link.path && (
                           <DashboardButton
                            size="sm"
                            variant="outline"
                            icon={Plus}
                            onClick={() => handleAddSubItem(link.id, link)}
                            className="!rounded-xl !py-2 !bg-primary/5 !border-primary/10 !text-primary"
                          >
                            {t('dashboard.nav.add_sub')}
                          </DashboardButton>
                        )}
                        <DashboardButton
                          size="sm"
                          variant="ghost"
                          icon={Trash2}
                          onClick={() => deleteNavLink(link.id)}
                          className="!rounded-xl text-red-400 hover:text-red-500 hover:bg-red-50"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Sub items display */}
                {expandedId === link.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-8 pb-6 space-y-3"
                  >
                    <div className="bg-secondary/[0.03] rounded-3xl p-6 border border-secondary/5 space-y-4">
                      {link.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2 border-b border-secondary/5 last:border-0 group/sub">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-secondary">{item.label[activeLang]}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">{item.path}</span>
                          </div>
                          <button 
                            onClick={() => removeSubItem(link.id, link, idx)}
                            className="p-2 text-red-400 opacity-0 group-hover/sub:opacity-100 transition-opacity hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      {showSubForm === link.id ? (
                        <div className="pt-4 space-y-4 border-t border-secondary/5">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <DashboardInput
                                placeholder={t('dashboard.nav.label_placeholder')}
                                value={newSubLabel[activeLang]}
                                onChange={(e) => setNewSubLabel({ ...newSubLabel, [activeLang]: e.target.value })}
                                icon={MousePointer2}
                                className="!py-2.5"
                             />
                             <DashboardInput
                                placeholder={t('dashboard.nav.path_placeholder')}
                                value={newSubPath}
                                onChange={(e) => setNewSubPath(e.target.value)}
                                icon={LinkIcon}
                                className="!py-2.5"
                             />
                           </div>
                           <div className="flex gap-3">
                              <DashboardButton 
                                size="sm" 
                                icon={Plus} 
                                onClick={() => handleAddSubItem(link.id, link)}
                                className="flex-1"
                              >
                                {t('dashboard.add')}
                              </DashboardButton>
                              <DashboardButton 
                                size="sm" 
                                variant="ghost" 
                                icon={X} 
                                onClick={() => setShowSubForm(null)}
                                className="!px-4"
                              />
                           </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setShowSubForm(link.id)}
                          className="w-full py-3 border-2 border-dashed border-secondary/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-secondary/30 hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          {t('dashboard.nav.add_new_sub')}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
