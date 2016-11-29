import React from 'react';
import ReactDOM from 'react-dom';
import Graph from './components/graph/graph';
import data from './data.json';

let App = {

    /**
     * Run application
     */

    run() {
        console.log(data);
        // render aplication
        ReactDOM.render(
            <Graph/>,
            document.getElementById('graph-container')
        );
    }
};

export default App;
