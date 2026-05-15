export const isDemoMode = () => {
  return import.meta.env.VITE_DEMO_MODE === 'true';
};

/**
 * Safely resolves a multilingual value to a plain string.
 * Handles: string | { en, ar, fr, ru } | null | undefined
 */
export const getLang = (value: any, lang: string = 'en'): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return value[lang] || value.en || Object.values(value)[0] as string || '';
  }
  return String(value);
};

export const sanitizeText = (text: string | any): any => {
  if (!isDemoMode() || !text) return text;

  if (typeof text === 'string') {
    let sanitized = text;
    // Replace Gravity Clinic variants
    sanitized = sanitized.replace(/Gravity Clinic Global/gi, 'Lumo Clinic Global');
    sanitized = sanitized.replace(/Gravity Clinic/gi, 'Lumo Clinic');
    sanitized = sanitized.replace(/Gravity/g, 'Lumo');
    
    // Replace emails
    sanitized = sanitized.replace(/admin@gravity-clinic\.com/gi, 'admin@lumoclinic.demo');
    sanitized = sanitized.replace(/info@gravity-clinic\.com/gi, 'info@lumoclinic.demo');
    
    // Replace URLs
    sanitized = sanitized.replace(/gravity-clinic\.com/gi, 'lumoclinic.demo');
    sanitized = sanitized.replace(/gravityclinic\.com/gi, 'lumoclinic.demo');

    // Replace Phone Numbers
    sanitized = sanitized.replace(/\+90\s*544\s*792\s*46\s*66/g, '+90 555 000 00 00');
    sanitized = sanitized.replace(/\+90\s*541\s*339\s*25\s*69/g, '+90 555 000 00 01');

    // Replace Addresses
    sanitized = sanitized.replace(/Yenibosna/gi, 'Nişantaşı');

    return sanitized;
  }

  if (typeof text === 'object') {
    // Handle MultiLangText objects
    const newObj = { ...text };
    for (const key in newObj) {
      if (typeof newObj[key] === 'string') {
        newObj[key] = sanitizeText(newObj[key]);
      }
    }
    return newObj;
  }

  return text;
};

export const getDemoText = (original: string, fallbackDemo: string) => {
  return isDemoMode() ? fallbackDemo : original;
};

export const getDemoImage = (original: string, fallbackDemo: string) => {
  return isDemoMode() ? fallbackDemo : original;
};
