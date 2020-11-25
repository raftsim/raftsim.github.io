import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { STLLoader } from 'https://unpkg.com/three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var container;
var camera, scene, renderer, controls;
var disk;

var dis = 0.45;

let targetPos = new THREE.Vector3(0, 0, 0);

var stringPoints = [];
var string;

var twoPi = 6.283185307178467;

var count = 0;
var end = false;

var input1, input2;
var angleInc;
var draw = false;

var gapMin = 0;
let gapMax = 16;
var angle;

var tside = true;

var tgap = document.getElementById("tgap");
var bgap = document.getElementById("bgap");

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
    camera.position.z = 70;
    camera.position.y = 140;

    // scene

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);

    var loader = new STLLoader();
    var material = new THREE.MeshPhongMaterial({ color: 0xffffff });



    loader.load('objects/disk.stl', function (geometry) {
        disk = new THREE.Mesh(geometry, material);
        scene.add(disk);
        disk.position.y = 0.375;
        disk.rotation.x = Math.PI / 2;

    });

    stringPoints.push(new THREE.Vector3(46.5, dis, 0));
    var lineMat = new THREE.LineBasicMaterial({ color: 0xff48ff });
    var lineGeo = new THREE.BufferGeometry().setFromPoints(stringPoints);
    string = new THREE.Line(lineGeo, lineMat);
    scene.add(string);

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

function nextPoint(i) {
    var x = 46.5 * Math.cos(i);
    var z = 46.5 * -Math.sin(i);
    stringPoints.push(new THREE.Vector3(x, tside ? dis : -dis, z));
    stringPoints.push(new THREE.Vector3(x, tside ? -dis : dis, z));
    string.geometry.setFromPoints(stringPoints);
    if ((Math.round(i * 100) / 100) == 0) 
    {
        stringPoints.push(new THREE.Vector3(x, tside ? -5 : 5, z));
        string.geometry.setFromPoints(stringPoints);
        end = true;
    }
}


function render() {

    // TODO: Change camera target here

    controls.target.set(targetPos.x, targetPos.y, targetPos.z);
    if (draw) {
        if (!end) {
            if (tside) {
                angleInc = (input1 + 1) * Math.PI / 9;
            }
            else {
                angleInc = (input2 + 1) * Math.PI / 9;
            }
            angle += angleInc;
            angle = angle % (twoPi);
            nextPoint(angle);
            tside = !tside;
        }
        else 
        {
            draw = false;
        }

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

function submitInputs() {
    tside = true;
    draw = false;
    stringPoints.length = 0;
    stringPoints.push(new THREE.Vector3(46.5, dis, 0));
    string.geometry.setFromPoints(stringPoints);

    tgap = document.getElementById("tgap");
    bgap = document.getElementById("bgap");

    input1 = clip(Math.round(tgap.value), gapMin, gapMax);
    input2 = clip(Math.round(bgap.value), gapMin, gapMax);

    tgap.value = input1;
    bgap.value = input2;

    angle = 0;

    draw = true;
    end = false;
}

function sendOutput() {
    document.getElementById("output-text").style.visibility = "visible";
    document.getElementById("output").innerText = output;
}