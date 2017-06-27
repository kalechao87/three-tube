var ww = window.innerWidth;
var wh = window.innerHeight;
var isMobile = ww < 500;

function Tunnel() {
  this.init();
  this.createMesh();
  this.handleEvents();
  window.requestAnimationFrame(this.render.bind(this));
}

Tunnel.prototype.init = function () {
  console.log('init');
  this.speed = 1;
  this.prevTime = 0;

  this.renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector('#scene')
  });
  this.renderer.setSize(ww, wh);

  this.camera = new THREE.PerspectiveCamera(15, ww / wh, 0.01, 100);
  // this.camera.rotation.y = Math.PI;
  this.camera.position.z = 0.35;

  // mouse controls
  // this.controls = new THREE.OrbitControls( this.camera );
  // this.controls.autoRotate = true;

  this.scene = new THREE.Scene();
  // this.scene.fog = new THREE.Fog(0x000d25, 0.05, 1.6);

  var light = new THREE.HemisphereLight(0xe9eff2, 0x01010f, 1);
  this.scene.add(light);
};

Tunnel.prototype.createMesh = function () {
  console.log('createMesh');
  var points = [];
  var i = 0;
  var geometry = new THREE.Geometry();

  for (i = 0; i < 5; i += 1) {
    points.push(new THREE.Vector3(0, 0, 2.5 * (i / 4)));
    console.log('points[' + i + '].z is: ' + points[i].z );
  }
  points[4].y = -0.06;
  // console.log('points is: ' + points);

  this.curve = new THREE.CatmullRomCurve3(points);
  this.curve.type = 'catmullrom';
  console.log(this.curve);

  geometry = new THREE.Geometry();
  geometry.vertices = this.curve.getPoints(70);
  console.log(geometry.vertices);
  this.splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial());
  console.log(this.splineMesh);
  // this.scene.add(this.splineMesh);

  this.tubeMaterial = new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    color: 0xffffff
  });

  this.tubeGeometry = new THREE.TubeGeometry(this.curve, 70, 0.02, 30, false);
  this.tubeGeometry_o = this.tubeGeometry.clone();
  this.tubeMesh = new THREE.Group(this.tubeGeometry, this.tubeMaterial);

  this.scene.add(this.tubeMesh);

};

Tunnel.prototype.handleEvents = function () {
  console.log('handleEvents');
  window.addEventListener('resize', this.onResize.bind(this), false);
};

Tunnel.prototype.onResize = function () {
  console.log('resize');
  ww = window.innerWidth;
  wh = window.innerHeight;

  isMobile = ww < 500;

  this.camera.aspect = ww / wh;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(ww, wh);
};

Tunnel.prototype.render = function () {
  // console.log('render');
  this.renderer.render(this.scene, this.camera);

  window.requestAnimationFrame(this.render.bind(this));
};

window.onload = function () {
  document.body.classList.remove('loading');
  window.tunnel = new Tunnel();
};
