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
var currentRot, targetRot, currentOrbit, targetOrbit;

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
    currentRot = group.rotation.y;
    currentOrbit = group.rotation.y;
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
/* 
One variable needs to contain the magnet orbit rotation (targetOrbit)
The other variable needs to contain the magnet rotation (magnetRot)
One more variable called current orbit 
magnetRot held by group.rotation.y
Input 1 is what you set to magnet orbit rotation
If input 2 is true, then, magnet rotation is orbit rotation-pi
If input 2 is false, magnet rotation is orbit rotation.
The compass moves to magnet rotation
*/

function render() {

    // TODO: Change camera target here

    controls.target.set(0, 0, 0);

    // TODO: change object positions, rotations, states, etc here
    var speed = 0.02;
    currentRot = group.rotation.y;
    if (Math.abs(currentRot - targetRot) >= speed) { //negRad2 to magnetRot
        console.log("1");
        if (currentRot > targetRot) {
            currentRot -= speed;
        } else if (currentRot < targetRot) {
            currentRot += speed;
        }
        group.rotation.y = currentRot;
    } else if (Math.abs(currentOrbit - targetOrbit) >= speed) { // group.rotation.y to current orbit and negRad2 to target orbit
        console.log("2");
        if (currentOrbit > targetOrbit) {
            currentOrbit -= speed;
            currentRot -= speed;
            targetRot -= speed;
        } else if (currentOrbit < targetOrbit) {
            currentOrbit += speed;
            currentRot += speed;
            targetRot += speed;
        }
        group.rotation.y = currentRot;
        group.position.x = Math.sin(currentOrbit) * 4;
        group.position.z = Math.cos(currentOrbit) * 4;
    } else if (Math.abs(assembly.rotation.z - currentRot) >= speed) { //negRad2 to magnetRot
        console.log("3");
        if (assembly.rotation.z > currentRot) {
            assembly.rotation.z -= speed;
        } else if (assembly.rotation.z < currentRot) {
            assembly.rotation.z += speed;
        }
    }
    renderer.render(scene, camera);
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

    while (currentOrbit > 360) { currentOrbit -= 360 };
    while (targetOrbit > 360) { targetOrbit -= 360 };
    while (currentRot > 360) { currentRot -= 360 };
    while (targetRot > 360) { targetRot -= 360 };
    while (group.rotation.y > 360) { group.rotation.y -= 360 };
    while (assembly.rotation.z > 360) { assembly.rotation.z -= 360 };

    input1 = clip(input1Input.value, input1Min, input1Max);
    input2 = input2Input.checked;
    sendValues();

    var rawDiff = input1 > currentOrbit ? input1 - currentOrbit : currentOrbit - input1;
    while (rawDiff > 360) { rawDiff -= 360 };
    var dist = rawDiff > 180 ? 360 - rawDiff : rawDiff;

    if (currentOrbit < 180) {
        if (input1 < currentOrbit + 180) {
            input1 = currentOrbit + dist;
        } else {
            input1 = currentOrbit - dist;
        }
    } else {
        if (input1 > currentOrbit - 180) {
            input1 = currentOrbit - dist;
        } else {
            input1 = currentOrbit + dist;
        }
    }

    targetOrbit = -1 * input1 * (Math.PI / 180);
    targetRot = input2 ? group.rotation.y - Math.PI : group.rotation.y;
}

function sendValues() {
    input1Input.value = Math.round(input1 * 100) / 100;
}
