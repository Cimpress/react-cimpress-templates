import React from 'react';
import PropTypes from 'prop-types';

export default class Loading extends React.Component {
    render() {
        return (
            <div className={'card'}>
                <div className={'card-block'}>
                    <img width={30}
                        height={30}
                        alt={this.props.message}
                        src="https://static.ux.cimpress.io/mcp-ux-css/latest/assets/spinner.svg"/>&nbsp;
                    {this.props.message}
                </div>
            </div>
        );
    }
}

Loading.propTypes = {
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
