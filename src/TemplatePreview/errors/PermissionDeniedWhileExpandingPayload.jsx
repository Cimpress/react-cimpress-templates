import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import {Alert} from '@cimpress/react-components';
import DefaultButton from '../../internal/DefaultButton';
import {RobotCard} from '../../internal/RobotCard';

class PermissionDeniedWhileExpandingPayload extends React.Component {
    tt(key) {
        let {t, language} = this.props;
        return t(key, {lng: language});
    }

    render() {
        let relsPresent = true;
        let rels = Object.keys(this.props.permissionDeniedErrors
            .map((e, i) => e.rels)
            .reduce((acc, curr) => {
                if (curr) {
                    acc[curr] = acc[curr] ? 1 : acc[curr]++;
                } else {
                    relsPresent = false;
                }
                return acc;
            }, {}));
        relsPresent &= (rels && rels.length > 0);

        let continueAnywayButton = relsPresent ? (
            <DefaultButton
                gaKey={'btn.preview_page.continue_anyway'}
                onClick={() => {
                    this.props.onContinueAnyway(rels);
                }}
                title={this.tt('errors:no_permissions_go_ahead_with_missing_data')}/>
        ) : null;

        return (
            <div>
                <Alert type={'warning'} dismissible={false}
                    title={this.tt('errors:not_enough_permissions_title')}
                    message={
                        <div>
                            <br/>
                            {this.tt(relsPresent
                                ? 'errors:not_enough_permission_description_concrete'
                                : 'errors:not_enough_permissions_description')}
                            <ul>
                                {rels.map((k) => <li key={k}><a>{k}</a></li>)}
                            </ul>
                        </div>
                    }/>
                <RobotCard bsStyle={'info'}>
                    <br/>
                    <h4>{this.tt('in_the_mean_time')}</h4>
                    <br/>
                    <div className='paragraph'>
                        {this.tt('errors:no_permissions_should_we_continue_anyway_line1')}<br/>
                        {this.tt('errors:no_permissions_should_we_continue_anyway_line2')}
                    </div>
                    <br/>
                    {continueAnywayButton}
                    {this.props.customErrorHandlingButton || null}
                </RobotCard>
            </div>
        );
    }
}

PermissionDeniedWhileExpandingPayload.propTypes = {
    language: PropTypes.string,
    permissionDeniedErrors: PropTypes.array,
    onContinueAnyway: PropTypes.func,

    customErrorHandlingButton: PropTypes.any,

    t: PropTypes.any,
};

export default translate(['translations', 'errors'])(PermissionDeniedWhileExpandingPayload);
