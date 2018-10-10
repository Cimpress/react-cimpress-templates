import axios from 'axios';

const defaultRequestData = (accessToken, additionalRequest) => {
    return Object.assign({}, {
        baseURL: `https://api.cimpress.io/auth/access-management`,
        timeout: 3000,
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        },
    }, additionalRequest);
};

const exec = (data) => {
    return axios
        .request(data)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            // eslint-disable-next-line no-console
            console.error(err);
            throw err;
        });
};

const getGroups = (accessToken, resourceId) => {
    let data = defaultRequestData(accessToken, {
        url: `/v1/groups?resource_type=stereotype-templates&resource_identifier=${resourceId}&${Math.random() * 1000000}`,
        method: 'GET',
    });

    return exec(data).then((r) => r.groups);
};

const getTemplateAdminGroup = (accessToken, templateId) => {
    return getGroups(accessToken, templateId)
        .then((groups) => {
            if (groups && groups.length > 0) {
                let bestGuess = groups.filter((g) => g.name.startsWith('Stereotype Template: '));
                let id = (bestGuess && bestGuess.length > 0) ? bestGuess[0].id : groups[0].id;
                return Promise.resolve(parseInt(id, 10));
            } else {
                return Promise.resolve(undefined);
            }
        })
        .catch((e) => {
            return Promise.resolve(undefined);
        });
};


export {
    getGroups,
    getTemplateAdminGroup,
};
