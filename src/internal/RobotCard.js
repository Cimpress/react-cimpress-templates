import React from 'react';
import {shapes} from '@cimpress/react-components';
import PropTypes from 'prop-types';

const {Robot} = shapes;

const RobotCard = (props) => {
    return (
        <div className={'card'}>
            <div className={'card-block'}>
                <div className="row">
                    <div className={'col-md-9'}>
                        {props.children}
                    </div>
                    <div className={'col-md-3'}>
                        <Robot bsStyle={props.bsStyle}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

RobotCard.propTypes = {
    children: PropTypes.any,
    bsStyle: PropTypes.string,
};

export {RobotCard};
