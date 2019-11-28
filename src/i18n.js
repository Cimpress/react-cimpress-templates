import i18n from 'i18next';

let i18nInstance = null;

function getI18nInstance() {
    if (!i18nInstance) {
        i18nInstance = i18n.createInstance();

        i18nInstance
            .init({

                fallbackLng: 'en',

                resources: {
                    en: require('./locales/react-cimpress-templates.en'),
                    de: require('./locales/react-cimpress-templates.de'),
                    fr: require('./locales/react-cimpress-templates.fr'),
                    nl: require('./locales/react-cimpress-templates.nl'),
                    it: require('./locales/react-cimpress-templates.it'),
                },

                ns: ['translations'],
                defaultNS: 'translations',

                debug: false,

                interpolation: {
                    escapeValue: false, // not needed for react!!
                },

                react: {
                    wait: true,
                },
                saveMissing: true,
                missingKeyHandler: (lng, ns, key, fallbackValue) => {
                    // eslint-disable-next-line no-console
                    console.log(lng, ns, key, fallbackValue);
                },
            });
    }

    return i18nInstance;
}

export {
    getI18nInstance,
};
