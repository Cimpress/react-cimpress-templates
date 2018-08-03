import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';

let languages = require('./locales/translations.json');

let i18n_instance = null;

function getI18nInstance() {

    if ( !i18n_instance ) {
        i18n_instance = i18n.createInstance();

        i18n_instance
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
                    wait: true
                }
            });
    }

    return i18n_instance;
}

export {
    getI18nInstance
};
