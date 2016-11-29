
function workerCode() {
  importScripts("https://d3js.org/d3-collection.v1.min.js");
  importScripts("https://d3js.org/d3-dispatch.v1.min.js");
  importScripts("https://d3js.org/d3-quadtree.v1.min.js");
  importScripts("https://d3js.org/d3-timer.v1.min.js");
  importScripts("https://d3js.org/d3-force.v1.min.js");

  onmessage = function(event) {
    var nodes = event.data.nodes,
        edges = event.data.edges;

    for (var i = 0; i < edges.length; i++) {
      var edge = edges[i];
      edge.source = edge.src;
      edge.target = edge.dst;
    }

    var simulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink(edges).distance(20).strength(1).id(function (d) {
          // console.log(d);
          return d.id;
        }))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .stop();

    for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
      postMessage({ type: "tick", progress: i / n });
      simulation.tick();
    }

    postMessage({type: "end", nodes: nodes, edges: edges});
  };
}


export default ((cb, progressCb) => {
  var blobURL = URL.createObjectURL( new Blob([ '(',

  workerCode.toString(),

  ')()' ], { type: 'application/javascript' } ) )


  var worker = new Worker(blobURL);
  worker.onmessage = function (event) {
      if (event.data.type === 'tick') {
        progressCb(event.data);
      } else if (event.data.type === 'end') {
        cb(event.data);
      }
  };

  return ({
    postMessage(data) {
      worker.postMessage(data);
    },
    kill() {
      worker.terminate();
    }
  })

});
