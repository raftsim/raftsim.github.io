import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { STLLoader } from 'https://unpkg.com/three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var container;
var camera, scene, renderer, controls;
var assembly;

let targetPos = new THREE.Vector3(0, 0, 0);

var input1, input2;

let input1Min = 0;
let input1Max = 99;

let input2Min = 100;
let input2Max = 199;

let input1Input = document.getElementById("input1");
let input2Input = document.getElementById("input2");

var output = "";

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

    var loader = new STLLoader();

    var material = new THREE.MeshPhongMaterial({ color: 0xffffff });

    loader.load('objects/assembly.stl', function (geometry) {

        assembly = new THREE.Mesh(geometry, material);
        scene.add(assembly);

    });

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

    renderer.render(scene, camera);
}

function clip(input, limit1, limit2) {
    if (limit1 != null && input < limit1) {
        return limit1;
    } else if (limit2 != null && input > limit2) {
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

function sendOutput() {
    document.getElementById("output-text").style.visibility = "visible";
    document.getElementById("output").innerText = output;
}