import React from 'react';
import ReactDOM from 'react-dom';
// import Graph from './components/graph/graph';
import ForceGraph from './components/forceGraph/ForceDirectedGraph';
import demodata from './freeppstop.json';
import globalStyle from './global.scss';
import Upload from './components/Upload/Upload';

let App = {

    /**
     * Run application
     */

    run() {

      const dropElement = document.getElementById('drop-container');
      const appContainer = document.getElementById('container');

      const app = (shouldRemove, data, noBlur) => {
        ReactDOM.render(
            <ForceGraph width={window.innerWidth - 188} height={window.innerHeight} blur={false} depth={data ? null : 3} data={data || demodata} />,
            appContainer
        );
      }
    

      app();

      window.onresize = app.bind(window, null, null, false);
    }

};

export default App;
