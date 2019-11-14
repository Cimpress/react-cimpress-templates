import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Tooltip} from '@cimpress/react-components';

import './DefaultButton.css';

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

let DefaultButton = (props) => {
    let baseButton = (
        <button autoFocus={!!props.autoFocus}
            className={classNames(
                'rct-default-button',
                'btn',
                {'btn-sm': props.size === 'sm'},
                {'btn-lg': props.size === 'lg'},
                `btn-${props.type}`,
                {disabled: props.disabled})}
            onClick={props.disabled ? undefined : clickHandler(props.onClick, props.gaKey)}>
            { props.icon && <Fragment><props.icon/>&nbsp;&nbsp;</Fragment> }
            {props.title || props.children}
        </button>
    );

    if (props.disabled && props.disabledTooltip) {
        return withTooltip(props.disabledTooltip, baseButton);
    }

    if (props.tooltip) {
        return withTooltip(props.tooltip, baseButton);
    }

    return baseButton;
};

DefaultButton.propTypes = {
    gaKey: PropTypes.string,
    type: PropTypes.string,
    size: PropTypes.oneOf(['sm', 'lg']),
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    icon: PropTypes.elementType.isRequired,
    tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    disabled: PropTypes.bool,
    disabledTooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    onClick: PropTypes.func,
    autoFocus: PropTypes.bool,
};

DefaultButton.defaultProps = {
    type: 'default',
};

export default DefaultButton;
