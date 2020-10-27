import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import { OBJLoader } from 'https://unpkg.com/three/examples/jsm/loaders/OBJLoader.js';

import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var container;

var camera, scene, renderer, controls;

var templateStick, sticks, group;

let targetPos = new THREE.Vector3(0, 0, 0);

init();
animate();

function init() {

    container = document.createElement('div');
    container.id = "container";
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 200;
    camera.position.y = 200;
    camera.position.x = 200;
    
    // scene

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);

    // manager

    function loadModel() {

        //scene.add(templateStick);
        sticks = [];
        createSticks();
        //can we add those to the group since those were defaults
        //scene.add(sticks[1]);

    }

    var manager = new THREE.LoadingManager(loadModel);

    manager.onProgress = function (item, loaded, total) {

        console.log(item, loaded, total);

    };

    // model

    function onProgress(xhr) {

        if (xhr.lengthComputable) {

            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log('model ' + Math.round(percentComplete, 2) + '% downloaded');

        }

    }

    function onError() { }

    {
        var loader = new OBJLoader(manager);

        loader.load('objects/stick.obj', function (obj) { // EXAMPLE CODE
          
            templateStick = obj;

        }, onProgress, onError);
    }

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

// is there a way to change the point of origion of the camera
function createSticks() {
scene.remove (group);
    /* for (var i = 0; i < sticks.length; i++) {
        scene.remove(sticks[i]);
    } */
    group = new THREE.Group();
    sticks = [];

    for (var i = 0; i < 18; i++) {
        var newStick = templateStick.clone(true);
        newStick.position.x = 230 * (i + 1);

        sticks.push(newStick);
        //console.log(sticks[i].position.x);
        group.add(sticks[i]);
    }

    sticks[14].position.x = 0;

    sticks[0].position.x = -115;
    sticks[0].position.z += -6.35;
    sticks[0].rotation.y -= 0.07;

    sticks[1].rotation.z += 1.5707963268;
    sticks[1].position.x = 0;
    sticks[1].position.y += 101.5;
    sticks[1].position.z += -3.175;

    sticks[2].rotation.z += 1.5707963268;
    sticks[2].position.x = 0;
    sticks[2].position.y -= 101.5;
    sticks[2].position.z += -3.175;

    sticks[3].position.x = 115;
    sticks[3].position.z += -6.35;
    sticks[3].rotation.y += 0.07;

    sticks[4].rotation.z += 1.5707963268;
    sticks[4].position.x = 115;
    sticks[4].position.y += 74.5;
    sticks[4].position.z -= 12;
    sticks[4].rotation.y += 0.145;

    sticks[5].rotation.z += 1.5707963268;
    sticks[5].position.x = 115;
    sticks[5].position.y -= 74.5;
    sticks[5].position.z -= 12;
    sticks[5].rotation.y += 0.145;

    sticks[6].rotation.z += 1.5707963268;
    sticks[6].position.x = -115;
    sticks[6].position.y -= 74.5;
    sticks[6].position.z -= 12;
    sticks[6].rotation.y += -0.145;

    sticks[7].rotation.z += 1.5707963268;
    sticks[7].position.x = -115;
    sticks[7].position.y += 74.5;
    sticks[7].position.z -= 12;
    sticks[7].rotation.y += -0.145;

    sticks[8].position.x = -230;
    sticks[8].position.z += -6.35;
    sticks[8].position.z -= 26;
    sticks[8].rotation.y += -0.145;

    sticks[9].rotation.z += 1.5707963268;
    sticks[9].position.x = -230;
    sticks[9].position.y += 101.5;
    sticks[9].position.z += -38.5;
    sticks[9].rotation.y += -0.34;

    sticks[10].rotation.z += 1.5707963268;
    sticks[10].position.x = -230;
    sticks[10].position.y -= 101.5;
    sticks[10].position.z += -38.5;
    sticks[10].rotation.y += -0.34;

    sticks[11].position.x = -345;
    sticks[11].position.z += -6.35;
    sticks[11].position.z -= 77;
    sticks[11].rotation.y += -0.4;

    sticks[12].rotation.z += 1.5707963268;
    sticks[12].position.x = -331.5;
    sticks[12].position.y -= 74.5;
    sticks[12].position.z -= 81;
    sticks[12].rotation.y += -0.515;

    sticks[13].rotation.z += 1.5707963268;
    sticks[13].position.x = -331.5;
    sticks[13].position.y += 74.5;
    sticks[13].position.z -= 81;
    sticks[13].rotation.y += -0.515;

    sticks[15].position.x = 230;
    sticks[15].position.z += -6.35;
    sticks[15].position.z -= 26;
    sticks[15].rotation.y += 0.145;
    group.rotation.x -= 1.5707963268;
    scene.add(group);

    sticks[16].rotation.z += 1.5707963268;
    sticks[16].position.x = 230;
    sticks[16].position.y += 101.5;
    sticks[16].position.z += -38.5;
    sticks[16].rotation.y += 0.34;

    sticks[17].rotation.z += 1.5707963268;
    sticks[17].position.x = 230;
    sticks[17].position.y -= 101.5;
    sticks[17].position.z += -38.5;
    sticks[17].rotation.y += 0.34;
}
// 0.25 kg - decreases by abt 30%
// 0.5kg - decreases by abt 50%
// 0.75kg - decreases by abt 70%
//1kg - brings the whole thing down
function animate() {

    requestAnimationFrame(animate);
    controls.update();
    render();

}

function render() {
    
    // thank u sir
    targetPos.x = -57.5;
    targetPos.z = -6.35;
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
