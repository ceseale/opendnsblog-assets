import React, { PropTypes } from 'react';
import './graph.scss';

class Tester extends React.Component {

    render() {
        return (
          <div>
            <div>Hello Blog</div>
          </div>
        );
    }
}


// define propTypes
Tester.propTypes = {
    data: PropTypes.string
};

export default Tester;