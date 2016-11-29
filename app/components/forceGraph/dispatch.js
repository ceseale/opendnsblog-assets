export default ((cb, progressCb) => {

  var worker = new Worker('./app/components/forceGraph/worker.js');
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
