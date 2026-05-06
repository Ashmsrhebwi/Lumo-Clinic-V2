import { en } from './en';
import { fr } from './fr';
import { ru } from './ru';
import { ar } from './ar';

export const translations = {
  en,
  fr,
  ru,
  ar,
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof en;
