import React from 'react';

import { storiesOf } from '@storybook/react';
import { State, Store } from '@sambego/storybook-state';

import Authenticated from './Authenticated';
import TemplatesSelect from "../src/TemplateSelect";
import TemplatesSelectButton from "../src/TemplateSelectButton";
import auth from "./auth";

const store = new Store({
  lastTemplateId: undefined,
});

storiesOf('TemplatesSelect', module)
  .add('With static list', () =>
    <State store={store}>
      <TemplatesSelect
        templates={[{
        templateId: 't1'
      }, {
        templateId: 't2'
      }, {
        templateId: 't3'
      }]}
        selectedTemplateId={store.get('lastTemplateId')}
        onChange={templateId => store.set({ lastTemplateId: templateId })}/>
    </State>)

  .add('List from service', () => <Authenticated>
    <State store={store}>
      <TemplatesSelect
        accessToken={auth.getAccessToken()}
        selectedTemplateId={store.get('lastTemplateId')}
        onChange={templateId => store.set({ lastTemplateId: templateId })}/>
    </State>
  </Authenticated>)

  .add('With add new visible', () => <Authenticated>
    <State store={store}>
      <TemplatesSelect
        accessToken={auth.getAccessToken()}
        showAddNew={false}
        selectedTemplateId={store.get('lastTemplateId')}
        onChange={templateId => store.set({ lastTemplateId: templateId })}/>
    </State>
  </Authenticated>);

storiesOf('TemplatesSelectButton', module)
  .add('Basic use', () => <Authenticated>
    <State store={store}>
      <TemplatesSelectButton
        accessToken={auth.getAccessToken()}
        onConfirm={templateId => store.set({ lastTemplateId: templateId })}/>
    </State>
  </Authenticated>);
