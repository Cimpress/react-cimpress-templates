import React from 'react';
import PropTypes from 'prop-types';
import VirtualizedSelect from 'react-virtualized-select';
import { SelectWrapper } from '@cimpress/react-components';

import { getI18nInstance } from './i18n';
import { translate } from 'react-i18next';
import StereotypeClient from 'stereotype-client';

class TemplatesSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            templates: this.props.templates,
            fetchingTemplates: false
        };
    }

    fetchTemplates() {

        this.setState({
            fetchingTemplates: true
        });

        let client = new StereotypeClient(this.props.accessToken);
        return client.listTemplates()
            .then(templates => {
                this.setState({
                    templates: templates,
                    fetchingTemplates: false
                })
            })
            .catch((err) => {
                this.setState({
                    templates: null,
                    fetchingTemplates: false,
                    fetchingError: err
                })
            });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.accessToken !== this.props.accessToken && this.props.accessToken) {
            this.fetchTemplates(this.props.accessToken)
        }
    }

    componentDidMount() {
        if (!this.props.accessToken) {
            return;
        }

        this.fetchTemplates(this.props.accessToken)
    }

    handleChange(option) {
        if (this.props.onChange) {
            this.props.onChange(option.value)
        }
    }

    getOptions() {
        let templates = this.state.templates || [];

        if (!templates) {
            if (this.state.fetchingTemplates) {
                return [{
                    label: this.tt('loading'),
                    value: '-1'
                }];
            }

            return [{
                label: this.tt('no-data'),
                value: '-1'
            }];
        }


        return templates.map(t => ({
            label: t.templateId,
            value: t.templateId
        }));
    }

    tt(key) {
        let { t, language } = this.props;
        return t(key, { lng: language });
    }

    render() {

        let select = <SelectWrapper
            selectedSelect={VirtualizedSelect}
            label={this.props.label || this.tt('template-label')}
            value={this.props.selectedTemplateId}
            options={this.getOptions()}
            noResultsText={this.tt('no-results-found')}
            clearable={false}
            onChange={(option) => this.handleChange(option)}
            tether/>;

        if (!this.props.showAddNew) {
            return select;
        }

        return (
            <div className='row'>
                <div className='col-sm-8'>
                    {select}
                </div>
                <div className='col-sm-4'>
                    {this.tt('cant-find-why-dont-you-add-a-new-one')}
                    &nbsp;
                    <a href={this.props.createNewUrl}>{this.tt('create-new')}</a>
                </div>
            </div>
        )
    }
}

TemplatesSelect.propTypes = {
    // silence eslint
    t: PropTypes.any,
    i18n: PropTypes.any,

    // Either access token OR a list of templates to display
    accessToken: PropTypes.string,
    templates: PropTypes.array,

    // functions and buttons
    onChange: PropTypes.func,

    // display
    language: PropTypes.string,
    label: PropTypes.string,
    showAddNew: PropTypes.bool,
    selectedTemplateId: PropTypes.string,
    createNewUrl: PropTypes.string
};

TemplatesSelect.defaultProps = {
    language: 'eng',
    showAddNew: true,
    createNewUrl: 'https://templatedesigner.cimpress.io/samples/productionEmail'
};

export default translate('translations', { i18n: getI18nInstance() })(TemplatesSelect);
