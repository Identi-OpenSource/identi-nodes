import i18next from 'i18next';

import global_es from './locales/es/global.json';
import global_en from './locales/en/global.json';

i18next.init({
    interpolation: { escapeValue: false },
    lng: 'es',
    resources: {
        es: {
            translation: global_es
        },
        en: {
            translation: global_en
        }
    }
});

export default i18next;