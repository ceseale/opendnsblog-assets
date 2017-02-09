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

        let width = document.getElementsByClassName('entry-content')[0].clientWidth;
        if (window.innerWidth >= 951) {
          width = width - 169;
        }

        let visheight = window.innerHeight - 420;
        if ((window.innerHeight - 420) <= 284) {
          visheight = 284;
        }

        ReactDOM.render(
            <ForceGraph width={width - 208} height={visheight} blur={false} depth={data ? null : 1} data={data || demodata} />,
            appContainer
        );
      }
    

      app();

      window.onresize = app.bind(window, null, null, false);
    }

};

export default App;
