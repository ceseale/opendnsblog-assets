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
        const getItemString = (type, data, itemType, itemString) => (<span>{ (data.type || data.depth) || itemString }</span>);
        // render aplication
        ReactDOM.render(
            <JSONTree getItemString={getItemString} hideRoot={true} data={data} />,
            document.getElementById('tree-container')
        );

        ReactDOM.render(
            <Graph width={900} height={340} codeRunCount={0} data={data} />,
            document.getElementById('graph-container')
        );

        ReactDOM.render(
            <ForceGraph width={900} height={340} codeRunCount={0} data={data} />,
            document.getElementById('fgraph-container')
        );

        ReactDOM.render(
            <GlobePatterns width={900} height={900} codeRunCount={0} data={data} />,
            document.getElementById('globe-container')
        );
    }
};

export default App;
