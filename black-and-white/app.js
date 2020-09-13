import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import { STLLoader } from 'https://unpkg.com/three/examples/jsm/loaders/STLLoader.js';

import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var container;

var camera, scene, renderer, controls;

var disk, knob, marble;

let targetPos = new THREE.Vector3(0, 0, 0);

init();
animate();

function init() {

    container = document.createElement('div');
    container.id = "container";
    document.body.appendChild(container);

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

    scene.background = new THREE.Color(0x7F4BC3);

    var loader = new STLLoader();

    var material = new THREE.MeshPhongMaterial({ color: 0xffffff });


    loader.load('objects/black-and-white-cd.stl', function (geometry) {

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
        map: THREE.ImageUtils.loadTexture('objects/benham-disk-pattern.jpg')
    });
    img.map.needsUpdate = true; //ADDED

    var plane = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), img);
    plane.overdraw = true;
    scene.add(plane);






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

function clip(input, limit1, limit2) {
    if (input < limit1) {
        return limit1;
    } else if (input > limit2) {
        return limit2;
    } else {
        return input;
    }
}
