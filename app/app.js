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
        function addCss(fileName) {

          var head = document.head
            , link = document.createElement('link')

          link.type = 'text/css'
          link.rel = 'stylesheet'
          link.href = fileName

          head.appendChild(link)
        } 

        addCss('https://rawgit.com/ceseale/opendnsblog-assets/fgraph/bundle.mini.css')
        // addCss('./bundle.mini.css')
        // d3.selectAll('.vis-container').style('display', 'flex');
        const postComponentData = {};

        const updateMirror = (name, scale, translation) => {
          postComponentData[name].initScale = scale;
          postComponentData[name].initTranslation = translation;
          console.log(postComponentData[name].el)
          ReactDOM.render(<ForceGraph {...postComponentData[name]} />, postComponentData[name].el);
        }

        const createPostComponents = (dataDepth, positionData) => {
            d3.selectAll('.focusedGraph').datum(function() {
              if (dataDepth === Number(this.dataset.depth)) {          
                const props = postComponentData[this.dataset.name] || Object.assign({}, this.dataset);

                if (!postComponentData[this.dataset.name]) {                
                  props.width = Number(props.width);
                  props.height = Number(props.height);
                  props.depth = Number(props.depth);
                  props.hasMenu = Boolean(props.menu);
                  props.minZoom = Number(props.minzoom);
                  props.maxZoom = Number(props.maxzoom);
                  props.initScale = Number(props.initscale);
                  props.initTranslation = props.inittranslation ? JSON.parse(props.inittranslation) : null;
                  props.mirror = props.mirror;
                  props.initFilter = props.initfilter;
                  props.initCluster = props.initcluster ? { type: 'end', clusters: clusters[String(props.initcluster)] } : null;
                  props.positionedData = true;
                  props.data = positionData;
                  props.el = this;
                  if (props.mirror) {
                    props.onZoomEnd = function(trans, scale) {
                      updateMirror(this.mirror, trans, scale);
                    }
                  }

                  postComponentData[this.dataset.name] = props;
                }
                // props
                ReactDOM.render(<ForceGraph {...props} />, this);
              } else if(dataDepth === 'init') {
                ReactDOM.render(<div style={{ width: Number(this.dataset.width), height: Number(this.dataset.height) }}/>, this);
              }
            });
        }
        
        createPostComponents('init'); // init with empty div
        const getItemString = (type, data, itemType, itemString) => (<span>{ (data.type || data.depth) || itemString }</span>);
        // render aplication
        for (let depth = 1; depth < 5; depth++) {
          if (depth === 4) {
            ReactDOM.render(
                <ForceGraph width={760 - 188} height={340} maxZoom={22} depth={depth} onWorkDone={createPostComponents} initScale={0.14906360904132906} data={data} />,
                document.getElementById(`fgraph-container${depth}`)
            );
          } else if (depth === 3) {
            ReactDOM.render(
                <ForceGraph width={760 - 188} height={340} depth={depth} onWorkDone={createPostComponents} initScale={0.390663940086158} data={data} />,
                document.getElementById(`fgraph-container${depth}`)
            );
          } else {          
            ReactDOM.render(
                <ForceGraph width={760 - 188} height={340} depth={depth} onWorkDone={createPostComponents} data={data} />,
                document.getElementById(`fgraph-container${depth}`)
            );
          }  



        }


    }
};

export default App;
