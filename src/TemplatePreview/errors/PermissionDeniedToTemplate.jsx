import React from 'react';
import {translate} from 'react-i18next';
import {colors} from '@cimpress/react-components';
import {IconAlertTriangle} from '@cimpress-technology/react-streamline-icons';
import {RobotCard} from '../../internal/RobotCard';
import PropTypes from 'prop-types';
import {getI18nInstance} from '../../i18n';

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
                    <IconAlertTriangle size={'2x'} style={{verticalAlign: 'middle'}} color={colors.danger.base}/>&nbsp;
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

export default translate(['translations', 'errors'], {i18n: getI18nInstance()})(PermissionDeniedToTemplate);
