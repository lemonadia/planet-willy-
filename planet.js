const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 1);

const sectionTag = document.querySelector("section");
sectionTag.appendChild(renderer.domElement);

const scene = new THREE.Scene();

//light
const ambientLight = new THREE.AmbientLight(0x777777);
scene.add(ambientLight);

//add a spotlight

const pointLight = new THREE.PointLight(0xffffff, 1, 0);
pointLight.position.set(500, 500, -3000);
scene.add(pointLight);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.z = -3000;

// load texture loader
const loader = new THREE.TextureLoader();

//make planet
const makePlanet = function () {
  const texture = loader.load("assets/wilson-skin.png");
  const geometry = new THREE.SphereGeometry(800, 128, 128);
  const material = new THREE.MeshLambertMaterial({
    // color: 0x2727e6,
    map: texture,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
};
//make points
const makeStars = function () {
  const geometry = new THREE.Geometry();

  for (let i = 0; i < 5000; i = i + 1) {
    const point = new THREE.Vector3(2000 * Math.random(), 2000 * Math.random(), 2000 * Math.random());

    geometry.vertices.push(point);
  }
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);
  return points;
};
const makeMoon = function () {
  const texture = loader.load("assets/wilson-skin.png");
  const geometry = new THREE.SphereGeometry(80, 128, 128);
  const material = new THREE.MeshLambertMaterial({
    color: 0x2727e6,
    map: texture,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
};

// a single ring

const makeRing = function (width, color) {
  const geometry = new THREE.TorusGeometry(width, 5, 16, 100);
  const material = new THREE.MeshBasicMaterial({
    color: color,
  });
  const mesh = new THREE.Mesh(geometry, material);

  mesh.geometry.rotateX(Math.PI / 2);
  mesh.geometry.rotateZ(Math.PI / 10);
  scene.add(mesh);
  return mesh;
};

const earth = makePlanet();

const moon = makeMoon();

//Group the moon
const moonGroup = new THREE.Group();
moonGroup.add(moon);
scene.add(moonGroup);
moon.translateX(-1500);

const ring1 = makeRing(1000, 0xff1414);
const ring2 = makeRing(1200, 0x3fffff);
const ring3 = makeRing(1300, 0xffc0cb);
const stars = makeStars();

const animate = function () {
  camera.lookAt(scene.position);

  earth.rotateY(0.01);
  moon.rotateY(0.02);
  moonGroup.rotateY(0.02);
  ring1.geometry.rotateY(0.01);
  ring2.geometry.rotateY(-0.002);
  ring3.geometry.rotateY(-0.003);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  render.setSize(window.innerWidth, window.innerHeight);
});

// document.addEventListener("scroll", function () {
//   const scrollPsition = window.pageYOffset;
//   earth.rotation.set(0, scrollPsition / 100, 0);
// });

document.addEventListener("mousemove", function (event) {
  camera.position.x = (window.innerWidth / 2 - event.pageX) * 4;
  camera.position.y = (window.innerHeight / 2 - event.pageY) * 4;
});
