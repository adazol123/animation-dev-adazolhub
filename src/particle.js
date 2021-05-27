import "./css/style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const loader = new THREE.TextureLoader();
// const height = loader.load("../src/assets/textures/height.png");
const texture = loader.load("../src/assets/textures/texture.jpg");
const alpha = loader.load("../src/assets/textures/alpha.png");

const canvas = document.querySelector('.scene');
const sizes = {
  width: canvas.clientWidth,
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
    renderer.setClearColor( new THREE.Color('#21282A', 0.09))

    canvas.appendChild(renderer.domElement); //add canvas inside div element

    // Objects + Material = Mesh
    const radius = 1
    const tube = 3
    const radialSegment = 16
    const tubularSegment = 100
    
    const geometry = new THREE.TorusGeometry( radius, tube, radialSegment, tubularSegment)
    const material = new THREE.PointsMaterial({
        size: 0.009
    })
    const sphere = new THREE.Points( geometry, material)
    scene.add(sphere)

    const particleGeometry = new THREE.BufferGeometry
    const particleCounts = 6000

    const posArray = new Float32Array(particleCounts * 3)

    for(let i = 0; i < particleCounts * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 8
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.005,
        // map: height,
        // transparent: true,
        color: 'green',
        blending: THREE.AdditiveBlending
    })
    const particle = new THREE.Points( particleGeometry, particleMaterial)
    scene.add(particle)

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


    document.addEventListener('mousemove', animateTerrain)
    let mouseY = 0
    let mouseX = 0

    function animateTerrain(event){
        mouseY = event.clientY
        mouseX = event.clientX
    }

    function onWindowResize(){
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()
        renderer.setSize(sizes.width, sizes.height)
    }

    const clock = new THREE.Clock();
    const animation = () => {
        const elapsedTime = clock.getElapsedTime();
        sphere.rotation.y = 0.007 * elapsedTime;
        particle.rotation.z = 0.004 * elapsedTime;
        sphere.position.z = -mouseY * (elapsedTime * 0.00008)
        sphere.rotation.y = mouseX * (elapsedTime * 0.000008 )
        // plane.material.displacementScale = 0.3 +  mouseY * 0.001
        renderer.render(scene, camera);
        window.requestAnimationFrame(animation);
        window.addEventListener('resize', onWindowResize)
    };
    animation();
}




init()





    