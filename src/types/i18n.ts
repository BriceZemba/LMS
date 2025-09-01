export type SupportedLanguage = 'fr' | 'en';

export interface Translation {
  [key: string]: string | Translation;
}

export interface I18nConfig {
  currentLanguage: SupportedLanguage;
  translations: Record<SupportedLanguage, Translation>;
}
