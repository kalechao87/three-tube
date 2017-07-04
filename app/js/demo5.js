var ww = window.innerWidth;
var wh = window.innerHeight;

function Tunnel() {
  this.init();

  this.createMesh();

  this.handleEvents();
}

Tunnel.prototype.init = function () {
  this.speed = 4;

  this.mouse = {
    position: new THREE.Vector2(ww*0.5, wh*0.5),
    ratio: new THREE.Vector2(0, 0),
    target: new THREE.Vector2(ww*0.5, wh*0.5)
  };

  this.renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector('#scene')
  });
  this.renderer.setSize(ww, wh);

  this.camera = new THREE.PerspectiveCamera(15, ww/wh, 0.01, 10);
  // this.camera.rotation.y = Math.PI;
  this.camera.position.z = 0.4;

  this.scene = new THREE.Scene();
  this.scene.fog = new THREE.Fog(0xffffff, 1, 1.9);
};

Tunnel.prototype.createMesh = function () {
  var points = [];
  var i = 0;
  var geometry = new THREE.Geometry();

  this.scene.remove(this.tubeMesh);

  for (var i = 0; i < 5; i+=1) {
    points.push(new THREE.Vector3(0, 0, 3*(i /4)));
  }

  points[4].y = -0.06;

  this.curve = new THREE.CatmullRomCurve3(points);
  this.curve.type = 'catmullrom';

  geometry = new THREE.Geometry();
  geometry.vertices = this.curve.getPoints(120);
  this.splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial());

  this.tubeMaterial = new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    vertexColors: THREE.FaceColors
  });

  this.tubeGeometry = new THREE.TubeGeometry(this.curve, 120, 0.02, 3, false);

  for (var i = 0; i < this.tubeGeometry.faces.length; i++) {
    f = this.tubeGeometry.faces[i];
    p = this.tubeGeometry.vertices[f.a];

    color = new THREE.Color(
      "hsl(" +
            (Math.floor(
              Math.abs(noise.simplex3(p.x * 2, p.y * 4, p.z * 2)) * 80 * 100
            ) *
              0.01 +
              180) +
          ",70%,60%)"
    );
    f.color = color;
  }

  console.log(this.tubeGeometry.faces.length);

  this.tubeGeometry_o = this.tubeGeometry.clone();
  this.tubeMesh = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial);

  this.scene.add(this.tubeMesh);
  console.log(this.tubeMesh);
};

Tunnel.prototype.onResize = function () {
  ww = window.innerWidth;
  wh = window.innerHeight;

  this.camera.aspect = ww / wh;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(ww, wh);
};

Tunnel.prototype.handleEvents = function () {
  window.addEventListener('resize', this.onResize.bind(this), false);
};

window.onload = function () {
  document.body.classList.remove('loading');
  window.tunnle = new Tunnel();
};
