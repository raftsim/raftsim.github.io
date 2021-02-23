import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { STLLoader } from 'https://unpkg.com/three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var container;
var camera, scene, renderer, controls;
var assembly;

let targetPos = new THREE.Vector3(0, 0, 0);

var input1, input2;

let input1Min = 0;
let input1Max = 360;

let input1Input = document.getElementById("input1");
let input2Input = document.getElementById("input2");

var group = new THREE.Group();
var magnetNorth;
var magnetSouth;

var currentRot, assemblyRot, currentOrbit, targetOrbit;
var targetRot = 0;

init();
animate();

function init() {

    container = document.createElement('div');
    container.id = "container";
    document.body.appendChild(container);

    var submitInputsButton = document.getElementById("submit");
    submitInputsButton.onclick = submitInputs;

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.x = -6;
    camera.position.y = 12;
    camera.position.z = 12;

    // scene

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.4);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xFFFFFF, 0.8);
    camera.add(pointLight);
    scene.add(camera);

    let loader = new STLLoader();

    let materialWhite = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
    let materialRed = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
    let materialGray = new THREE.MeshBasicMaterial({ color: 0xAAAAAA });
    let lineMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF });

    loader.load('objects/assembly.stl', function (geometry) {

        assembly = new THREE.Mesh(geometry, materialWhite);
        scene.add(assembly);
        assembly.rotation.x = -Math.PI / 2;

    });

    loader.load('objects/magnet-north.stl', function (geometry) {

        magnetNorth = new THREE.Mesh(geometry, materialWhite);
        group.add(magnetNorth);

    });

    loader.load('objects/magnet-south.stl', function (geometry) {

        magnetSouth = new THREE.Mesh(geometry, materialRed);
        group.add(magnetSouth);
        magnetSouth.position.z = -1.99;

    });

    let unitCircleGroup = new THREE.Group();
    let unitCircleRadius = 5.99;

    var circleGeometry = new THREE.CircleGeometry(unitCircleRadius, 64);

    var circleTop = new THREE.Mesh(circleGeometry, materialGray);
    circleTop.rotation.x = -Math.PI / 2;
    circleTop.position.y = -0.01;

    var circleBottom = new THREE.Mesh(circleGeometry, materialGray);
    circleBottom.rotation.x = Math.PI / 2;
    circleBottom.position.y = circleTop.position.y;

    unitCircleGroup.add(circleTop);
    unitCircleGroup.add(circleBottom);

    var fontLoader = new THREE.FontLoader();
    fontLoader.load('https://unpkg.com/three/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        var degree = 0;
        var radian = 0;

        var textGroup = new THREE.Group();
        var textSettings = {
            font: font,
            size: 0.5,
            height: 0.1,
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 5
        }

        while (degree <= 330) {
            if (degree % 45 != 0 && degree % 30 != 0) {
                degree += 15;
            }
            radian = degree / 180 * Math.PI;

            if (degree < 180) {
                var linePoints = [];
                linePoints.push(new THREE.Vector3(unitCircleRadius * Math.cos(radian), 0, unitCircleRadius * Math.sin(radian)));
                linePoints.push(new THREE.Vector3(unitCircleRadius * Math.cos(radian + Math.PI), 0, unitCircleRadius * Math.sin(radian + Math.PI)));
                var lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
                var line = new THREE.Line(lineGeometry, lineMaterial);
                unitCircleGroup.add(line);
            }

            var textGeometry = new THREE.TextGeometry(degree + "°", textSettings);
            var textMesh = new THREE.Mesh(textGeometry, materialWhite);

            textMesh.position.y = -(unitCircleRadius + 1) * Math.cos(radian);
            textMesh.position.x = -(unitCircleRadius + 1) * Math.sin(radian);
            textMesh.rotation.z = -radian;

            textGroup.add(textMesh);

            degree += 15;
        }

        textGroup.rotation.x = Math.PI * 3 / 2;
        unitCircleGroup.add(textGroup);
    });

    unitCircleGroup.position.y = -0.1;
    scene.add(unitCircleGroup);

    // movement

    scene.add(group);
    group.position.z = 4;
    currentRot = group.rotation.y;
    currentOrbit = group.rotation.y;

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

function animate() {

    requestAnimationFrame(animate);
    controls.update();
    render();

}

function render() {

    controls.target.set(targetPos.x, targetPos.y, targetPos.z);

    var speed = 0.02;
    currentRot = group.rotation.y;
    assemblyRot = assembly.rotation.z;


    if (Math.abs(currentRot - targetRot) >= speed || Math.abs(assemblyRot - currentRot) >= speed) {
        if (Math.abs(currentRot - targetRot) >= speed) {

            if (currentRot > targetRot) {
                currentRot -= speed;
            } else if (currentRot < targetRot) {
                currentRot += speed;
            }

            group.rotation.y = currentRot;
        }

        if (Math.abs(assemblyRot - currentRot) >= speed) {

            if (assemblyRot > currentRot) {
                assemblyRot -= speed;
            } else if (assemblyRot < currentRot) {
                assemblyRot += speed;
            }

            assembly.rotation.z = assemblyRot;
        }
    } else if (Math.abs(currentOrbit - targetOrbit) >= speed) {

        if (currentOrbit > targetOrbit) {
            currentOrbit -= speed;
            currentRot -= speed;
            targetRot -= speed;
        } else if (currentOrbit < targetOrbit) {
            currentOrbit += speed;
            currentRot += speed;
            targetRot += speed;
        }

        group.rotation.y = currentRot;
        group.position.x = Math.sin(currentOrbit) * 4;
        group.position.z = Math.cos(currentOrbit) * 4;

    }

    renderer.render(scene, camera);
}

function clip(input, limit1) {
    if (input < limit1) {
        return limit1;
    } else {
        return input;
    }
}

function submitInputs() {
    while (currentOrbit > 360) { currentOrbit -= 360 };
    while (targetOrbit > 360) { targetOrbit -= 360 };
    while (currentRot > 360) { currentRot -= 360 };
    while (targetRot > 360) { targetRot -= 360 };
    while (group.rotation.y > 360) { group.rotation.y -= 360 };
    while (assembly.rotation.z > 360) { assembly.rotation.z -= 360 };

    input1 = clip(input1Input.value, input1Min, input1Max);
    input1Input.value = Math.round(input1 * 100) / 100;
    input2 = input2Input.checked;

    var rawDiff = input1 > currentOrbit ? input1 - currentOrbit : currentOrbit - input1;
    while (rawDiff > 360) { rawDiff -= 360 };
    var dist = rawDiff > 180 ? 360 - rawDiff : rawDiff;

    if (currentOrbit < 180) {
        if (input1 < currentOrbit + 180) {
            input1 = currentOrbit + dist;
        } else {
            input1 = currentOrbit - dist;
        }
    } else {
        if (input1 > currentOrbit - 180) {
            input1 = currentOrbit - dist;
        } else {
            input1 = currentOrbit + dist;
        }
    }

    targetOrbit = -1 * input1 * (Math.PI / 180);
    targetRot = input2 ? targetRot - Math.PI : targetRot;
}
