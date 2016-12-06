/* global d3 */
import React, { PropTypes } from 'react';
import ForceWorker from './dispatch';
import ReactDOM from 'react-dom';
import InfoLegend from '../graph/InfoLegend';


class ForceDirectedGraph extends React.Component {
    constructor(props) {
        super(props);
        this.data = JSON.parse(JSON.stringify(this.props.data));

        if (this.props.depth !== undefined) {
            for (let i = 0; i < this.data.edges.length; i++) {
                let edge = this.data.edges[i];
                if ((edge.depth) > this.props.depth - 0.5) {
                    delete this.data.edges[i];
                }
            }

            this.data.edges = this.data.edges.filter(d => d);

            for (let i = 0; i < this.data.nodes.length; i++) {
                let node = this.data.nodes[i];

                if (node.depth > this.props.depth) {
                    delete this.data.nodes[i];
                }
            }

            this.data.nodes = this.data.nodes.filter(d => d);

        }
    }

    finishedWork(data) {

        d3.select(this.span).remove();
        let node = ReactDOM.findDOMNode(this);
        let context = d3.select(node).select('.graphContainer2').node().getContext('2d');
        let hiddenContext = d3.select(node).select('.graphHidden').node().getContext('2d');

        console.log(d3.select(node).selectAll('.graphHidden'));

        const colorMap = {};

        const zoom = () => {
            context.save();
            context.clearRect(0, 0, this.props.width, this.props.height);
            context.translate(d3.event.translate[0], d3.event.translate[1]);
            context.scale(d3.event.scale, d3.event.scale);
            ended.bind(this)(data);
            context.restore();

            hiddenContext.save();
            hiddenContext.clearRect(0, 0, this.props.width, this.props.height);
            hiddenContext.translate(d3.event.translate[0], d3.event.translate[1]);
            hiddenContext.scale(d3.event.scale, d3.event.scale);
            ended.bind(this)(data, true);
            hiddenContext.restore();
        }
        
        ended.bind(this)(data);
        ended.bind(this)(data, true);

        d3.select(node).select('canvas').call(d3.behavior.zoom().scaleExtent([0, 8]).on('zoom', zoom))

        function ended(data, hidden) {

            if (!hidden) {
                var nodes = data.nodes,
                    edges = data.edges;

                context.clearRect(0, 0, this.props.width, this.props.height);
                context.save();
                context.translate(this.props.width / 2, this.props.height / 2);

                edges.forEach(drawEdge);

                nodes.forEach(drawNode);

                context.restore();
            } else {
                var nodes = data.nodes,
                    edges = data.edges;

                hiddenContext.clearRect(0, 0, this.props.width, this.props.height);
                hiddenContext.save();
                hiddenContext.translate(this.props.width / 2, this.props.height / 2);

                nodes.forEach(drawNodeHidden);

                hiddenContext.restore();
            }

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

        function drawNodeHidden(d) {
            let nodeColor = getRandomColor();

            while (colorMap[nodeColor]) {
                nodeColor = getRandomColor();
            }

            colorMap[nodeColor] = d;

            hiddenContext.beginPath();
            hiddenContext.moveTo(d.x + 3, d.y);
            hiddenContext.arc(d.x, d.y, 3, 0, 2 * Math.PI);
            hiddenContext.fillStyle = nodeColor;
            hiddenContext.fill();
            hiddenContext.strokeStyle = nodeColor;
            hiddenContext.stroke();
        }

        function getRandomColor() {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            return `rgb(${r}, ${g}, ${b})`;
        }

        d3.select(node).select('#mainCanvas').node().addEventListener('mousemove', function(e) {
            let mouseX = e.layerX;
            let mouseY = e.layerY;
            let col = hiddenContext.getImageData(mouseX, mouseY, 1, 1).data;
            let d = Object.assign({}, colorMap[`rgb(${col[0]}, ${col[1]}, ${col[2]})`]);

            if(colorMap[`rgb(${col[0]}, ${col[1]}, ${col[2]})`]) {

                if (d.type === 'hash') {
                    d.id = d.id.split('').slice(0, 15).join('') + '...';
                }

                delete d.x;
                delete d.y;

                let href;

                if (d.type === 'hash') {
                    href = 'https://investigate.opendns.com/sample-view/' + d.id;
                } else if (d.type === 'ip') {
                    href = ('https://investigate.opendns.com/ip-view/' + d.id);
                } else {
                    href = ('https://investigate.opendns.com/domain-view/name/' + d.id + '/view');
                }

                d3.select(node).append('div').attr('id', 'graph-tooltip');
                ReactDOM.render(
                    <InfoLegend {...d} fixedWidth={true} left={e.pageX} top={e.pageY} position={'absolute'} leftBorder={true} text={JSON.stringify(d).replace(/,/g, '\n')}>
                        <a style={{ color: 'rgb(243, 120, 33)', margin: 5 }} href={href} target="_blank">{('Investigate').toUpperCase()}</a>
                    </InfoLegend>, document.getElementById('graph-tooltip')
                );

            } else {
                d3.select(node).selectAll('#graph-tooltip').remove();
            }

        });

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
            console.log(this.data);
            forceWorker.postMessage(this.data);
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <canvas className={'graphContainer2'} id='mainCanvas' width={this.props.width} height={this.props.height} style={{ cursor: 'crosshair', backgroundColor: 'black' }} ></canvas>
              <canvas className={'graphHidden'} style={{ display: 'none' }} width={this.props.width} height={this.props.height}></canvas>
            </div>
        );
    }
}


// define propTypes
ForceDirectedGraph.propTypes = {
    data: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    depth: PropTypes.number
};

export default ForceDirectedGraph;