import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import { OBJLoader } from 'https://unpkg.com/three/examples/jsm/loaders/OBJLoader.js';

import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var container;

var camera, scene, renderer, controls;
var balloon, base, group, plane;

var factor = 1;
var popped = false;
var ready = false;

var input1 = 0;
let input1Min = 0;
var pressure = 0;

let min = 0;
let max = 30;
let scale = 0;
let sf = 0.02;
var angle = 0;

let targetPos = new THREE.Vector3(0, 0, 0);
let speed = new THREE.Vector2(0, 0);

let input1Input = document.getElementById("input1");


init();
animate();
function init() {

    container = document.createElement('div');
    container.id = "container";
    document.body.appendChild(container);

    var submitInputsButton = document.getElementById("submit");
    submitInputsButton.onclick = submitInputs;

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 50000);
    camera.position.z = 500;
    camera.position.y = 500;
    camera.position.x = 500;

    // scene

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);


    var geometry = new THREE.PlaneGeometry(1000, 1000);
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    plane.rotation.x = Math.PI / 2;

    // manager

    function loadModel() {

        group = new THREE.Group();
        group.add(balloon);
        group.add(base);
        scene.add(group);
        balloon.visible = false;
    }

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

        loader.load('objects/balloon.obj', function (obj) {

            balloon = obj;

        }, onProgress, onError);

        loader.load('objects/base.obj', function (obj) {

            base = obj;

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

    if (!ready) {
        balloon.scale.x += sf;
        balloon.scale.y += sf;
        balloon.scale.z += sf;

        if (balloon.scale.x >= scale) { ready = true; }
    }

    if (!popped && ready) {
        pressure -= 0.01;

        if (pressure <= 0) {
            factor = 0.7;
            pressure = 0;
        }

        speed.x *= factor;
        speed.y *= factor;

        if (group.position.x > (500 - 63.5)) {
            speed.x = -Math.abs(speed.x);
        } else if (group.position.x < (63.5 - 500)) {
            speed.x = Math.abs(speed.x);
        }

        if (group.position.z > (500 - 63.5)) {
            speed.y = -Math.abs(speed.y);
        } else if (group.position.z < (63.5 - 500)) {
            speed.y = Math.abs(speed.y);
        }

        group.position.z += speed.y;
        group.position.x += speed.x;

        var scaleF = 2 * pressure / (max - min);
        balloon.scale.x = scaleF;
        balloon.scale.y = scaleF;
        balloon.scale.z = scaleF;
    }

    if (popped && ready) {
        balloon.visible = false;
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

    input1 = clip(input1Input.value, input1Min);

    factor = 1;
    pressure = input1;

    angle = Math.random() * Math.PI * 2;
    speed.x = pressure * (Math.cos(angle)) / 3.2;
    speed.y = pressure * (Math.sin(angle)) / 3.2;

    popped = pressure > max;
    if (pressure > 50) { pressure = 50; }
    scale = 2 * pressure / (max - min);

    ready = false;
    balloon.visible = true;

    balloon.scale.x = 0;
    balloon.scale.y = 0;
    balloon.scale.z = 0;

    sendValues();
}

function sendValues() {
    input1Input.value = Math.round(input1 * 100) / 100;
}