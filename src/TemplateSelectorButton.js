import React from 'react';
import PropTypes from 'prop-types';

import {getI18nInstance} from './i18n';
import {translate} from 'react-i18next';
import TemplateSelectorModal from './TemplateSelectorModal';

class TemplateSelectorButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    onCancel() {
        this.setState({open: false}, () => {
            if (this.props.onCancel) {
                this.props.onCancel()
            }
        })
    }

    onConfirm(templateId) {
        this.setState({open: false}, () => {
            if (this.props.onConfirm) {
                this.props.onConfirm(templateId)
            }
        })
    }

    tt(key) {
        let {t, language} = this.props;
        return t(key, {lng: language});
    }

    render() {
        return [
            <button className={'btn btn-default'} onClick={() => this.setState({open: !this.state.open})}>
                {this.tt('open-template-selection-modal')}
            </button>,
            <TemplateSelectorModal
                language={this.props.language}
                open={this.state.open}
                accessToken={this.props.accessToken}
                onCancel={() => this.onCancel()}
                onConfirm={(templateId) => this.onConfirm(templateId)}
            />
        ]
    }
}


TemplateSelectorButton.propTypes = {
    // silence eslint
    t: PropTypes.any,
    i18n: PropTypes.any,

    // Either access token OR a list of templates to display
    accessToken: PropTypes.string,

    // functions and buttons
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,

    // display
    language: PropTypes.string,
    label: PropTypes.string,
    showAddNew: PropTypes.bool,
    selectedTemplateId: PropTypes.string,
};

TemplateSelectorButton.defaultProps = {
    language: 'eng',
    showAddNew: true
};

export default translate('translations', {i18n: getI18nInstance()})(TemplateSelectorButton);
