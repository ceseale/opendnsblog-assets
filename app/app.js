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

        function addCss(fileName) {

          var head = document.head
            , link = document.createElement('link')

          link.type = 'text/css'
          link.rel = 'stylesheet'
          link.href = fileName

          head.appendChild(link)
        } 

        addCss('https://rawgit.com/ceseale/opendnsblog-assets/newblog/bundle.mini.css')

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
