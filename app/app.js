import React from 'react';
import ReactDOM from 'react-dom';
// import Graph from './components/graph/graph';
import ForceGraph from './components/forceGraph/ForceDirectedGraph';
import data from './freeppstopBIG.json';
import globalStyle from './global.scss';

// import JSONTree from 'react-json-tree';



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

        // addCss('https://rawgit.com/ceseale/opendnsblog-assets/fgraph/bundle.mini.css')
        addCss('./bundle.mini.css')
        // d3.selectAll('.vis-container').style('display', 'flex');

        const getItemString = (type, data, itemType, itemString) => (<span>{ (data.type || data.depth) || itemString }</span>);
        // render aplication
        for (let depth = 1; depth < 5; depth++) {
          if (depth === 4) {
            ReactDOM.render(
                <ForceGraph width={760 - 188} height={340} depth={depth} initScale={0.14906360904132906} data={data} />,
                document.getElementById(`fgraph-container${depth}`)
            );
          } else if (depth === 3) {
            ReactDOM.render(
                <ForceGraph width={760 - 188} height={340} depth={depth} initScale={0.390663940086158} data={data} />,
                document.getElementById(`fgraph-container${depth}`)
            );
          } else {          
            ReactDOM.render(
                <ForceGraph width={760 - 188} height={340} depth={depth} data={data} />,
                document.getElementById(`fgraph-container${depth}`)
            );
          }  



        }


    }
};

export default App;
