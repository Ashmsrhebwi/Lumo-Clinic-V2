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
  Youtube,
  ArrowRight
} from 'lucide-react';
import { sanitizeText } from '../../lib/demoUtils';

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
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val[language] || val.en || '';
  };

  const getSocialHover = (platform: string) => {
    switch (platform) {
      case 'Instagram': return 'hover:text-[#E4405F]';
      case 'Facebook':  return 'hover:text-[#1877F2]';
      case 'Linkedin':  return 'hover:text-[#0A66C2]';
      case 'TikTok':    return 'hover:text-[#FE2C55]';
      case 'YouTube':   return 'hover:text-[#FF0000]';
      default:          return 'hover:text-[#0891B2]';
    }
  };

  return (
    <footer
      className="bg-[#0B1C2D] pt-32 pb-12 lg:pt-48"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Editorial Statement & Logo Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-16 mb-32">
          <div className="max-w-3xl">
            <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif italic text-white leading-[1.1] tracking-tight mb-8">
              {language === 'ar' ? 'فن التميز الطبي.' : 'The Art of Medical Excellence.'}
            </h2>
            <p className="text-white/40 text-xl font-body font-light max-w-xl leading-relaxed">
              {getVal(state.seo.description) || getVal(state.branding.name) || 'Experience absolute luxury and world-class concierge healthcare in the heart of Istanbul.'}
            </p>
          </div>
          <div className="flex-shrink-0">
            <img
              src={state.branding.logo || '/logo'}
              alt={getVal(state.branding.name)}
              className="h-12 w-auto opacity-90"
            />
          </div>
        </div>

        {/* Structural Divider */}
        <div className="w-full h-[1px] bg-white/10 mb-24"></div>

        {/* Minimalist Data Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-12 mb-32">
          
          {/* Navigation */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-12">
            {state.navLinks.map((section, idx) => (
              <div key={section.id || `footer-sec-${idx}`}>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#0891B2] mb-8">
                  {getVal(section.label)}
                </h3>
                <ul className="space-y-4">
                  {section.children?.map((item: any, cidx: number) => (
                    <li key={item.id || item.slug || `footer-item-${idx}-${cidx}`}>
                      <Link
                        to={item.path || '#'}
                        className="text-white/50 hover:text-white text-lg font-body font-light transition-all duration-300 inline-flex items-center group"
                      >
                        {getVal(item.label)}
                        <ArrowRight className={`w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#0891B2] ${language === 'ar' ? 'rotate-180 mr-2 ml-0 translate-x-2 group-hover:-translate-x-0' : ''}`} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#0891B2] mb-8">
              {t('footer.contact') || 'INQUIRIES'}
            </h3>
            <ul className="space-y-8">
              {[
                {
                  id: 'whatsapp',
                  label: t('footer.whatsapp') || 'WhatsApp / Phone',
                  value: state.whatsapp.phoneNumber || state.locations[0]?.phone
                },
                ...(state.locations[0]?.email
                  ? [{
                      id: 'email',
                      label: t('footer.email') || 'Email',
                      value: state.locations[0].email
                    }]
                  : [])
              ].map((item) => (
                <li key={item.id} className="group">
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 mb-2">
                    {item.label}
                  </p>
                  <p className="text-white/80 font-serif italic text-2xl group-hover:text-[#0891B2] transition-colors duration-500 cursor-pointer" dir={item.id === 'whatsapp' ? 'ltr' : 'auto'}>
                    {item.value ?? ''}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Headquarters & Socials */}
          <div className="lg:col-span-3 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#0891B2] mb-8">
                {t('footer.istanbul') || 'HEADQUARTERS'}
              </h3>
              <p className="text-white/50 text-lg font-body font-light leading-relaxed mb-6">
                {getVal(state.locations[0]?.address) || t('footer.address') || 'Istanbul, Turkey'}
              </p>
            </div>

            <div className="mt-12 lg:mt-0">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#0891B2] mb-6">
                {t('footer.social_follow') || 'CONNECT'}
              </h3>
              <div className="flex items-center gap-6">
                {(state.socialLinks.length > 0 ? state.socialLinks : [
                  { id: 'instagram', platform: 'Instagram', icon_name: 'Instagram', url: 'https://www.instagram.com/lumoclinic/' },
                  { id: 'facebook',  platform: 'Facebook',  icon_name: 'Facebook',  url: 'https://www.facebook.com/lumoclinic/' },
                  { id: 'tiktok',    platform: 'TikTok',    icon_name: 'TikTok',    url: 'https://www.tiktok.com/@lumoclinic' },
                  { id: 'youtube',   platform: 'YouTube',   icon_name: 'YouTube',   url: 'https://www.youtube.com/channel/UCpeRizxKJ-rerTR8dxgdyYg' }
                ]).filter(l => l.is_active !== false).map((link, i) => {
                  const Icon = iconMap[link.icon_name] || iconMap[link.platform] || Instagram;
                  return (
                    <a
                      key={link.id || `social-${i}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-white/40 transition-all duration-300 hover:-translate-y-1 ${getSocialHover(link.platform)}`}
                      aria-label={link.platform}
                      title={link.platform}
                    >
                      <Icon className="w-6 h-6" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em] text-center md:text-left">
            {t('footer.copyright')}
          </p>

          <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em]">
            <a href="#" className="text-white/30 hover:text-[#0891B2] transition-colors duration-500">
              {t('footer.privacy')}
            </a>
            <span className="w-1 h-1 rounded-full bg-white/10"></span>
            <a href="#" className="text-white/30 hover:text-[#0891B2] transition-colors duration-500">
              {t('footer.terms')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}