import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import { OBJLoader } from 'https://unpkg.com/three/examples/jsm/loaders/OBJLoader.js';

import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var container;

var camera, scene, renderer, controls;

var assembly;

let targetPos = new THREE.Vector3(0, 0, 0);

var material = new THREE.LineBasicMaterial({ color: 0xffffff });
var linePoints = [];
var line;

var angle = 0;
let angleIncrease = 0.2;

var radius = 1;

let radiusInput = document.getElementById("radius");
let rotationInput = document.getElementById("rotation");

var volume = 0;
let volumeFactor = 100

init();
animate();

function init() {

    container = document.createElement('div');
    container.id = "container";
    document.body.appendChild(container);

    var submitInputsButton = document.getElementById("submit");
    submitInputsButton.onclick = submitInputs;

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 20;
    camera.position.y = 2;

    // scene

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);

    // manager

    function loadModel() {

        scene.add(assembly);
        assembly.position.x = -3.078;
        assembly.position.z = -1.169;

    }

    linePoints.push(new THREE.Vector3(0, 0, 0));
    linePoints.push(new THREE.Vector3(radius, 0, 0));
    var geometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    line = new THREE.Line(geometry, material);
    scene.add(line);

    var manager = new THREE.LoadingManager(loadModel);

    manager.onProgress = function (item, loaded, total) {

        console.log(item, loaded, total);

    };

    // model

    function onProgress(xhr) {

        if (xhr.lengthComputable) {

            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log('model ' + Math.round(percentComplete, 2) + '% downloaded');

        }

    }

    function onError() { }

    {
        var loader = new OBJLoader(manager);

        loader.load('objects/assembly.obj', function (obj) { // EXAMPLE CODE

            assembly = obj;

        }, onProgress, onError);
    }

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

    sendValues();
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

    controls.target.set(targetPos.x, targetPos.y, targetPos.z);

    angle += angleIncrease;

    setPosition(radius, angle);

    volumeFactor = 200;

    volume = Math.round((radius ** 0.25) * ((angleIncrease * 2) ** 2.5) * volumeFactor * 10) / 10;

    document.getElementById("volume").innerText = volume;

    renderer.render(scene, camera);
}

function setPosition(r, angle) {
    var a = 3.078 + r;
    var b = 1.169;
    var c = Math.sqrt(Math.pow(b, 2) + Math.pow(a, 2));

    var angleBoost = Math.atan(b / a);

    assembly.position.x = Math.cos(angle - angleBoost) * (c)
    assembly.position.z = Math.sin(angle - angleBoost) * (c);
    assembly.rotation.y = -angle;

    linePoints[1].x = Math.cos(angle) * radius;
    linePoints[1].z = Math.sin(angle) * radius;
    line.geometry.setFromPoints(linePoints);
}

function submitInputs() {
    radius = clip(Number(radiusInput.value), 0);
    angleIncrease = clip(rotationInput.value * Math.PI / 180, 0);

    setPosition(radius, angle);
    sendValues();
    console.log(radius);
    console.log(angleIncrease);
}

function clip(input, limit) {
    if (input < limit) {
        return limit;
    } else {
        return input;
    }
}

function sendValues() {
    radiusInput.value = Math.round(radius * 100) / 100;
    rotationInput.value = Math.round(angleIncrease / Math.PI * 180 * 100) / 100;
}
