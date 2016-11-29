/* global d3 */
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
// import D3Chart from '../D3Chart/D3Chart';
// import style from './graph.scss';
import InfoLegend from './InfoLegend';

class Graph extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props.data);
        this.nodeRadius = 10;
        this.state = { focus: this.props.focus };
        this.setUpData();
    }

    setUpData() {
        console.log('setUpData');

        this.tempData = Object.assign({}, this.props.data);

        // set nodes to the center of svg 
        this.tempData.nodes.forEach((d) => {
            d.x = this.props.width / 2;
            d.y = this.props.height / 2;
        });

        this.updateNodeMap();
        this.updateLinks(); // update egde postions

        this.updateNodeMap();
    }

    shouldComponentUpdate(nextProps, nextState) {
        this.setUpData();
        return true;
    }

    componentWillUpdate(nextProps, nextState) {
        // console.log(this.tempData.nodes);
        for (let i = 0; i < this.tempData.nodes.length; i++) {
            this.tempData.nodes[i].style = nextProps.data.nodes[i].style;
        }

        for (let i = 0; i < this.tempData.edges.length; i++) {
            this.tempData.edges[i].style = nextProps.data.edges[i].style;
        }
    }

    updateNodeMap() {
        const nodes = this.tempData.nodes;

        this.nodeMap = nodes.reduce((map, d, i) => {
            map[d.id] = i;
            return map;
        }, {});
    }

    createGraph() {
        // this.tempData = this.props.domains;
        // this.updateNodeMap();
        // this.props.data.graph;
    }

    updateLinks() {
        this.tempData.edges.forEach((d) => {
            const source = this.tempData.nodes[this.nodeMap[d.src]];
            const target = this.tempData.nodes[this.nodeMap[d.dst]];

            d.lineCorrdinates = [[source.x, source.y], [target.x, target.y]];
        });

    }

    componentDidUpdate() {
        let node = ReactDOM.findDOMNode(this);
        let circles = d3.select(node).selectAll('.point');

        circles.data(this.tempData.nodes);

        this.showTip(node);
    }

    getMousePosition() {
        return [this.cursorX, this.cursorY];
    }

    componentWillUnmount() {
        document.onmousemove = undefined;
    }

    componentDidMount() {

        document.onmousemove = (e) => {
            this.cursorX = e.pageX;
            this.cursorY = e.pageY;
        };

        let node = ReactDOM.findDOMNode(this);

        function zoom() {
            d3.select(node).select('#childg').attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }

        d3.select(node).select('#topg').call(d3.behavior.zoom().scaleExtent([0, 8]).on("zoom", zoom))

        const getNode = (depth) => {
            return d3.select(node).select('#depth' + depth).node();
        };

        const getNodeSrc = (d, atDepth) => {
            for (let i = 0; i < this.tempData.edges.length; i++) {
                if (this.tempData.edges[i].depth === atDepth && d.id === this.tempData.edges[i].dst) {
                    return this.tempData.edges[i].src;
                }
            }
        };

        /*
        * gets the order that nodes should be placed for a specific depth
        */
        const getOrder = (nodeDepth, edgeDepth) => {

            let orderMap;

            if (nodeDepth === 1) {
                // Attempt to get correct order 
                orderMap = this.tempData.nodes.reduce((mem, d, i) => {
                    if (d.depth === nodeDepth) {
                        mem.push({ order: i, type: getNodeSrc(d, edgeDepth) });
                    }
                    return mem;
                }, []);
            } else {
                // Attempt to get correct order 
                orderMap = this.tempData.nodes.reduce((mem, d, i) => {
                    if (d.depth === nodeDepth) {
                        mem.push({ order: i, type: i });
                    }
                    return mem;
                }, []);
            }

            // place node in descending order
            orderMap = orderMap.sort((a, b) => {
                if (b.type < a.type) {
                    return -1;
                } else if (b.type > a.type) {
                    return 1;
                } else {
                    return 0;
                }
            });

            //
            // // place node in ascending order
            // if (nodeDepth === 1) {
            //     orderMap = orderMap.sort((a, b) => {
            //         if (b.type < a.type) {
            //             return 1;
            //         } else if (b.type > a.type) {
            //             return -1;
            //         } else {
            //             return 0;
            //         }
            //     });
            // }

            orderMap = orderMap.reduce((mem, d, i) => {
                mem[d.order] = i;
                return mem;
            }, {});

            return orderMap;
        };

        // let orderMapDepth4 = getOrder(4, 3.5);
        let orderMapDepth3 = getOrder(3, 2.5);
        let orderMapDepth2 = getOrder(2, 1.5);
        let orderMapDepth1 = getOrder(1, 0.5);
        const getPositions = (d, i) => {
            const path = getNode(d.depth);
            const depthData = this.tempData.nodes.reduce((data, dnode, i2) => {
                if (d.depth === dnode.depth) {
                    data.count += 1;

                    // Trying to find the smallest index in the depth so
                    // the each node will be evenly spaced out

                    if (i < data.smallestID) {
                        data.smallestID = i;
                    } 

                    if (i2 < data.smallestID) {
                        data.smallestID = i2;
                    }
                }

                return data;
            }, { count: 0, smallestID: Infinity });

            let l;

            if (d.depth === 2) { // special ordering for depth 2
                l = ((orderMapDepth2[i] + depthData.smallestID) - (depthData.smallestID - 1)) * (path.getTotalLength() * (1 / (depthData.count + 1)));
            } else if (d.depth === 1) {
                l = ((orderMapDepth1[i] + depthData.smallestID) - (depthData.smallestID - 1)) * (path.getTotalLength() * (1 / (depthData.count + 1)));
            } else if (d.depth === 3) {
                l = ((orderMapDepth3[i] + depthData.smallestID) - (depthData.smallestID - 1)) * (path.getTotalLength() * (1 / (depthData.count + 1)));
            } else {
                l = (i - (depthData.smallestID - 1)) * (path.getTotalLength() * (1 / (depthData.count + 1)));
            }

            d.x = path.getPointAtLength(l).x;
            d.y = path.getPointAtLength(l).y;
                // return pointType === 'x' ? path.getPointAtLength(l).x : path.getPointAtLength(l).y;
        };

        this.tempData.nodes.forEach(getPositions);

        let circles = d3.select(node).selectAll('.point');

        circles
            .data(this.tempData.nodes).attr('cx', (d) => {
                return d.x;
            })
            .attr('cy', (d) => {
                return d.y;
            })
            .attr('x', (d) => {
                if (d.type === 'ip') {
                    return d.x - this.nodeRadius;
                }
            })
            .attr('y', (d) => {
                if (d.type === 'ip') {
                    return d.y - this.nodeRadius;
                }
            })
            .attr('transform', (d) => {
                if (d.type === 'ip') {
                    return 'rotate(45, ' + d.x + ', ' + d.y + ')';
                } else if (d.type === 'email') {
                    return 'translate(' + (d.x - this.nodeRadius) + ', ' + (d.y - this.nodeRadius) + ')';
                } else if (d.type === 'hash') {
                    return 'translate(' + (d.x - this.nodeRadius) + ', ' + (d.y - this.nodeRadius) + ')scale(1.9)';
                }
            });

        this.updateLinks();

        d3.select(node).selectAll('.link')
            .data(this.tempData.edges)
            .attr('opacity', 0)
            .attr('d', (d) => {
                return d3.svg.line()(d.lineCorrdinates);
            })
            .attr('opacity', .5);

        d3.select(node)
            .selectAll('.depth')
            .attr('opacity', .5);

        this.showTip(node);

    }

    onFocusChange() {
        // this.setState({ focus: newDomains });
    }

    getFocusedGraph(focus) {
        let graph = { nodes: {}, edges: {} }; // create an empty graph
        const queue = Array.isArray(focus) ? focus.slice() : [focus]; // create an array of nodes to focus on (usally domains at 0 depth)
        const graphGood = (edge) => {
            if (edge.depth === 0.5) {
                return this.tempData.nodes[this.nodeMap[edge.dst]].depth === 1 && this.tempData.nodes[this.nodeMap[edge.src]].depth === 0;
            } else if (edge.depth === 1.5) {
                return this.tempData.nodes[this.nodeMap[edge.dst]].depth === 2 && this.tempData.nodes[this.nodeMap[edge.src]].depth === 1;
            } else if (edge.depth === 2.5) {
                return this.tempData.nodes[this.nodeMap[edge.dst]].depth === 3 && this.tempData.nodes[this.nodeMap[edge.src]].depth === 2;
            }
        };
        
        queue.forEach((d) => {
            graph.nodes[this.nodeMap[d]] = true; // add current nodes to graph
        });

        for (let i = 0; i < this.tempData.edges.length; i++) {
            let d = this.tempData.edges[i];

            if (queue.length === 1 && queue.indexOf(d.dst) > -1) { // if the queue only has item and the item is not at depth 0 rerun with the focus on the current depth - 1
                graph = this.getFocusedGraph(d.src);
                break;
            }
            if (queue.indexOf(d.src) > -1 && graphGood(d)) { // Checks to if edge souce is apart of the list and makes sure edge not conneting depth 0 and 1
                graph.nodes[this.nodeMap[d.dst]] = true;
                graph.edges[i] = true;
                queue.push(d.dst, d.src);
            }
        }

        return graph;
    }

    showTip(node) {

        const that = this;
        let inTip = false;

        d3.select(node).selectAll('.point')
            .on('mouseover', function (data) {
                let d = Object.assign({}, data);

                if (d.type === 'hash') {
                    d.id = d.id.split('').slice(0, 15).join('') + '...';
                }

                delete d.x;
                delete d.y;

                let href;

                if (d.type === 'hash') {
                    href = 'https://investigate.opendns.com/sample-view/' + data.id;
                } else if (d.type === 'ip') {
                    href = ('https://investigate.opendns.com/ip-view/' + data.id);
                } else {
                    href = ('https://investigate.opendns.com/domain-view/name/' + data.id + '/view');
                } 

                d3.select(node).append('div').attr('id', 'graph-tooltip');

                ReactDOM.render(
                    <InfoLegend {...d} fixedWidth={true} left={that.getMousePosition()[0]} top={that.getMousePosition()[1]} position={'absolute'} leftBorder={true} text={JSON.stringify(d).replace(/,/g, '\n')}>
                        <a style={{ color: 'rgb(243, 120, 33)', margin: 5 }} href={href} target="_blank">{('Investigate').toUpperCase()}</a>
                    </InfoLegend>, document.getElementById('graph-tooltip')
                );

                d3.select(node).selectAll('#graph-tooltip').on('mouseover', () => {
                    inTip = true;
                });

                d3.select(node).selectAll('#graph-tooltip').on('mouseleave', () => {
                    inTip = false;
                    d3.select(node).selectAll('#graph-tooltip').remove();
                });
            })
            .on('mouseleave', () => {
                setTimeout(() => {

                    if (!inTip) {
                        d3.select(node).selectAll('#graph-tooltip').remove();
                    }
                    
                }, 400);
            });

    }

    render() {

        let highlight = null;
        let nodeMetaData = {};

        if (this.props.focus) {
            highlight = (this.getFocusedGraph(this.state.focus || this.props.focus));
        }

        // Set to center of screen
        this.updateLinks();

        const nodes = this.tempData.nodes.map((d, i) => {
            nodeMetaData[d.depth] = (nodeMetaData[d.depth] + 1) || 1;

            return  (<g key={i}>
                        <Node depth={d.depth} type={d.type} color={d.style ? d.style.color : null} domain={d.id} r={this.nodeRadius} cx={d.x} cy={d.y} key={i}/>
                    </g>);
        });

        const links = this.tempData.edges.map((d, i) => {
            return <path className='link' stroke={d.style ? d.style.color || 'white': 'white'} d={d3.svg.line()(d.lineCorrdinates)} strokeWidth={1} key={i}/>;
        });

        let nodeSpace = this.props.height / 14;

        var depth2 = [
          [50, nodeSpace * nodeMetaData[2] / 2],
          [nodeSpace * nodeMetaData[2], (nodeSpace * 14) - (nodeSpace * nodeMetaData[2])],
          [50, -nodeSpace * nodeMetaData[2] / 2],
          [-nodeSpace * nodeMetaData[2], (nodeSpace * 14) - (nodeSpace * nodeMetaData[2])]
        ];

        var depth1 = [
          [50, 0],
          [200, nodeSpace * nodeMetaData[1] / 2],
          [100, nodeSpace * nodeMetaData[1] ],
          [-100, nodeSpace * nodeMetaData[1] / 2],
          [50, 0]
        ];

        let cx1 = 50;
        let cy1 = this.props.height / 2;
        let r = 100;

        let test = `M ${cx1} ${cy1} m -${r}, 0 a ${r},${r} 0 1,0 ${(r * 2)},0 a ${r},${r} 0 1,0 -${(r * 2)},0`;

        r = 800;
        let test2 = `M ${cx1} ${cy1} m -${r}, 0 a ${r},${r} 0 1,0 ${(r * 2)},0 a ${r},${r} 0 1,0 -${(r * 2)},0`;

        r = 2700;
        let test3 = `M ${cx1} ${cy1} m -${r}, 0 a ${r},${r} 0 1,0 ${(r * 2)},0 a ${r},${r} 0 1,0 -${(r * 2)},0`;

        r = 4500;
        let test4 = `M ${cx1} ${cy1} m -${r}, 0 a ${r},${r} 0 1,0 ${(r * 2)},0 a ${r},${r} 0 1,0 -${(r * 2)},0`;

        { /* <path 
            d="
            M cx cy
            m -r, 0
            a r,r 0 1,0 (r * 2),0
            a r,r 0 1,0 -(r * 2),0
            "
        /> */ }

        var depth0 = [
          [50, 0],
          [50, this.props.height]
        ];

        return (
            <div className={'graphContainer'}>

                    <svg width={this.props.width} height={this.props.height + 25} className={'graphSvg'}>
                        <g id='topg'>
                            <rect className="overlay" width={this.props.width} height={this.props.height + 25}></rect>
                            <g id='childg' transform={'translate(' + 0 + ', ' + 12 + ')'}>
                                <path id='depth0' stroke='transparent' fill='none' d={d3.svg.line().tension(.4).interpolate('cardinal')(depth0)}></path>
                                <g>
                                    <text fill='gray' dy='0' x={depth1[0][0]} y={depth1[0][1]} textAnchor='middle' >Depth 1</text>
                                    <path id='depth1' className='depth' stroke='#58585b' fill='none' strokeWidth={1} opacity='0' d={test}></path>
                                </g>
                                <g>
                                    <text fill='gray' dy='0' x={depth2[0][0]} y={depth1[0][1]} textAnchor='middle' >Depth 2</text>
                                    <path id='depth2' className='depth' stroke='#58585b' fill='none' strokeWidth={1} opacity='0' d={test2}></path>
                                </g>
                                <g>
                                    <text fill='gray' dy='0' x={depth2[0][0]} y={depth1[0][1]} textAnchor='middle' >Depth 3</text>
                                    <path id='depth3' className='depth' stroke='#58585b' fill='none' strokeWidth={1} opacity='0' d={test3}></path>
                                </g>
                                <g>
                                    <text fill='gray' dy='0' x={depth2[0][0]} y={depth1[0][1]} textAnchor='middle' >Depth 4</text>
                                    <path id='depth4' className='depth' stroke='#58585b' fill='none' strokeWidth={1} opacity='0' d={test4}></path>
                                </g>

                                {links}
                                {nodes}
                            </g>
                        </g>
                    </svg>
            </div>
        );
    }
}


// define propTypes
Graph.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    colors: PropTypes.array,
    padding: PropTypes.number,
    domains: PropTypes.array,
    data: PropTypes.object,
    spcb: PropTypes.func,
    focus: PropTypes.string,
    codeRunCount: PropTypes.number.isRequired
};


class Node extends React.Component {

    render() {

        let symbol;

        if (this.props.type === 'ip') {
            symbol = <rect fill={this.props.color || '#80A6D8'} width={this.props.r * 2 * 0.85} height={this.props.r * 2 * 0.85} className={'depth' + this.props.depth + ' point'} x={this.props.cx - this.props.r * 0.85} y={this.props.cy - this.props.r * 0.85} transform={'rotate(45, ' + this.props.cx + ', ' + this.props.cy + ')'}/>;
        } else if (this.props.type === 'domain') {
            symbol = <circle className={'depth' + this.props.depth + ' point'} fill={this.props.color || '#80A6D8'} cx={this.props.cx} cy={this.props.cy} r={this.props.r}/>;
        } else if (this.props.type === 'email') {
            symbol = <polygon transform={'translate(' + (this.props.cx - this.props.r) + ', ' + (this.props.cy - this.props.r) + ')'} className={'depth' + this.props.depth + ' point'} fill={this.props.color || '#80A6D8'} x={this.props.cx} y={this.props.cy} points="11,0 22,8 17.8,20.9 4.2,20.9 0,8 "/>;
        } else if (this.props.type === 'hash') {
            symbol = <path width={this.props.r * 2} height={this.props.r * 2} className={'depth' + this.props.depth + ' point'} fill={this.props.color || '#80A6D8'} x={this.props.cx} y={this.props.cy} transform={'translate(' + (this.props.cx - this.props.r) + ', ' + (this.props.cy - this.props.r) + ')scale(1.9)'} d="M7.16.82h0a1.23,1.23,0,0,0,1.69.7h0a1.23,1.23,0,0,1,1.64,1.64h0a1.23,1.23,0,0,0,.7,1.69h0a1.23,1.23,0,0,1,0,2.32h0a1.23,1.23,0,0,0-.7,1.69h0a1.23,1.23,0,0,1-1.64,1.64h0a1.23,1.23,0,0,0-1.69.7h0a1.23,1.23,0,0,1-2.32,0h0a1.23,1.23,0,0,0-1.69-.7h0A1.23,1.23,0,0,1,1.52,8.85h0a1.23,1.23,0,0,0-.7-1.69h0a1.23,1.23,0,0,1,0-2.32h0a1.23,1.23,0,0,0,.7-1.69h0A1.23,1.23,0,0,1,3.15,1.52h0A1.23,1.23,0,0,0,4.84.82h0A1.23,1.23,0,0,1,7.16.82Z"/>;
        }

        return (
            <g className={'node'}>
                {symbol}
            </g>
        );
    }
}

Node.propTypes = {
    type: PropTypes.string,
    r: PropTypes.number,
    color: PropTypes.string,
    cx: PropTypes.number,
    cy: PropTypes.number,
    depth: PropTypes.number,
    domain: PropTypes.string
};


export default Graph;
