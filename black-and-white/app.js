import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import { STLLoader } from 'https://unpkg.com/three/examples/jsm/loaders/STLLoader.js';

import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var container;

var camera, scene, renderer, controls;

var cutout, assembly, ttop, btop;

var angle = 0;
var input1 = 0;
var input2;
let input1Min = 0;
let input1Max = 3;

let input2Min = 100;
let input2Max = 199;

let input1Input = document.getElementById("input1");
let input2Input = document.getElementById("input2");

var rot = 0;

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
    //
    

    // scene

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);

    var loader = new STLLoader();

    var material = new THREE.MeshPhongMaterial({ color: 0xffffff });


    /* loader.load('objects/black-and-white-cd.stl', function (geometry) {

        disk = new THREE.Mesh(geometry, material);

        scene.add(disk);

    });

    loader.load('objects/black-and-white-knob.stl', function (geometry) {

        knob = new THREE.Mesh(geometry, material);

        scene.add(knob);

    });

    loader.load('objects/black-and-white-marble.stl', function (geometry) {

        marble = new THREE.Mesh(geometry, material);

        scene.add(marble);

    }); */
    loader.load('objects/assembly.stl', function (geometry) {

        assembly = new THREE.Mesh(geometry, material);
        assembly.rotation.x = -Math.PI
        scene.add(assembly);


    });
    loader.load('objects/cutout.stl', function (geometry) {

        cutout = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x000000 }));
        //scene.add(cutout);
        cutout.rotation.x = -Math.PI
        cutout.position.z -= 0.67;

    });

    /*     // instantiate a loader
        var image_loader = new THREE.ImageBitmapLoader();
    
        // set options if needed
        image_loader.setOptions({ imageOrientation: 'flipY' });
    
        // load a image resource
        image_loader.load(
            // resource URL
            'objects/benham-disk-pattern.png',
    
            // onLoad callback
            function (imageBitmap) {
                var texture = new THREE.CanvasTexture(imageBitmap);
                var img_material = new THREE.MeshBasicMaterial({ map: texture });
                var circle_geometry = new THREE.CircleGeometry(4, 132); // radius, number of triangles making up circle (res)
    
                var img = new THREE.Mesh(circle_geometry, img_material);
                img.position.y += 4;
    
                scene.add(img);
            },
    
            // onProgress callback currently not supported
            undefined,
    
            // onError callback
            function (err) {
                console.log('An error happened');
                console.log(err);
            }
        ); */

    var img = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
        map: THREE.ImageUtils.loadTexture('objects/benham-disk-pattern.png')
    });
    img.map.needsUpdate = true; //ADDED

    ttop = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), img);
    ttop.overdraw = true;
    ttop.position.z -= 7.8;
    scene.add(ttop);

    btop = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), img);
    btop.overdraw = true;
    btop.position.z -= 7.9;
    btop.rotation.y = Math.PI;
    btop.scale.x = -1;
    scene.add(btop);

    btop.rotation.x = -Math.PI
    ttop.rotation.x = -Math.PI

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
    /* controls.minPolarAngle = controls.minAzimuthAngle;
    controls.maxPolarAngle = controls.maxAzimuthAngle; */

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
    input1 = clip(Number(input1Input.value), input1Min, input1Max);
    input2 = clip(input2Input.value, input2Min, input2Max);
    angle = input1;
    sendValues();
}

function sendValues() {
    input1Input.value = Math.round(input1 * 100) / 100;
    input2Input.value = Math.round(input2 * 100) / 100;
}

function render() {

    controls.target.set(targetPos.x, targetPos.y, targetPos.z);
    
    rot += angle;
    if (rot > 2 * Math.PI)
    {
        rot -= (2 * Math.PI);
    }
    if (cutout != undefined && btop != undefined && ttop != undefined)
    {
        spin(rot);
    }
    if (angle > 0)
        angle -= 0.001;
    else
        angle = 0
    /* document.getElementById("x").innerText = camera.position.x;
    document.getElementById("y").innerText = camera.position.y;
    document.getElementById("z").innerText = camera.position.z; */
    renderer.render(scene, camera);
    
}

function spin (num)
{
    ttop.rotation.z = num;
    cutout.rotation.z = num;
    btop.rotation.z = (2 *Math.PI) - num;
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
