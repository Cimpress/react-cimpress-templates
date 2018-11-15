import React from 'react';
import PropTypes from 'prop-types';
import {Icon, Tooltip} from '@cimpress/react-components';
import classNames from 'classnames';

import './IconButton.css';


let withTooltip = (tooltip, content) => {
    if (!tooltip) {
        return content;
    }
    return <Tooltip contents={tooltip}>{content}</Tooltip>;
};

const clickHandler = (userHandler, key) => {
    return () => {
        if (typeof ga === 'function') {
            // eslint-disable-next-line
            ga('send', 'event', key, 'click');
        }
        userHandler();
    };
};
let IconButton = (props) => {
    let baseButton = (
        <a className={classNames('icon-button', {'disabled': props.disabled})}
            href={props.href}
            onClick={props.onClick && !props.disabled ? clickHandler(props.onClick, props.gaKey) : undefined}
            target={props.target}>
            <Icon name={props.name} size={props.iconSize} color={props.disabled ? undefined : props.color}/>
        </a>
    );

    if (props.disabled && props.disabledTooltip) {
        return withTooltip(props.disabledTooltip, baseButton);
    }

    if (props.tooltip) {
        return withTooltip(props.tooltip, baseButton);
    }

    return baseButton;
};

IconButton.propTypes = {
    gaKey: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.string,
    color: PropTypes.string,
    tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    disabled: PropTypes.bool,
    disabledTooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    href: PropTypes.string,
    target: PropTypes.string,
    onClick: PropTypes.func,
};

IconButton.defaultProps = {
    iconSize: 'lg',
};

export default IconButton;
