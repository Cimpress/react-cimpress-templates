import StereotypeClient from 'stereotype-client';
import TagliatelleClient from 'cimpress-tagliatelle';

const Base64 = require('js-base64').Base64;

const tagKeyTemplateName = 'urn:stereotype:templateName';
const tagKeyTemplateType = 'urn:stereotype:templateType';

const xStereotypeRelBlacklist = 'https://fulfillment.at.cimpress.io/rels/jobsheet,https://fulfillment.at.cimpress.io/rels/document,https://fulfillment.at.cimpress.io/rels/notifications';
const xStereotypeAcceptPreference = 'image/*;q=0.1,application/json;q=0.9';


const listTemplates = (accessToken, customTag) => {
    const client = new StereotypeClient('Bearer ' + accessToken);
    const tagliatelle = new TagliatelleClient();

    const tagKeys = [tagKeyTemplateName];
    if (customTag) {
        tagKeys.push(customTag.key);
    }

    return Promise.all([
        client.listTemplates(true, true),
        tagliatelle.getTags(accessToken, {key: tagKeys}).then((x) => x.results),
    ]).then((data) => {
        const list = data[0];
        const tags = data[1];

        const namedList = list.map((template) => {
            const templateTags = {};
            tags
                .filter((t) => t.resourceUri === template.links.self.href)
                .forEach(((tt) => {
                    templateTags[tt.key] = tt.value || null;
                }));

            return Object.assign({}, template, {
                templateName: templateTags[tagKeyTemplateName],
                tags: templateTags,
            });
        });

        if (customTag) {
            const filteredList = namedList.filter((t) => {
                return Object.keys(t.tags).includes(customTag.key);
            });
            return Promise.resolve(filteredList);
        }

        return Promise.resolve(namedList);
    });
};

const cloneTemplate = (accessToken, fromTemplateId, templateName, customTag) => {
    const client = new StereotypeClient('Bearer ' + accessToken);
    const tagliatelle = new TagliatelleClient();

    let templateData;

    client.getTemplate(fromTemplateId)
        .then((template) => {
            templateData = template;
            return tagliatelle.getTags(accessToken, {resourceUri: template.links.self.href}).then((t) => t.results);
        })
        .then((tags) => {
            const templateTypeTag = tags.find((t) => t.key === tagKeyTemplateType);
            const templateType = templateTypeTag ? templateTypeTag.value : undefined;

            return createTemplate(accessToken,
                templateData.contentType,
                templateName,
                customTag,
                Base64.decode(templateData.templateBody),
                templateType);

        }).catch((error) => {
            if (error.response && error.response.status === 404) {
                return Promise.reject(`Template ${fromTemplateId} does not exists!`);
            }
        });
};

const createTemplate = (accessToken, contentType, templateName, customTag = null, templateBody='', templateType = 'raw' ) => {
    const client = new StereotypeClient('Bearer ' + accessToken);
    const tagliatelle = new TagliatelleClient();

    return client
        .createTemplate(templateBody, contentType, false)
        .then((newTemplate) => {
            const templateUri = newTemplate.links.self.href;
            const tagPromises = [
                tagliatelle.createTag(accessToken, templateUri, tagKeyTemplateType, templateType),
                tagliatelle.createTag(accessToken, templateUri, tagKeyTemplateName, templateName),
            ];

            if (customTag) {
                tagPromises.push(tagliatelle.createTag(accessToken, templateUri, customTag.key, customTag.value));
            }

            return Promise.all(tagPromises).then(()=> {
                const template = newTemplate;
                template.templateName = templateName;
                template.tags = {};
                template.tags[tagKeyTemplateName] = templateName;
                template.tags[tagKeyTemplateType] = templateType;
                if (customTag) {
                    template.tags[customTag.key] = customTag.value;
                }
                return template;
            });
        });
};

const materializeTemplate = (accessToken, templateId, payload, options) => {
    const client = new StereotypeClient('Bearer ' + accessToken);

    let blacklist = (options || {}).blacklist;
    if (blacklist) {
        blacklist = `${blacklist},${xStereotypeRelBlacklist}`;
    }
    client.setBlacklistHeader(blacklist);
    client.setAcceptPreferenceHeader(xStereotypeAcceptPreference);

    return client.materialize(templateId, payload);
};

const materializeTemplateBody = (accessToken, templateBody, contentType, payload, options) => {
    const client = new StereotypeClient('Bearer ' + accessToken);

    let blacklist = (options || {}).blacklist;
    if (blacklist) {
        blacklist = `${blacklist},${xStereotypeRelBlacklist}`;
    }
    client.setBlacklistHeader(blacklist);
    client.setAcceptPreferenceHeader(xStereotypeAcceptPreference);

    let template = {
        content: templateBody,
        contentType: contentType,
    };

    return client.materializeDirect(template, payload);
};

export {
    listTemplates,
    cloneTemplate,
    createTemplate,
    materializeTemplate,
    materializeTemplateBody,
};
