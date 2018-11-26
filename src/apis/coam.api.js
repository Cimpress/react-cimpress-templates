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

const getGroupInfo = (accessToken, groupUrl) => {
    let data = defaultRequestData(accessToken, {
        url: `${groupUrl}?canonicalize=true&${Math.random() * 1000000}`,
        method: 'GET',
    });

    return exec(data);
};

const patchUserRoles = (accessToken, groupId, principal, rolesChanges) => {
    let data = defaultRequestData(accessToken, {
        url: `/v1/groups/${groupId}/members/${encodeURIComponent(principal)}/roles`,
        method: 'PATCH',
        data: rolesChanges,
    });

    return exec(data);
};

const addGroupMember = (accessToken, groupId, principal, isAdmin) => {
    let data = defaultRequestData(accessToken, {
        url: `/v1/groups/${groupId}/members`,
        method: 'PATCH',
        data: {
            'add': [{
                is_admin: !!isAdmin,
                principal: principal,
            }],
        },
    });

    return exec(data);
};

const grantReadToPrincipal = (accessToken, groupUrl, principal) => {
    return getGroupInfo(accessToken, groupUrl)
        .then((groupInfo) => {
            if (!groupInfo) {
                return Promise.reject('Failed to retrieve template COAM group.');
            }
            return addGroupMember(accessToken, groupInfo.id, principal, false)
                .then(() => patchUserRoles(accessToken, groupInfo.id, principal, {'add': ['Template Reader']})
                );
        });
};

export {
    grantReadToPrincipal,
};
