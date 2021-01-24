import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import { OBJLoader } from 'https://unpkg.com/three/examples/jsm/loaders/OBJLoader.js';

import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var container;

var camera, scene, renderer, controls;

var templateStick, sticks, group, templateWeight, weights;

let targetPos = new THREE.Vector3(0, 0, 0);

var input1;
let input1Min = 0;
let input1Input = document.getElementById("input1");

let blockWeight = 0.5;
let bridgeWeight = 0.22;

init();
animate();

function init() {

    container = document.createElement('div');
    container.id = "container";
    document.body.appendChild(container);

    var submitInputsButton = document.getElementById("submit");
    submitInputsButton.onclick = submitInputs;

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

        sticks = [];
        weights = [];
        createSticks();

    }

    var manager = new THREE.LoadingManager(loadModel);

    manager.onProgress = function (item, loaded, total) {

        console.log(item, loaded, total);

    };

    function onProgress(xhr) {

        if (xhr.lengthComputable) {

            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log('model ' + Math.round(percentComplete, 2) + '% downloaded');

        }

    }

    function onError() { }

    {
        var loader = new OBJLoader(manager);

        loader.load('objects/stick.obj', function (obj) {

            templateStick = obj;

        }, onProgress, onError);
        loader.load('objects/weight.obj', function (obj) {

            templateWeight = obj;

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

function createSticks() {
    scene.remove(group);

    group = new THREE.Group();
    sticks = [];

    for (var i = 0; i < 21; i++) {
        var newStick = templateStick.clone(true);
        newStick.position.x = 230 * (i + 1);

        sticks.push(newStick);
        group.add(sticks[i]);
    }

    resetSticks();

    group.rotation.x = -1.5707963268;
    scene.add(group);
}

function resetSticks() {
    
    sticks[0].position.x = -115;
    sticks[0].position.z = -6.35;
    sticks[0].rotation.y = -0.07;
    
    sticks[1].rotation.z = 1.5707963268;
    sticks[1].position.x = 0;
    sticks[1].position.y = 101.5;
    sticks[1].position.z = -3.175;
    
    sticks[2].rotation.z = 1.5707963268;
    sticks[2].position.x = 0;
    sticks[2].position.y = -101.5;
    sticks[2].position.z = -3.175;
    
    sticks[3].position.x = 115;
    sticks[3].position.z = -6.35;
    sticks[3].rotation.y = 0.07;
    
    sticks[4].rotation.z = 1.5707963268;
    sticks[4].position.x = 115;
    sticks[4].position.y = 74.5;
    sticks[4].position.z = -12;
    sticks[4].rotation.y = 0.145;
    
    sticks[5].rotation.z = 1.5707963268;
    sticks[5].position.x = 115;
    sticks[5].position.y = -74.5;
    sticks[5].position.z = -12;
    sticks[5].rotation.y = 0.145;
    
    sticks[6].rotation.z = 1.5707963268;
    sticks[6].position.x = -115;
    sticks[6].position.y = -74.5;
    sticks[6].position.z = -12;
    sticks[6].rotation.y = -0.145;
    
    sticks[7].rotation.z = 1.5707963268;
    sticks[7].position.x = -115;
    sticks[7].position.y = 74.5;
    sticks[7].position.z = -12;
    sticks[7].rotation.y = -0.145;
    
    sticks[8].position.x = -230;
    sticks[8].position.z = -6.35;
    sticks[8].position.z = -26;
    sticks[8].rotation.y = -0.145;
    
    sticks[9].rotation.z = 1.5707963268;
    sticks[9].position.x = -230;
    sticks[9].position.y = 101.5;
    sticks[9].position.z = -38.5;
    sticks[9].rotation.y = -0.34;
    
    sticks[10].rotation.z = 1.5707963268;
    sticks[10].position.x = -230;
    sticks[10].position.y = -101.5;
    sticks[10].position.z = -38.5;
    sticks[10].rotation.y = -0.34;
    
    sticks[11].position.x = -345;
    sticks[11].position.z = -6.35;
    sticks[11].position.z = -77;
    sticks[11].rotation.y = -0.4;
    
    sticks[12].rotation.z = 1.5707963268;
    sticks[12].position.x = -331.5;
    sticks[12].position.y = -74.5;
    sticks[12].position.z = -81;
    sticks[12].rotation.y = -0.515;
    
    sticks[13].rotation.z = 1.5707963268;
    sticks[13].position.x = -331.5;
    sticks[13].position.y = 74.5;
    sticks[13].position.z = -81;
    sticks[13].rotation.y = -0.515;
    
    sticks[14].position.x = 0;
    sticks[14].position.z = 0;
    
    sticks[15].position.x = 230;
    sticks[15].position.z = -6.35;
    sticks[15].position.z = -26;
    sticks[15].rotation.y = 0.145;

    sticks[16].rotation.z = 1.5707963268;
    sticks[16].position.x = 230;
    sticks[16].position.y = 101.5;
    sticks[16].position.z = -38.5;
    sticks[16].rotation.y = 0.34;

    sticks[17].rotation.z = 1.5707963268;
    sticks[17].position.x = 230;
    sticks[17].position.y = -101.5;
    sticks[17].position.z = -38.5;
    sticks[17].rotation.y = 0.34;

    sticks[18].position.x = 345;
    sticks[18].position.z = -6.35;
    sticks[18].position.z = -77;
    sticks[18].rotation.y = 0.4;

    sticks[19].rotation.z = -1.5707963268;
    sticks[19].position.x = 331.5;
    sticks[19].position.y = -74.5;
    sticks[19].position.z = -81;
    sticks[19].rotation.y = 0.515;

    sticks[20].rotation.z = -1.5707963268;
    sticks[20].position.x = 331.5;
    sticks[20].position.y = 74.5;
    sticks[20].position.z = -81;
    sticks[20].rotation.y = 0.515;
}

// 0.25 kg - decreases by abt 30%
// 0.5kg - decreases by abt 50%
// 0.75kg - decreases by abt 70%
// 1kg - brings the whole thing down
function animate() {

    requestAnimationFrame(animate);
    controls.update();
    render();

}

function render() {

    controls.target.set(targetPos.x, targetPos.y, targetPos.z);
    renderer.render(scene, camera);

}

function clip(input, limit1) {
    if (input < limit1) {
        return limit1;
    } else {
        return Math.floor(input);
    }
}

function submitInputs() {
    document.getElementById("output-text1").style.visibility = "hidden";
    document.getElementById("output-text2").style.visibility = "hidden";

    input1 = clip(input1Input.value, input1Min);

    sendValues();
}

function sendValues() {
    input1Input.value = Math.round(input1);
    changeBridge(input1);
}

function changeBridge(numBlocks) {
    var heightChange = 0;
    resetSticks();

    if (numBlocks == 1) {
        for (var i = 0; i < 21; i++) {
            sticks[i].position.z -= 30;
        }

        sticks[4].rotation.y -= 0.03625;
        sticks[4].position.z += 4.5;

        sticks[5].rotation.y -= 0.03625;
        sticks[5].position.z += 4.5;

        sticks[6].rotation.y += 0.03625;
        sticks[6].position.z += 4.5;

        sticks[7].rotation.y += 0.03625;
        sticks[7].position.z += 4.5;

        sticks[8].rotation.y += 0.03625;
        sticks[8].position.z += 9;

        sticks[9].rotation.y += 0.085;
        sticks[9].position.z += 7;

        sticks[10].rotation.y += 0.085;
        sticks[10].position.z += 7;

        sticks[11].rotation.y += 0.1;
        sticks[11].position.z += 19;

        sticks[12].rotation.y += 0.12875;
        sticks[12].position.z += 18;
        sticks[12].position.x -= 7;

        sticks[13].rotation.y += 0.12875;
        sticks[13].position.z += 18;
        sticks[13].position.x -= 7;

        sticks[15].rotation.y += -0.03625;
        sticks[15].position.z += 9;

        sticks[16].rotation.y -= 0.085;
        sticks[16].position.z += 7;

        sticks[17].rotation.y -= 0.085;
        sticks[17].position.z += 7;

        sticks[18].rotation.y -= 0.1;
        sticks[18].position.z += 19;

        sticks[19].rotation.y -= 0.12875;
        sticks[19].position.z += 18;
        sticks[19].position.x += 7;

        sticks[20].rotation.y -= 0.12875;
        sticks[20].position.z += 18;
        sticks[20].position.x += 7;

        heightChange = 31;
    } else if (numBlocks == 2) {
        for (var i = 0; i < 21; i++) {
            sticks[i].position.z -= 50;
        }

        sticks[4].rotation.y -= 0.0725;
        sticks[4].position.z += 5.5;

        sticks[5].rotation.y -= 0.0725;
        sticks[5].position.z += 5.5;

        sticks[6].rotation.y += 0.0725;
        sticks[6].position.z += 5.5;

        sticks[7].rotation.y += 0.0725;
        sticks[7].position.z += 5.5;

        sticks[8].rotation.y += 0.0725;
        sticks[8].position.z += 14;

        sticks[9].rotation.y += 0.17;
        sticks[9].position.z += 15;

        sticks[10].rotation.y += 0.17;
        sticks[10].position.z += 15;

        sticks[11].rotation.y += 0.2;
        sticks[11].position.z += 37.5;

        sticks[12].rotation.y += 0.2575;
        sticks[12].position.z += 37;
        sticks[12].position.x -= 7;

        sticks[13].rotation.y += 0.2575;
        sticks[13].position.z += 37;
        sticks[13].position.x -= 7;

        sticks[15].rotation.y += -0.0725;
        sticks[15].position.z += 14;

        sticks[16].rotation.y -= 0.17;
        sticks[16].position.z += 15;

        sticks[17].rotation.y -= 0.17;
        sticks[17].position.z += 15;

        sticks[18].rotation.y -= 0.2;
        sticks[18].position.z += 37.5;

        sticks[19].rotation.y -= 0.2575;
        sticks[19].position.z += 37;
        sticks[19].position.x += 7;

        sticks[20].rotation.y -= 0.2575;
        sticks[20].position.z += 37;
        sticks[20].position.x += 7;

        heightChange = 64;
    } else if (numBlocks == 3) {
        for (var i = 0; i < 21; i++) {
            sticks[i].position.z -= 75;
        }

        sticks[4].rotation.y -= 0.10875;
        sticks[4].position.z += 8;

        sticks[5].rotation.y -= 0.10875;
        sticks[5].position.z += 8;

        sticks[6].rotation.y += 0.10875;
        sticks[6].position.z += 8;

        sticks[7].rotation.y += 0.10875;
        sticks[7].position.z += 8;

        sticks[8].rotation.y += 0.10875;
        sticks[8].position.z += 20;

        sticks[9].rotation.y += 0.255;
        sticks[9].position.z += 26;

        sticks[10].rotation.y += 0.255;
        sticks[10].position.z += 26;

        sticks[11].rotation.y += 0.3;
        sticks[11].position.z += 59;

        sticks[12].rotation.y += 0.38625;
        sticks[12].position.z += 59;
        sticks[12].position.x -= 7;

        sticks[13].rotation.y += 0.38625;
        sticks[13].position.z += 58;
        sticks[13].position.x -= 7;

        sticks[15].rotation.y += -0.10875;
        sticks[15].position.z += 20;

        sticks[16].rotation.y -= 0.255;
        sticks[16].position.z += 26;

        sticks[17].rotation.y -= 0.255;
        sticks[17].position.z += 26;

        sticks[18].rotation.y -= 0.3;
        sticks[18].position.z += 59;

        sticks[19].rotation.y -= 0.38625;
        sticks[19].position.z += 59;
        sticks[19].position.x += 7;

        sticks[20].rotation.y -= 0.38625;
        sticks[20].position.z += 58;
        sticks[20].position.x += 7;

        heightChange = 100
    } else if (numBlocks >= 4) {
        for (var i = 0; i < 21; i++) {
            sticks[i].rotation.y = 0;
            sticks[i].position.z = -90;
        }

        sticks[1].position.z += -3.175;
        sticks[2].position.z += -3.175;
        sticks[9].position.z += -3.175;
        sticks[10].position.z += -3.175;
        sticks[16].position.z += -3.175;
        sticks[17].position.z += -3.175;

        sticks[0].position.z += 1.5875;
        sticks[14].position.z += 1.5875;
        sticks[3].position.z += -1.5875;
        sticks[8].position.z += -1.5875;
        sticks[11].position.z += -1.5875;
        sticks[15].position.z += -1.5875;
        heightChange = 137;
    }

    addWeight(numBlocks);

    document.getElementById("output1").innerText = Math.round(heightChange) / 10 + "cm";
    document.getElementById("output2").innerText = Math.round((100 * blockWeight * numBlocks) / bridgeWeight) / 100;
    document.getElementById("output-text1").style.visibility = "visible";
    document.getElementById("output-text2").style.visibility = "visible";

}

function addWeight(numBlocks) {
    weights.forEach(item => {
        group.remove(item);
    });

    weights = [];
    for (var i = 0; i < numBlocks; i++) {
        var newWeight = templateWeight.clone(true);
        newWeight.position.x = 0;
        newWeight.position.z = 25;
        newWeight.rotation.z = 1.5707963268;

        weights.push(newWeight);
        group.add(weights[i]);
    }

    var starty = -75;
    if (numBlocks >= 4) {
        var startz = -60;
    } else if (numBlocks == 3) {
        var startz = -47;
    } else if (numBlocks == 2) {
        var startz = -22
    } else if (numBlocks == 1) {
        var startz = -2;
    }

    for (var i = 0; i < (numBlocks / 4); i++) {
        for (var j = 0; j < 4; j++) {

            try {
                weights[(i * 4) + j].position.y = starty;
                weights[(i * 4) + j].position.z = startz;
                starty += 50;
            } catch (e) {
                console.log(e);
            }
        }
        startz += 50;
        starty = -75;
    }

    if (numBlocks % 4 == 1) {
        weights[numBlocks - 1].position.y = 0;
        if ((numBlocks / 4) > 1) {
            weights[numBlocks - 1].position.z -= 8;
        }
    }

    if (numBlocks % 4 == 2) {
        weights[numBlocks - 1].position.y = 25;
        weights[numBlocks - 2].position.y = -25;
    }

    if (numBlocks % 4 == 3) {
        weights[numBlocks - 1].position.y = 50;
        weights[numBlocks - 2].position.y = 0;
        weights[numBlocks - 3].position.y = -50;

        if ((numBlocks / 4) > 1) {
            weights[numBlocks - 1].position.z -= 8;
            weights[numBlocks - 2].position.z -= 8;
            weights[numBlocks - 3].position.z -= 8;
        }
    }
}