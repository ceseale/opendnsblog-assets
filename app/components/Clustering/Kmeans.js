/* global d3 */
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import KmeansWorker from './Workers/Kmeans';
import { DPLButton } from '@opendns/dpl-buttons';
import { AnimatedTextInput } from '@opendns/dpl-formfields';
import CircleSpinner from '@opendns/dpl-spinner';

class Kmeans extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.data = this.props.getData();
        let worker = KmeansWorker(this.onWorkEnd.bind(this), this.onSnapshot.bind(this));

        worker.postMessage({ nodes: this.data.nodes, k: 6, distance: null, snapshotPeriod: 1 });
    }

    onWorkEnd(data) {
        console.log(data);
    }

    onSnapshot(data) {
        this.props.onCluster(data)
    }

    render() {

        return (
            <div style={{ color: 'white' }}>
                <CircleSpinner className={'flsdkfjlsdkfj'} width={200} height={200}/>
            </div>
        );
    }
}


// define propTypes
Kmeans.propTypes = {
    getData: PropTypes.func,
    // width: PropTypes.number,
    // height: PropTypes.number,
    // transX: PropTypes.number,
    // style: PropTypes.object,
    onCluster: PropTypes.func
};

export default Kmeans;
