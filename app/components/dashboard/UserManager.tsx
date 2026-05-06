import React, { useState } from 'react';
import { useDashboard, CMSUser } from '../../context/DashboardContext';
import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, Trash2, Shield, Mail, User, ShieldCheck, ShieldAlert, X, Save } from 'lucide-react';
import { toast } from 'sonner';
import { 
  DashboardCard, 
  DashboardInput, 
  DashboardButton, 
  SectionHeader,
  StatusBadge
} from './UI';

export function UserManager() {
  const { state, addUser, deleteUser } = useDashboard();
  const { t } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'editor'>('editor');

  const handleAdd = () => {
    if (!newName || !newEmail) {
      toast.error(t('dashboard.users.error.fields'));
      return;
    }
    const id = Math.random().toString(36).substr(2, 9);
    addUser({ id, name: newName, email: newEmail, role: newRole });
    setNewName('');
    setNewEmail('');
    setIsAdding(false);
    toast.success(t('dashboard.users.success.added'));
  };

  const handleDelete = (id: string) => {
    if (id === '1') {
      toast.error(t('dashboard.users.error.primary'));
      return;
    }
    deleteUser(id);
    toast.success(t('dashboard.users.success.removed'));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <SectionHeader 
        title={t('dashboard.users.title')} 
        description={t('dashboard.users.desc')}
        actions={
          <DashboardButton icon={UserPlus} onClick={() => setIsAdding(true)}>
            {t('dashboard.users.add_user')}
          </DashboardButton>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <DashboardCard className="!p-0 overflow-hidden">
            <div className="p-8 border-b border-secondary/5 bg-secondary/[0.02] flex items-center justify-between">
               <h3 className="font-bold text-secondary">{t('dashboard.users.authorized')}</h3>
               <StatusBadge variant="info">{state.users.length} {t('dashboard.users.active_accts')}</StatusBadge>
            </div>
            
            <div className="divide-y divide-secondary/5">
              {state.users.map((user) => (
                <div key={user.id} className="p-6 flex items-center justify-between hover:bg-secondary/[0.01] transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${user.role === 'admin' ? 'bg-primary text-white shadow-primary/20' : 'bg-secondary/5 text-secondary/40'}`}>
                      {user.role === 'admin' ? <ShieldCheck className="w-6 h-6" /> : <User className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-secondary flex items-center gap-2 text-lg">
                        {user.name}
                        {user.id === '1' && <StatusBadge variant="neutral">{t('dashboard.users.primary')}</StatusBadge>}
                      </h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5" />
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="hidden md:flex flex-col items-end">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary/40'}`}>
                        {user.role}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className={`p-3 rounded-xl transition-all ${user.id === '1' ? 'opacity-0 pointer-events-none' : 'text-red-400/30 hover:text-red-500 hover:bg-red-50'}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsAdding(false)}
               className="absolute inset-0 bg-secondary/80 backdrop-blur-md"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden shadow-black/20"
             >
                <div className="p-10 space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold text-secondary">{t('dashboard.users.invite')}</h3>
                      <p className="text-sm text-muted-foreground">{t('dashboard.users.invite_desc')}</p>
                    </div>
                    <button onClick={() => setIsAdding(false)} className="p-3 hover:bg-secondary/5 rounded-2xl transition-colors">
                      <X className="w-6 h-6 text-secondary/30" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <DashboardInput 
                      label={t('dashboard.users.full_name')} 
                      placeholder="e.g. Jane Doe" 
                      value={newName} 
                      onChange={(e) => setNewName(e.target.value)}
                      icon={User}
                    />
                    <DashboardInput 
                      label={t('dashboard.users.email')} 
                      placeholder="e.g. jane@gravity.clinic" 
                      value={newEmail} 
                      onChange={(e) => setNewEmail(e.target.value)}
                      icon={Mail}
                    />
                    
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-secondary/60 ml-1">{t('dashboard.users.assign_role')}</label>
                      <div className="flex gap-4">
                        {(['admin', 'editor'] as const).map((role) => (
                          <button
                            key={role}
                            onClick={() => setNewRole(role)}
                            className={`flex-1 p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 text-center ${newRole === role ? 'border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10' : 'border-secondary/5 hover:border-secondary/10'}`}
                          >
                            {role === 'admin' ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                            <span className="font-bold capitalize">{role}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <DashboardButton 
                    className="w-full" 
                    size="lg" 
                    icon={Save} 
                    onClick={handleAdd}
                  >
                    {t('dashboard.users.confirm_invite')}
                  </DashboardButton>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
