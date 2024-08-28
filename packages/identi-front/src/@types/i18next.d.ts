import ns1Es from '../translations/locales/es/global.json';
import ns1En from '../translations/locales/en/global.json';

declare module 'i18next' {
    type CustomTypeOptions = {
        defaultNS: 'ns1es';
        resources: {
            ns1es: typeof ns1Es;
            ns1en: typeof ns1En;
        }
    }
}