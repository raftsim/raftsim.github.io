import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import { STLLoader } from 'https://unpkg.com/three/examples/jsm/loaders/STLLoader.js';

import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var container;

var camera, scene, renderer, controls;

var assembly;

var rotations = 0;

var distTraveled = 0;

let targetPos = new THREE.Vector3(0, 0, 0);

let input1Min = 0;

let input1Input = document.getElementById("input1");

var x = 0;
var move = false;
let xReduction = 0.001;
var speed = 1;

let radius = 84.5;
let circumference = 2 * Math.PI * radius;

init();
animate();

function init() {

    container = document.createElement('div');
    container.id = "container";
    document.body.appendChild(container);

    var submitInputsButton = document.getElementById("submit");
    submitInputsButton.onclick = submitInputs;

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.x = 800;
    camera.position.y = 800;
    camera.position.z = 800;

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

    x -= xReduction;

    assembly.position.x = getPosition(x);
    setRotation();
    if (rotations <= (input1 * 2 * Math.PI)) {
        straw.rotation.y += 0.1;
        rotations += 0.1;
    }
    else if (rotations > (input1 * 2 * Math.PI) && input1 != null) {
        if (distTraveled >= (-2) * Math.PI * input1) {
            straw.position.x+=speed;
            assembly.position.x+=speed;
            assembly.rotation.z -= speed * 0.0156;
            distTraveled -= speed * 0.0156;
            
            if(speed>0){
                speed -= speedFac;
            }  
        }
    }
    if (move && assembly.position.x == 0) {
        document.getElementById("output").innerText = 0;
        document.getElementById("output-text").style.visibility = "visible";
    }

    renderer.render(scene, camera);
}

function getPosition(x) {
    let xFactor = 80 / 3;

    // x = 2 * x - 1;
    x *= Math.PI;

    x = clip(x, 0);
 
    // return xFactor * (((0.7 * x) ** 1.2) * Math.sin(x));
    return xFactor * (-x * Math.sin(2 * x));
}

function setRotation() {
    assembly.rotation.z = - (assembly.position.x % circumference) / (4 * Math.PI);
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

    x = clip(input1Input.value, input1Min) % 5;
    move = true;

    sendValues();
}

function sendValues() {
    input1Input.value = Math.round(x * 100) / 100;
}