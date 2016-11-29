/* global d3 */
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import TrackballControls from 'three-trackballcontrols';
import dat from 'dat-gui';
const THREE = require('three');
const Color = require('color');
const electronENV = true;
console.dir(THREE);

class GlobePatterns extends React.Component {
  constructor(props) {
    super(props);
    (function(){ var script = document.createElement('script');script.onload=function(){var stats=new Stats();document.getElementById('globalHolder').appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='https://rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})()

    window.document.body.style.margin = 0;
    // const THREE.TrackballControls
    if (electronENV) {
      this.createFromElectron();
    } else {
      this.createFromFile('./controllers/querypatterns/mia.csv');
    }
    window.THREE = THREE;
  }

  componentDidMount() {
    this.start();
  }

  createFromElectron() {
    let electronChartData = { graph: this.props.data };

    const reducedNodes = electronChartData.graph.nodes.reduce((mem, d) => {
      // Pair order is lat vs lon
      if (d.type === 'domain' && d.investigate['rr:a'] && d.investigate['rr:a'].locations) {
        let locations = d.investigate['rr:a'].locations.map(location => {
          return [location.lat, location.lon];
        });

        mem[d.id] = { locations: locations, type: d.type };
      } else if (d.type === 'ip' && d.geoip2) {
        let locations = [d.geoip2.location.latitude, d.geoip2.location.longitude];

        mem[d.id] = { locations: [locations], type: d.type };
      }

      return mem;
    }, {});

    const coordinatePairs = [];

    const pairColors = [];

    for (let i = 0; i < electronChartData.graph.edges.length; i++) {
      const edge = electronChartData.graph.edges[i];
      const src = reducedNodes[edge.src];
      const dst = reducedNodes[edge.dst];

      if (src && dst) {
        for (let srci = 0; srci < src.locations.length; srci++) {
          const currentSrc = src.locations[srci];
          for (let dsti = 0; dsti < dst.locations.length; dsti++) {
            const currentDst = dst.locations[dsti];
            // removeing ones that point to themselves
            if (currentSrc[0] !== currentDst[0] && currentSrc[1] !== currentDst[1]) {
              coordinatePairs.push([currentSrc[0], currentSrc[1], currentDst[0], currentDst[1]]);
              pairColors.push(edge.style ? Color(edge.style.color).rgbArray() : Color('red').rgbArray());
            }
          }
        }
      }
    }

    this.data = coordinatePairs;
    this.colorData = pairColors;
    // console.log(electronChartData, coordinatePairs, pairColors);
  }

  createFromFile(url) {
    d3.csv(url, (data) => {
      this.data = [];
      for (let i = 0; i < data.length; i += 2) {
        if (data[i].lat && data[i].lng && data[i + 1].lat && data[i + 1].lng) { // If none of the data is undefined
          this.data.push([Number(data[i].lat), Number(data[i].lng), Number(data[i + 1].lat), Number(data[i + 1].lng)]);
        }
      }
      this.data = this.data.filter((item) => {
        return !(item[0] === item[2] && item[1] === item[3]);
      });

      this.start(); // Starts WEBGL
    });
  }

  start() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
      this.camera.position.z = 1.5;
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setClearColor(0x000000, 1.0);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.props.width, this.props.height);
      document.getElementById('globalHolder').appendChild(this.renderer.domElement);
      this.startIndex = 0;
      this.endIndex = this.data.length;
      this.pathSplines = [];
      this.pathDistance = [];
      this.pointCloudGeom = null;
      this.positions = [];
      this.sizes = null;
      this.lineOpacity = 0.02;
      this.colors = [];
      this.radius = 0.5;
      this.queryPathLines = null;
      this.addLights();
      this.addEarth();
      this.addTrackball(this.camera, this.renderer.domElement);
      var animate = function() {
        requestAnimationFrame(animate);
        // Check for if loading
        // Update controls
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
      };

      animate = animate.bind(this);

      animate();

  }

  addLights() {
    const light1 = new THREE.DirectionalLight(0xffffff, 0.2);
    light1.position.set(5, 3, -5);
    this.scene.add(light1);
    const light2 = new THREE.DirectionalLight(0xffffff, 0.02);
    light2.position.set(5, 3, 5);
    this.scene.add(light2);
    this.scene.add(new THREE.AmbientLight(0x777777, 0.08));
  }

  addTrackball(camera, elem) {
    this.controls = new TrackballControls(camera, elem);
    this.controls.rotateSpeed = 0.5;
    this.controls.noZoom = false;
    this.controls.noPan = true;
    this.controls.staticMoving = false;
    this.controls.minDistance = 0.57;
    this.controls.maxDistance = 3.0;
  }

  addGUI() {
    let gui = new dat.GUI();
    const that = this;
    gui.add({ queryPathLines: this.lineOpacity }, 'queryPathLines', 0, 1.0).name('Path Opacity').onChange(function(value) {
      that.queryPathLines.material.opacity = value;
    });
  }

  addEarth() {
    const radius = 0.5;
    const segments = 64;
    const that = this;
    const generatePoints = (radius) => {
      let test = true;
      for (let q = this.startIndex; q < this.endIndex; q++) {
        const lat1 = this.data[q][0];
        const lng1 = this.data[q][1];
        const lat2 = this.data[q][2];
        const lng2 = this.data[q][3];

        const maxHeight = Math.random() * 0.04;

        const points = [];
        const splineCount = 8;

        for (let i = 0; i < splineCount + 1; i++) {
          const arcAngle = i * 180.00 / splineCount;
          const arcRadius = radius + Math.sin(arcAngle * Math.PI / 180.0) * maxHeight;
          const latlng = latlngInterPoint(lat1, lng1, lat2, lng2, i / splineCount);
          const pos = xyzFromLatLng(latlng.lat, latlng.lng, arcRadius);
          points.push(new THREE.Vector3(pos.x, pos.y, pos.z));
        }

        let spline = new THREE.SplineCurve3(points);
        this.pathSplines.push(spline);

        if(test) {
          console.log(spline);
          test = false ;
        }

        let arcLength = spline.getLength();
        this.pathDistance.push(arcLength);

        // TODO: Time stuff

      }
    }

    const earthImg = THREE.ImageUtils.loadTexture('./images/earth.jpg', THREE.UVMapping, () => {
      const bumpMap = THREE.ImageUtils.loadTexture('./images/elevation.jpg', THREE.UVMapping, () => {
        const waterSpec = THREE.ImageUtils.loadTexture('./images/water.png', THREE.UVMapping, () => {
          that.scene.add(new THREE.Mesh(
            new THREE.SphereGeometry(radius, segments, segments),
            new THREE.MeshPhongMaterial({
              map: earthImg,
              specular: new THREE.Color('grey'),
            })
            )
          );

          generatePoints(this.radius);
          this.queryPathLines = this.pathLines();
          this.scene.add(this.queryPathLines);
          this.addGUI();

        });
      });
    });

    function latlngInterPoint(lat1, lng1, lat2, lng2, offset) {
      const lat1R = lat1 * Math.PI / 180.0;
      const lng1R = lng1 * Math.PI / 180.0;
      const lat2R = lat2 * Math.PI / 180.0;
      const lng2R = lng2 * Math.PI / 180.0;

      const d = 2 * Math.asin(Math.sqrt(Math.pow((Math.sin((lat1R - lat2R) / 2)), 2) +
          Math.cos(lat1R) * Math.cos(lat2R) * Math.pow(Math.sin((lng1R - lng2R) / 2), 2)));
      const A = Math.sin((1 - offset) * d) / Math.sin(d);
      const B = Math.sin(offset * d) / Math.sin(d);
      const x = A * Math.cos(lat1R) * Math.cos(lng1R) + B * Math.cos(lat2R) * Math.cos(lng2R);
      const y = A * Math.cos(lat1R) * Math.sin(lng1R) + B * Math.cos(lat2R) * Math.sin(lng2R);
      const z = A * Math.sin(lat1R) + B * Math.sin(lat2R);
      const lat = Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))) * 180 / Math.PI;
      const lng = Math.atan2(y, x) * 180 / Math.PI;

      return {
        lat: lat,
        lng: lng,
      };
    }

    function xyzFromLatLng(lat, lng, radius) {
      const phi = (90 - lat) * Math.PI / 180;
      const theta = (360 - lng) * Math.PI / 180;
      return {
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.sin(theta),
      };
    }
  }

  pathLines() {
    const controlPointNumber = 32;

    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      vertexColors: THREE.VertexColors,
      transparent: true,
      opacity: this.lineOpacity,
      depthTest: true,
      depthWrite: false,
      linewidth: 0.001,
    });

    const linePositions = new Float32Array(this.endIndex * 3 * 2 * controlPointNumber);
    const colors = new Float32Array(this.endIndex * 3 * 2 * controlPointNumber);

    function setColors(r, b, g, i, j) {
      colors[(i * controlPointNumber + j) * 6 + 0] = r / 255;
      colors[(i * controlPointNumber + j) * 6 + 1] = b / 255;
      colors[(i * controlPointNumber + j) * 6 + 2] = g / 255;
      colors[(i * controlPointNumber + j) * 6 + 3] = r / 255;
      colors[(i * controlPointNumber + j) * 6 + 4] = b / 255;
      colors[(i * controlPointNumber + j) * 6 + 5] = g / 255;
    }

    for (let i = this.startIndex; i < this.endIndex; i++) {
      for (let j = 0; j < controlPointNumber - 1; j++) {
        let startPos = this.pathSplines[i].getPoint(j / (controlPointNumber - 1));
        let endPos = this.pathSplines[i].getPoint((j + 1) / (controlPointNumber - 1));

        linePositions[(i * controlPointNumber + j) * 6 + 0] = startPos.x;
        linePositions[(i * controlPointNumber + j) * 6 + 1] = startPos.y;
        linePositions[(i * controlPointNumber + j) * 6 + 2] = startPos.z;
        linePositions[(i * controlPointNumber + j) * 6 + 3] = endPos.x;
        linePositions[(i * controlPointNumber + j) * 6 + 4] = endPos.y;
        linePositions[(i * controlPointNumber + j) * 6 + 5] = endPos.z;

        if (this.colorData) {
          setColors(this.colorData[i][0], this.colorData[i][1], this.colorData[i][2], i, j);
        } else {
          setColors(227, 26, 28, i, j);
        }

      }
    }
    geometry.addAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeBoundingSphere();

    return new THREE.Line(geometry, material, THREE.LinePieces);
  }
  // updateFunction

  render() {
    return (<div id='globalHolder'></div>);
  }

}

GlobePatterns.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    data: PropTypes.object,
};


export default GlobePatterns;