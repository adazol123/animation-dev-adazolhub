import "./css/style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const loader = new THREE.TextureLoader();
const height = loader.load("../src/assets/textures/height.png");
const texture = loader.load("../src/assets/textures/texture.jpg");
const alpha = loader.load("../src/assets/textures/alpha.png");

const canvas = document.querySelector(".scene");
const sizes = {
  width: canvas.clientWidth * 0.7,
  height: canvas.clientHeight,
};
/**
 * Creating the scene
 * -- To be able to display anything with three.js,
 * -- we need three things: Scene, Camera, Renderer
 * -- so that we can render the scene with camera
 */

function init() {
  const gui = new dat.GUI();

  const scene = new THREE.Scene();
  const fov = 75;
  const aspect = sizes.width / sizes.height;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 0.5, 4);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  canvas.appendChild(renderer.domElement); //add canvas inside div element

  // Objects + Material = Mesh
  const gWidth = 6;
  const gHeight = 6;
  const gWidthSegment = 64;
  const gHeightSegment = 64;
  const geometry = new THREE.PlaneBufferGeometry(
    gWidth,
    gHeight,
    gWidthSegment,
    gHeightSegment,
  ); // Object

  const mColor = "#8deab2";
  const material = new THREE.MeshStandardMaterial({
    color: mColor,
    map: texture,
    displacementMap: height,
    displacementScale: 0.6,
    alphaMap: alpha,
    transparent: true,
    depthTest: false
  }); //Material

  const plane = new THREE.Mesh(geometry, material); //Mesh
  scene.add(plane);
  plane.rotation.x = 74;

  gui.add(plane.rotation, "x").min(0).max(300);

  //lights
  const pColor = "0xffffff";
  const pIntensity = 2;
  const pointLight = new THREE.PointLight(pColor, pIntensity);
  pointLight.position.x = 2;
  pointLight.position.y = 3;
  pointLight.position.z = 5;
  scene.add(pointLight);

  gui.add(pointLight.position, "x");
  gui.add(pointLight.position, "y");
  gui.add(pointLight.position, "z");

  const col = { color: "#8deab2" };
  gui.addColor(col, "color").onChange(() => {
    pointLight.color.set(col.color);
  });

  document.addEventListener('mousemove', animateTerrain)
  let mouseY = 0
  function animateTerrain(event){
    mouseY = event.clientY
  }

  const clock = new THREE.Clock();
  const animation = () => {
    const elapsedTime = clock.getElapsedTime();
    plane.rotation.z = 0.2 * elapsedTime;
    plane.material.displacementScale = 0.3 +  mouseY * 0.001
    renderer.render(scene, camera);
    window.requestAnimationFrame(animation);
  };
  animation();
}



init();
