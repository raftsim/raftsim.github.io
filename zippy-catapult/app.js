import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import { OBJLoader } from 'https://unpkg.com/three/examples/jsm/loaders/OBJLoader.js';

var container;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var mouseFactor = 0.02;
var speedFactor = 0.05;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var assembly;
var spoon;
var straw1;
var straw2;

let spoonAngleMin = 0;
var spoonAngle = Math.PI / 4;
var spoonAnglePercent = 50;
let spoonAngleMax = Math.PI * 0.47;
let spoonAngleFactor = 0.01;
let spoonAnglePercentFactor = 0.01;
var spoonUpward = true;

let strawYMin = -3.45;
var strawY = -2;
var strawYPercent = 50;
let strawYMax = -0.55;
let strawYFactor = 0.01;
let strawYPercentFactor = 0.01;
var strawUpward = true;

init();
animate();


function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 10;

    // scene

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);

    // manager

    function loadModel() {

        /* assembly.traverse(function (child) {

            // if (child.isMesh) child.material.map = texture;

        }); */

        assembly.position.y = -2;
        scene.add(assembly);

        {
            spoon.position.x = 0;
            spoon.position.y = 0.56 * Math.sin(spoonAngle) - 2;
            spoon.position.z = 0.56 * Math.cos(spoonAngle);

            spoon.rotation.x = -spoonAngle;
            spoon.rotation.y = -Math.PI / 2;
            spoon.rotation.z = -Math.PI / 2;
            scene.add(spoon);
        }

        {
            straw1.position.x = 3.12;
            straw1.position.y = strawY;
            straw1.position.z = 0;

            straw1.rotation.x = 0;
            straw1.rotation.y = 0;
            straw1.rotation.z = Math.PI / 2;

            scene.add(straw1);
        }

        {
            straw2.position.x = -3.12;
            straw2.position.y = strawY;
            straw2.position.z = 0;

            straw2.rotation.x = 0;
            straw2.rotation.y = 0;
            straw2.rotation.z = Math.PI / 2;

            scene.add(straw2);
        }
    }

    var manager = new THREE.LoadingManager(loadModel);

    manager.onProgress = function (item, loaded, total) {

        console.log(item, loaded, total);

    };

    // texture

    // var textureLoader = new THREE.TextureLoader(manager);

    // var texture = textureLoader.load('textures/uv_grid_opengl.jpg');

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

        loader.load('assembly.obj', function (obj) {

            assembly = obj;

        }, onProgress, onError);

        loader.load('spoon.obj', function (obj) {

            spoon = obj;

        }, onProgress, onError);

        loader.load('straw.obj', function (obj) {

            straw1 = obj;

        }, onProgress, onError);

        loader.load('straw.obj', function (obj) {

            straw2 = obj;

        }, onProgress, onError);
    }

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    //

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {

    mouseX = (event.clientX - windowHalfX) / 2;
    mouseY = (event.clientY - windowHalfY) / 2;

}

//

function animate() {

    requestAnimationFrame(animate);
    render();

}

function render() {

    camera.position.x += (mouseX * mouseFactor - camera.position.x) * speedFactor;
    camera.position.y += (- mouseY * mouseFactor - camera.position.y) * speedFactor;

    camera.lookAt(scene.position);

    {
        if (strawY <= strawYMin) {
            strawUpward = true;
        } else if (strawY >= strawYMax) {
            strawUpward = false;
        }

        if (strawUpward) {
            strawY += strawYFactor
        } else {
            strawY -= strawYFactor
        }

        straw1.position.y = strawY;
        straw2.position.y = strawY;
    }

    {
        console.log(spoonAngle);
        if (spoonAngle <= spoonAngleMin) {
            spoonUpward = true;
            console.log(false);
        } else if (spoonAngle >= spoonAngleMax) {
            spoonUpward = false;
            console.log(true);
        }

        if (spoonUpward) {
            spoonAngle += spoonAngleFactor
        } else {
            spoonAngle -= spoonAngleFactor
        }

        spoon.position.y = 0.56 * Math.sin(spoonAngle) - 2;
        spoon.position.z = 0.56 * Math.cos(spoonAngle);

        spoon.rotation.x = -spoonAngle;
    }

    renderer.render(scene, camera);
}