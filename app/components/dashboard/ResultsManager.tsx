import React, { useState } from 'react';
import { useDashboard, Result } from '../../context/DashboardContext';
import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Image as ImageIcon, 
  Search,
  ChevronRight,
  Upload,
  Split
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  DashboardCard, 
  DashboardInput, 
  DashboardButton, 
  SectionHeader,
  LanguageTabs
} from './UI';
import { LanguageCode } from '../../context/DashboardContext';

export function ResultsManager() {
  const { state } = useDashboard();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLang, setActiveLang] = useState<LanguageCode>('en');

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-secondary">{t('dashboard.results.title')}</h2>
          <p className="text-muted-foreground max-w-lg">{t('dashboard.results.desc')}</p>
        </div>
        
        <div className="flex flex-col items-end gap-6">
          <LanguageTabs activeLang={activeLang} onLangChange={setActiveLang} />
          <button className="bg-primary text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" /> {t('dashboard.results.new')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {state.results.map((result) => (
          <div key={result.id} className="bg-white rounded-[3rem] shadow-xl shadow-secondary/5 border border-secondary/5 overflow-hidden group">
            <div className="grid grid-cols-2 gap-1 p-2 h-80 relative">
               <div className="relative overflow-hidden rounded-l-[2.5rem]">
                 <img src={result.beforeImage} className="w-full h-full object-cover" />
               </div>
               <div className="relative overflow-hidden rounded-r-[2.5rem]">
                 <img src={result.afterImage} className="w-full h-full object-cover" />
               </div>
               <div className="absolute inset-x-0 bottom-8 flex justify-center">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Split className="w-6 h-6" />
                  </div>
               </div>
            </div>

            <div className="p-10 space-y-6">
               <div className="flex items-start justify-between">
                 <div className="space-y-1">
                    <p className="text-xs font-black text-primary uppercase tracking-widest">{result.category[activeLang]}</p>
                    <h3 className="text-2xl font-bold text-secondary tracking-tight">{result.title[activeLang]}</h3>
                    <p className="text-sm text-secondary/40 font-medium italic">{result.patient[activeLang]}</p>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-3 bg-secondary/5 text-secondary rounded-2xl hover:bg-primary/10 hover:text-primary transition-all">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-secondary/5 text-secondary rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                 </div>
               </div>
               <p className="text-muted-foreground leading-relaxed">"{result.text[activeLang]}"</p>
               
               <div className="pt-4 flex gap-4">
                  <div className="flex-1 p-4 bg-secondary/5 rounded-2xl border border-secondary/5 space-y-2">
                    <p className="text-[10px] font-black text-secondary/40 uppercase tracking-widest">{t('dashboard.results.matrix')}</p>
                    <p className="text-xs font-bold text-secondary truncate">{result.beforeImage.split('/').pop()}</p>
                  </div>
                  <div className="flex-1 p-4 bg-secondary/5 rounded-2xl border border-secondary/5 space-y-2">
                    <p className="text-[10px] font-black text-secondary/40 uppercase tracking-widest">{t('dashboard.results.path')}</p>
                    <p className="text-xs font-bold text-secondary truncate">{result.afterImage.split('/').pop()}</p>
                  </div>
               </div>
            </div>
          </div>
        ))}

        <div className="bg-primary/5 rounded-[3rem] border-2 border-dashed border-primary/20 flex flex-col items-center justify-center p-20 text-center space-y-6 animate-pulse min-h-[400px]">
           <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-lg text-primary">
             <ImageIcon className="w-10 h-10" />
           </div>
           <div>
             <h4 className="text-xl font-bold text-secondary">{t('dashboard.results.drop')}</h4>
             <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">{t('dashboard.results.drop_hint')}</p>
           </div>
        </div>
      </div>
    </div>
  );
}
