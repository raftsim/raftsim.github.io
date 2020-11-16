import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import { OBJLoader } from 'https://unpkg.com/three/examples/jsm/loaders/OBJLoader.js';

import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var container;

var camera, scene, renderer, controls;

var sliderL, sliderR, topStick, botStick, rubberBand, miniLeft, miniRight;

let targetPos = new THREE.Vector3(0, 0, 0);

var input1, input2;

let input1Min = 0;
let input1Max = 99;

let input2Min = 100;
let input2Max = 199;

let input1Input = document.getElementById("input1");
let input2Input = document.getElementById("input2");

//

init();
animate();

function init() {

    container = document.createElement('div');
    container.id = "container";
    document.body.appendChild(container);
    
    var submitInputsButton = document.getElementById("submit");
    submitInputsButton.onclick = submitInputs;

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.y = 35;
    camera.position.z = 100;


    // scene

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);

    // manager

    function loadModel() {

        scene.add(sliderL);
        sliderL.rotation.z = Math.PI/2;
        sliderL.position.x = -38;

        scene.add(sliderR);
        sliderR.rotation.z = Math.PI/2;
        sliderR.position.x = 38;

        scene.add(miniLeft);
        miniLeft.rotation.y = Math.PI/2;
        miniLeft.position.y = -0.5;
        miniLeft.position.x = -58;
        
        scene.add(miniRight);
        miniRight.rotation.y = Math.PI/2;
        miniRight.position.y = -0.5;
        miniRight.position.x = 58;
        
        scene.add(rubberBand);
        rubberBand.rotation.y = Math.PI/2;

        scene.add(topStick);

        scene.add(botStick);
        botStick.position.y = -2;

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

        loader.load('objects/mini rubber band.obj', function (obj) {

            miniLeft = obj;

        }, onProgress, onError);

        loader.load('objects/mini rubber band.obj', function (obj) {

            miniRight = obj;

        }, onProgress, onError);

        loader.load('objects/slider.obj', function (obj) {

            sliderL = obj;
        }, onProgress, onError);
        

        loader.load('objects/slider.obj', function (obj) {

            sliderR = obj;

        }, onProgress, onError);

        loader.load('objects/rubber band.obj', function (obj) {

            rubberBand = obj;

        }, onProgress, onError);

        loader.load('objects/stick.obj', function (obj) {

            topStick = obj;

        }, onProgress, onError);

        loader.load('objects/stick.obj', function (obj) {

            botStick = obj;

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

    // TODO: change object positions, rotations, states, etc here
    console.log(camera.position);
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

function submitInputs() {
    document.getElementById("output-text").style.visibility = "hidden";

    input1 = clip(input1Input.value, input1Min, input1Max);
    input2 = clip(input2Input.value, input2Min, input2Max);

    sendValues();
}

function sendValues() {
    input1Input.value = Math.round(input1 * 100) / 100;
    input2Input.value = Math.round(input2 * 100) / 100;
}