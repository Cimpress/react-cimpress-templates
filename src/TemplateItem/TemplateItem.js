import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {Drawer} from '@cimpress/react-components';
import {translate} from 'react-i18next';
import CommentsDrawerLink from 'react-cimpress-comment';
import IconButton from '../internal/IconButton';
import DefaultButton from '../internal/DefaultButton';
import {UsersTable} from 'react-cimpress-users';
import {getI18nInstance} from '../i18n';
import TemplateSelectModal from '../TemplateSelectModal/TemplateSelectModal';
import NewTemplateModal from '../internal/NewTemplateModal';

import './TemplateItem.css';
import {listTemplates} from '../apis/stereotype.api';
import {grantReadToPrincipal} from '../apis/coam.api';

class TemplateItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openDialogChangeTemplate: false,
            openDialogCreateTemplate: false,
            showUsers: false,
        };
    }

    tt(key) {
        let {t, language} = this.props;
        return t(key, {lng: language});
    }

    onChangeTemplate() {
        this.setState({
            openDialogChangeTemplate: true,
        });
    }

    fetchTemplates() {
        return listTemplates(this.props.accessToken, this.props.filterTemplatesByTag ? {key: this.props.filterTemplatesByTag} : undefined)
            .then((templates) => {
                this.setState({
                    templates: templates,
                });
            });
    }

    fetchAll() {
        this.setState({
            fetching: true,
            fetchingError: undefined,
        }, () => {
            this.fetchTemplates()
                .then((x) => {
                    this.setState({
                        fetching: false,
                    });
                }).catch((error) => {
                    this.setState({
                        fetching: false,
                        fetchingError: error,
                    });
                });
        });
    }

    componentDidMount() {
        if (!this.state.fetching) {
            this.fetchAll();
        }
    }

    componentDidUpdate(prevProps) {
        let reFetchTemplates = false;
        if (prevProps.accessToken !== this.props.accessToken && this.props.accessToken) {
            reFetchTemplates = true;
        }

        if (reFetchTemplates && !this.state.fetching) {
            this.fetchAll();
        }
    }

    onCancel(dialogOpenFlagName) {
        this.setState({
            [dialogOpenFlagName]: false,
        });
    }

    onTemplateChanged(dialogOpenFlagName, templateId) {
        this.setState({
            [dialogOpenFlagName]: false,
        });
        if (this.props.onTemplateChanged) {
            this.props.onTemplateChanged(templateId);
        }
    }

    _templateDesignerHref(templateId) {
        return `https://templatedesigner.cimpress.io/designer/${templateId}?payload=${encodeURIComponent(JSON.stringify(this.props.payload))}`;
    }

    onTemplateCreated(dialogOpenFlagName, newTemplate) {
        this.setState({
            [dialogOpenFlagName]: false,
        });

        if (this.props.onTemplateCreated) {
            this.props.onTemplateCreated(newTemplate.templateId);
        }

        this.setState({
            templates: this.state.templates.concat([newTemplate]),
        });

        if (this.props.autoGrantReadToPrincipalWhenCreating) {
            const groupUrl = ((newTemplate.links || {}).coamAdminGroup || {}).href;
            grantReadToPrincipal(this.props.accessToken, groupUrl, this.props.autoGrantReadToPrincipalWhenCreating);
        }

        if (this.props.autoRedirectAfterCreation) {
            window.open(this._templateDesignerHref(newTemplate.templateId), '_blank');
        }
    }

    renderChangeTemplateDialog() {
        return <TemplateSelectModal
            language={this.props.language}
            filterTemplatesByTag={this.props.filterTemplatesByTag}
            open={this.state.openDialogChangeTemplate}
            templates={this.state.templates}
            accessToken={this.props.accessToken}
            onCancel={() => this.onCancel('openDialogChangeTemplate')}
            onConfirm={(templateId) => this.onTemplateChanged('openDialogChangeTemplate', templateId)}
            createNewUrl={undefined}
            showAddNew={false}
        />;
    }

    renderCreateTemplateDialog() {
        return <NewTemplateModal
            language={this.props.language}
            creationType={this.state.openDialogCreateTemplateType}
            autoTagTemplateWhenCreatingWith={this.props.autoTagTemplateWhenCreating ? this.props.filterTemplatesByTag : undefined}
            accessToken={this.props.accessToken}
            oldTemplateId={this.props.templateId}
            open={this.state.openDialogCreateTemplate}
            onCancel={() => this.onCancel('openDialogCreateTemplate')}
            onConfirm={(oldTemplateId, newTemplate) => {
                this.onTemplateCreated('openDialogCreateTemplate', newTemplate);
            }}
        />;
    }

    renderUsersDrawer(templateName) {
        const template = (this.state.templates || []).find((t) => t.templateId === this.props.templateId);
        const groupUrl = (((template || {}).links || {}).coamAdminGroup || {}).href;
        if (!groupUrl) {
            return null;
        }

        let drawerContent = <div style={{marginTop: '-20px'}}>
            <UsersTable
                language={this.props.i18n.language}
                accessToken={this.props.accessToken}
                groupUrl={groupUrl}
                mutuallyExclusiveRoles
                showAdminsOnlyFilter={false}
                allowedRoles={[{
                    roleName: 'Template Editor',
                    roleCaption: 'Editor',
                    isManagerRole: true,
                }, {
                    roleName: 'Template Reader',
                    roleCaption: 'Reader',
                    isManagerRole: false,
                }]}
            />
        </div>;

        return <Drawer
            closeOnClickOutside
            show={this.state.showUsers}
            header={
                <div>
                    <h4>{this.tt('manage_access_drawer_title')}</h4>
                    <h5 style={{textAlign: 'left'}}>
                        <span className={'active-template-name-full'}>{templateName}</span>
                    </h5>
                </div>
            }
            onRequestHide={() => this.setState({showUsers: false})}
            footer={<DefaultButton
                gaKey={'btn.users.drawer.close'}
                onClick={() => this.setState({showUsers: false})}
                title={this.tt('button_cancel')}
            />}>
            {this.state.showUsers ? drawerContent : null}
        </Drawer>;
    }

    render() {
        const template = (this.state.templates || []).find((t) => t.templateId === this.props.templateId);
        const templateName = template
            ? (template.templateName || template.templateId)
            : this.props.templateId;

        const groupUrl = (((template || {}).links || {}).coamAdminGroup || {}).href;
        const spacing = <Fragment>&nbsp;&nbsp;&nbsp;</Fragment>;
        const title = this.state.fetchingError
            ? <div className={'clearfix'}>
                Error
                <div className={'pull-right'}>
                    <button className={'btn btn-sm btn-default'} onClick={() => this.fetchAll(true, true)}>
                        {this.tt('retry')}
                    </button>
                </div>
            </div>
            : <span className={'rct'}>

                {this.props.withCreateBlankButton || this.props.withCloneButton
                    ? this.renderCreateTemplateDialog('blank')
                    : null}

                <div className={'pull-left'}>
                    {this.renderChangeTemplateDialog()}
                    <IconButton
                        gaKey={'btn.template.change'}
                        name={'view-module-1-f'}
                        disabled={this.state.fetching}
                        onClick={() => this.onChangeTemplate()}
                        tooltip={this.tt('button_change_tooltip')}
                    />
                </div>
                <span>
                    <label className={'template-label'}>{this.tt('template-item-label')}</label>
                    <span className={'template-name'}>
                        {this.state.fetching
                            ? this.tt('loading')
                            : templateName}
                        {this.props.withComments && !this.state.fetching
                            ? <CommentsDrawerLink
                                locale={this.props.i18n.language}
                                resourceUri={`https://stereotype.trdlnk.cimpress.io/v1/templates/${this.props.templateId}`}
                                newestFirst
                                editComments
                                accessToken={this.props.accessToken}/>
                            : null}
                    </span>
                </span>

                <div className={'pull-right'}>
                    {this.props.withCreateBlankButton
                        ? <Fragment>
                            {spacing}
                            <IconButton
                                gaKey={'create_blank_template'}
                                name={'add-circle-1'}
                                disabled={this.state.fetching}
                                onClick={() => this.setState({
                                    openDialogCreateTemplate: true,
                                    openDialogCreateTemplateType: 'blank',
                                })}
                                tooltip={this.tt('button_create_blank_template_tooltip')}/></Fragment>
                        : null}
                    {this.props.withEditButton
                        ? <Fragment>
                            {spacing}
                            <IconButton
                                gaKey={'edit_template'}
                                name={'file-picture-edit-l'}
                                disabled={this.state.fetching}
                                href={this._templateDesignerHref(this.props.templateId)}
                                target={'_blank'}
                                tooltip={this.tt('button_edit_template_tooltip')}/></Fragment>
                        : null}
                    {this.props.withCloneButton
                        ? <Fragment>
                            {spacing}
                            <IconButton
                                gaKey={'clone_template'}
                                name={'copy-3-l'}
                                disabled={this.state.fetching}
                                onClick={() => this.setState({
                                    openDialogCreateTemplate: true,
                                    openDialogCreateTemplateType: 'clone',
                                })}
                                tooltip={this.tt('button_clone_template_tooltip')}/></Fragment>
                        : null}
                    {this.props.withAccessButton
                        ? <Fragment>
                            {spacing}
                            {this.renderUsersDrawer(templateName)}
                            <IconButton
                                gaKey={'open_manage_access_drawer'}
                                name={'person-lock-1-l'}
                                disabled={!groupUrl || this.state.fetching}
                                onClick={() => this.setState({showUsers: true})}
                                tooltip={this.tt('button_manage_access_tooltip')}/></Fragment>
                        : null}
                    {this.props.withPreviewButton
                        ? <Fragment>
                            {spacing}
                            <IconButton
                                tooltip={this.tt('button_preview_tooltip')}
                                disabled={this.state.fetching || !this.props.onPreviewClicked}
                                onClick={() => {
                                    if (this.props.onPreviewClicked) {
                                        this.props.onPreviewClicked(this.props.templateId);
                                    }
                                }}
                                gaKey={'btn.view.template'}
                                name={'view-2-l'}/></Fragment>
                        : null}
                </div>
            </span>;

        return <div className={'rct template-item clearfix'}>
            {title}
        </div>;
    }
}

TemplateItem.propTypes = {

    // translations
    t: PropTypes.any,
    i18n: PropTypes.any,
    language: PropTypes.string,

    accessToken: PropTypes.string,
    templateId: PropTypes.string,

    filterTemplatesByTag: PropTypes.string,
    autoTagTemplateWhenCreating: PropTypes.bool,
    autoGrantReadToPrincipalWhenCreating: PropTypes.string,
    autoRedirectAfterCreation: PropTypes.bool,

    payload: PropTypes.object,

    withComments: PropTypes.bool,
    withCreateBlankButton: PropTypes.bool,
    withPreviewButton: PropTypes.bool,
    withAccessButton: PropTypes.bool,
    withEditButton: PropTypes.bool,
    withCloneButton: PropTypes.bool,

    onTemplateChanged: PropTypes.func,
    onTemplateCreated: PropTypes.func,
    onPreviewClicked: PropTypes.func,
};

TemplateItem.defaultProps = {
    withComments: true,
    withCreateBlankButton: true,
    withPreviewButton: false,
    withAccessButton: true,
    withEditButton: true,
    withCloneButton: true,
    autoRedirectAfterCreation: false,
};

export default translate('translations', {i18n: getI18nInstance()})(TemplateItem);
