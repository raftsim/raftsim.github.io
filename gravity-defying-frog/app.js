import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import { STLLoader } from 'https://unpkg.com/three/examples/jsm/loaders/STLLoader.js';

import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var container;

var camera, scene, renderer, controls;

var base, frog;

var rightHand, leftHand, rightFoot, leftFoot;

var xMove, yMove, zMove;

let move = new THREE.Euler3(0.68 - Math.PI/2, 0, 0);

let tRate = 100;

var t = 0;

var xRate = 0;
var yRate = 0;
var zRate = 0;

let targetPos = new THREE.Vector3(0, 0, 0);

let tfRightHand = document.getElementById("rightHand");
let tfLeftHand = document.getElementById("leftHand");
let tfRightFoot = document.getElementById("rightFoot");
let tfLeftFoot = document.getElementById("leftFoot");


init();
animate();

function init() {

    container = document.createElement('div');
    container.id = "container";
    document.body.appendChild(container);

    let btSubmit = document.getElementById("submit");
    btSubmit.onclick = submitInputs;

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 200;
    camera.position.y = 200;
    camera.position.x = -200;

    // scene

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);

    var loader = new STLLoader();

    var material = new THREE.MeshPhongMaterial({ color: 0xffffff });

    loader.load('objects/base.stl', function (geometry) {

        base = new THREE.Mesh(geometry, material);
        base.position.x = 6;
        base.position.y = -55;
        base.position.z = 10;

        base.rotation.x = -Math.PI / 2;

        scene.add(base);
    });

    loader.load('objects/frog.stl', function (geometry) {

        console.log('big sur is cool');

        frog = new THREE.Mesh(geometry, material);
        resetFrog();
        frog.rotation.z = 0;
        frog.rotation.y = 0;
        frog.rotation.x = 0.68 - Math.PI / 2;

        zMove = 0;
        yMove = 0;
        xMove = 0.68 - Math.PI / 2;
        scene.add(frog);

        console.log('catalina sucks');

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

let threshold = 0.01;

function render() {

    // TODO: Change camera target here

    controls.target.set(targetPos.x, targetPos.y, targetPos.z);

    if (frog != undefined && t < tRate) {
        console.log(frog.rotation);
        frog.rotation.x += xRate;
        frog.rotation.y += yRate;
        frog.rotation.z += zRate;
        t++;
    }

    renderer.render(scene, camera);
}

function resetFrog() {
    // frog.rotation.z = 0;
    // frog.rotation.y = 0;
    // frog.rotation.x = 0.68 - Math.PI / 2;

    xMove = 0.68 - Math.PI / 2;
    yMove = 0;
    zMove = 0;

    t = 0;
}

function paperclips(lh, rh, ll, rl) {
    let xLim = 1;
    let yLim = 0.69;
    let zLim = 0.95;

    xMove = clip(( /* xMove + */ 0.68 - Math.PI / 2 + 0.113 * (-rh - lh) + 0.68 * (rl - ll)), -xLim, xLim);
    yMove = clip(( /* yMove + */ 0.3 * (rh - lh + ll + rl)), -yLim, yLim);
    zMove = clip(( /* zMove + */ 0.1 * (lh - rh) + 0.3 * (rl - ll)), -zLim, zLim);
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
    resetFrog();

    rightHand = Math.round(tfRightHand.value);
    leftHand = Math.round(tfLeftHand.value);
    rightFoot = Math.round(tfRightFoot.value);
    leftFoot = Math.round(tfLeftFoot.value);

    paperclips(leftHand, rightHand, leftFoot, rightFoot);

    xRate = xMove / tRate;
    yRate = yMove / tRate;
    zRate = zMove / tRate;

    sendValues();
}

function sendValues() {
    tfRightHand.value = rightHand;
    tfLeftHand.value = leftHand;
    tfRightFoot.value = rightFoot;
    tfLeftFoot.value = leftFoot;
}