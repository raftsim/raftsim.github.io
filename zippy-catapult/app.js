import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import { OBJLoader } from 'https://unpkg.com/three/examples/jsm/loaders/OBJLoader.js';

var container;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var mouseFactor = 0.4;
var speedFactor = 0.05;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var assembly;
var spoon;
var straw1;
var straw2;
var ball;

let spoonAngleMin = Math.PI * 0.04;
let spoonAngleDefaultMax = Math.PI * 0.5;
var spoonAngleMax = spoonAngleDefaultMax;
var spoonAngle = spoonAngleMax / 2;
var actualSpoonAngle;
let spoonAngleFactor = 0.01;
var spoonUpward = true;

let strawMin = 0;
let strawMax = 4 - (0.03937008 + 0.5635 + 0.5635);
var strawLength = strawMax / 2;
var actualStrawLength;
let strawFactor = 0.01;
var strawUpward = true;

let movement = false;
var glide = false;
let glideFactor = 0.05;
// let glideFactor = 1;
var positionSet = true;

let fixedCamera = false;

let timeFactor = 0.01;
var t = 0;
var v0x = 0;
var v0y = 0;
var vx = 0;
var vy = 0;
var ax = 0;
var ay = 0;

var x = 0;
var y = 0;

let targetPos = new THREE.Vector3(0, 0, 0);

var material = new THREE.LineBasicMaterial({ color: 0xffffff });
var linePoints1 = [];
var line1;

var linePoints2 = [];
var line2;

var mainPoints = [];
var mainLine;

var fontLoader = new THREE.FontLoader();
var mesh;

init();
animate();


function init() {

    container = document.createElement('div');
    container.id = "container";
    document.body.appendChild(container);

    var submitInputsButton = document.getElementById("submit");
    submitInputsButton.onclick = submitInputs;

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 20;
    camera.position.y = 2;
    if (fixedCamera) {
        camera.position.x = -15;
        camera.position.y = 20;
        camera.position.z = -0.25;
    }

    // scene

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);

    // manager

    function loadModel() {

        scene.add(assembly);

        {
            // spoon.position.x = 0.07;
            spoon.rotation.y = -Math.PI / 2;
            spoon.rotation.z = -Math.PI / 2;

            scene.add(spoon);
        }

        {
            straw1.position.x = 3.12;
            straw1.rotation.z = Math.PI / 2;

            scene.add(straw1);
        }

        {
            straw2.position.x = -straw1.position.x;
            straw2.rotation.z = straw1.rotation.z;

            scene.add(straw2);
        }

        {
            ball.position.y = spoon.position.y;
            ball.position.z = spoon.position.z;

            scene.add(ball);
        }
    }

    linePoints1.push(new THREE.Vector3(-1, 0, 0));
    linePoints1.push(new THREE.Vector3(1, 0, 0));
    var geometry1 = new THREE.BufferGeometry().setFromPoints(linePoints1);
    line1 = new THREE.Line(geometry1, material);
    scene.add(line1);

    linePoints2.push(new THREE.Vector3(-1, 0, 0));
    linePoints2.push(new THREE.Vector3(1, 0, 0));
    var geometry2 = new THREE.BufferGeometry().setFromPoints(linePoints2);
    line2 = new THREE.Line(geometry2, material);
    scene.add(line2);

    mainPoints.push(new THREE.Vector3(0, 0, 0));
    mainPoints.push(new THREE.Vector3(0, 0, 0));
    var mainGeometry = new THREE.BufferGeometry().setFromPoints(mainPoints);
    mainLine = new THREE.Line(mainGeometry, material);
    scene.add(mainLine);

    fontLoader.load('https://unpkg.com/three/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        var text = "Distance: " + (mainPoints[1].z - mainPoints[0].z);

        var geometry = new THREE.TextGeometry(text, {
            font: font,
            size: 1,
            height: 0.1,
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 5
        });

        mesh = new THREE.Mesh(geometry, material);

        mesh.rotation.x = Math.PI * 1.5;
        mesh.position.x = -5.75;
        mesh.visible = false;

        scene.add(mesh);
    });

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

        loader.load('assembly.obj', function (obj) {

            assembly = obj;

        }, onProgress, onError);

        loader.load('spoon.obj', function (obj) {

            spoon = obj;

        }, onProgress, onError);

        loader.load('straw.obj', function (obj) {

            straw1 = obj;

        }, onProgress, onError);

        loader.load('straw.obj', function (obj) {

            straw2 = obj;

        }, onProgress, onError);

        loader.load('ball.obj', function (obj) {

            ball = obj;

        }, onProgress, onError);
    }

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    //

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {

    mouseX = (event.clientX - windowHalfX) / 2;
    mouseY = (event.clientY - windowHalfY) / 2;

}

//

function animate() {

    requestAnimationFrame(animate);
    render();

}

function render() {

    if (!fixedCamera) {
        camera.position.x += (mouseX * mouseFactor - camera.position.x) * speedFactor;
        camera.position.y += (- mouseY * mouseFactor - camera.position.y) * speedFactor;
    }

    if (ball != null) {
        targetPos.z = (scene.position.z + ball.position.z) / 2;
    }

    camera.lookAt(targetPos);

    if (movement) {
        {
            if (strawLength <= strawMin) {
                strawUpward = true;
            } else if (strawLength >= strawMax) {
                strawUpward = false;
            }

            if (strawUpward) {
                strawLength += strawFactor
            } else {
                strawLength -= strawFactor
            }
        }

        {
            if (spoonAngle <= spoonAngleMin) {
                spoonUpward = true;
            } else if (spoonAngle >= spoonAngleMax) {
                spoonUpward = false;
            }

            if (spoonUpward) {
                spoonAngle += spoonAngleFactor
            } else {
                spoonAngle -= spoonAngleFactor
            }
        }
    } else if (ball != null && ball.position.y > 0 && positionSet) {
        console.log("here");
        if (mesh != undefined) {
            mesh.visible = false;
        }
        vx = v0x + ax * t;
        vy = v0y + ay * t;

        ball.position.z = x + t * 0.5 * (vx + v0x);
        ball.position.y = y + t * 0.5 * (vy + v0y);

        t += timeFactor;

        if (ball.position.z <= 0) {
            line1.visible = false;
            line2.visible = false;
            mainLine.visible = false;
        } else {
            line1.visible = true;
            line2.visible = true;
            mainLine.visible = true;

            linePoints2[0].z = ball.position.z;
            linePoints2[1].z = ball.position.z;
            mainPoints[1].z = ball.position.z;

            line2.geometry.setFromPoints(linePoints2);
            mainLine.geometry.setFromPoints(mainPoints);
        }
    } else if ((ball != null && ball.position.z > 1) && (mesh != null && !mesh.visible) && positionSet) {
        ball.position.y = 0;
        fontLoader.load('https://unpkg.com/three/examples/fonts/helvetiker_regular.typeface.json', function (font) {
            var text = "Distance: " + (Math.round((mainPoints[1].z - mainPoints[0].z) * 100) / 100);

            var geometry = new THREE.TextGeometry(text, {
                font: font,
                size: 1,
                height: 0.1,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 1,
                bevelSize: 1,
                bevelOffset: 0,
                bevelSegments: 5
            });

            mesh.geometry = geometry;

            mesh.rotation.x = Math.PI * 1.5;
            mesh.position.x = -6;
            mesh.position.z = targetPos.z;
            mesh.visible = true;
        });
    }

    setPositions();
    renderer.render(scene, camera);
}

function setPositions() {
    // console.log("text");
    if (assembly != null && straw1 != null && straw2 != null && spoon != null && ball != null) {
        if (glide) {
            let assemblyAngle = -Math.atan(strawLength / 4.871);
            if (Math.abs(assembly.rotation.x - assemblyAngle) > 0.1) {
                let a = assembly.rotation.x + Math.round((assemblyAngle - assembly.rotation.x) * glideFactor * 100) / 100;
                let s = actualSpoonAngle + Math.round((spoonAngle - actualSpoonAngle) * glideFactor * 100) / 100;
                let l = actualStrawLength + Math.round((strawLength - actualStrawLength) * glideFactor * 100) / 100;

                console.log(Math.abs(assembly.rotation.x - assemblyAngle));

                setPosition(a, s, l);
                positionSet = false;
            } else {
                positionSet = true;
            }
        } else {
            let assemblyAngle = -Math.atan(strawLength / 4.871);
            setPosition(assemblyAngle, spoonAngle, strawLength);
            {
                /* assembly.rotation.x = assemblyAngle;
                assembly.position.y = -4.871 * Math.sin(assemblyAngle);
                assembly.position.z = 4.871 * Math.cos(-assemblyAngle) - 4.871;
    
                spoonAngleMax = spoonAngleDefaultMax - assemblyAngle;
    
                straw1.rotation.x = assemblyAngle;
                straw1.position.z = strawLength * strawLength / 4.871 + 1.3 * assembly.position.z
    
                straw2.rotation.x = straw1.rotation.x;
                straw2.position.z = straw1.position.z;
    
                spoon.position.y = 0.5635 * Math.sin(Math.PI * 0.5 - spoonAngle - assemblyAngle) + 0.60287008 + assembly.position.y;
                spoon.position.z = 0.5635 * Math.cos(Math.PI * 0.5 - spoonAngle - assemblyAngle) + assembly.position.z;
    
                spoon.rotation.x = -(Math.PI * 0.5 - spoonAngle) + assemblyAngle;
    
                if (ball.position.y == 0 && ball.position.z == 0 && (mesh == undefined || !mesh.visible)) {
                    ball.position.y = spoon.position.y + 5 * Math.sin(spoonAngle + assemblyAngle - Math.PI * 0.07);
                    ball.position.z = spoon.position.z - 5 * Math.cos(spoonAngle + assemblyAngle - Math.PI * 0.07);
                } */
            }
        }
    }
}

function setPosition(a, s, l) {
    assembly.rotation.x = a;
    assembly.position.y = -4.871 * Math.sin(a);
    assembly.position.z = 4.871 * Math.cos(-a) - 4.871;

    spoonAngleMax = spoonAngleDefaultMax - a;

    straw1.rotation.x = a;
    straw1.position.z = l * l / 4.871 + 1.3 * assembly.position.z;
    actualStrawLength = l;

    straw2.rotation.x = straw1.rotation.x;
    straw2.position.z = straw1.position.z;

    spoon.position.y = 0.5635 * Math.sin(Math.PI * 0.5 - s - a) + 0.60287008 + assembly.position.y;
    spoon.position.z = 0.5635 * Math.cos(Math.PI * 0.5 - s - a) + assembly.position.z;

    spoon.rotation.x = -(Math.PI * 0.5 - s) + a;
    actualSpoonAngle = s;

    if (mesh == undefined || !mesh.visible) {
        ball.position.y = spoon.position.y + 5 * Math.sin(s + a - Math.PI * 0.07);
        ball.position.z = spoon.position.z - 5 * Math.cos(s + a - Math.PI * 0.07);
        
        x = ball.position.z;
        y = ball.position.y;
    }
}

function submitInputs() {
    var strawLengthInput = document.getElementById("strawLength");
    var spoonAngleInput = document.getElementById("spoonAngle");
    var velocityInput = document.getElementById("velocity");
    var gravityInput = document.getElementById("gravity");

    strawLength = clip(strawLengthInput.value, strawMin, strawMax);
    strawLengthInput.value = Math.round(strawLength * 100) / 100;

    spoonAngle = clip(spoonAngleInput.value * Math.PI / 180, spoonAngleMin, spoonAngleMax);
    spoonAngleInput.value = Math.round(spoonAngle / Math.PI * 180 * 100) / 100;

    mesh.visible = false;
    glide = true;
    positionSet = false;
    setPositions();
    setPosition(assembly.rotation.x, actualSpoonAngle, actualStrawLength);

    console.log("running");
    var angle = Math.PI - (spoon.rotation.x - Math.PI * 0.2 + Math.PI * 0.16);

    while (angle > Math.PI || angle < 0) {
        if (angle > Math.PI) {
            angle -= Math.PI;
        } else if (angle < 0) {
            angle += Math.PI;
        }
    }

    t = 0;
    v0x = velocityInput.value * Math.cos(angle);
    v0y = velocityInput.value * Math.sin(angle);
    vx = v0x;
    vy = v0y;
    ax = 0;
    ay = -1 * Number(gravityInput.value);

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
