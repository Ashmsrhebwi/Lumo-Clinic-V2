import { useLanguage } from '../../context/LanguageContext';
import { useDashboard } from '../../context/DashboardContext';
import { Link } from 'react-router';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  X,
  Linkedin,
  Youtube
} from 'lucide-react';

const TikTokIcon = (props: any) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const iconMap: Record<string, any> = {
  Facebook,
  Instagram,
  Twitter,
  X,
  Linkedin,
  TikTok: TikTokIcon,
  YouTube: Youtube,
  Youtube: Youtube
};

export function Footer() {
  const { language, t } = useLanguage();
  const { state } = useDashboard();

  const getVal = (val: any) => {
    if (!val) return "";
    if (typeof val === 'string') return val;
    return val[language] || val.en || "";
  };

  const getBrandBaseColor = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return 'text-[#E4405F]';
      case 'Facebook':
        return 'text-[#1877F2]';
      case 'Linkedin':
        return 'text-[#0A66C2]';
      case 'TikTok':
        return 'text-[#FE2C55]';
      case 'YouTube':
        return 'text-[#FF0000]';
      default:
        return 'text-primary';
    }
  };

  const getBrandHoverEffects = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return 'hover:shadow-[#E4405F]/40 hover:border-[#E4405F]/40 hover:bg-[#E4405F]/5';
      case 'Facebook':
        return 'hover:shadow-[#1877F2]/40 hover:border-[#1877F2]/40 hover:bg-[#1877F2]/5';
      case 'Linkedin':
        return 'hover:shadow-[#0A66C2]/40 hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/5';
      case 'TikTok':
        return 'hover:shadow-[#FE2C55]/40 hover:border-[#FE2C55]/40 hover:bg-[#FE2C55]/5';
      case 'YouTube':
        return 'hover:shadow-[#FF0000]/40 hover:border-[#FF0000]/40 hover:bg-[#FF0000]/5';
      default:
        return 'hover:shadow-primary/30 hover:border-primary/40 hover:bg-primary/5';
    }
  };

  return (
    <footer className="bg-secondary text-white pt-24 pb-32 lg:pb-12 overflow-hidden relative" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-12 sm:gap-16 mb-20 lg:items-start">
          <div className="space-y-8 max-w-sm">
            <div className="space-y-6">
              <div className="bg-white/10 p-4 rounded-3xl inline-block backdrop-blur-md border border-white/10">
                <img src={state.branding.logo || "/logo"} alt={getVal(state.branding.name)} className="h-10 w-auto" />
              </div>
              <p className="text-white/60 leading-relaxed text-sm max-w-xs">
                {getVal(state.seo.description) || getVal(state.branding.name) || 'World-class medical tourism in Istanbul.'}
              </p>
            </div>

            {/* Integrated Social Section */}
            <div className="bg-white/[0.06] backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-7 space-y-6 relative group/social overflow-hidden shadow-2xl shadow-black/30">
              {/* Subtle accent glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-40" />
              
              <div className="space-y-2 relative z-10">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/90">
                  {t('footer.social_follow')}
                </h3>
                <p className="text-white/50 text-[12px] font-semibold leading-relaxed">
                  {t('footer.social_desc')}
                </p>
              </div>

              <div className="flex items-center gap-4 relative z-10">
                {(state.socialLinks.length > 0 ? state.socialLinks : [
                  { id: 'instagram', platform: 'Instagram', icon_name: 'Instagram', url: 'https://www.instagram.com/gravityclinicofficial/' },
                  { id: 'facebook', platform: 'Facebook', icon_name: 'Facebook', url: 'https://www.facebook.com/GARVITYCLINICOFFICIAL/' },
                  { id: 'tiktok', platform: 'TikTok', icon_name: 'TikTok', url: 'https://www.tiktok.com/@gravityclinic?_r=1&_t=ZS-95au6KjxlDu' },
                  { id: 'youtube', platform: 'YouTube', icon_name: 'YouTube', url: 'https://www.youtube.com/channel/UCpeRizxKJ-rerTR8dxgdyYg' }
                ]).filter(l => l.is_active !== false).map((link, i) => {
                  const Icon = iconMap[link.icon_name] || iconMap[link.platform] || Instagram;

                  return (
                    <a
                      key={link.id || `social-${i}-${link.platform}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group/icon w-11 h-11 rounded-2xl bg-white/[0.08] backdrop-blur-md flex items-center justify-center border border-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.08] hover:shadow-xl active:scale-95 ${getBrandHoverEffects(link.platform)}`}
                      aria-label={`Follow Gravity Clinic on ${link.platform}`}
                      title={link.platform}
                    >
                      <Icon
                        className={`w-5 h-5 transition-all duration-300 ${getBrandBaseColor(link.platform)} opacity-90 group-hover/icon:scale-110 group-hover/icon:opacity-100 group-hover/icon:brightness-125`}
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-8 flex-1 lg:justify-center">
            {state.navLinks.map((section, idx) => (
              <div key={section.id || `footer-sec-${idx}`} className="min-w-[120px]">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-primary">
                  {getVal(section.label)}
                </h3>
                <ul className="space-y-4">
                  {section.children?.map((item: any, cidx: number) => (
                    <li key={item.id || item.slug || `footer-item-${idx}-${cidx}`}>
                      <Link to={item.path || '#'} className="text-white/40 hover:text-white hover:translate-x-1 transition-all inline-block text-[13px] font-bold">
                        {getVal(item.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-auto lg:min-w-[280px]">
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl h-full">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-white">{t('footer.contact')}</h3>
              <ul className="space-y-8 lg:space-y-6">
                {[
                  {
                    id: 'whatsapp',
                    icon: Phone,
                    label: t('footer.whatsapp'),
                    value: state.whatsapp.phoneNumber || state.locations[0]?.phone
                  },
                  {
                    id: 'location',
                    icon: MapPin,
                    label: getVal(state.locations[0]?.city) || t('footer.istanbul'),
                    value: getVal(state.locations[0]?.address) || t('footer.address') || 'Istanbul, Turkey'
                  },
                  ...(state.locations[0]?.email
                    ? [{
                      id: 'email',
                      icon: Mail,
                      label: t('footer.email') || 'Email Us',
                      value: state.locations[0].email
                    }]
                    : [])
                ].map((item) => (
                  <li key={item.id} className="flex flex-col items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-all duration-300">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-primary font-black uppercase tracking-[0.4em] mb-2 opacity-80">
                        {item.label}
                      </p>
                      <p className={`font-bold text-white transition-colors duration-300 ${item.icon === Phone ? 'text-lg sm:text-xl whitespace-nowrap' : 'text-sm leading-relaxed'}`}>
                        {item.value ?? ''}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>



        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-left">
            <div className="text-white/30 text-[11px] font-medium tracking-wide">
              {t('footer.copyright')}
            </div>

            <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
              <a href="#" className="hover:text-primary transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="hover:text-primary transition-colors">{t('footer.terms')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}