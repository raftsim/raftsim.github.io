import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import { STLLoader } from 'https://unpkg.com/three/examples/jsm/loaders/STLLoader.js';

import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var container;

var camera, scene, renderer, controls;

var ball, capsule, plate;

var world, cam;

var assembly;

let targetPos = new THREE.Vector3(0, 0, 0);

init();
animate();

function init() {
    //setup three
    container = document.createElement('div');
    container.id = "container";
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(315, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 300;
    camera.position.y = 300;

    // scene

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);

    var loader = new STLLoader();

    var material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    
    //oimo
    cam = (0, 20, 40);
    world = new OIMO.World({
        timestep: 1/60,
        iterations: 8,
        broadphase: 3,
        worldscale: 1,
        random: true,
        info: false,
        gravity: [0, -9.8, 0]

    });
    //place objects
    loader.load('objects/ball.stl', function(geometry){
        ball = new THREE.Mesh(geometry, material);
        ball.position.set(0, 0, 100);
        world.add(ball);
    });
    loader.load('objects/capsule.stl', function(geometry){
        capsule = new THREE.Mesh(geometry, material);
        capsule.position.set(0, 0, 100);
        world.add(capsule);
    });
    loader.load('objects/plate.stl', function(geometry){
        plate = new THREE.Mesh(geometry, material);
        world.add(plate);    
    });
    

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // orbit controls

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();
    controls.enablePan = false;
    controls.enableDamping = true;

    //

    window.addEventListener('resize', onWindowResize, false);
    world.play()
    


}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

//

function animate() {
    
    requestAnimationFrame(animate);
    controls.update();
    render();

}

function render() {

    // TODO: Change camera target here

    controls.target.set(targetPos.x, targetPos.y, targetPos.z);

    // TODO: change object positions, rotations, states, etc here

    renderer.render(scene, camera);
}

function clip(input, limit1, limit2) {
    if (input < limit1) {
        return limit1;
    } else if (input > limit2) {
        return limit2;
    } else {
        return input;
    }
}
