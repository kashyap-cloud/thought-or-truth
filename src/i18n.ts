import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import local translations
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import pt from './locales/pt.json';
import de from './locales/de.json';
import ar from './locales/ar.json';
import hi from './locales/hi.json';
import bn from './locales/bn.json';
import zhCN from './locales/zh-CN.json';
import ja from './locales/ja.json';
import id from './locales/id.json';
import tr from './locales/tr.json';
import vi from './locales/vi.json';
import ko from './locales/ko.json';
import ru from './locales/ru.json';
import it from './locales/it.json';
import pl from './locales/pl.json';
import th from './locales/th.json';
import tl from './locales/tl.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  pt: { translation: pt },
  de: { translation: de },
  ar: { translation: ar },
  hi: { translation: hi },
  bn: { translation: bn },
  'zh-CN': { translation: zhCN },
  ja: { translation: ja },
  id: { translation: id },
  tr: { translation: tr },
  vi: { translation: vi },
  ko: { translation: ko },
  ru: { translation: ru },
  it: { translation: it },
  pl: { translation: pl },
  th: { translation: th },
  tl: { translation: tl }
};

export const PARAMS: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  pt: 'Português',
  de: 'Deutsch',
  ar: 'العربية',
  hi: 'हिन्दी',
  bn: 'বাংলা',
  'zh-CN': '简体中文',
  ja: '日本語',
  id: 'Bahasa Indonesia',
  tr: 'Türkçe',
  vi: 'Tiếng Việt',
  ko: '한국어',
  ru: 'Русский',
  it: 'Italiano',
  pl: 'Polski',
  th: 'ไทย',
  tl: 'Tagalog'
};

const customQuerystringDetector = {
  name: 'customQuerystring',
  lookup(options: any) {
    let found;
    if (typeof window !== 'undefined') {
      const query = window.location.search;
      if (query) {
        const urlParams = new URLSearchParams(query);
        found = urlParams.get('lang');
      }
    }
    return found;
  },
  cacheUserLanguage(lng: string, options: any) {
    // maybe save it in local storage if needed
    localStorage.setItem('i18nextLng', lng);
  }
};

const languageDetector = new LanguageDetector();
languageDetector.addDetector(customQuerystringDetector);

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['customQuerystring', 'querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
    },
    interpolation: {
      escapeValue: false, 
    }
  });

export default i18n;
