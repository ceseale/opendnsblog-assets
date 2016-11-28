import React from 'react';
import ReactDOM from 'react-dom';
import Graph from './components/graph/graph';


let App = {

    /**
     * Run application
     */

    run() {
        // render aplication
        ReactDOM.render(
            <Graph/>,
            document.getElementById('graph-container')
        );
    }
};

export default App;
