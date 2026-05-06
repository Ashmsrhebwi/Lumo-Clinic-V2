import React, { useState } from 'react';
import { useDashboard, LanguageCode } from '../../context/DashboardContext';
import { useLanguage } from '../../context/LanguageContext';
import { Save, RefreshCcw, Phone, MessageSquare, Power, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  DashboardCard,
  DashboardInput,
  DashboardButton,
  SectionHeader,
  StatusBadge,
  LanguageTabs
} from './UI';

export function WhatsAppManager() {
  const { state, updateWhatsApp } = useDashboard();
  const { t } = useLanguage();
  const [whatsapp, setWhatsapp] = useState(state.whatsapp);
  const [activeLang, setActiveLang] = useState<LanguageCode>('en');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await new Promise((r) => setTimeout(r, 800));
      await updateWhatsApp(whatsapp);
      toast.success(t('dashboard.whatsapp.save'));
    } catch (error) {
      console.error(error);
      toast.error('Failed to save WhatsApp settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setWhatsapp(state.whatsapp);
    toast.info(t('dashboard.discarded'));
  };

  const updateMessage = (val: string) => {
    setWhatsapp({
      ...whatsapp,
      message: {
        ...whatsapp.message,
        [activeLang]: val
      }
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <SectionHeader
        title={t('dashboard.whatsapp.title')}
        description={t('dashboard.whatsapp.desc')}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-7 space-y-8">
          <DashboardCard>
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${whatsapp.enabled
                        ? 'bg-[#25D366]/10 text-[#25D366]'
                        : 'bg-secondary/10 text-secondary/40'
                      }`}
                  >
                    <Power className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-secondary">
                      {t('dashboard.whatsapp.enabled')}
                    </h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                      {t('dashboard.whatsapp.visibility')}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setWhatsapp({ ...whatsapp, enabled: !whatsapp.enabled })}
                  className={`w-16 h-9 rounded-full transition-all relative ${whatsapp.enabled ? 'bg-[#25D366]' : 'bg-secondary/20'
                    }`}
                  type="button"
                >
                  <div
                    className={`absolute top-1.5 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${whatsapp.enabled ? 'left-8' : 'left-1.5'
                      }`}
                  />
                </button>
              </div>

              <div className="pt-6 border-t border-secondary/5 space-y-8">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-secondary/60">
                    {t('dashboard.branding.general')}
                  </h4>
                  <LanguageTabs activeLang={activeLang} onLangChange={setActiveLang} />
                </div>

                <DashboardInput
                  label={t('dashboard.whatsapp.number')}
                  value={whatsapp.phoneNumber}
                  onChange={(e) =>
                    setWhatsapp({ ...whatsapp, phoneNumber: e.target.value })
                  }
                  placeholder="e.g. +90 212 555 0123"
                  icon={Phone}
                />

                <DashboardInput
                  label="Russian WhatsApp Number"
                  value={whatsapp.ruPhoneNumber || ''}
                  onChange={(e) =>
                    setWhatsapp({ ...whatsapp, ruPhoneNumber: e.target.value })
                  }
                  placeholder="e.g. +7 999 123 45 67"
                  icon={Phone}
                />

                <DashboardInput
                  label={`${t('dashboard.whatsapp.message_key')} (${activeLang.toUpperCase()})`}
                  value={whatsapp.message[activeLang]}
                  onChange={(e) => updateMessage(e.target.value)}
                  placeholder="e.g. How can we help you?"
                  icon={MessageSquare}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <DashboardButton
                  onClick={handleSave}
                  loading={isSaving}
                  className="flex-1 !bg-[#25D366] hover:bg-[#20ba59] shadow-[#25D366]/20"
                  icon={Save}
                  size="lg"
                >
                  {t('dashboard.whatsapp.save')}
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

          <DashboardCard padding="sm" className="bg-[#25D366]/5 border-[#25D366]/10">
            <div className="flex items-start gap-4 p-2">
              <div className="p-3 bg-white rounded-2xl shadow-sm text-[#25D366]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-secondary text-sm">
                  {t('dashboard.whatsapp.practices')}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t('dashboard.whatsapp.practices_desc')}
                </p>
              </div>
            </div>
          </DashboardCard>
        </div>

        <div className="xl:col-span-5">
          <DashboardCard
            variant="dark"
            className="sticky top-8 flex flex-col items-center justify-center h-[400px] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#25D366]/5" />
            <div className="relative z-10 flex flex-col items-center gap-8">
              <div className="relative">
                <div className="w-24 h-24 bg-[#25D366] rounded-[2.5rem] shadow-2xl shadow-[#25D366]/40 flex items-center justify-center animate-bounce">
                  <MessageSquare className="w-12 h-12 text-white" />
                </div>

                {whatsapp.enabled && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-[#25D366]">
                    <div className="w-2 h-2 bg-[#25D366] rounded-full animate-ping" />
                  </div>
                )}
              </div>

              <div className="text-center space-y-3">
                <StatusBadge variant={whatsapp.enabled ? 'success' : 'neutral'}>
                  {whatsapp.enabled
                    ? t('dashboard.whatsapp.active')
                    : t('dashboard.whatsapp.hidden')}
                </StatusBadge>

                <p className="text-sm font-bold opacity-60 max-w-[200px] leading-relaxed">
                  {whatsapp.enabled
                    ? t('dashboard.whatsapp.active_desc')
                    : t('dashboard.whatsapp.hidden_desc')}
                </p>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}