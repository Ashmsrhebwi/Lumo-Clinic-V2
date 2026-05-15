import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useRef } from 'react';
import { clinicService } from '../services/clinicService';
import { api } from '../lib/api';
import { DEMO_BRANDING, DEMO_HERO, overrideTreatments, overrideBlogs, overrideDoctors, overrideTestimonials, overrideLocations, overrideWhatsapp, overrideSocialLinks, overrideSections, overrideResults } from '../lib/demoContent';
import { sanitizeText } from '../lib/demoUtils';

export type LanguageCode = 'en' | 'fr' | 'ru' | 'ar';
export type MultiLangText = Record<LanguageCode, string>;

export interface Branding {
  name: MultiLangText;
  logo: string;
}

export interface NavLink {
  id: string | number;
  label: MultiLangText;
  path?: string;
  children?: { label: MultiLangText; path: string }[];
}

export interface Hero {
  title: MultiLangText;
  subheader: MultiLangText;
  subtitle: MultiLangText;
  youtubeUrl: string;
  videoUrl?: string;
  image: string;
  media_url?: string;
  secondaryBtn: MultiLangText;
  showButtons: boolean;
}

export interface Treatment {
  id: number | string;
  title: MultiLangText;
  category: MultiLangText | string;
  description: MultiLangText;
  image: string;
  media_url?: string;
  content_image?: string;
  content_media_url?: string;
  slug?: string;
  link?: string;
  duration: MultiLangText;
  success_rate: number;
  features?: MultiLangText[] | MultiLangText;
  beforeAfter?: string;
  before_after_media_url?: string;
  is_active?: boolean;
  content_sections?: Array<{
    title: MultiLangText;
    subtitle?: MultiLangText;
    description: MultiLangText;
    image?: string;
    media_url?: string;
  }>;
  template_type?: 'standard' | 'dental' | 'hair';
}

export interface Stat {
  id: number | string;
  label: MultiLangText;
  value: string;
  suffix: string;
}

export interface ProcessStep {
  id: number | string;
  title: MultiLangText;
  description: MultiLangText;
  icon: string;
  icon_name?: string;
  iconName?: string;
  order?: number;
  step?: number;
  is_active?: boolean;
}

export interface SocialLink {
  id: number | string;
  platform: string;
  url: string;
  icon_name: string;
  is_active?: boolean;
}

export interface Testimonial {
  id: number | string;
  treatment_id?: number | string;
  patient_name?: MultiLangText;
  feedback?: MultiLangText;
  name?: string | MultiLangText;
  text?: MultiLangText;
  treatment?: {
    id: number | string;
    title: MultiLangText;
    slug: string;
    category: MultiLangText | string;
  } | string | MultiLangText;
  rating: number;
  image?: string;
  is_active?: boolean;
}

export interface Faq {
  id: number | string;
  question: MultiLangText;
  answer: MultiLangText;
  category: string;
}

export interface Location {
  id: number | string;
  city: MultiLangText;
  country: MultiLangText;
  address: MultiLangText;
  phone: string;
  email: string;
  hours: MultiLangText;
  is_active: boolean;
}

export interface WhatsApp {
  enabled: boolean;
  phoneNumber: string;
  ruPhoneNumber?: string;
  message: MultiLangText;
}

export interface SEO {
  title: MultiLangText;
  description: MultiLangText;
  ogImage: string;
}

export interface CMSUser {
  id: string | number;
  name: string;
  email: string;
  role: 'admin' | 'editor';
}

export interface Section {
  title: MultiLangText;
  subtitle: MultiLangText;
  image?: string;
  media_url?: string;
}

export interface Blog {
  id: number | string;
  slug: string;
  title: MultiLangText;
  category: MultiLangText;
  treatment_id?: number | string;
  treatment?: {
    id: number | string;
    title: MultiLangText;
    slug: string;
    category: MultiLangText | string;
  };
  excerpt: MultiLangText;
  content: MultiLangText;
  author: MultiLangText;
  read_time: MultiLangText;
  image_id?: number | string;
  image?: string;
  media_url?: string;
  is_active: boolean;
  created_at?: string;
}

export interface Settings {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  buttonRadius: string;
}

export interface DashboardState {
  branding: Branding;
  settings: Settings;
  navLinks: NavLink[];
  hero: Hero;
  treatments: Treatment[];
  testimonials: Testimonial[];
  stats: Stat[];
  processSteps: ProcessStep[];
  faqs: Faq[];
  locations: Location[];
  whatsapp: WhatsApp;
  seo: SEO;
  sections: Record<string, Section>;
  whyChooseUsFeatures: any[];
  users: CMSUser[];
  media: any[];
  blogs: Blog[];
  doctors: any[];
  socialLinks: SocialLink[];
  results: Array<{
    id: number | string;
    treatment_id?: number | string;
    patient_name: MultiLangText;
    story: MultiLangText;
    before_image_url: string;
    after_image_url: string;
    treatment?: {
      id: number | string;
      title: MultiLangText;
      slug: string;
      category: MultiLangText | string;
    };
  }>;
  loading: boolean;
  error: string | null;
}

export interface DashboardContextType {
  state: DashboardState;
  updateBranding: (branding: Partial<Branding>) => Promise<void>;
  updateHero: (hero: Partial<Hero>) => Promise<void>;
  updateWhatsApp: (whatsapp: Partial<WhatsApp>) => Promise<void>;
  updateSEO: (seo: Partial<SEO>) => Promise<void>;
  updateSection: (key: string, updates: Partial<Section>) => void;
  updateWhyChooseUsFeatures: (features: any[]) => Promise<void>;
  addNavLink: (link: any) => void;
  updateNavLink: (id: string | number, updates: any) => void;
  deleteNavLink: (id: string | number) => void;
  addGeneric: (type: string, data: any) => void;
  updateGeneric: (type: string, id: string | number, data: any) => void;
  deleteGeneric: (type: string, id: string | number) => void;
  addUser: (user: CMSUser) => void;
  deleteUser: (id: string | number) => void;
  refreshData: () => Promise<void>;
  refreshTreatmentDetail: (slug: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const initialMultiLang = { en: '', fr: '', ru: '', ar: '' };

const initialState: DashboardState = {
  branding: { name: { ...initialMultiLang }, logo: '' },
  settings: {
    primaryColor: '#F28522',
    secondaryColor: '#1E1C4B',
    fontFamily: 'Inter, system-ui, sans-serif',
    buttonRadius: '0.75rem'
  },
  navLinks: [
    {
      id: 'dent',
      label: { en: 'Dental', ar: 'الأسنان', fr: 'Dentaire', ru: 'Стоматология' },
      children: [
        { label: { en: 'Dental Implant', ar: 'زراعة الأسنان', fr: 'Implant Dentaire', ru: 'Дентальная имплантация' }, path: '/treatment/dental-implant' },
        { label: { en: 'Hollywood Smile', ar: 'ابتسامة هوليود', fr: 'Sourire Hollywood', ru: 'Голливудская улыбка' }, path: '/treatment/hollywood-smile' }
      ]
    },
    {
      id: 'hair',
      label: { en: 'Hair Transplant', ar: 'زراعة الشعر', fr: 'Greffe de Cheveux', ru: 'Пересадка волос' },
      children: [
        { label: { en: 'Male Hair Transplant', ar: 'زراعة الشعر للرجال', fr: 'Greffe pour Hommes', ru: 'Пересадка волос для мужчин' }, path: '/treatment/male-hair-transplant' },
        { label: { en: 'Female Hair Transplant', ar: 'زراعة الشعر للنساء', fr: 'Greffe pour Femmes', ru: 'Пересадка волос для женщин' }, path: '/treatment/female-hair-transplant' },
        { label: { en: 'Beard & Moustache Transplant', ar: 'زراعة اللحية والشارب', fr: 'Greffe Barbe', ru: 'Пересадка бороды и усов' }, path: '/treatment/beard-moustache-transplant' },
        { label: { en: 'Eyebrow Transplant', ar: 'زراعة الحواجب', fr: 'Greffe de Sourcils', ru: 'Пересадка бровей' }, path: '/treatment/eyebrow-transplant' }
      ]
    },
    {
      id: 'plastic-surgery',
      label: { en: 'Plastic Surgery', ar: 'الجراحة التجميلية', fr: 'Chirurgie Plastique', ru: 'Пластическая хирургия' },
      path: '/plastic-surgery'
    },
    {
      id: 'about',
      label: { en: 'About Us', ar: 'من نحن', fr: 'À Propos', ru: 'О Нас' },
      children: [
        { label: { en: 'Appointment', ar: 'الموعد', fr: 'Rendez-vous', ru: 'Запись' }, path: '/appointment' },
        { label: { en: 'Blog', ar: 'المدونة', fr: 'Blog', ru: 'Блог' }, path: '/blog' },
        { label: { en: 'Our Doctors', ar: 'أطباؤنا', fr: 'Nos Docteurs', ru: 'Наши врачи' }, path: '/doctors' },
        { label: { en: 'Contact Us', ar: 'اتصل بنا', fr: 'Contactez-nous', ru: 'Контакты' }, path: '/contact' }
      ]
    }
  ],
  hero: {
    title: { ...initialMultiLang },
    subheader: { ...initialMultiLang },
    subtitle: { ...initialMultiLang },
    youtubeUrl: '',
    videoUrl: '',
    image: '',
    secondaryBtn: { ...initialMultiLang },
    showButtons: false
  },
  treatments: [],
  testimonials: [],
  stats: [],
  processSteps: [],
  faqs: [],
  locations: [],
  sections: {},
  whyChooseUsFeatures: [],
  whatsapp: {
    enabled: true,
    phoneNumber: '+90 544 792 46 66',
    ruPhoneNumber: '+90 549 872 80 24',
    message: {
      ...initialMultiLang,
      en: 'Hello Lumo Clinic, I would like to get more information.',
      ar: 'مرحبًا بعيادة Lumo، أود الحصول على مزيد من المعلومات.',
      fr: 'Bonjour Lumo Clinic, je voudrais plus d’informations.',
      ru: 'Здравствуйте Lumo Clinic, хотел бы получить информацию.'
    }
  },
  seo: { title: { ...initialMultiLang }, description: { ...initialMultiLang }, ogImage: '' },
  users: [],
  media: [],
  blogs: [],
  doctors: [],
  socialLinks: [
    {
      id: 'instagram',
      platform: 'Instagram',
      icon_name: 'Instagram',
      url: 'https://www.instagram.com/lumoclinic/',
      is_active: true
    },
    {
      id: 'facebook',
      platform: 'Facebook',
      icon_name: 'Facebook',
      url: 'https://www.facebook.com/GARVITYCLINICOFFICIAL/',
      is_active: true
    },
    {
      id: 'tiktok',
      platform: 'TikTok',
      icon_name: 'TikTok',
      url: 'https://www.tiktok.com/@lumoclinic',
      is_active: true
    },
    {
      id: 'youtube',
      platform: 'YouTube',
      icon_name: 'YouTube',
      url: 'https://www.youtube.com/channel/UCpeRizxKJ-rerTR8dxgdyYg',
      is_active: true
    }
  ],
  results: [],
  loading: false,
  error: null,
};

// Safely resolve multilingual fields to current language string
const getLangAttr = (attr: any, lang: LanguageCode): string => {
  if (!attr) return '';
  if (typeof attr === 'string') return attr;
  if (typeof attr === 'object') {
    return attr[lang] || attr['en'] || Object.values(attr)[0] || '';
  }
  return String(attr);
};

const CACHE_KEY = 'gravity_clinic_cache_v5';
const CACHE_TTL = 300000; // 5 minutes

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DashboardState>(() => {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const data = JSON.parse(cached);
          if (Date.now() - data.timestamp < CACHE_TTL) {
            return {
              ...initialState,
              ...data,
              loading: false,
            };
          }
        } catch {
          sessionStorage.removeItem(CACHE_KEY);
        }
      }
    }
    return initialState;
  });

  const hasHydrated = useRef(false);

  const saveToCache = (data: any) => {
    try {
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          ...data,
          timestamp: Date.now()
        })
      );
    } catch {
      // ignore cache errors
    }
  };

  const refreshData = async () => {
    setState((prev) => ({
      ...prev,
      loading: prev.treatments.length === 0 && prev.navLinks.length === 0,
    }));

    try {
      const fullRes = await clinicService.getFullInit();
      if (fullRes) {
        const rawSettings = fullRes.settings;
        const resolvedSettings = rawSettings?.settings || rawSettings?.ui_settings || null;

        setState((prev) => {
          const newState = {
            ...prev,
            branding: rawSettings?.branding || prev.branding,
            settings: resolvedSettings
              ? {
                primaryColor: resolvedSettings?.primaryColor || prev.settings.primaryColor,
                secondaryColor: resolvedSettings?.secondaryColor || prev.settings.secondaryColor,
                fontFamily: resolvedSettings?.fontFamily || prev.settings.fontFamily,
                buttonRadius: resolvedSettings?.buttonRadius || prev.settings.buttonRadius,
              }
              : prev.settings,
            hero: { ...prev.hero, ...(rawSettings?.hero || {}) },
            whatsapp: {
              ...prev.whatsapp,
              ...(rawSettings?.whatsapp || {})
            },
            seo: rawSettings?.seo || prev.seo,
            navLinks: (() => {
              const mappedNavLinks = (fullRes.navLinks || prev.navLinks).map((l: any) => {
                // Extremely robust label cleaning
                const sanitize = (labelVal: any, itemId?: string) => {
                  if (!labelVal) return labelVal;
                  
                  // If label is a string
                  if (typeof labelVal === 'string') {
                    let cleaned = labelVal.replace(/[\u0600-\u06FF]/g, '').trim();
                    if ((itemId === 'about' || labelVal.toLowerCase().includes('about')) && cleaned.startsWith('О На')) {
                      return 'О Нас';
                    }
                    return cleaned;
                  }
                  
                  // If label is a multilingual object
                  if (typeof labelVal === 'object') {
                    const cleanedObj = { ...labelVal };
                    const enText = (cleanedObj.en || '').toLowerCase();
                    if (cleanedObj.ru && typeof cleanedObj.ru === 'string') {
                      const originalRU = cleanedObj.ru;
                      cleanedObj.ru = originalRU.replace(/[\u0600-\u06FF]/g, '').trim();
                      if ((itemId === 'about' || enText.includes('about')) && cleanedObj.ru.startsWith('О На')) {
                        cleanedObj.ru = 'О Нас';
                      }
                    }
                    return cleanedObj;
                  }
                  return labelVal;
                };
                
                const cleanedLabel = sanitize(l.label, l.id);

                // Support both 'children' and 'items' from backend
                const rawChildren = l.children || l.items || [];
                const children = rawChildren.map((child: any) => {
                  const cleanedChildLabel = sanitize(child.label, child.id);
                  
                  let cleanedPath = child.path || child.url || child.link || child.slug || '/';
                  const en = (typeof cleanedChildLabel === 'object' ? (cleanedChildLabel.en || '') : (typeof cleanedChildLabel === 'string' ? cleanedChildLabel : '')).toLowerCase();
                  const ru = (typeof cleanedChildLabel === 'object' ? (cleanedChildLabel.ru || '') : '').toLowerCase();
                  
                  // Super robust path correction for Dental Implant
                  if (en.includes('dental') && en.includes('implant') || 
                      ru.includes('имплантац') || 
                      (cleanedPath && cleanedPath.includes('dental-implant'))) {
                    cleanedPath = '/treatment/dental-implant';
                  }

                  return {
                    ...child,
                    label: cleanedChildLabel,
                    path: cleanedPath
                  };
                });

                // Force 'Our Doctors' into About Us if missing
                const isAbout = l.id === 'about' || 
                               (typeof cleanedLabel === 'object' && cleanedLabel.en === 'About Us') ||
                               (typeof cleanedLabel === 'string' && cleanedLabel.includes('About'));
                
                if (isAbout) {
                  const hasDoctors = children.some((c: any) => c.path === '/doctors');
                  if (!hasDoctors) {
                    children.push({
                      id: 'doctors-manual',
                      label: { en: 'Our Doctors', ar: 'أطباؤنا', fr: 'Nos Docteurs', ru: 'Наши врачи' },
                      path: '/doctors'
                    });
                  }
                
                  // Sort children based on the requested order
                  const getOrderIndex = (p: string = '') => {
                    if (p.includes('/appointment')) return 0;
                    if (p.includes('/blog') || p.includes('/articles')) return 1;
                    if (p.includes('/doctors')) return 2;
                    if (p.includes('/contact')) return 3;
                    return 99;
                  };

                  children.sort((a: any, b: any) => getOrderIndex(a.path) - getOrderIndex(b.path));
                }

                return {
                  ...l,
                  label: cleanedLabel,
                  children,
                  items: children // Ensure both are present
                };
              });

              // Inject Plastic Surgery safely
              const hasPlasticSurgery = mappedNavLinks.some((l: any) => l.id === 'plastic-surgery' || l.path === '/plastic-surgery' || (typeof l.label === 'object' && l.label.en === 'Plastic Surgery'));
              if (!hasPlasticSurgery) {
                const aboutIndex = mappedNavLinks.findIndex((l: any) => l.id === 'about' || (typeof l.label === 'object' && l.label.en === 'About Us'));
                const plasticSurgeryLink = {
                  id: 'plastic-surgery',
                  label: { en: 'Plastic Surgery', ar: 'الجراحة التجميلية', fr: 'Chirurgie Plastique', ru: 'Пластическая хирургия' },
                  path: '/plastic-surgery',
                  children: [],
                  items: []
                };
                if (aboutIndex >= 0) {
                  mappedNavLinks.splice(aboutIndex, 0, plasticSurgeryLink);
                } else {
                  mappedNavLinks.push(plasticSurgeryLink);
                }
              }

              return mappedNavLinks;
            })(),
            treatments: fullRes.treatments || prev.treatments,
            sections: rawSettings?.sections || prev.sections,
            whyChooseUsFeatures: rawSettings?.why_choose_us_features || prev.whyChooseUsFeatures,
            testimonials: fullRes.testimonials || prev.testimonials,
            results: fullRes.results || prev.results,
            stats: fullRes.stats || prev.stats,
            faqs: fullRes.faqs || prev.faqs,
            locations: fullRes.locations || prev.locations,
            blogs: fullRes.blogs || prev.blogs,
            doctors: fullRes.doctors || prev.doctors,
            socialLinks: (fullRes.socialLinks && fullRes.socialLinks.length > 0) ? fullRes.socialLinks : prev.socialLinks,
            processSteps: fullRes.processSteps || prev.processSteps,
            loading: false,
          };

          const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';
          if (isDemo) {
            newState.branding = { ...newState.branding, ...DEMO_BRANDING };
            newState.hero = { ...newState.hero, ...DEMO_HERO };
            newState.treatments = overrideTreatments(newState.treatments);
            newState.blogs = overrideBlogs(newState.blogs);
            newState.doctors = overrideDoctors(newState.doctors);
            newState.testimonials = overrideTestimonials(newState.testimonials);
            newState.results = overrideResults(newState.results);
            newState.locations = overrideLocations(newState.locations);
            newState.whatsapp = overrideWhatsapp(newState.whatsapp);
            newState.socialLinks = overrideSocialLinks(newState.socialLinks);
            newState.sections = overrideSections(newState.sections);
          }

          saveToCache(newState);
          return newState;
        });
      }
    } catch (err) {
      console.error('Initial hydration error:', err);
      setState((p) => ({ ...p, loading: false }));
    }
  };

  const refreshTreatmentDetail = async (slug: string) => {
    try {
      const response = await api.get<any>(`/public/treatments/${slug}`);
      if (response) {
        setState((prev) => {
          const newTreatments = prev.treatments.map((t) => {
            if (t.slug === slug) {
              let updated = { ...t, ...response };
              const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';
              if (isDemo) {
                // Find index to maintain consistency with override array
                const idx = prev.treatments.findIndex(pt => pt.slug === slug);
                const tempArray = overrideTreatments([{ ...updated }]);
                updated = tempArray[0];
                // Keep the original idx mapping if needed, but the simple override handles it well enough
              }
              return updated;
            }
            return t;
          });
          const next = { ...prev, treatments: newTreatments };
          saveToCache(next);
          return next;
        });
      }
    } catch (e) {
      console.error('Error refreshing treatment detail:', e);
    }
  };

  useEffect(() => {
    if (hasHydrated.current) return;
    hasHydrated.current = true;

    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const data = JSON.parse(cached);
        if (Date.now() - data.timestamp < CACHE_TTL) {
          setState((prev) => ({ ...prev, ...data, loading: false }));
        }
      } catch {
        sessionStorage.removeItem(CACHE_KEY);
      }
    }

    refreshData();
  }, []);

  const updateBranding = async (updates: Partial<Branding>) => {
    try {
      const newBranding = { ...state.branding, ...updates };
      setState((prev) => {
        const next = { ...prev, branding: newBranding };
        saveToCache(next);
        return next;
      });
      await clinicService.updateSettingsBatch([{ key: 'branding', value: newBranding }]);
    } catch (err: any) {
      console.error('Branding update error:', err);
      throw err;
    }
  };

  const updateHero = async (updates: Partial<Hero>) => {
    try {
      const optimisticHero = { ...state.hero, ...updates };
      setState((prev) => {
        const next = { ...prev, hero: optimisticHero };
        saveToCache(next);
        return next;
      });
      await clinicService.updateSettingsBatch([{ key: 'hero', value: optimisticHero }]);
    } catch (err: any) {
      console.error('Hero update error:', err);
      refreshData();
      throw err;
    }
  };

  const updateWhatsApp = async (updates: Partial<WhatsApp>) => {
    try {
      const newWhatsApp = { ...state.whatsapp, ...updates };
      setState((prev) => {
        const next = { ...prev, whatsapp: newWhatsApp };
        saveToCache(next);
        return next;
      });
      await clinicService.updateSettingsBatch([{ key: 'whatsapp', value: newWhatsApp }]);
    } catch (err: any) {
      console.error('WhatsApp update error:', err);
      throw err;
    }
  };

  const updateSEO = async (updates: Partial<SEO>) => {
    try {
      const newSEO = { ...state.seo, ...updates };
      setState((prev) => {
        const next = { ...prev, seo: newSEO };
        saveToCache(next);
        return next;
      });
      await clinicService.updateSettingsBatch([{ key: 'seo', value: newSEO }]);
    } catch (err: any) {
      console.error('SEO update error:', err);
      throw err;
    }
  };

  const updateSection = (key: string, updates: Partial<Section>) => {
    const newSections = { ...state.sections, [key]: { ...state.sections[key], ...updates } };
    setState((prev) => {
      const next = { ...prev, sections: newSections };
      saveToCache(next);
      return next;
    });
    clinicService.updateSettingsBatch([{ key: 'sections', value: newSections }]);
  };

  const updateWhyChooseUsFeatures = async (features: any[]) => {
    try {
      setState((prev) => {
        const next = { ...prev, whyChooseUsFeatures: features };
        saveToCache(next);
        return next;
      });
      await clinicService.updateSettingsBatch([{ key: 'why_choose_us_features', value: features }]);
    } catch (err) {
      console.error('Error updating Why Choose Us features:', err);
      throw err;
    }
  };

  const addNavLink = (link: any) => {
    const newLinks = [...state.navLinks, { ...link, id: link.id || Math.random().toString(36).substr(2, 9) }];
    setState((prev) => {
      const next = { ...prev, navLinks: newLinks };
      saveToCache(next);
      return next;
    });
  };

  const updateNavLink = (id: string | number, updates: any) => {
    const newLinks = state.navLinks.map((l) => (l.id.toString() === id.toString() ? { ...l, ...updates } : l));
    setState((prev) => {
      const next = { ...prev, navLinks: newLinks };
      saveToCache(next);
      return next;
    });
  };

  const deleteNavLink = (id: string | number) => {
    const newLinks = state.navLinks.filter((l) => l.id.toString() !== id.toString());
    setState((prev) => {
      const next = { ...prev, navLinks: newLinks };
      saveToCache(next);
      return next;
    });
  };

  const addGeneric = async (type: string, data: any) => {
    const key = (type.endsWith('s') ? type : type + 's') as keyof DashboardState;
    try {
      const typeMap: Record<string, string> = {
        treatment: 'Treatment',
        testimonial: 'Testimonial',
        stat: 'Stat',
        processStep: 'ProcessStep',
        socialLink: 'SocialLink',
        faq: 'Faq',
        location: 'Location',
        blog: 'Blog',
        article: 'Blog',
        doctor: 'Doctor',
        result: 'Result'
      };

      const suffix = typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
      const methodName = `create${suffix}` as keyof typeof clinicService;

      if (typeof clinicService[methodName] === 'function') {
        const response = await (clinicService[methodName] as Function)(data);
        const newItem = response?.data || response || data;

        setState((prev) => {
          if (Array.isArray(prev[key])) {
            const next = { ...prev, [key]: [...(prev[key] as any[]), newItem] };
            saveToCache(next);
            return next;
          }
          return prev;
        });
      }
    } catch (err) {
      console.error(`Error adding ${type}:`, err);
      throw err;
    }
  };

  const updateGeneric = async (type: string, id: string | number, data: any) => {
    const key = (type.endsWith('s') ? type : type + 's') as keyof DashboardState;
    try {
      const typeMap: Record<string, string> = {
        treatment: 'Treatment',
        testimonial: 'Testimonial',
        stat: 'Stat',
        processStep: 'ProcessStep',
        socialLink: 'SocialLink',
        faq: 'Faq',
        location: 'Location',
        blog: 'Blog',
        article: 'Blog',
        doctor: 'Doctor',
        result: 'Result'
      };

      const suffix = typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
      const methodName = `update${suffix}` as keyof typeof clinicService;

      if (typeof clinicService[methodName] === 'function') {
        const response = await (clinicService[methodName] as Function)(id, data);
        const updatedItem = response?.data || response || data;

        setState((prev) => {
          if (Array.isArray(prev[key])) {
            const newItems = (prev[key] as any[]).map((item) =>
              item.id.toString() === id.toString() ? { ...item, ...updatedItem, id: Number(id) } : item
            );
            const next = { ...prev, [key]: newItems };
            saveToCache(next);
            return next;
          }
          return prev;
        });
      }
    } catch (err) {
      console.error(`Error updating ${type}:`, err);
      throw err;
    }
  };

  const deleteGeneric = async (type: string, id: string | number) => {
    const key = (type.endsWith('s') ? type : type + 's') as keyof DashboardState;
    try {
      const typeMap: Record<string, string> = {
        treatment: 'Treatment',
        testimonial: 'Testimonial',
        stat: 'Stat',
        processStep: 'ProcessStep',
        socialLink: 'SocialLink',
        faq: 'Faq',
        location: 'Location',
        blog: 'Blog',
        article: 'Blog',
        doctor: 'Doctor',
        result: 'Result'
      };

      const suffix = typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
      const methodName = `delete${suffix}` as keyof typeof clinicService;

      if (typeof clinicService[methodName] === 'function') {
        await (clinicService[methodName] as Function)(id);

        setState((prev) => {
          if (Array.isArray(prev[key])) {
            const newItems = (prev[key] as any[]).filter((item) => item.id.toString() !== id.toString());
            const next = { ...prev, [key]: newItems };
            saveToCache(next);
            return next;
          }
          return prev;
        });
      }
    } catch (err) {
      console.error(`Error deleting ${type}:`, err);
      throw err;
    }
  };

  const addUser = (user: CMSUser) => {
    setState((prev) => ({ ...prev, users: [...prev.users, user] }));
  };

  const deleteUser = (id: string | number) => {
    setState((prev) => ({ ...prev, users: prev.users.filter((u) => u.id.toString() !== id.toString()) }));
  };

  const setLoading = (loading: boolean) => setState((prev) => ({ ...prev, loading }));
  const setError = (error: string | null) => setState((prev) => ({ ...prev, error }));

  const value: DashboardContextType = useMemo(
    () => ({
      state,
      updateBranding,
      updateHero,
      updateWhatsApp,
      updateSEO,
      updateSection,
      updateWhyChooseUsFeatures,
      addNavLink,
      updateNavLink,
      deleteNavLink,
      addGeneric,
      updateGeneric,
      deleteGeneric,
      addUser,
      deleteUser,
      refreshData,
      refreshTreatmentDetail,
      setLoading,
      setError
    }),
    [state]
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
