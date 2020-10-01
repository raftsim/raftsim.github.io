import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import { STLLoader } from 'https://unpkg.com/three/examples/jsm/loaders/STLLoader.js';

import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var container;

var camera, scene, renderer, controls, scale;

var assembly, templateRing, templatePill, rings, pills;

let targetPos = new THREE.Vector3(0, 0, 0);

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
    camera.position.y = 10;

    scale = 0.1;

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

        assembly.rotation.x = Math.PI / 2;
        assembly.scale.x = scale;
        assembly.scale.y = scale;
        assembly.scale.z = scale;
    });

    rings = [];

    loader.load('objects/ring.stl', function (geometry) {

        templateRing = (new THREE.Mesh(geometry, material));

        templateRing.scale.x = scale;
        templateRing.scale.y = scale;
        templateRing.scale.z = scale;

    });

    pills = [];

    loader.load('objects/pill.stl', function (geometry) {

        templatePill = (new THREE.Mesh(geometry, material));

        templatePill.scale.x = scale;
        templatePill.scale.y = scale;
        templatePill.scale.z = scale;

        templatePill.rotation.x = Math.PI / 2;
    });



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
    if (input < limit1) {
        return limit1;
    } else if (input > limit2) {
        return limit2;
    } else {
        return input;
    }
}

function createPills(numberOfPills) {

    for (var i = 0; i < pills.length; i++) {
        scene.remove(pills[i]);
    }

    pills = [];

    console.log("Created empty pills");

    for (var i = 0; i < numberOfPills; i++) {
        var newPill = templatePill.clone(false);
        newPill.position.x = 10 * (i + 1);

        newPill.scale.x = scale;
        newPill.scale.y = scale;
        newPill.scale.z = scale;

        newPill.rotation.x = Math.PI / 2;


        pills.push(newPill);

        scene.add(pills[i]);
        console.log("Created pill");
    }
}

function submitInputs() {
    createPills(3);
}