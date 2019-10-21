/* global saving */
import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import Loading from '../internal/Loading';
import {materializeTemplate, materializeTemplateBody} from '../apis/stereotype.api';
import {Alert} from '@cimpress/react-components';
import {Highlight} from 'react-fast-highlight';
import {getI18nInstance} from '../i18n';
import Frame from 'react-frame-component';
import PermissionDeniedToTemplate from './errors/PermissionDeniedToTemplate';
import PermissionDeniedWhileExpandingPayload from './errors/PermissionDeniedWhileExpandingPayload';

class TemplatePreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blacklistRels: [],
        };
    }

    componentDidMount() {
        this.materialize();
    }

    componentDidUpdate(prevProps) {
        let shouldMaterialize = (this.props.templateId !== prevProps.templateId)
            || (this.props.accessToken !== prevProps.accessToken)
            || (this.props.templateContentType !== prevProps.templateContentType)
            || (this.props.templateBody !== prevProps.templateBody)
            || (this.props.htmlPreview !== prevProps.htmlPreview)
            || (this.props.materializationLanguage !== prevProps.materializationLanguage)
            || (JSON.stringify(this.props.payload) !== JSON.stringify(prevProps.payload));

        if ((JSON.stringify(this.props.payload) !== JSON.stringify(prevProps.payload))) {
            this.setState({blacklistRels: []});
        }

        if (shouldMaterialize) {
            this.materialize();
        }
    }

    materialize() {
        let options = {
            // add here black/white lists
            blacklist: (this.state.blacklistRels || []).join(','),
        };

        this.setState({
            isFetching: true,
            error: undefined,
        }, () => {
            let mPromise = Promise.resolve('misconfigured');
            if (this.props.templateId) {
                mPromise = materializeTemplate(this.props.accessToken, this.props.templateId, this.props.payload, options);
            }

            if (this.props.templateBody && this.props.templateContentType) {
                mPromise = materializeTemplateBody(this.props.accessToken, this.props.templateBody, this.props.templateContentType, this.props.payload, options)
                    .then((r) => r.result);
            }

            mPromise
                .then((materialization) => {
                    if (this.props.materializationPostProcessing) {
                        return this.props.materializationPostProcessing(materialization);
                    }
                    return materialization;
                })
                .then((materialization) => {
                    this.setState({
                        isFetching: false,
                        materialization: materialization,
                    });
                })
                .catch((error) => {
                    this.setState({
                        isFetching: false,
                        materialization: undefined,
                        error: error,
                    });
                });
        });
    }

    renderPreview() {
        if (this.props.materializationLanguage === 'html') {
            if (this.props.htmlPreview) {
                return <div dangerouslySetInnerHTML={{__html: this.state.materialization}}
                    onClick={(e) => {
                        let target = e.target;
                        while (target) {
                            if (target.tagName && target.tagName.toLowerCase() === 'a') {
                                target.setAttribute('target', '_blank');
                                return;
                            }
                            target = target.parentNode;
                        }
                    }}
                />;
            } else {
                return <Highlight languages={['html']} className="my-class">
                    {this.state.materialization || ''}
                </Highlight>;
            }
        }

        if (this.props.materializationLanguage === 'text') {
            return <pre>
                {this.state.materialization}
            </pre>;
        }

        return <Highlight languages={[this.props.materializationLanguage]} className="my-class">
            {this.state.materialization || ''}
        </Highlight>;
    }

    renderError() {
        if (!this.state.error) {
            return null;
        }

        let e = this.state.error;
        if (e.response) {
            if (e.response.status) {
                if (e.response.status === 404) {
                    return <Alert type={'danger'} message={this.tt('errors:template-not-found')}/>;
                }
                if (e.response.status === 403) {
                    return <PermissionDeniedToTemplate/>;
                }
                if (e.response.status === 400) {
                    const err = e.response.body.errors;
                    try {
                        const hasPermissionDeniedErrors = err.filter((a) => a.expandedResponseCode === 403);
                        if (hasPermissionDeniedErrors.length > 0) {
                            return <PermissionDeniedWhileExpandingPayload
                                permissionDeniedErrors={hasPermissionDeniedErrors}
                                onContinueAnyway={(relArray) => {
                                    this.setState({blacklistRels: relArray}, () => this.materialize() );
                                }}
                                customErrorHandlingButton={this.props.customErrorHandlingButton}
                            />;
                        }
                    } catch (e) {
                        // eslint-disable-next-line no-console
                        console.error(e);
                    }
                }
            }

            if (e.response.data) {
                return JSON.stringify(e.response.data);
            }

            // TODO: Better handle errors
            return JSON.stringify(e.response);
        }

        return JSON.stringify(e);
    }

    tt(key) {
        let {t, language} = this.props;
        return t(key, {lng: language});
    }

    render() {
        if (this.state.isFetching) {
            return <Loading/>;
        }

        let error = this.renderError();
        let preview = this.props.renderFrame
            ? <Frame {...this.props.frameProps}>
                {this.renderPreview()}
            </Frame>
            : this.renderPreview();

        return <Fragment>
            {error || preview}
        </Fragment>;
    }
}

TemplatePreview.propTypes = {
    language: PropTypes.string,
    accessToken: PropTypes.string,
    templateId: PropTypes.string,
    payload: PropTypes.object,
    materializationLanguage: PropTypes.string,

    // advanced
    templateBody: PropTypes.string,
    templateContentType: PropTypes.string,
    materializationPostProcessing: PropTypes.func,
    htmlPreview: PropTypes.bool,

    // advanced++
    renderFrame: PropTypes.bool,
    frameProps: PropTypes.object,
    customErrorHandlingButton: PropTypes.any,

    // translation
    t: PropTypes.any,
};

TemplatePreview.defaultProps = {
    language: 'eng',
};

export default translate(['translations', 'errors'], {i18n: getI18nInstance()})(TemplatePreview);
