const fs = require('fs');
const path = require('path');
const rp = require('request-promise-native');
const {CimpressTranslationsClient} = require('cimpress-translations');

const SERVICE_ID = '14105bd8-499b-451c-aa35-1a79ee651405';
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TRANSLATIONS_FILE = __dirname + '/../src/locales/translations.json';

const log = (message) => console.log('[translation]', message);

async function getAccessToken() {
    let options = {
        method: 'POST',
        uri: `https://cimpress.auth0.com/oauth/token`,
        body: {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            audience: 'https://api.cimpress.io/',
            grant_type: 'client_credentials',
        },
        json: true,
    };

    const data = await rp(options);

    return  data.access_token;
}

async function retrieveTranslations() {

    log('Retrieving Auth0 token...');
    const token = await getAccessToken();

    let translationClient = new CimpressTranslationsClient(null, `Bearer ${token}`);

    log(`Retrieving service ${SERVICE_ID} description...`);
    const description = await translationClient.describeService(SERVICE_ID);

    log(`Retrieving service ${SERVICE_ID} description... DONE. Found languages: ${JSON.stringify(description.languages.map((s) => s.blobId))}`);
    const languagePromises = [];
    const translations = {};
    description.languages.forEach((lang) => {
        log(`Retrieving language translation for ${lang.blobId}`);
        languagePromises.push(
            translationClient.getLanguageBlob(SERVICE_ID, lang.blobId)
                .then((blob) =>translations[blob.blobId] = blob.data )
        );
    });

    const definedLangs = await Promise.all(languagePromises);

    if (!fs.existsSync(path.dirname(TRANSLATIONS_FILE))) {
        log('Creating translations folder...');
        fs.mkdirSync(path.dirname(TRANSLATIONS_FILE));
    }

    log(`Storing translation ${TRANSLATIONS_FILE}`);
    fs.writeFileSync(TRANSLATIONS_FILE, JSON.stringify(translations, null, 4));
}

retrieveTranslations()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
