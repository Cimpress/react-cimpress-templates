import i18n from 'i18next';
import {reactI18nextModule} from 'react-i18next';

let languages = {};
try {
    languages = require('./locales/translations.json');
} catch (e) {
    // eslint-disable-next-line no-console
    console.warn('No translations files found. You can continue working normally but you would see translation keys instead of standard text.');
    // eslint-disable-next-line no-console
    console.warn('If you want to download the translations files, run `npm run build` (checkout the readme file for details)');
}

let i18nInstance = null;

function getI18nInstance() {
    if (!i18nInstance) {
        i18nInstance = i18n.createInstance();

        i18nInstance
            .use(reactI18nextModule)
            .init({

                fallbackLng: 'eng',

                resources: languages,

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
