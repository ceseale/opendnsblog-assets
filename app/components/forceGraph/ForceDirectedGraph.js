/* global d3 */
import React, { PropTypes } from 'react';
import ForceWorker from './dispatch';
import ReactDOM from 'react-dom';
import InfoLegend from '../graph/InfoLegend';
import globalStyle from '../../global.scss';
import AnimatedNumber from 'react-animated-number';

class ForceDirectedGraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = { lastFocus: null };
        this.data = JSON.parse(JSON.stringify(this.props.data));
        this.focusOn = [];
        let edgeSet = new Set();

        if (this.props.depth !== undefined) {
            for (let i = 0; i < this.data.edges.length; i++) {
                let edge = this.data.edges[i];
                if ((edge.depth) > this.props.depth - 0.5) {
                    delete this.data.edges[i];
                } else {
                    edgeSet.add(edge.src);
                    edgeSet.add(edge.dst);
                }
            }

            this.data.edges = this.data.edges.filter(d => d);

            for (let i = 0; i < this.data.nodes.length; i++) {
                let node = this.data.nodes[i];

                if (!edgeSet.has(node.id)) {
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
        let lastTranslation = null;
        let lastScale = this.props.initScale;
        let width = this.props.width;
        let height = this.props.height;
        let first = true;
        let radius = 3;

        const colorMap = {};
        const zoom = () => {
            lastTranslation = d3.event && d3.event.type === 'zoom' ? d3.event.translate : lastTranslation;
            lastScale = d3.event && d3.event.type === 'zoom' ? d3.event.scale : lastScale;
            if (lastScale && lastTranslation) {            
                context.save();
                context.clearRect(0, 0, this.props.width, this.props.height);
                context.translate(lastTranslation[0], lastTranslation[1]);
                context.scale(lastScale, lastScale);
                ended.bind(this)(data);
                context.restore();
            } else {
                ended.bind(this)(data);
            }
        }
        
        const zoomEnd = () => {
            lastTranslation = d3.event && d3.event.type === 'zoom' ? d3.event.translate : lastTranslation;
            lastScale = d3.event && d3.event.type === 'zoom' ? d3.event.scale : lastScale;
            if (lastScale && lastTranslation) {            
                hiddenContext.save();
                hiddenContext.clearRect(0, 0, this.props.width, this.props.height);
                hiddenContext.translate(lastTranslation[0], lastTranslation[1]);
                hiddenContext.scale(lastScale, lastScale);
                ended.bind(this)(data, true);
                hiddenContext.restore();
            } else {
                ended.bind(this)(data);
            }
        }
        

        ended.bind(this)(data);
        ended.bind(this)(data, true);

        let zoomWorker = d3.behavior.zoom().scaleExtent([1, 8]).on('zoom', zoom).on('zoomend', zoomEnd);
        d3.select(node).select('canvas').call(zoomWorker);

        const zoomIn = () => {
            // let newScale = (lastScale || this.props.initScale) + .3;

            // zoomWorker.scale(newScale);

            // let newTranslate = lastTranslation ? [lastTranslation[0] + (lastTranslation[0] / (newScale - .3) ), lastTranslation[1] + (lastTranslation[1] / newScale - .3)] : [this.props.width / 2, this.props.height / 2];
            // console.log(lastTranslation);
            // lastTranslation = [newTranslate[0] - (newTranslate[0] * newScale), newTranslate[1] - (newTranslate[1] * newScale)];

            // zoomWorker.translate(lastTranslation);

            // zoomWorker.event(d3.select(node).select('.graphContainer2'));
        }
        window.zoomIn = zoomIn;

        function ended(data, hidden) {
            if (!hidden) {
                var nodes = data.nodes,
                    edges = data.edges;

                context.clearRect(0, 0, this.props.width, this.props.height);
                context.save();

                if (this.props.initTranslation) {
                    context.translate(this.props.initTranslation.x, this.props.initTranslation.y);
                } else {
                    context.translate(this.props.width / 2, this.props.height / 2);
                }
                

                if (this.props.initScale) {
                    context.scale(this.props.initScale, this.props.initScale);
                }

                for (let i = 0; i < edges.length; i++) {
                    let edge = edges[i];

                    drawEdge(edge);
                }

                for (let i = 0; i < nodes.length; i++) {
                    let node = nodes[i];
                    
                    drawNode(node);
                }

                context.restore();
            } else {
                var nodes = data.nodes,
                    edges = data.edges;

                hiddenContext.clearRect(0, 0, this.props.width, this.props.height);
                hiddenContext.save();

                if (this.props.initTranslation) {
                    hiddenContext.translate(this.props.initTranslation.x, this.props.initTranslation.y);
                } else {
                    hiddenContext.translate(this.props.width / 2, this.props.height / 2);
                }

                if (this.props.initScale) {
                    hiddenContext.scale(this.props.initScale, this.props.initScale);
                }

                for (let i = 0; i < nodes.length; i++) {
                    let node = nodes[i];
                    
                    drawNodeHidden(node);
                }

                hiddenContext.restore();
            }

            first = false;

        }

        function drawEdge(d) {
            context.beginPath();
            context.moveTo(d.source.x, d.source.y);
            context.lineTo(d.target.x, d.target.y);
            context.strokeStyle = d.style ? d.style.color || 'rgba(255,255,255,.6)' : 'rgba(255,255,255,.6)';
            context.stroke();
        }

        function drawNode(d) {
            context.beginPath();
            context.moveTo(d.x + radius, d.y);
            context.arc(d.x, d.y, radius, 0, 2 * Math.PI);
            // context.fillStyle = d.style ? d.style.color || '#059fd9' : '#059fd9';
            // context.fill();

            context.strokeStyle = d.style ? d.style.color || '#059fd9' : '#059fd9';
            context.stroke();

        }

        
        function drawNodeHidden(d) {
            let nodeColor = getRandomColor();

            while (colorMap[nodeColor]) {
                nodeColor = getRandomColor();
            }

            colorMap[nodeColor] = d;

            hiddenContext.beginPath();
            hiddenContext.moveTo(d.x + radius, d.y);
            hiddenContext.arc(d.x, d.y, radius, 0, 2 * Math.PI);
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

        const focusNeighborhood = (id) => {
            let idSet = new Set();
            let nodes = data.nodes,
                edges = data.edges;
            this.focusedEdgeCount = 0;

            let ids = Array.isArray(id) ? id : [id];
            this.focusedNodeCount = ids.length;

            if (id === null || ids.length === 0) {
                this.focusedNodeCount = data.nodes.length;
                this.focusedEdgeCount = data.edges.length;
                for (let i = 0; i < edges.length; i++) {
                    let edge = edges[i];
                    edge.style = { color: 'rgba(255,255,255,.6)' };
                }

                for (let i = 0; i < nodes.length; i++) {
                    let node = nodes[i];
                    node.style = { color: 'rgba(5, 159, 217, .9)' };
                    drawNode(node);
                }

                zoom();
                return;
            }

            for (let i = 0; i < edges.length; i++) {
                let edge = edges[i];

                if (ids.indexOf(edge.src) > -1 || ids.indexOf(edge.dst) > -1) {
                    this.focusedEdgeCount++;
                    idSet.add(edge.src);
                    idSet.add(edge.dst);

                    if (edge.style) {
                        edge.style.color = 'rgba(255,255,255,.9)';
                    } else {
                        edge.style = { color: 'rgba(255,255,255,.9)' };
                    }
                } else {
                    if (edge.style) {
                        edge.style.color = 'rgba(255,255,255,.25)';
                    } else {
                        edge.style = { color: 'rgba(255,255,255,.25)' };
                    }
                }
            }

            for (let i = 0; i < nodes.length; i++) {
                let node = nodes[i];

                if (ids.indexOf(node.id) > -1) {
                    if (node.style) {
                        node.style.color = '#f37821';
                    } else {
                        node.style = { color: '#f37821' };
                    }
                } else {
                    if (node.style) {
                        node.style.color = 'rgba(5, 159, 217, .25)';
                    } else {
                        node.style = { color: 'rgba(5, 159, 217, .25)' };
                    }
                }
                drawNode(node);
            }
            zoom();
        }

        let that = this;
        d3.select(node).select('#mainCanvas').on('mousemove', function(e) {
            let mouseData = d3.mouse(this);
            let mouseX = mouseData[0];
            let mouseY = mouseData[1];
            let col = hiddenContext.getImageData(mouseX, mouseY, 1, 1).data;
            let d = Object.assign({}, colorMap[`rgb(${col[0]}, ${col[1]}, ${col[2]})`]);

            if(colorMap[`rgb(${col[0]}, ${col[1]}, ${col[2]})`]) {

                focusNeighborhood(d.id)
                if (d.type === 'hash') {
                    d.id = d.id.split('').slice(0, 15).join('') + '...';
                }

                // delete d.x;
                // delete d.y;

                let href;

                if (d.type === 'hash') {
                    href = 'https://investigate.opendns.com/sample-view/' + d.id;
                } else if (d.type === 'ip') {
                    href = ('https://investigate.opendns.com/ip-view/' + d.id);
                } else {
                    href = ('https://investigate.opendns.com/domain-view/name/' + d.id + '/view');
                }

                let relPosition = d3.mouse(node);

                d3.select(node).append('div').attr('id', 'graph-tooltip');
                ReactDOM.render(
                    <InfoLegend {...d} fixedWidth={true} left={relPosition[0] + node.offsetLeft} top={relPosition[1] + node.offsetTop} position={'absolute'} leftBorder={true} text={JSON.stringify(d).replace(/,/g, '\n')}>
                        <a style={{ color: 'rgb(243, 120, 33)', margin: 5 }} href={href} target="_blank">{('Investigate').toUpperCase()}</a>
                    </InfoLegend>, document.getElementById('graph-tooltip')
                );
                

            } else {
                d3.select(node).selectAll('#graph-tooltip').remove();
                focusNeighborhood(that.focusOn);
            }

        });

        const changeNodeColors = (node, color) => {
            node.style = { color: color };
        }

        this.changeFocus = (type, color) => {
            let nodes = data.nodes;
            this.focusOn = [];
            const resetColors = () => {
                for (let i = 0; i < nodes.length; i++) {
                    let node = nodes[i];
                    changeNodeColors(node, 'rgba(5, 159, 217, 1)')
                }

                zoom();
                return;
            }

            if (this.state.lastFocus === type || !type) {
                this.setState({ lastFocus: null });
                return focusNeighborhood(this.focusOn);
            } 

            if (type !== 'Blocked Domains') {
                for (let i = 0; i < nodes.length; i++) {
                    let node = nodes[i];
                    if (node.type === type) {
                        this.focusOn.push(node.id);
                        changeNodeColors(node, color);
                    } else {
                        changeNodeColors(node, 'rgba(5, 159, 217, .5)');
                    }
                }
            } else if (type === 'Blocked Domains') {
                for (let i = 0; i < nodes.length; i++) {
                    let node = nodes[i];
                    if (node.status === -1) {
                        this.focusOn.push(node.id);
                        changeNodeColors(node, color);
                    } else {
                        changeNodeColors(node, 'rgba(5, 159, 217, .5)');
                    }
                }
            }

            this.setState({ lastFocus: type });
            focusNeighborhood(this.focusOn);
            
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

    componentDidMount() {
        if (this.props.data.nodes.length) {      
            let forceWorker = ForceWorker(this.finishedWork.bind(this), this.progress.bind(this));
            forceWorker.postMessage(this.data);
        }
    }

    render() {

        const filters = [
            { type: 'hash', title: 'Hashes', color: '#f37821' },
            { type: 'domain', title: 'Domains', color: '#f37821'},
            { type: 'Blocked Domains', title: 'Blocked Domains', color: '#f37821'},
            { type: 'ip', title: 'IPs', color: '#f37821'},
            { type: 'email', title: 'Emails', color: '#f37821'},
        ];

        for (let i = 0; i < filters.length; i++) {
            let filter = filters[i];

            if (filter.type === this.state.lastFocus) {
                filter.class = 'active';
            } else {
                filter.class = '';
            }
        }



        let filerButtons = filters.map((d, i) => <a key={i} style={{ backgroundColor: d.color }} className={`fgraph-button ${d.class}`} onClick={() => ( this.changeFocus(d.type, d.color) )}>{d.title}</a>);
        return (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <div style={{ width: '166px', height: this.props.height, background: 'black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                <div style={{ display: 'flex', width: '75%', paddingBottom: '17px', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', color: 'white' }}>
                    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}><AnimatedNumber stepPrecision={0} value={this.focusedNodeCount || this.data.nodes.length} duration={1500}/><span>Nodes</span></span>
                    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}><AnimatedNumber stepPrecision={0} value={this.focusedEdgeCount || this.data.edges.length} duration={1500}/><span>Edges</span></span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {filerButtons}
                </div>
              </div>
              <div>
                <canvas className={'graphContainer2'} id='mainCanvas' width={this.props.width} height={this.props.height} style={{ cursor: 'crosshair', backgroundColor: 'black' }} ></canvas>
                <canvas className={'graphHidden'} style={{ display: 'none' }} width={this.props.width} height={this.props.height}></canvas>
              </div>

            </div>
        );
    }
}


// define propTypes
ForceDirectedGraph.propTypes = {
    data: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    depth: PropTypes.number,
    initScale: PropTypes.number,
    initTranslation: PropTypes.object
};

export default ForceDirectedGraph;