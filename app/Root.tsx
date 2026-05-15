import { Outlet, useLocation } from 'react-router';
import { Navigation } from './components/Navigation';
import { Footer } from './components/layout/Footer';
import { useLanguage, Language } from './context/LanguageContext';
import { Mail, Phone, Facebook, Instagram, Twitter, Youtube, MessageCircle, ChevronUp, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { AnimatePresence, LazyMotion, domAnimation, motion as m, useScroll } from 'motion/react';
import { useDashboard } from './context/DashboardContext';
import { WhatsAppWidget } from './components/ui/WhatsAppWidget';
import { ScrollToTop } from './components/ScrollToTop';

export function Root() {
  const { t, language } = useLanguage();
  const { state } = useDashboard();
  const location = useLocation();

  const isAuthPage = ['/login', '/otp', '/forgot-password', '/reset-password'].includes(location.pathname);

  // Set document direction for RTL languages
  useEffect(() => {
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  // Synchronize CSS Variables and SEO with Dashboard Settings
  useEffect(() => {
    const root = document.documentElement;
    const settings = state?.settings;
    const seo = state?.seo;
    const currentLang = language as Language;

    if (settings?.primaryColor) root.style.setProperty('--primary', settings.primaryColor);
    if (settings?.secondaryColor) root.style.setProperty('--secondary', settings.secondaryColor);
    if (settings?.buttonRadius) root.style.setProperty('--radius', settings.buttonRadius);
    
    // Font Family Sync
    const fontFamily = settings?.fontFamily || 'Inter, system-ui, sans-serif';
    root.style.setProperty('--font-family', fontFamily);
    document.body.style.fontFamily = fontFamily;

    // Update Document Title (SEO)
    if (seo?.title && (seo.title as any)[currentLang]) {
      document.title = (seo.title as any)[currentLang];
    }
    
    // Update Meta Description
    if (seo?.description && (seo.description as any)[currentLang]) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', (seo.description as any)[currentLang]);
    }
  }, [state?.settings, state?.seo, language]);

  const { scrollY } = useScroll();

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    return scrollY.on('change', (latest: number) => {
      setShowScrollTop(latest > 400);
    });
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <LazyMotion features={domAnimation}>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-background text-foreground" style={{ fontFamily: state?.settings?.fontFamily || 'Inter, system-ui, sans-serif' }}>
        {!isAuthPage && <Navigation />}

        <main className="flex-1">
          <Outlet />
        </main>

        {!isAuthPage && (
          <>
            {/* Floating Actions: scroll-to-top stacked above WhatsApp */}
            <div className="fixed right-4 bottom-6 sm:right-8 sm:bottom-8 z-[60] flex flex-col items-end gap-3">
              <AnimatePresence>
                {showScrollTop && (
                  <m.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    onClick={scrollToTop}
                    className="p-3 sm:p-4 bg-white/90 backdrop-blur-md text-secondary rounded-2xl shadow-2xl border border-secondary/10 hover:bg-white transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label={t('common.scrollToTop')}
                  >
                    <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-y-1" />
                  </m.button>
                )}
              </AnimatePresence>

              {/* WhatsApp Widget */}
              {state?.whatsapp?.enabled && <WhatsAppWidget />}
            </div>
            <Footer />
          </>
        )}
      </div>
    </LazyMotion>
  );
}