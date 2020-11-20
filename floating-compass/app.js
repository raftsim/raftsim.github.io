import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { STLLoader } from 'https://unpkg.com/three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var container;
var camera, scene, renderer, controls;
var assembly;

let targetPos = new THREE.Vector3(0, 0, 0);

var input1, input2;

let input1Min = 0;
let input1Max = 360;

let input1Input = document.getElementById("input1");
let input2Input = document.getElementById("input2");

var group = new THREE.Group();
var magnetNorth;
var magnetSouth;

var currentRot, currentOrbit, targetOrbit;
var targetRot = 0;

init();
animate();

function init() {

    container = document.createElement('div');
    container.id = "container";
    document.body.appendChild(container);

    var submitInputsButton = document.getElementById("submit");
    submitInputsButton.onclick = submitInputs;

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.x = -6;
    camera.position.y = 9;
    camera.position.z = 9;

    // scene

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.4);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xFFFFFF, 0.8);
    camera.add(pointLight);
    scene.add(camera);

    var loader = new STLLoader();

    var materialWhite = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
    var materialRed = new THREE.MeshPhongMaterial({ color: 0xFF0000 });

    loader.load('objects/assembly.stl', function (geometry) {

        assembly = new THREE.Mesh(geometry, materialWhite);
        scene.add(assembly);
        assembly.rotation.x = -Math.PI / 2;

    });

    loader.load('objects/magnet-north.stl', function (geometry) {

        magnetNorth = new THREE.Mesh(geometry, materialWhite);
        group.add(magnetNorth);

    });

    loader.load('objects/magnet-south.stl', function (geometry) {

        magnetSouth = new THREE.Mesh(geometry, materialRed);
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

function animate() {

    requestAnimationFrame(animate);
    controls.update();
    render();

}

function render() {

    controls.target.set(targetPos.x, targetPos.y, targetPos.z);

    var speed = 0.02;
    currentRot = group.rotation.y;

    if (Math.abs(currentRot - targetRot) >= speed) {

        if (currentRot > targetRot) {
            currentRot -= speed;
        } else if (currentRot < targetRot) {
            currentRot += speed;
        }

        group.rotation.y = currentRot;

    } else if (Math.abs(currentOrbit - targetOrbit) >= speed) {
        
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

    } else if (Math.abs(assembly.rotation.z - currentRot) >= speed) {
        
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
    while (currentOrbit > 360) { currentOrbit -= 360 };
    while (targetOrbit > 360) { targetOrbit -= 360 };
    while (currentRot > 360) { currentRot -= 360 };
    while (targetRot > 360) { targetRot -= 360 };
    while (group.rotation.y > 360) { group.rotation.y -= 360 };
    while (assembly.rotation.z > 360) { assembly.rotation.z -= 360 };

    input1 = clip(input1Input.value, input1Min, input1Max);
    input1Input.value = Math.round(input1 * 100) / 100;
    input2 = input2Input.checked;

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
    targetRot = input2 ? targetRot - Math.PI : targetRot;
    targetRot %= Math.PI;
}
