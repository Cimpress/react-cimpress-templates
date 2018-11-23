import React from 'react';

import {storiesOf} from '@storybook/react';
import {State, Store} from '@sambego/storybook-state';
import {withKnobs, text, boolean} from '@storybook/addon-knobs/react';

import Authenticated from './Authenticated';
import TemplateSelect from '../src/TemplateSelect/TemplateSelect';
import TemplateSelectButton from '../src/TemplateSelectButton/TemplateSelectButton';
import auth from './auth';
import TemplateItem from '../src/TemplateItem/TemplateItem';
import {TemplatePreview} from '../src/index';

const store = new Store({
    lastTemplateId: 'FileBasedAdaptorDefaultTemplate',
});

storiesOf('TemplatePreview', module)
    .addDecorator(withKnobs)
    .add('Basic use', () => <Authenticated>
        <State store={store}>
            {(state) => {
                return <div className={'row'}>
                    <div className={'col-md-6'}>
                        <TemplatePreview
                            language={'eng'}
                            accessToken={auth.getAccessToken()}
                            templateId={text('templateId', state.lastTemplateId)}
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
    </Authenticated>)
    .add('Direct materialization', () => <Authenticated>
        <State store={store}>
            {(state) => {
                return <div className={'row'}>
                    <div className={'col-md-6'}>
                        <TemplatePreview
                            language={'eng'}
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
                            language={'eng'}
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
                accessToken={auth.getAccessToken()}
                selectedTemplateId={store.get('lastTemplateId')}
                onChange={(templateId) => store.set({lastTemplateId: templateId})}/>
        </State>
    </Authenticated>)

    .add('With add new visible', () => <Authenticated>
        <State store={store}>
            <TemplateSelect
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
                accessToken={auth.getAccessToken()}
                onConfirm={(templateId) => store.set({lastTemplateId: templateId})}/>
        </State>
    </Authenticated>);
