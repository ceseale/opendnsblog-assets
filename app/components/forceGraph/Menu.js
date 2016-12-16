import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { BasicMenu } from '@opendns/dpl-menus';
import { DPLButton } from '@opendns/dpl-buttons';
import AnimatedNumber from 'react-animated-number';
import keycode from 'keycode';

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = { current: 0 };
        this.menuItems = [ { label: 'Filters', value: 0 }, { label: 'Search', value: 1 }, { label: 'Cluster', value: 2 } ];
        // console.time('cluster')
        // // this.markovCluster(this.props.data.nodes, this.props.data.edges);
        // console.timeEnd('cluster')
    }

    markovCluster(nodes, edges) {
        // function round(n) {
        //     return Math.round(n*100) / 100;
        // }

        // // Represents an edge from source to sink with capacity
        // var Edge = function(source, sink, capacity) {
        //     this.source = source;
        //     this.sink = sink;
        //     this.capacity = capacity;
        // };

        // // Main class to manage the network
        // var Graph = function() {
        //     this.edges = {};
        //     this.nodes = [];
        //     this.nodeMap = {};
            
        //     // Add a node to the graph
        //     this.addNode = function(node) {
        //         this.nodes.push(node);
        //         this.nodeMap[node] = this.nodes.length-1;
        //         this.edges[node] = [];
        //     };

        //     // Add an edge from source to sink with capacity
        //     this.addEdge = function(source, sink, capacity) {
        //         // Create the two edges = one being the reverse of the other    
        //         var edge = new Edge(source, sink, capacity);
        //         this.edges[source].push(edge);
        //     };
            
        //     // Does edge from source to sink exist?
        //     this.edgeExists = function(source, sink) {
        //         if(this.edges[source] !== undefined) 
        //             for(var i=0;i<this.edges[source].length;i++)
        //                 if(this.edges[source][i].sink == sink)
        //                     return this.edges[source][i];
        //         return null;
        //     };
            
        //     // Turn the set of nodes and edges to a matrix with the value being
        //     // the capacity between the nodes
        //     this.getAssociatedMatrix = function() {
        //         var matrix = [];
        //         for(var i=0;i<this.nodes.length;i++) {
        //             var row = [];
        //             for(var j=0;j<this.nodes.length;j++) {
        //                 var edge = this.edgeExists(this.nodes[j], this.nodes[i]);
        //                 if(i == j) edge = {capacity:1};
        //                 row.push(edge != null ? edge.capacity : 0);
        //             }
        //             matrix.push(row);
        //         }
        //         return matrix;
        //     };
                
        //     // Normalizes a given matrix
        //     this.normalize = function(matrix) {
        //         // Find the sum of each column
        //         var sums = [];
        //         for(var col=0;col<matrix.length;col++) {
        //             var sum = 0;
        //             for(var row=0;row<matrix.length;row++)
        //                 sum += matrix[row][col];
        //             sums[col] = sum;
        //         }

        //         // For every value in the matrix divide by the sum
        //         for(var col=0;col<matrix.length;col++) 
        //             for(var row=0;row<matrix.length;row++)
        //                 matrix[row][col] = round(matrix[row][col] / sums[col]);
        //     };
            
        //     // Prints the matrix
        //     this.print = function(matrix) {
        //         console.log(matrix, 'over');
        //         for(var i=0;i<matrix.length;i++) {
        //             for(var j=0;j<matrix[i].length;j++) {
        //                 document.write((j==0?'':',')+matrix[i][j]);
        //             }
        //             document.write('<br>');
        //         }
        //     };
                
        //     // Take the (power)th power of the matrix effectively multiplying it with
        //     // itself pow times
        //     this.matrixExpand = function(matrix, pow) {
        //         var resultMatrix = [];
        //         for(var row=0;row<matrix.length;row++) {
        //             resultMatrix[row] = [];
        //             for(var col=0;col<matrix.length;col++) {
        //                 var result = 0;
        //                 for(var c=0;c<matrix.length;c++)
        //                     result += matrix[row][c] * matrix[c][col];
        //                 resultMatrix[row][col] = result;
        //             }
        //         }
        //         return resultMatrix;
        //     }; 
                
        //     // Applies a power of X to each item in the matrix
        //     this.matrixInflate = function(matrix, pow) {
        //         for(var row=0;row<matrix.length;row++) 
        //             for(var col=0;col<matrix.length;col++)
        //                 matrix[row][col] = Math.pow(matrix[row][col], pow);
        //     };
            
        //     // Are the two matrices equal?
        //     this.equals = function(a,b) {
        //         for(var i=0;i<a.length;i++) 
        //             for(var j=0;j<a[i].length;j++) 
        //                 if(b[i] === undefined || b[i][j] === undefined || a[i][j] - b[i][j] > 0.1) return false;
        //         return true;
        //     };
            
        //     // Girvan–Newman algorithm
        //     this.getMarkovCluster = function(power, inflation) {
        //         var lastMatrix = [];
                
        //         var currentMatrix = this.getAssociatedMatrix();
        //         // this.print(currentMatrix);        
        //         this.normalize(currentMatrix);  
                
        //         currentMatrix = this.matrixExpand(currentMatrix, power);    
        //         this.matrixInflate(currentMatrix, inflation);                               
        //         this.normalize(currentMatrix);
                
        //         var c = 0;
        //         while(!this.equals(currentMatrix,lastMatrix)) {
        //             lastMatrix = currentMatrix.slice(0);

        //             currentMatrix = this.matrixExpand(currentMatrix, power);
        //             // console.log('ffjdf1', 1)                
        //             this.matrixInflate(currentMatrix, inflation); 
        //             // console.log('ffjdf1', 2)             
        //             this.normalize(currentMatrix);            
        //             // console.log(currentMatrix);
        //             if(++c > 500) break; //JIC, fiddle fail
        //         }
        //         return currentMatrix;
        //     };
        // };

        // var g = new Graph();

        // for (let i = 0; i < nodes.length; i++) {
        //     g.addNode(nodes[i].id);
        // }

        // for (let i = 0; i < edges.length; i++) {
        //     g.addEdge(edges[i].src, edges[i].dst, 1);
        // }

        // g.addNode('a');
        // g.addNode('b');
        // g.addNode('c');
        // g.addNode('d');

        // g.addEdge('a','b',1);
        // g.addEdge('b','a',1);
        // g.addEdge('a','c',1);
        // g.addEdge('c','a',1);
        // g.addEdge('a','d',1);
        // g.addEdge('d','a',1);
        // g.addEdge('a','b',1);
        // g.addEdge('b','d',1);
        // g.addEdge('d','b',1);

        // var result = g.getMarkovCluster(2, 2);
        // g.print(result);
    }

    selectHandler(index) {
        this.setState({ current: index });
    }

    getMenuContent() {
        const currentItem = this.menuItems[this.state.current];
        let content = null;

        switch (currentItem.label) {
            case 'Filters':
                content = this.props.buttons;
                break;
            case 'Search':
                content = this.props.search;
                break;
            case 'Cluster':
                content = this.props.clusters;
                break;
        }

        return content;
    }

    componentDidUpdate() {
        let node = ReactDOM.findDOMNode(this);
        let input = (d3.select(node).select('.select-input___1XLBC'));
        let inputNode = input.node();
        if (input[0]) {
            input.on('input', () => {
                let data = [];
                for (let i = 0; i < this.props.data.nodes.length; i++) {
                    let node = this.props.data.nodes[i];

                    if (inputNode.value && node.id.indexOf(inputNode.value) > -1) {
                        data.push(node.id);
                    }
                }
                this.props.onInputChange('search', data);
            });
        }
    }

    render() {


        const menuContent = this.getMenuContent();
        const centeringStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
        return (
              <div style={{ width: this.props.width, height: this.props.height, background: 'black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
                <div style={{ display: 'flex', width: '75%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', color: 'white' }}>
                    <span style={centeringStyle}><AnimatedNumber stepPrecision={0} value={this.props.focusedNodeCount || this.props.data.nodes.length} duration={1500}/><span>Nodes</span></span>
                    <span style={centeringStyle}><AnimatedNumber stepPrecision={0} value={this.props.focusedEdgeCount || this.props.data.edges.length} duration={1500}/><span>Edges</span></span>
                </div>
                <div style={{ width: 182 }} >
                    <BasicMenu menuButtonText="Explore By" selectedOptionText={this.menuItems[this.state.current].label} options={this.menuItems} selectHandler={this.selectHandler.bind(this)} />
                </div>

                {/* wraps menu content */}
                <div style={{ display: 'flex', height: '70%', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
                    {menuContent}
                </div>
              </div>
        );
    }
}


// define propTypes
Menu.propTypes = {
    data: PropTypes.object,
    width: PropTypes.any,
    height: PropTypes.any,
    transX: PropTypes.number,
    style: PropTypes.object,
    onClick: PropTypes.func,
    buttons: PropTypes.array,
    search: PropTypes.node,
    focusedNodeCount: PropTypes.number,
    focusedEdgeCount: PropTypes.number,
    onInputChange: PropTypes.func,
    clusters: PropTypes.node

};

export default Menu;