import React from 'react';

import {storiesOf} from '@storybook/react';
import {State, Store} from '@sambego/storybook-state';
import {withKnobs, text, boolean} from '@storybook/addon-knobs/react';

import Authenticated from './Authenticated';
import TemplateSelect from '../src/TemplateSelect/TemplateSelect';
import TemplateSelectButton from '../src/TemplateSelectButton/TemplateSelectButton';
import auth from './auth';
import TemplateItem from '../src/TemplateItem/TemplateItem';

const store = new Store({
    lastTemplateId: 'FTPAdaptorOrderModel',
});

storiesOf('TemplateItem', module)
    .addDecorator(withKnobs)
    .add('Basic use', () => <Authenticated>
        <State store={store}>
            <div className={'row'}>
                <div className={'col-md-6'}>
                    <TemplateItem
                        language={'eng'}
                        accessToken={auth.getAccessToken()}
                        template={{
                            templateId: store.get('lastTemplateId'),
                        }}

                        onTemplateChanged={(templateId) => {
                            store.set({lastTemplateId: templateId});
                        }}

                        onTemplateCreated={(newTemplateId) => {
                            store.set({lastTemplateId: newTemplateId});
                        }}

                        templateSelectionPrefix={text('templateSelectionPrefix', 'FTPAdaptor')}
                        autoPrefixTemplateWhenCreating={boolean('autoPrefixTemplateWhenCreating', true)}
                        autoRedirectAfterCreation={boolean('autoRedirectAfterCreation', true)}

                        withCreateBlankButton={boolean('withComments', true)}
                        withComments={boolean('withComments', true)}
                        withPreviewButton={boolean('withPreviewButton', false)}
                        withAccessButton={boolean('withAccessButton', true)}
                        withEditButton={boolean('withEditButton', true)}
                        withCloneButton={boolean('withCloneButton', true)}
                    />
                </div>
            </div>
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
