import StereotypeClient from 'stereotype-client';


function listTemplates(accessToken, filterByPrefix) {
    const client = new StereotypeClient('Bearer ' + accessToken);

    return client.listTemplates()
        .then((list) => {
            if (filterByPrefix) {
                return Promise.resolve(list.filter((t) => t.templateId.startsWith((filterByPrefix))));
            }
            return Promise.resolve(list);
        });
}

function cloneTemplate(accessToken, fromTemplateId, newTemplateId) {
    const client = new StereotypeClient('Bearer ' + accessToken);

    return client
        .getTemplate(newTemplateId)
        .then(() => {
            return Promise.reject(`Template ${newTemplateId} already exists!`);
        })
        .catch((error) => {
            // Already there
            if (error.response && error.response.status === 403) {
                return Promise.reject(`Template ${newTemplateId} already exists!`);
            }

            // Good
            if (error.response && error.response.status === 404) {
                return client
                    .getTemplate(fromTemplateId)
                    .then((template) =>
                        client.putTemplate(newTemplateId, template.templateBody, template.contentType)
                    );
            }

            return Promise.reject(error);
        });
}

function createTemplate(accessToken, newTemplateId, contentType) {
    const client = new StereotypeClient('Bearer ' + accessToken);

    return client
        .getTemplate(newTemplateId)
        .then(() => {
            return Promise.reject(`Template ${newTemplateId} already exists!`);
        })
        .catch((error) => {
            // Already there
            if (error.response && error.response.status === 403) {
                return Promise.reject(`Template ${newTemplateId} already exists!`);
            }

            // Good
            if (error.response && error.response.status === 404) {
                return client
                    .putTemplate(newTemplateId, '', contentType);
            }

            return Promise.reject(error);
        });
}

export {
    listTemplates,
    cloneTemplate,
    createTemplate,
};
