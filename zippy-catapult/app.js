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

var spoonAngleMin = 0;
var spoonAngle = Math.PI / 4;
var spoonAngle = Math.PI * 0.46;
var spoonAngleMax = Math.PI * 0.46;
let spoonAngleFactor = 0.01;
var spoonUpward = true;

var strawMin = 0;
var strawMax = 4 - (0.03937008 + 0.5635 + 0.5635);
var strawLength = strawMax;
let strawFactor = 0.01;
var strawUpward = true;

let movement = true;

init();
animate();


function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 10;
    /* camera.position.x = -15;
    camera.position.y = 2;
    camera.position.z = -0.25;
    camera.rotation.y = -Math.PI / 2; */

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

        scene.add(assembly);

        {
            spoon.position.x = 0;
            spoon.position.y = 0.5635 * Math.sin(spoonAngle) + 0.60287008;
            spoon.position.z = 0.5635 * Math.cos(spoonAngle);

            spoon.rotation.x = -spoonAngle;
            spoon.rotation.y = -Math.PI / 2;
            spoon.rotation.z = -Math.PI / 2;
            scene.add(spoon);
        }

        {
            straw1.position.x = 3.12;
            straw1.position.y = 0;
            straw1.position.z = 0;

            straw1.rotation.x = 0;
            straw1.rotation.y = 0;
            straw1.rotation.z = Math.PI / 2;

            scene.add(straw1);
        }

        {
            straw2.position.x = -straw1.position.x;
            straw2.position.y = straw1.position.y;
            straw2.position.z = straw1.position.z;

            straw2.rotation.x = straw1.rotation.x;
            straw2.rotation.y = straw1.rotation.y;
            straw2.rotation.z = straw1.rotation.z;

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

    if (movement) {
        {
            if (strawLength <= strawMin) {
                strawUpward = true;
            } else if (strawLength >= strawMax) {
                strawUpward = false;
            }

            if (strawUpward) {
                strawLength += strawFactor
            } else {
                strawLength -= strawFactor
            }
        }

        let assemblyAngle = Math.atan(strawLength / 4.871);
        assembly.rotation.x = -assemblyAngle;
        assembly.position.y = -4.871 * Math.sin(-assemblyAngle);
        assembly.position.z = 4.871 * Math.cos(assemblyAngle) - 4.871;

        straw1.rotation.x = -assemblyAngle;
        straw1.position.z = strawLength * strawLength / 4.871 + 1.3 * assembly.position.z

        straw2.rotation.x = straw1.rotation.x;
        straw2.position.z = straw1.position.z;

        {
            if (spoonAngle <= spoonAngleMin) {
                spoonUpward = true;
            } else if (spoonAngle >= spoonAngleMax) {
                spoonUpward = false;
            }

            if (spoonUpward) {
                spoonAngle += spoonAngleFactor
            } else {
                spoonAngle -= spoonAngleFactor
            }

            spoon.position.y = 0.5635 * Math.sin(spoonAngle + assemblyAngle) + 0.60287008 + assembly.position.y;
            spoon.position.z = 0.5635 * Math.cos(spoonAngle + assemblyAngle) + assembly.position.z;

            spoon.rotation.x = -spoonAngle - assemblyAngle;
        }
    }

    renderer.render(scene, camera);
}