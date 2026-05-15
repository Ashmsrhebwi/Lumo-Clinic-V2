import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { Link } from 'react-router';
import { useLanguage } from '../context/LanguageContext';

interface EditorialSection {
  title: Record<string, string>;
  subtitle?: Record<string, string>;
  image: string;
  description: Record<string, string>;
  link?: string;
}

interface EditorialGridProps {
  sections: EditorialSection[];
  t: (key: string) => string;
}

export const EditorialGrid: React.FC<EditorialGridProps> = ({ sections, t }) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-48">
      {sections.map((section, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-20 lg:gap-32`}
        >
          {/* Image Side */}
          <div className="flex-1 relative w-full group">
            <div className="absolute -inset-6 bg-[var(--navbar-cyan)]/5 rounded-[4rem] blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="rounded-[3.5rem] overflow-hidden shadow-[0_30px_70px_-15px_rgba(11,28,45,0.12)] border-[12px] border-white dark:border-zinc-900 transform group-hover:scale-[1.03] transition-all duration-[1.2s] ease-out relative z-10">
              <img 
                src={section.image} 
                alt={section.title?.[language] || section.title?.en || ''} 
                className="w-full h-full object-cover aspect-[4/3] grayscale-[0.2] group-hover:grayscale-0 transition-all duration-[1.5s]" 
              />
            </div>
            <motion.div 
              animate={{ rotate: idx % 2 === 0 ? [0, 5, 0] : [0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute -bottom-10 ${idx % 2 === 0 ? '-right-10' : '-left-10'} w-36 h-36 bg-[var(--navbar-navy)] rounded-full flex items-center justify-center border-[10px] border-white p-8 shadow-2xl z-20`}
            >
              <Check className="w-full h-full text-[var(--navbar-cyan)]" strokeWidth={3} />
            </motion.div>
          </div>

          {/* Text Side */}
          <div className="flex-1 text-left rtl:text-right relative z-10">
            {section.subtitle && (
              <motion.div
                initial={{ opacity: 0, x: idx % 2 === 0 ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-4 mb-10"
              >
                <div className="w-10 h-[1.5px] bg-[var(--navbar-cyan)] opacity-40"></div>
                <span className="label-eyebrow !opacity-100">
                  {section.subtitle?.[language] || section.subtitle?.en}
                </span>
              </motion.div>
            )}
            
            <h2 className="text-[var(--hero-title-size)] font-body font-bold mb-10 text-[var(--navbar-navy)] tracking-tight leading-[1.05]">
              {(() => {
                const title = section.title?.[language] || section.title?.en || "";
                const words = title.split(' ');
                if (words.length > 2) {
                  return (
                    <>
                      {words.slice(0, -1).join(' ')}{' '}
                      <span className="font-display italic font-light text-[var(--navbar-cyan)]">
                        {words[words.length - 1]}
                      </span>
                    </>
                  );
                }
                return title;
              })()}
            </h2>
            
            <p className="text-[17px] text-[var(--navbar-navy)]/55 leading-relaxed font-body mb-14 max-w-lg">
              {section.description?.[language] || section.description?.en || ''}
            </p>
            
            {section.link && (
              <div className="mt-12">
                 <Link to={section.link} className="btn-luxury px-12 py-5">
                    {t('common.learnMoreAboutUs') || 'Explore Details'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                 </Link>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
