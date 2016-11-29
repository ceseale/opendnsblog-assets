import React from 'react';
import ReactDOM from 'react-dom';
import Graph from './components/graph/graph';
import ForceGraph from './components/forceGraph/ForceDirectedGraph';
import GlobePatterns from './components/GlobePatterns/GlobePatterns';
import data from './data.json';

let App = {

    /**
     * Run application
     */

    run() {
        // render aplication
        ReactDOM.render(
            <GlobePatterns width={900} height={340} codeRunCount={0} data={data} />,
            document.getElementById('graph-container')
        );
    }
};

export default App;
