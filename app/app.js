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

      const app = (shouldRemove, data) => {
        if (shouldRemove === true) {
          removeUploader();
          ReactDOM.unmountComponentAtNode(appContainer);
        }

        ReactDOM.render(
            <ForceGraph width={window.innerWidth - 188} height={window.innerHeight} depth={100} data={data || demodata} />,
            appContainer
        );
      }
      
      const removeUploader = () => {        
        ReactDOM.unmountComponentAtNode(dropElement);
        dropElement.remove();
      }

      ReactDOM.render(
          <Upload apprunner={app} removeSelf={removeUploader} />,
          dropElement
      );

      app();

      window.onresize = app;
    }

};

export default App;
