/* global d3 */
import React, { PropTypes } from 'react';
import ForceWorker from './dispatch';
import ReactDOM from 'react-dom';
import InfoLegend from '../graph/InfoLegend';
import globalStyle from '../../global.scss';
import { DPLButton } from '@opendns/dpl-buttons';
import { TypeaheadSearch } from '@opendns/dpl-search';
import Menu from './Menu';
import KmeansMenuItem from '../Clustering/Kmeans';

class ForceDirectedGraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = { lastFocus: null, selectedValues: [] };

        this.data = JSON.parse(JSON.stringify(this.props.data));
        this.focusOn = [];
        this.onSearch = (type, ids) => {
            this.focusOn = ids;
            this.focusNeighborhood(this.focusOn);
            this.setState({ lastFocus: type });
        }
        this.clusters = null;
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
            this.createSearchOptions();

        }
    }

    clusterCB (clusterData) {
        this.clusters = clusterData;
        this.focusNeighborhood(null);
    }

    createSearchOptions() {
        this.searchOptions = [];
        for (let i = 0; i < this.data.nodes.length; i++) {
            let node = this.data.nodes[i];

            this.searchOptions.push({ value: node.id, label: node.id, context: node.type });
        }
    }

    finishedWork(data) {
        this.data = data;
        let node = ReactDOM.findDOMNode(this);
        let context = d3.select(node).select('.graphContainer2').node().getContext('2d');
        let hiddenContext = d3.select(node).select('.graphHidden').node().getContext('2d');
        let width = this.props.width;
        let height = this.props.height;
        let first = true;
        let radius = 3;
        let zooming = false;
        const colorMap = {};

        this.lastScale = this.props.initScale;
        this.lastTranslation = this.props.initTranslation;
        this.clusters = null;


        const zoom = () => {
            this.lastTranslation = d3.event && d3.event.type === 'zoom' ? d3.event.translate : this.lastTranslation;
            this.lastScale = d3.event && d3.event.type === 'zoom' ? d3.event.scale : this.lastScale;

            if (this.lastScale && this.lastTranslation) {            
                context.save();
                context.clearRect(0, 0, this.props.width, this.props.height);
                context.translate(this.lastTranslation[0], this.lastTranslation[1]);
                context.scale(this.lastScale, this.lastScale);
                ended.bind(this)(data);
                context.restore();
            } else {
                ended.bind(this)(data);
            }
        }
        
        const zoomEnd = (updateMirror = false) => {
            zooming = false;
            this.lastTranslation = d3.event && d3.event.type === 'zoom' ? d3.event.translate : this.lastTranslation;
            this.lastScale = d3.event && d3.event.type === 'zoom' ? d3.event.scale : this.lastScale;
            if (this.lastScale && this.lastTranslation) {            
                hiddenContext.save();
                hiddenContext.clearRect(0, 0, this.props.width, this.props.height);
                hiddenContext.translate(this.lastTranslation[0], this.lastTranslation[1]);
                hiddenContext.scale(this.lastScale, this.lastScale);
                ended.bind(this)(data, true);
                hiddenContext.restore();
                if (this.props.onZoomEnd) {
                    this.props.onZoomEnd(this.lastScale, this.lastTranslation);
                }
            } else {
                ended.bind(this)(data);
            }

            if (updateMirror) {
                this.onZoomEnd(this.lastTranslation, this.lastScale);
            }
        }
        
        const zoomStart = () => {
            zooming = true;
        }

        this.updateZoom = () => {
            zoom();
            zoomEnd(false);
        }
        ended.bind(this)(data);
        ended.bind(this)(data, true);

        let zoomWorker = d3.behavior.zoom().scaleExtent([ typeof this.props.minZoom === 'number' ? this.props.minZoom : .1, this.props.maxZoom || 8]).on('zoom', zoom).on('zoomend', zoomEnd).on('zoomstart', zoomStart);
        d3.select(node).select('canvas').call(zoomWorker);

        const zoomIn = () => {
            // let newScale = (this.lastScale || this.props.initScale) + .3;

            // zoomWorker.scale(newScale);

            // let newTranslate = this.lastTranslation ? [this.lastTranslation[0] + (this.lastTranslation[0] / (newScale - .3) ), this.lastTranslation[1] + (this.lastTranslation[1] / newScale - .3)] : [this.props.width / 2, this.props.height / 2];
            // console.log(this.lastTranslation);
            // this.lastTranslation = [newTranslate[0] - (newTranslate[0] * newScale), newTranslate[1] - (newTranslate[1] * newScale)];

            // zoomWorker.translate(this.lastTranslation);

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

        let clusterColors = ['red', 'green', 'blue', 'orange', 'yellow', 'white', 'pink', 'lightgreen', 'lightblue', 'gray', 'darkorange', 'darkyellow'];
        const getClusterColor = (message) => {
            let clusters = message.clusters;

            if (clusters.length > clusterColors.length) {
                for (let i = clusterColors.length; i < clusters.length; i++) {
                    clusterColors[i] = getRandomColor();
                 }
            }
            for (let i = 0; i < clusters.length; i++) {
                let cluster = clusters[i];
                let color = clusterColors[i];

                for (let j = 0; j < cluster.length; j++) {
                    let index = cluster[j];
                    let node = this.data.nodes[index];

                    if (node.style) {
                        node.style.color = color;
                    } else {
                        node.style = { color: color };
                    }

                }
            }
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

                if (!this.clusters) {                
                    for (let i = 0; i < nodes.length; i++) {
                        let node = nodes[i];
                        node.style = { color: '#059fd9' };
                        // drawNode(node);
                    }
                } else {
                    getClusterColor(this.clusters);
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

        // functions used by other components
        this.focusNeighborhood = focusNeighborhood.bind(this);


        let that = this;
        d3.select(node).select('#mainCanvas').on('mousemove', function(e) {
            
            if (!zooming) {
                let mouseData = d3.mouse(this);
                let mouseX = mouseData[0];
                let mouseY = mouseData[1];
                let col = hiddenContext.getImageData(mouseX, mouseY, 1, 1).data;
                let d = Object.assign({}, colorMap[`rgb(${col[0]}, ${col[1]}, ${col[2]})`]);

                if(colorMap[`rgb(${col[0]}, ${col[1]}, ${col[2]})`]) {

                    focusNeighborhood(d.id)
                    let nodeId = d.id;
                    if (d.type === 'hash') {

                        d.id = d.id.split('').slice(0, 15).join('') + '...';
                    }

                    // delete d.x;
                    // delete d.y;

                    let href;

                    if (d.type === 'hash') {
                        href = 'https://investigate.opendns.com/sample-view/' + nodeId;
                    } else if (d.type === 'ip') {
                        href = ('https://investigate.opendns.com/ip-view/' + nodeId);
                    } else {
                        href = ('https://investigate.opendns.com/domain-view/name/' + nodeId + '/view');
                    }

                    let relPosition = d3.mouse(node);

                    d3.select(node).append('div').attr('id', 'graph-tooltip');
                    ReactDOM.render(
                        <InfoLegend {...d} fixedWidth={true} left={relPosition[0] + node.offsetLeft} top={relPosition[1] + node.offsetTop} position={'absolute'} leftBorder={true} text={JSON.stringify(d).replace(/,/g, '\n')}>
                            <a style={{ color: 'rgb(243, 120, 33)', margin: 5 }} href={href} target="_blank">{('Investigate').toUpperCase()}</a>
                        </InfoLegend>, document.getElementById('graph-tooltip')
                    );
                    

                } else {
                    d3.selectAll('#graph-tooltip').remove();
                    focusNeighborhood(that.focusOn);
                }
            }

        });

        const changeNodeColors = (node, color) => {
            node.style = { color: color };
        }

        this.changeFocus = (type, color = 'rgba(5, 159, 217, .9)') => {
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

            if (type !== 'Blocked Domains' && !(type.indexOf('match') > -1) ) {
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
            } else if (type.indexOf('match') > -1) {
                let val = type.split(':')[1];

                for (let i = 0; i < nodes.length; i++) {
                    let node = nodes[i];

                    if (val && node.id.indexOf(val) > -1) {
                        this.focusOn.push(node.id);
                    }

                }

            }

            this.setState({ lastFocus: type });
            focusNeighborhood(this.focusOn);
            
        }

        // focus callbacks
        if (this.props.initFilter) {
            this.changeFocus(this.props.initFilter);
        } else if (this.props.initCluster) {
            this.clusterCB(this.props.initCluster);
        }

        if (this.props.onWorkDone) {
            this.props.onWorkDone(this.props.depth, Object.assign({}, this.data));
        }

    }

    progress(data) {
        let node = ReactDOM.findDOMNode(this);
        let context = d3.select(node).select('.graphContainer2').node().getContext('2d');
        context.clearRect(0, 0, this.props.width, this.props.height);
        context.fillStyle = 'rgba(5, 159, 217, .9)';
        context.fillText((data.progress * 100).toFixed(0) + '%', this.props.width / 2, this.props.height / 2);
    }

    componentDidMount() {

        if (!this.props.positionedData) {
            if (this.props.data.nodes.length) {      
                let forceWorker = ForceWorker(this.finishedWork.bind(this), this.progress.bind(this));
                forceWorker.postMessage(this.data);
            }            
        } else {
            if (this.props.data.nodes.length) {      
                this.finishedWork(this.props.data);
            }  
        }

    }

    componentWillUpdate(nextProps, nextState) {
        if(nextProps.initScale !== this.props.initScale || nextProps.initTranslation !== this.props.initTranslation) {
            this.lastTranslation = nextProps.initTranslation;
            this.lastScale = nextProps.initScale;
            this.updateZoom()
        }
    }

    searching(...args) {
        // let input = (d3.select(node).select('.select-input___1XLBC'));
        this.setState({ selectedValues: [] });
        this.onSearch(null, null);
    }

    render() {

        const filters = [
            { type: 'hash', title: 'Hashes', color: 'rgba(5, 159, 217, .9)' },
            { type: 'domain', title: 'Domains', color: 'rgba(5, 159, 217, .9)'},
            { type: 'Blocked Domains', title: 'Malicious', color: 'rgba(5, 159, 217, .9)'},
            { type: 'ip', title: 'IPs', color: 'rgba(5, 159, 217, .9)'},
            { type: 'email', title: 'Emails', color: 'rgba(5, 159, 217, .9)'},
        ];

        if (this.state.lastFocus) {        
            for (let i = 0; i < filters.length; i++) {
                let filter = filters[i];

                if (filter.type === this.state.lastFocus) {
                    filter.color = 'rgba(243, 120, 33, .9)';
                } else {
                    filter.color = 'rgba(5, 159, 217, .4)';
                }
            }
        }

        let searchBox = <TypeaheadSearch selectedValues={this.state.selectedValues} pillType="context" onChange={this.searching.bind(this)} values={this.searchOptions} />

        let clustersNav = <KmeansMenuItem onCluster={(data) => { this.clusterCB(data); }} getData={() => { return this.data }}/>;

        let filerButtons = filters.map((d, i) => <DPLButton key={i} style={{ backgroundColor: d.color, margin: 10 }} className={`${d.class}`} onClick={() => ( this.changeFocus(d.type, d.color) )}>{d.title}</DPLButton>);
        return (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              { this.props.hasMenu === false ? null : <Menu width={'188px'} clusters={clustersNav} onInputChange={this.onSearch.bind(this)} search={searchBox} height={this.props.height} buttons={filerButtons} data={this.data} focusedNodeCount={this.focusedNodeCount} focusedEdgeCount={this.focusedEdgeCount}/> }
              <div style={{ cursor: 'crosshair' }}>
                <canvas className={'graphContainer2'} id='mainCanvas' width={this.props.width} height={this.props.height} style={{ backgroundColor: 'black', pointer: 'crosshair' }} ></canvas>
                <canvas className={'graphHidden'} style={{ display: 'none' }} width={this.props.width} height={this.props.height}></canvas>
              </div>
            </div>
        );
    }
}


// define propTypes
ForceDirectedGraph.propTypes = {
    positionedData: PropTypes.bool,
    data: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    depth: PropTypes.number,
    initScale: PropTypes.number,
    initTranslation: PropTypes.object,
    hasMenu: PropTypes.bool,
    maxZoom: PropTypes.number,
    minZoom: PropTypes.number,
    initFilter: PropTypes.string,
    initCluster: PropTypes.object,
    onWorkDone: PropTypes.func,
    onZoomEnd: PropTypes.func
};

export default ForceDirectedGraph;