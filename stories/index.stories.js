import React from 'react';

import {storiesOf} from '@storybook/react';
import {State, Store} from '@sambego/storybook-state';
import {withKnobs, text, boolean} from '@storybook/addon-knobs/react';
const simpleParser = require('mailparser').simpleParser;

import Authenticated from './Authenticated';
import TemplateSelect from '../src/TemplateSelect/TemplateSelect';
import TemplateSelectButton from '../src/TemplateSelectButton/TemplateSelectButton';
import PermissionDeniedToTemplate from '../src/TemplatePreview/errors/PermissionDeniedToTemplate';
import auth from './auth';
import TemplateItem from '../src/TemplateItem/TemplateItem';
import {TemplatePreview} from '../src/index';

const store = new Store({
    lastTemplateId: '264e885b-d7f9-4be8-b154-1010f54bece3',
});

const payload403 = {
    'to': 'istanishev@cimpress.com',
    'emailNotificationTo': 'istanishev@cimpress.com',
    'links': {
        'self': {
            'href': 'https://fulfillment.at.cimpress.io/v1/notifications/0a1c21de-d195-4555-a95a-41939d32562b',
        },
    },
};

storiesOf('TemplatePreview', module)
    .addDecorator(withKnobs)
    .add('Basic use', () => <Authenticated>
        <State store={store}>
            {(state) => {
                return <div className={'row'}>
                    <div className={'col-md-6'}>
                        <TemplatePreview
                            language={text('Language', 'eng')}
                            accessToken={auth.getAccessToken()}
                            templateId={text('templateId', state.lastTemplateId)}
                            payload={payload403}
                            materializationLanguage={text('materializationLanguage', 'html')}
                            materializationPostProcessing={(mimeMessage)=> {
                                return simpleParser(mimeMessage).then((x) => x.html);
                            }}
                            htmlPreview={boolean('htmlPreview', true)}
                            renderFrame={boolean('renderFrame', false)}
                        />
                    </div>
                </div>;
            }}
        </State>
    </Authenticated>)
    .add('Direct materialization', () => <Authenticated>
        <State store={store}>
            {(state) => {
                return <div className={'row'}>
                    <div className={'col-md-6'}>
                        <TemplatePreview
                            language={text('Language', 'eng')}
                            accessToken={auth.getAccessToken()}
                            templateBody={'{{{JSONstringify .}}}'}
                            templateContentType={'text/handlebars'}
                            payload={{
                                demo: 'asd',
                            }}
                            materializationLanguage={text('materializationLanguage', 'json')}
                            htmlPreview={boolean('htmlPreview', false)}
                        />
                    </div>
                </div>;
            }}
        </State>
    </Authenticated>);

storiesOf('TemplateItem', module)
    .addDecorator(withKnobs)
    .add('Basic use', () => <Authenticated>
        <State store={store}>
            {(state) => {
                return <div className={'row'}>
                    <div className={'col-md-6'}>
                        <TemplateItem
                            language={text('Language', 'eng')}
                            accessToken={auth.getAccessToken()}
                            templateId={state.lastTemplateId}

                            onTemplateChanged={(templateId) => {
                                store.set({lastTemplateId: templateId});
                            }}

                            onTemplateCreated={(newTemplateId) => {
                                store.set({lastTemplateId: newTemplateId});
                            }}

                            filterTemplatesByTag={text('templateSelectionPrefix', 'urn:fileBasedAdaptor:template')}
                            autoTagTemplateWhenCreating={boolean('autoTagTemplateWhenCreating', true)}
                            autoRedirectAfterCreation={boolean('autoRedirectAfterCreation', false)}
                            autoGrantReadToPrincipalWhenCreating={text('autoGrantReadToPrincipalWhenCreating', 'waad|7Q4pxFe7EGs_VN5XuG1fMswSspASn6DpUecPJAIas8U')}

                            withCreateBlankButton={boolean('withComments', true)}
                            withComments={boolean('withComments', true)}
                            withPreviewButton={boolean('withPreviewButton', true)}
                            withAccessButton={boolean('withAccessButton', true)}
                            withEditButton={boolean('withEditButton', true)}
                            withCloneButton={boolean('withCloneButton', true)}
                        />
                    </div>
                </div>;
            }}
        </State>
    </Authenticated>);

storiesOf('TemplateSelect', module)
    .addDecorator(withKnobs)
    .add('With static list', () =>
        <State store={store}>
            <TemplateSelect
                language={text('Language', 'eng')}
                templates={[{
                    templateId: 't1',
                }, {
                    templateId: 't2',
                }, {
                    templateId: 't3',
                }]}
                selectedTemplateId={store.get('lastTemplateId')}
                onChange={(templateId) => store.set({lastTemplateId: templateId})}/>
        </State>)

    .add('List from service', () => <Authenticated>
        <State store={store}>
            <TemplateSelect
                language={text('Language', 'eng')}
                accessToken={auth.getAccessToken()}
                selectedTemplateId={store.get('lastTemplateId')}
                onChange={(templateId) => store.set({lastTemplateId: templateId})}/>
        </State>
    </Authenticated>)

    .add('With add new visible', () => <Authenticated>
        <State store={store}>
            <TemplateSelect
                language={text('Language', 'eng')}
                accessToken={auth.getAccessToken()}
                showAddNew={false}
                selectedTemplateId={store.get('lastTemplateId')}
                onChange={(templateId) => store.set({lastTemplateId: templateId})}/>
        </State>
    </Authenticated>);

storiesOf('TemplateSelectButton', module)
    .addDecorator(withKnobs)
    .add('Basic use', () => <Authenticated>
        <State store={store}>
            <TemplateSelectButton
                language={text('Language', 'eng')}
                accessToken={auth.getAccessToken()}
                onConfirm={(templateId) => store.set({lastTemplateId: templateId})}/>
        </State>
    </Authenticated>);

storiesOf('Errors', module)
    .addDecorator(withKnobs)
    .add('PermissionDeniedToTemplate', () =>
        <State store={store}>
            <PermissionDeniedToTemplate/>
        </State>)

    .add('PermissionDeniedToTemplate', () =>
        <State store={store}>
            <PermissionDeniedToTemplate/>
        </State>);
