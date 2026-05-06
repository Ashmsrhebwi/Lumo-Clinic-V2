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
    <div className="space-y-32">
      {sections.map((section, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-24`}
        >
          {/* Image Side */}
          <div className="flex-1 relative w-full">
            <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-3xl -z-10 animate-pulse"></div>
            <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-zinc-900 transform hover:scale-105 transition-transform duration-700">
              <img 
                src={section.image} 
                alt={section.title?.[language] || section.title?.en || ''} 
                className="w-full h-full object-cover aspect-[4/3]" 
              />
            </div>
            <div className={`absolute -bottom-8 ${idx % 2 === 0 ? '-right-8' : '-left-8'} w-32 h-32 bg-secondary rounded-full flex items-center justify-center border-8 border-white p-6 shadow-2xl`}>
              <Check className="w-full h-full text-primary" />
            </div>
          </div>

          {/* Text Side */}
          <div className="flex-1 text-left rtl:text-right">
            {section.subtitle && (
              <h3 className="text-primary font-black tracking-[0.3em] uppercase mb-6 text-xs bg-primary/10 inline-block px-4 py-1 rounded-full">
                {section.subtitle?.[language] || section.subtitle?.en}
              </h3>
            )}
            <h2 className="text-4xl md:text-6xl font-black mb-8 text-secondary tracking-tighter italic leading-[1.1]">
              {section.title?.[language] || section.title?.en}
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
              {section.description?.[language] || section.description?.en || ''}
            </p>
            {section.link && (
              <div className="mt-12">
                 <Link to={section.link} className="text-secondary font-black border-b-4 border-primary pb-1 hover:text-primary transition-colors text-lg tracking-tight italic">
                    {t('common.learnMoreAboutUs') || 'Learn More'} →
                 </Link>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
