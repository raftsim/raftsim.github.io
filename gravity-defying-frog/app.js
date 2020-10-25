import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import { STLLoader } from 'https://unpkg.com/three/examples/jsm/loaders/STLLoader.js';

import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var container;

var camera, scene, renderer, controls;

var base, frog;

var rightHand, leftHand, rightLeg, leftLeg;

let targetPos = new THREE.Vector3(0, 0, 0);

let tfRightHand = document.getElementById("rightHand");
let tfLeftHand = document.getElementById("leftHand");
let tfRightLeg = document.getElementById("rightLeg");
let tfLeftLeg = document.getElementById("leftLeg");

let btSubmit = document.getElementById("submit");

init();
animate();

function init() {

    container = document.createElement('div');
    container.id = "container";
    document.body.appendChild(container);

    btSubmit.onclick = submitInputs;

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

    loader.load('objects/base.stl', function (geometry) {

        base = new THREE.Mesh(geometry, material);
        base.position.x = 6;
        base.position.y = -10;
        base.position.z = -55;

        scene.add(base);
    });

    loader.load('objects/frog.stl', function (geometry) {
        
        frog = new THREE.Mesh(geometry, material);
        resetFrog();
        scene.add(frog);
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


function resetFrog() {
    frog.rotation.z = 0;
    frog.rotation.y = 0;
    frog.rotation.x = 0.68;
}

function onLeftHand() {
    frog.rotation.z = clipZ(frog.rotation.z + 0.3);
    frog.rotation.y = clipY(frog.rotation.y - 0.1);
    frog.rotation.x = clipX(frog.rotation.x - 0.113);
}

function onRightHand() {
    frog.rotation.z = clipZ(frog.rotation.z - 0.3);
    frog.rotation.y = clipY(frog.rotation.y + 0.1);
    frog.rotation.x = clipX(frog.rotation.x - 0.113);
}

function onLeftLeg() {
    frog.rotation.z = clipZ(frog.rotation.z + 0.3);
    frog.rotation.y = clipY(frog.rotation.y - 0.3);
    frog.rotation.x = clipX(frog.rotation.x + 0.68);
}

function onRightLeg() {
    frog.rotation.z = clipZ(frog.rotation.z + 0.3);
    frog.rotation.y = clipY(frog.rotation.y + 0.3);
    frog.rotation.x = clipX(frog.rotation.x + 0.68);
}






function clipX(xRotation) {
    if (xRotation < 0.69 && xRotation > -0.69){
        return xRotation;
    }
    if (xRotation < 0){
        return -0.69;
    }
    return 0.69;
}

function clipY(yRotation){
    if (yRotation < 0.95 && yRotation > -0.95){
        return yRotation;
    }
    if (yRotation < 0){
        return -0.95;
    }
    return 0.95;
}

function clipZ(zRotation) {
    if (zRotation < 1 && zRotation > -1){
        return zRotation;
    }
    if (zRotation < 0) {
        return -1;
    }
    return 1;
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
    rightHand = Math.round(tfRightHand.value);
    leftHand = Math.round(tfLeftHand.value);
    rightLeg = Math.round(tfRightLeg.value);
    leftLeg = Math.round(tfLeftLeg.value);
}