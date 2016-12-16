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
        this.state = { k: 3, running: false };
        this.data = this.props.getData();
    }

    run() {
        let worker = KmeansWorker(this.onSnapshot.bind(this), this.onSnapshot.bind(this));

        worker.postMessage({ nodes: this.data.nodes, k: this.state.k, distance: null, snapshotPeriod: 1 });
    }

    reset() {
        this.props.onCluster(null);
    }

    onChange(event) {
        if (Number(event.target.value) > 0) {
            this.setState({ k: Number(event.target.value) });
        } else {
            this.setState({ k: 1 });
            d3.select(event.target).attr('value', 1);
        }
    }

    onWorkEnd(data) {
    }

    onSnapshot(data) {
        this.props.onCluster(data)
    }

    render() {
        const centeringStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };

        return (
            <div style={Object.assign(centeringStyle, { color: 'white' })}>
                <AnimatedTextInput keyUpHandler={this.onChange.bind(this)} label="# of Clusters (k-means)" value={this.state.k} name="cluster_count" isRequired={true} validationMessage="" regex="[1-9]" maxLength={2} />
                <div style={Object.assign({}, centeringStyle, { flexDirection: 'row' })}>
                    <DPLButton disabled={this.state.running} onClick={this.run.bind(this)}>Run</DPLButton>
                    <DPLButton onClick={this.reset.bind(this)}>Reset</DPLButton>
                </div>


                { /* <CircleSpinner width={200} height={200}/> */ }
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
