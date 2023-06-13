import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {GUI} from 'dat.gui'
// Canvas
let renderer, scene, camera;
let statue, plane;
let spotLight;

const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
class Statue{
  constructor(){
    loader.load('/statue.glb', (gltf) => {
      scene.add(gltf.scene);
      gltf.scene.position.set(0, 0, 0);
      gltf.scene.scale.set(10,10,10);
      // scene.add(mesh);
      this.obj = gltf.scene;

    })
  }
}

init();
animate();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);  
});

function init(){
  const container = document.querySelector('.container');
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.append(renderer.domElement);
  
  scene = new THREE.Scene();
  statue = new Statue();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  const planeGeometory = new THREE.PlaneGeometry(50,50);
  const planeMaterial = new THREE.MeshStandardMaterial({side: THREE.DoubleSide});
  plane = new THREE.Mesh(planeGeometory, planeMaterial);
  scene.add(plane);
  plane.rotation.x = Math.PI * 0.5;
  plane.position.set(0,0,0)
  spotLight = new THREE.SpotLight( 0xffffff, 1 );
  spotLight.position.set( 10, 30, 0 );
  if(statue && statue.obj)spotLight.lookAt(statue.obj.position)
  const spotLightHelper = new THREE.SpotLightHelper( spotLight );
  
  scene.add( spotLightHelper );
  scene.add( spotLight );
  camera.position.set( 0, 50, 40 );
  
  /* GUI */
  
 const textures = {
  'disturb.jpg': 'disturb.jpg',
  'uv_grid_opengl.jpg': 'uv_grid_opengl.jpg',
  'matrix.jpg': 'matrix.jpg',
  'matrix2.jpg': 'matrix2.jpg'
};
  
  const gui = new GUI();
  const lightFolder = gui.addFolder('Light');
  lightFolder.add(spotLight.position, 'x', -50, 50);
  lightFolder.add(spotLight.position, 'y', -50, 50);
  lightFolder.add(spotLight.position, 'z', -50, 50);
  lightFolder.add(spotLight, 'intensity', 0, 10);
  lightFolder.add(spotLight, 'distance', 0, 200);
  lightFolder.add(spotLight, 'angle', 0, 1.5);
  lightFolder.add(spotLight, 'penumbra', 0, 1);
  lightFolder.add(spotLight, 'decay', 0, 2);
  lightFolder.add(spotLight, 'castShadow', 0, 1);
  lightFolder.open();
  const TextureFolder = gui.addFolder('Textures')
  const params = {
    map: textures[ 'disturb.jpg' ],
  }
  TextureFolder.add( params, 'map', textures ).onChange( function ( val ) {
    console.log(val);
    spotLight.map = textureLoader.load(val);
    
  } );
  TextureFolder.open();
  spotLight.map = textureLoader.load(textures[ 'disturb.jpg' ]);
  // spotLight.map = textures[ 'disturb.jpg' ];
  
  /* ORBIT CONTROLS */
  const controls = new OrbitControls( camera, renderer.domElement );
  controls.minDistance = 20;
  controls.maxDistance = 100;
  controls.maxPolarAngle = Math.PI / 2;
  controls.update();
}

function animate(){
  const time = performance.now() / 3000;
  spotLight.position.x = Math.cos( time ) * 25;
  spotLight.position.z = Math.sin( time ) * 25;
  renderer.setAnimationLoop( animate );
  renderer.render( scene, camera );
}