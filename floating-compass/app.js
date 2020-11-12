import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import { STLLoader } from 'https://unpkg.com/three/examples/jsm/loaders/STLLoader.js';

import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var container;

var camera, scene, renderer, controls;

var assembly, magnet;

let targetPos = new THREE.Vector3(0, 0, 0);

var input1, input2;

let input1Min = 0;

let input1Max = 360;

let input1Input = document.getElementById("input1");
let input2Input = document.getElementById("input2");

var pi = Math.PI;

var size = 0;

var negRad = size;

var magnetNorth;
var magnetSouth;

var group = new THREE.Group();
var negRad2 = 0;
var negRad3 = Math.PI;

var turnMag = false;

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
    camera.position.y = 15;
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

    var material2 = new THREE.MeshPhongMaterial({ color: 0xFF0000 });

    var material3 = new THREE.MeshPhongMaterial({ color: 0x0000FF });

    loader.load('objects/assembly.stl', function (geometry) {

        assembly = new THREE.Mesh(geometry, material);

        scene.add(assembly);

        assembly.rotation.x = -Math.PI / 2;

    });

    /* loader.load('objects/magnet.stl', function (geometry) {

        magnet = new THREE.Mesh(geometry, material);

        scene.add(magnet);

        magnet.position.x = -0.15;
        magnet.position.y = 1.4625;
        magnet.position.z = 2.2;
        //magnet.rotation.x = 90;

    }); */

    loader.load('objects/magnet-north.stl', function (geometry) {

        magnetNorth = new THREE.Mesh(geometry, material);

        group.add(magnetNorth);

    });

    loader.load('objects/magnet-south.stl', function (geometry) {

        magnetSouth = new THREE.Mesh(geometry, material2);

        group.add(magnetSouth);

        magnetSouth.position.z = -1.99;

    });

    // movement
    scene.add(group);
    group.position.z = 4;
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
    if (Math.abs(group.rotation.y - negRad2) >= 0.01) {
        if (group.rotation.y > negRad2) {
            group.rotation.y -= 0.01;
        } else if (group.rotation.y < negRad2) {
            group.rotation.y += 0.01;
        }
        group.position.x = Math.sin(group.rotation.y) * 4;
        group.position.z = Math.cos(group.rotation.y) * 4;
    } else if (Math.abs(assembly.rotation.z - negRad2) >= 0.01) {
        if (assembly.rotation.z > negRad2) {
            assembly.rotation.z -= 0.01;
        } else if (assembly.rotation.z < negRad2) {
            assembly.rotation.z += 0.01;
        }
    }

    if (input2) {
        group.rotation.z = Math.PI;
        assembly.rotation.z = Math.PI;
    }
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
    input2 = input2Input.checked;

    negRad2 = -1 * input1 * (pi / 180);

    sendValues();
}

function sendValues() {
    input1Input.value = Math.round(input1 * 100) / 100;
}
