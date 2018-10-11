import React from 'react';
import PropTypes from 'prop-types';

import {getI18nInstance} from '../i18n';
import {translate} from 'react-i18next';
import TemplateSelectModal from '../TemplateSelectModal/TemplateSelectModal';

class TemplateSelectButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }

    onCancel() {
        this.setState({open: false}, () => {
            if (this.props.onCancel) {
                this.props.onCancel();
            }
        });
    }

    onConfirm(templateId) {
        this.setState({open: false}, () => {
            if (this.props.onConfirm) {
                this.props.onConfirm(templateId);
            }
        });
    }

    tt(key) {
        let {t, language} = this.props;
        return t(key, {lng: language});
    }

    render() {
        return [
            <button key={0} className={'btn btn-default'} onClick={() => this.setState({open: !this.state.open})}>
                {this.tt('open-template-selection-modal')}
            </button>,
            <TemplateSelectModal
                key={1}
                language={this.props.language}
                open={this.state.open}
                accessToken={this.props.accessToken}
                onCancel={() => this.onCancel()}
                onConfirm={(templateId) => this.onConfirm(templateId)}
                createNewUrl={this.props.createNewUrl}
                showAddNew={this.props.showAddNew}
                title={this.props.title}
                label={this.props.label}
            />,
        ];
    }
}


TemplateSelectButton.propTypes = {
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
    title: PropTypes.string,
    showAddNew: PropTypes.bool,
    selectedTemplateId: PropTypes.string,

    createNewUrl: PropTypes.string,
};

TemplateSelectButton.defaultProps = {
    language: 'eng',
    showAddNew: true,
};

export default translate('translations', {i18n: getI18nInstance()})(TemplateSelectButton);
