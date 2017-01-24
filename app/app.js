import React from 'react';
import ReactDOM from 'react-dom';
// import Graph from './components/graph/graph';
import ForceGraph from './components/forceGraph/ForceDirectedGraph';
import data from './freeppstopBIG.json';
import k3depth3 from './k3depth3.json';
import k7depth4 from './k7depth4.json';
import globalStyle from './global.scss';

const clusters = { k3depth3: k3depth3, k7depth4: k7depth4 };

let App = {

    /**
     * Run application
     */

    run() {
      ReactDOM.render(
          <ForceGraph width={window.innerWidth - 188} height={window.innerHeight} depth={3} data={data} />,
          document.getElementById('container')
      );
    }

};

export default App;
