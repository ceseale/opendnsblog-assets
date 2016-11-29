import React, { PropTypes } from 'react';

class InfoLegend extends React.Component {
    render() {

        const styleOb = {
            color: 'white',
            background: 'rgba(0,0,0,.7)',
            padding: 10,
            position: this.props.position ? this.props.position : this.props.left ? 'absolute' : 'relative',
            width: this.props.fixedWidth ? null : '200px',
            wordWrap: 'break-word', 
            borderLeft: this.props.leftBorder ? 'solid 2px #f37821' : '',
            borderTop: this.props.topBorder ? 'solid 2px #f37821' : '',
            fontFamily: 'CiscoSansLight',
            left: this.props.left,
            top: this.props.top,
            'zIndex': 2,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center'
        };

        if ('type' in this.props && 'id' in this.props) {
            return (
                <div className={'tip'} style={styleOb}>
                    {this.props.id}
                    {this.props.children}
                </div>
            );
        } else if ('text' in this.props) {
            return (
                <div className={'tip'} style={styleOb}>
                    {this.props.text}
                    {this.props.children}
                </div>
            );
        } else {
            return (
                <div className={'tip'} style={styleOb}>
                    Unknown
                    {this.props.children}
                </div>
            );
        }
    }
}

InfoLegend.propTypes = {
    topBorder: PropTypes.bool,
    leftBorder: PropTypes.bool,
    text: PropTypes.string,
    left: PropTypes.number,
    top: PropTypes.number, // change to string or number
    type: PropTypes.string,
    id: PropTypes.string,
    position: PropTypes.string,
    children: PropTypes.node,
    fixedWidth: PropTypes.bool
};

export default InfoLegend;
