/* global saving */
import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import Loading from '../internal/Loading';
import {materializeTemplate} from '../apis/stereotype.api';
import {Alert} from '@cimpress/react-components';
import {Highlight} from 'react-fast-highlight';
import {getI18nInstance} from '../i18n';

class TemplatePreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            useSampleData: false,
        };
    }

    componentDidMount() {
        this.materialize();
    }

    componentDidUpdate(prevProps) {
        let shouldMaterialize = (this.props.templateId !== prevProps.templateId)
            || (this.props.accessToken !== prevProps.accessToken)
            || (JSON.stringify(this.props.payload) !== JSON.stringify(prevProps.payload));

        if (shouldMaterialize) {
            this.materialize();
        }
    }

    materialize() {
        let options = {
            // add here black/white lists
            blacklist: undefined,
        };

        this.setState({
            isFetching: true,
            error: undefined,
        }, () => {
            materializeTemplate(this.props.accessToken, this.props.templateId, this.props.payload, options)
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
        if (this.props.renderAs === 'html') {
            if (this.props.htmlPreview) {
                return <div dangerouslySetInnerHTML={{__html: this.state.materialization}} />;
            } else {
                return <Highlight languages={['html']} className="my-class">
                    {this.state.materialization || ''}
                </Highlight>;
            }
        }

        if (this.props.renderAs === 'text') {
            return <pre>
                {this.state.materialization}
            </pre>;
        }

        if (this.props.renderAs === 'xml') {
            return <Highlight languages={['xml']} className="my-class">
                {this.state.materialization || ''}
            </Highlight>;
        }
    }

    renderError() {
        if (!this.state.error) {
            return null;
        }

        let e = this.state.error;

        if (e.response) {
            if (e.response.status) {
                if (e.response.status === 404) {
                    return <Alert type={'danger'} message={this.tt('template-not-found')}/>;
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
        let preview = this.renderPreview();

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
    renderAs: PropTypes.string,
    htmlPreview: PropTypes.bool,

    t: PropTypes.any,
};

TemplatePreview.defaultProps = {
    language: 'eng',
};

export default translate('translations', {i18n: getI18nInstance()})(TemplatePreview);
