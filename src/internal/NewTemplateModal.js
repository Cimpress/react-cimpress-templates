import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

import {getI18nInstance} from '../i18n';
import {translate} from 'react-i18next';
import {Portal} from 'react-portal';
import {Modal, TextField, Alert} from '@cimpress/react-components';
import {
    IconCheck,
    IconClose,
} from '@cimpress-technology/react-streamline-icons';

import DefaultButton from './DefaultButton';
import Loading from './Loading';
import {cloneTemplate, createTemplate} from '../apis/stereotype.api';

class NewTemplateModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newTemplateId: this.props.newTemplateId,
            executing: false,
            error: undefined,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.newTemplateId !== this.props.newTemplateId) {
            this.setState({newTemplateId: this.props.newTemplateId});
        }
    }

    onCancel() {
        this.setState({
            executing: false,
            error: undefined,
            newTemplateId: '',
        });

        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    onConfirm() {
        this.setState({
            executing: true,
            error: undefined,
        });

        const templateName = this.state.newTemplateId;

        const createPromise = (this.props.creationType === 'clone')
            ? cloneTemplate(this.props.accessToken, this.props.oldTemplateId, templateName,
                this.props.autoTagTemplateWhenCreatingWith ? {key: this.props.autoTagTemplateWhenCreatingWith} : undefined)
            : createTemplate(this.props.accessToken, this.props.blankTemplateContentType, templateName,
                this.props.autoTagTemplateWhenCreatingWith ? {key: this.props.autoTagTemplateWhenCreatingWith} : undefined);

        createPromise
            .then((template) => {
                this.setState({
                    executing: false,
                    error: undefined,
                    newTemplateId: '',
                });

                if (this.props.onConfirm) {
                    this.props.onConfirm(this.props.oldTemplateId, template);
                }
            })
            .catch((er) => {
                // eslint-disable-next-line no-console
                console.log('er', er);
                this.setState({
                    executing: false,
                    error: er,
                });
            });
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
                onRequestHide={this.state.executing ? undefined : () => this.onCancel()}
                closeOnOutsideClick={!this.state.executing}
                title={this.props.title || this.tt(`new-template-modal-${this.props.creationType}-template-title`)}
                closeButton={!this.state.executing}
                footer={
                    <div align='right'>
                        <DefaultButton
                            disabled={this.state.executing}
                            gaKey={'template.modal.btn.cancel'}
                            icon={IconClose}
                            onClick={() => this.onCancel()}
                            title={this.tt(`modal-btn-cancel`)}
                        />
                        &nbsp;
                        <DefaultButton
                            disabled={this.state.executing}
                            gaKey={'template.modal.btn.save'}
                            type={'primary'}
                            icon={IconCheck}
                            onClick={() => this.onConfirm()}
                            title={this.tt(`modal-btn-confirm`)}
                        />
                    </div>
                }>
                <div>{this.tt(`new-template-modal-${this.props.creationType}-description`)}</div>
                {this.state.error
                    ? <Fragment><br/>
                        <Alert type={'danger'} message={this.state.error.message
                            ? this.state.error.message
                            : typeof this.state.error === 'string'
                                ? JSON.stringify(this.state.error)
                                : JSON.stringify(this.state.error)} />
                    </Fragment>
                    : null}
                <br/>
                {this.state.executing ? <Fragment><Loading message={this.tt(`new-template-modal-${this.props.creationType}-executing`)}/><br/></Fragment> : null}
                <TextField
                    disabled={this.state.executing}
                    label={this.tt(`new-template-modal-${this.props.creationType}-new-template-label`)}
                    value={this.state.newTemplateId}
                    onChange={(e) => this.setState({
                        newTemplateId: e.target.value,
                        error: undefined,
                    })}
                />
            </Modal>
        </Portal>;
    }
}

NewTemplateModal.propTypes = {
    // silence eslint
    t: PropTypes.any,
    i18n: PropTypes.any,
    language: PropTypes.string,

    accessToken: PropTypes.string,
    oldTemplateId: PropTypes.string,
    newTemplateId: PropTypes.string,
    creationType: PropTypes.string, // .oneOf(['blank','clone']),
    autoTagTemplateWhenCreatingWith: PropTypes.string,
    blankTemplateContentType: PropTypes.string,

    // display
    open: PropTypes.bool,
    title: PropTypes.string,
    bsStyle: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.string,
    showAddNew: PropTypes.bool,
    selectedTemplateId: PropTypes.string,

    // functions and buttons
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
};

NewTemplateModal.defaultProps = {
    language: 'eng',
    showAddNew: true,
    creationType: 'clone',
    blankTemplateContentType: 'text/handlebars',
};

export default translate('translations', {i18n: getI18nInstance()})(NewTemplateModal);
