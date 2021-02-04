import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { STLLoader } from 'https://unpkg.com/three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var container;
var camera, scene, renderer, controls;
var assembly, ttop, btop, img, imgCol, tilt;

let angleDec = 0.001;
let defAngleThres = 0.9;
var angleThres = defAngleThres;
let maxTilt = Math.atan(1 / 15) * 2
var tilt = 0;

var color = false;

var rot = 0;
var angle = 0;
var input1 = 0;
let input1Min = 0;
let input1Max = 3;

let input1Input = document.getElementById("input1");
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
    camera.position.z = -40;
    camera.position.y = -123;

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);

    let loader = new STLLoader();
    let tLoader = new THREE.TextureLoader();
    let material = new THREE.MeshPhongMaterial({ color: 0xffffff });

    img = new THREE.MeshBasicMaterial({
        map: tLoader.load('objects/benham-disk-pattern.png')
    });

    imgCol = new THREE.MeshBasicMaterial({
        map: tLoader.load('objects/benham-disk-pattern(col).png')
    });

    ttop = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), img);
    ttop.overdraw = true;
    ttop.position.z -= 7.8;
    scene.add(ttop);

    btop = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), img);
    btop.overdraw = true;
    btop.position.z -= 7.8;
    btop.rotation.y = Math.PI;
    btop.scale.x = -1;
    scene.add(btop);

    btop.rotation.x = -Math.PI;
    ttop.rotation.x = -Math.PI;

    loader.load('objects/assembly.stl', function (geometry) {
        assembly = new THREE.Mesh(geometry, material);
        assembly.rotation.x = -Math.PI
        scene.add(assembly);
        assembly.attach(btop);
        assembly.attach(ttop);
    });

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

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

function submitInputs() {
    input1 = clip(Number(input1Input.value), input1Min, input1Max);
    angle = input1;
    tilt = 0;
    angleThres = (angle < defAngleThres) ? angle : defAngleThres
    sendValues();
}

function sendValues() {
    input1Input.value = Math.round(input1 * 100) / 100;
}

function render() {

    controls.target.set(targetPos.x, targetPos.y, targetPos.z);

    if (angle >= angleThres && color == false) {
        ttop.material = imgCol;
        btop.material = imgCol;
        color = true;
    } else if (angle < angleThres && angle > 0) {
        if (color == true) {
            ttop.material = img;
            btop.material = img;
            color = false;
        }

        if (tilt < maxTilt) {
            tilt += maxTilt / (angleThres / angleDec);
        }
    }

    rot += angle;
    if (rot > 2 * Math.PI) {
        rot -= (2 * Math.PI);
    }

    if (assembly != undefined) {
        assembly.rotation.z = rot;
        assembly.rotation.x = tilt * Math.cos(rot) - Math.PI;
        assembly.rotation.y = tilt * Math.sin(rot);
    }

    if (angle > 0) {
        angle -= angleDec;
    } else {
        angle = 0;
    }

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
