import React from 'react';
import ReactDOM from 'react-dom';
import Graph from './components/graph/graph';
import ForceGraph from './components/forceGraph/ForceDirectedGraph';
import GlobePatterns from './components/GlobePatterns/GlobePatterns';
import data from './data.json';
import globalStyle from './global.scss';
import JSONTree from 'react-json-tree';



let App = {

    /**
     * Run application
     */

    run() {

        d3.selectAll('.vis-container').style('display', 'flex');

        const getItemString = (type, data, itemType, itemString) => (<span>{ (data.type || data.depth) || itemString }</span>);
        // render aplication
        ReactDOM.render(
            <JSONTree getItemString={getItemString} hideRoot={true} data={data} />,
            document.getElementById('tree-container')
        );

        ReactDOM.render(
            <Graph width={760} height={340} codeRunCount={0} data={data} />,
            document.getElementById('graph-container')
        );

        ReactDOM.render(
            <ForceGraph width={760} height={340} codeRunCount={0} data={data} />,
            document.getElementById('fgraph-container')
        );

        ReactDOM.render(
            <GlobePatterns width={760} height={760} codeRunCount={0} data={data} />,
            document.getElementById('globe-container')
        );
    }
};

export default App;
