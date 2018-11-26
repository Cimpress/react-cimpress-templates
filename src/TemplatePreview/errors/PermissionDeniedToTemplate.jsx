import React from 'react';
import {translate} from 'react-i18next';
import {colors, Icon} from '@cimpress/react-components';
import {RobotCard} from '../../internal/RobotCard';
import PropTypes from 'prop-types';

class PermissionDeniedToTemplate extends React.Component {
    tt(key) {
        let {t, language} = this.props;
        return t(key, {lng: language});
    }

    render() {
        return (
            <RobotCard bsStyle={'danger'}>
                <br/>
                <h4>
                    <Icon name={'report-problem-triangle-f'} size={'2x'} color={colors.danger.base}/>&nbsp;
                    {this.tt('errors:no_access_to_this_template_title')}
                </h4>
                <br/>
                <div className='paragraph'>
                    {this.tt('errors:no_access_to_this_template_line1')}<br/>
                    {this.tt('errors:no_access_to_this_template_line2')}
                </div>
                <br/>
            </RobotCard>
        );
    }
}

PermissionDeniedToTemplate.propTypes = {
    language: PropTypes.string,

    t: PropTypes.any,
};

export default translate(['translations', 'errors'])(PermissionDeniedToTemplate);
