import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import { STLLoader } from 'https://unpkg.com/three/examples/jsm/loaders/STLLoader.js';

import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var container;

var camera, scene, renderer, controls;

var hot_cup, cold_cup, marble, test_tube, hbead, cbead;

let targetPos = new THREE.Vector3(0, 0, 0);

let coldTempInput = document.getElementById("coldTemp");
let hotTempInput = document.getElementById("hotTemp");
let salinityInput = document.getElementById("salinity");
//three.js library

init();
animate();

function init() {

    container = document.createElement('div');
    container.id = "container";
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.x = 0;
    camera.position.y = -274;
    camera.position.z = 55;

    var submitInputsButton = document.getElementById("submit");
    submitInputsButton.onclick = submitInputs;

    // scene

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);

    var loader = new STLLoader();

    var material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    var hotcupmat = new THREE.MeshPhongMaterial({ color: 0xffcccb, transparent: true, opacity: 0.4 });
    var colcupmat = new THREE.MeshPhongMaterial({ color: 0xb2ecff, transparent: true, opacity: 0.4 });
    var coltube = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
    var colmar = new THREE.MeshPhongMaterial({ color: 0xff0000, transparent: true, opacity: 0.6 });



    loader.load('objects/cup.stl', function (geometry) {

        hot_cup = new THREE.Mesh(geometry, hotcupmat);

        scene.add(hot_cup);

    });

    loader.load('objects/cup.stl', function (geometry) {

        cold_cup = new THREE.Mesh(geometry, colcupmat);

        scene.add(cold_cup);

    });

    loader.load('objects/marble.stl', function (geometry) {

        marble = new THREE.Mesh(geometry, colmar);

        scene.add(marble);

    });

    loader.load('objects/test_tube.stl', function (geometry) {

        test_tube = new THREE.Mesh(geometry, coltube);

        scene.add(test_tube);

    });

    loader.load('objects/waterbead.stl', function (geometry) {

        hbead = new THREE.Mesh(geometry, material);

        scene.add(hbead);

    });

    loader.load('objects/waterbead.stl', function (geometry) {

        cbead = new THREE.Mesh(geometry, material);

        scene.add(cbead);

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

function submitInputs() {
    hbead.scale.set = (2,2,2);
}

function render() {

    // TODO: Change camera target here

    controls.target.set(targetPos.x, targetPos.y, targetPos.z);

    // TODO: change object positions, rotations, states, etc here
    hot_cup.position.x = -80;
    cold_cup.position.x = -170;
    hot_cup.position.z = -40;
    cold_cup.position.z = -40;
    cold_cup.position.y = 0;
    hot_cup.position.y = 0;

    cbead.position.x = cold_cup.position.x;
    cbead.position.z = cold_cup.position.z + 1.5;

    hbead.position.x = hot_cup.position.x;
    hbead.position.z = hot_cup.position.z + 1.5;
    
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
