import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import { OBJLoader } from 'https://unpkg.com/three/examples/jsm/loaders/OBJLoader.js';

import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var container;

var camera, scene, renderer, controls;

var balloon, base;

var input1;

var t = 0;

var angle = 0;
var speed = 0;

let input1Min = 0
let threshold = 100


let targetPos = new THREE.Vector3(0, 0, 0);
let input1Input = document.getElementById("input1");


init();
animate();
function init() {

    container = document.createElement('div');
    container.id = "container";
    document.body.appendChild(container);

    var submitInputsButton = document.getElementById("submit");
    submitInputsButton.onclick = submitInputs;

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 500;
    camera.position.y = 500;

    // scene

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);


    var geometry = new THREE.PlaneGeometry(1000, 1000);
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    var plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    plane.rotation.x = Math.PI / 2;

    // manager

    function loadModel() {

        scene.add(balloon);
        scene.add(base);
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

    // TODO: Change camera target here

    controls.target.set(targetPos.x, targetPos.y, targetPos.z);
    t++;
    if (t% threshold ==0 && input1 > 0) {
        input1--;
        speed--;
        angle = Math.random() * 2 * Math.PI;

console.log("hello")
console.log(angle)
    }

    base.position.x += Math.cos(angle) * 10;
    base.position.z += Math.sin(angle) * 10;
    console.log(base)
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
t = 0
    sendValues();
}

function sendValues() {
    input1Input.value = Math.round(input1 * 100) / 100;
}