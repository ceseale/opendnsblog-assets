/* global d3 */
import React, { PropTypes } from 'react';
import ForceWorker from './dispatch';
import ReactDOM from 'react-dom';
 
class ForceDirectedGraph extends React.Component {

    finishedWork(data) {
        d3.select(this.span).remove();
        let node = ReactDOM.findDOMNode(this);
        let context = d3.select(node).select('.graphContainer2').node().getContext('2d');
        const zoom = () => {
            context.save();
            context.clearRect(0, 0, this.props.width, this.props.height);
            context.translate(d3.event.translate[0], d3.event.translate[1]);
            context.scale(d3.event.scale, d3.event.scale);
            ended.bind(this)(data);
            context.restore();
        }
        
        ended.bind(this)(data);
        d3.select(node).call(d3.behavior.zoom().scaleExtent([0, 8]).on('zoom', zoom))

        function ended(data) {
            var nodes = data.nodes,
                edges = data.edges;

            context.clearRect(0, 0, this.props.width, this.props.height);
            context.save();
            context.translate(this.props.width / 2, this.props.height / 2);

            edges.forEach(drawEdge);

            nodes.forEach(drawNode);

            context.restore();

        }

        function drawEdge(d) {
            context.beginPath();
            context.moveTo(d.source.x, d.source.y);
            context.lineTo(d.target.x, d.target.y);
            context.strokeStyle = d.style ? d.style.color : 'white';
            context.stroke();
        }

        function drawNode(d) {
            context.beginPath();
            context.moveTo(d.x + 3, d.y);
            context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
            context.fill();
            context.strokeStyle = d.style ? d.style.color : '#80A6D8';
            context.stroke();
        }


    }

    progress(data) {
        if (!this.span) {
            let node = ReactDOM.findDOMNode(this);

            this.span = d3.select(node).select('.progress').node();
        } else {
            this.span.innerHTML = (data.progress * 100).toFixed(0) + '%';
        }

    }

    render() {

        if (this.props.data.nodes.length) {      
            let forceWorker = ForceWorker(this.finishedWork.bind(this), this.progress.bind(this));

            forceWorker.postMessage(this.props.data);
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span className={'progress'} style={{ fontSize: '100px' }}></span>
              <canvas className={'graphContainer2'} width={this.props.width} height={this.props.height}></canvas>
            </div>
        );
    }
}


// define propTypes
ForceDirectedGraph.propTypes = {
    data: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number
};

export default ForceDirectedGraph;