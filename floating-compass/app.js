import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import { STLLoader } from 'https://unpkg.com/three/examples/jsm/loaders/STLLoader.js';

import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var container;

var camera, scene, renderer, controls;

var assembly, magnet;

let targetPos = new THREE.Vector3(0, 0, 0);

var input1, input2;

let input1Min = 0;

let input1Max = 200;

let input1Input = document.getElementById("input1");

var pi = Math.PI;

var size = 0;

var negRad = size;

// console.log("newPosX: " + newPosX);
// console.log("newPosY: " + newPosY);



init();
animate();

function init() {

    container = document.createElement('div');
    container.id = "container";
    document.body.appendChild(container);

    var submitInputsButton = document.getElementById("submit");
    submitInputsButton.onclick = submitInputs;

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.x = -10;
    camera.position.y = -15;
    camera.position.z = 15;



    // scene

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.4);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xFFFFFF, 0.8);
    camera.add(pointLight);
    scene.add(camera);

    var loader = new STLLoader();

    var material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });

    loader.load('objects/assembly.stl', function (geometry) {

        assembly = new THREE.Mesh(geometry, material);

        scene.add(assembly);

    });

    loader.load('objects/magnet.stl', function (geometry) {

        magnet = new THREE.Mesh(geometry, material);

        scene.add(magnet);

        magnet.position.x = -0.15;
        magnet.position.y = 1.4625;
        magnet.position.z = 2.2;
        //magnet.rotation.x = 90;

    });

    loader.load('objects/magnet-north.stl', function (geometry) {

        magnetNorth = new THREE.Mesh(geometry, material);

        scene.add(magnetNorth);

    });

    loader.load('objects/magnet-south.stl', function (geometry) {

        magnetSouth = new THREE.Mesh(geometry, material);

        scene.add(magnetSouth);

    });

    // movement



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

    controls.target.set(0, 0, 0);

    // TODO: change object positions, rotations, states, etc here

    renderer.render(scene, camera);

    if (negRad < size) {
        assembly.rotation.z += 0.01;
        size -= 0.01;
    }

    console.log(camera.position);
}

function clip(input, limit1) {
    if (input < limit1) {
        return limit1;
    } else {
        return input;
    }
}

function submitInputs() {
    document.getElementById("output-text").style.visibility = "hidden";

    input1 = clip(input1Input.value, input1Min, input1Max);

    sendValues();
}

function sendValues() {
    input1Input.value = Math.round(input1 * 100) / 100;

    negRad = -1 * input1 * (pi / 180);
    var newPosX = Math.sin(negRad) * 1.4625;
    var newPosY = Math.cos(negRad) * 1.4625;

    magnet.position.x = newPosX - 0.15;
    magnet.position.y = newPosY;
    magnet.position.z = 2.2;


}



