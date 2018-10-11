import React from 'react';
import PropTypes from 'prop-types';

import {getI18nInstance} from '../i18n';
import {translate} from 'react-i18next';
import TemplateSelect from '../TemplateSelect/TemplateSelect';
import {Portal} from 'react-portal';
import {Modal} from '@cimpress/react-components';

import './TemplateSelectModal.css';
import DefaultButton from '../internal/DefaultButton';


class TemplateSelectModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTemplateId: this.props.selectedTemplateId,
        };
    }

    onCancel() {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    onConfirm() {
        if (this.props.onConfirm) {
            this.props.onConfirm(this.state.selectedTemplateId);
        }
    }

    tt(key) {
        let {t, language} = this.props;
        return t(key, {lng: language});
    }

    render() {
        return <Portal>
            <Modal
                bsStyle={this.props.bsStyle || 'info'}
                className={this.props.className
                    ? this.props.className + ' tsm'
                    : 'tsm'}
                style={{overflow: 'visible'}}
                show={this.props.open}
                onRequestHide={() => this.onCancel()}
                closeOnOutsideClick={true}
                title={this.props.title || this.tt('change-modal-title')}
                closeButton={true}
                footer={
                    <div align='right'>
                        <DefaultButton
                            iconName={'close-l'}
                            gaKey={'template.modal.btn.cancel'}
                            onClick={() => this.onCancel()}
                            title={this.tt('modal-btn-cancel')}
                        />
                        &nbsp;
                        <DefaultButton
                            gaKey={'template.modal.btn.save'}
                            type={'primary'}
                            iconName={'check-1-l'}
                            iconColor={'#fff'}
                            onClick={() => this.onConfirm()}
                            title={this.tt('modal-btn-confirm')}
                        />
                    </div>
                }>
                <div>{this.tt('change-modal-description')}</div>
                <br/>
                <TemplateSelect
                    language={this.props.language}
                    selectedTemplateId={this.state.selectedTemplateId}
                    templateSelectionPrefix={this.props.templateSelectionPrefix}
                    accessToken={this.props.accessToken}
                    onChange={((templateId) => this.setState({selectedTemplateId: templateId}))}
                    showAddNew={this.props.showAddNew}
                    createNewUrl={this.props.createNewUrl}
                    title={this.props.title}
                    label={this.props.label}
                />
            </Modal>
        </Portal>;
    }
}


TemplateSelectModal.propTypes = {
    // silence eslint
    t: PropTypes.any,
    i18n: PropTypes.any,

    // Either access token OR a list of templates to display
    accessToken: PropTypes.string,
    templateSelectionPrefix: PropTypes.string,

    // functions and buttons
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,

    // display
    open: PropTypes.bool,
    title: PropTypes.string,
    bsStyle: PropTypes.string,
    className: PropTypes.string,
    language: PropTypes.string,
    label: PropTypes.string,
    showAddNew: PropTypes.bool,
    selectedTemplateId: PropTypes.string,

    createNewUrl: PropTypes.string,
};

TemplateSelectModal.defaultProps = {
    language: 'eng',
    showAddNew: true,
    templateSelectionPrefix: '',
};

export default translate('translations', {i18n: getI18nInstance()})(TemplateSelectModal);
