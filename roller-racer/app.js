import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { STLLoader } from 'https://unpkg.com/three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var container;
var camera, scene, renderer, controls;
var assembly, straw;

var rotations = 0;
var distTraveled = 0;

let targetPos = new THREE.Vector3(0, 0, 50.5);

var input1;
let input1Min = 0;
let input1Max = 99;

var speedFac = 0;
var speed = 1;

let input1Input = document.getElementById("input1");

init();
animate();

function init() {

    container = document.createElement('div');
    container.id = "container";
    document.body.appendChild(container);

    var submitInputsButton = document.getElementById("submit");
    submitInputsButton.onclick = submitInputs;

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 300;
    camera.position.y = 200;

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

    loader.load('objects/straw.stl', function (geometry) {

        straw = new THREE.Mesh(geometry, material);
        straw.position.z = 113.625;
        straw.rotation.x = -Math.PI / 2;
        straw.rotation.y = Math.acos(64.25 / 145);
        straw.rotation.z = -Math.PI / 2;
        scene.add(straw);

    });

    const material2 = new THREE.LineBasicMaterial({
        color: 0xffffff
    });

    const points = [];
    points.push(new THREE.Vector3(0, -64.25, 100));
    points.push(new THREE.Vector3(0, -64.25, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material2);
    scene.add(line);

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

    if (rotations <= (input1 * 2 * Math.PI)) {
        straw.rotation.y += 0.1;
        rotations += 0.1;
    } else if (rotations > (input1 * 2 * Math.PI) && input1 != null) {
        if (straw.rotation.y % (2 * Math.PI) > Math.acos(64.25 / 145)) {
            straw.rotation.y -= 0.05;
            distTraveled -= 0.05;
        } else if (distTraveled >= (-2) * Math.PI * input1) {
            straw.position.x += speed;
            assembly.position.x += speed;
            assembly.rotation.z -= speed * 0.0156;
            distTraveled -= speed * 0.0156;

            if (speed > 0) {
                speed -= speedFac;
            }
        }
    }

    document.getElementById("output").innerText = Math.round(assembly.position.x) / 100 + " cm";
    targetPos.x = assembly.position.x / 2;
    controls.target.set(targetPos.x, targetPos.y, targetPos.z);

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

    document.getElementById("output-text").style.visibility = "visible";
    document.getElementById("output").innerText = 0;

    distTraveled = 0;
    rotations = 0;

    input1 = Number(clip(input1Input.value, input1Min, input1Max));
    speed = input1;
    speedFac = speed / (((2) * Math.PI * input1) / (0.0156));
    input1Input.value = Math.round(input1 * 100) / 100;

    assembly.position.x = 0;
    assembly.rotation.z = 0;
    straw.position.x = 0;
    straw.rotation.y = Math.acos(64.25 / 145);
}