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
        let blur = noBlur === false ? false : true;

        if (shouldRemove === true) {
          removeUploader();
          ReactDOM.unmountComponentAtNode(appContainer);
          blur = false;
        }

        ReactDOM.render(
            <ForceGraph width={window.innerWidth - 188} height={window.innerHeight} blur={blur} data={data || demodata} />,
            appContainer
        );
      }
      
      const removeUploader = () => {        
        ReactDOM.unmountComponentAtNode(dropElement);
        dropElement.remove();
        app(null, null, false);
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
