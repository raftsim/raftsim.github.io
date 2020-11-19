import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import { OBJLoader } from 'https://unpkg.com/three/examples/jsm/loaders/OBJLoader.js';

import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var container;

var initFreq = 390.5; 
//338.63 (for harmonica); 
//390.05 (for sound5); 

var camera, scene, renderer, controls, listener, sound;

var slide = false;

var tone, buzz, halfStep;
var time = 0;

var sliderL, sliderR, topStick, botStick, rubberBand, miniLeft, miniRight;

let targetPos = new THREE.Vector3(0, 0, 0);

var input1;

let sGapMin = 0;
let sGapMax = 80;

let sGapInput = document.getElementById("sGap");

//

init();
animate();

function init() {

    container = document.createElement('div');
    container.id = "container";
    document.body.appendChild(container);

    var submitInputsButton = document.getElementById("submit");
    submitInputsButton.onclick = submitInputs;

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.y = 35;
    camera.position.z = 100;

    listener = new THREE.AudioListener();
    camera.add(listener);

    // create a global audio source
    sound = new THREE.Audio(listener);

    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('sound/sound5.mp3', function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(1.2);
    });


    // scene

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.5);
    camera.add(pointLight);
    scene.add(camera);

    // manager

    function loadModel() {

        scene.add(miniLeft);
        miniLeft.rotation.y = Math.PI / 2;
        miniLeft.position.y = -0.5;
        miniLeft.position.x = -58;
        miniLeft.children[0].material.color = new THREE.Color(0xeeeeee);

        scene.add(miniRight);
        miniRight.rotation.y = Math.PI / 2;
        miniRight.position.y = -0.5;
        miniRight.position.x = 58;
        miniRight.children[0].material.color = new THREE.Color(0xeeeeee);

        scene.add(sliderL);
        sliderL.rotation.z = Math.PI / 2;
        sliderL.position.x = -38;
        sliderL.children[0].material.color = new THREE.Color(0x69856a);

        scene.add(sliderR);
        sliderR.rotation.z = Math.PI / 2;
        sliderR.position.x = 38;
        sliderR.children[0].material.color = new THREE.Color(0x69856a);

        scene.add(rubberBand);
        rubberBand.rotation.y = Math.PI / 2;
        rubberBand.children[0].material.color = new THREE.Color(0xcfa986);

        scene.add(topStick);
        topStick.children[0].material.color = new THREE.Color(0xe5c7b6);

        scene.add(botStick);
        botStick.position.y = -2;
        botStick.children[0].material.color = new THREE.Color(0xe5c7b6);

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

        loader.load('objects/mini rubber band.obj', function (obj) {

            miniLeft = obj;

        }, onProgress, onError);

        loader.load('objects/mini rubber band.obj', function (obj) {

            miniRight = obj;

        }, onProgress, onError);

        loader.load('objects/slider.obj', function (obj) {

            sliderL = obj;
        }, onProgress, onError);


        loader.load('objects/slider.obj', function (obj) {

            sliderR = obj;

        }, onProgress, onError);

        loader.load('objects/rubber band.obj', function (obj) {

            rubberBand = obj;

        }, onProgress, onError);

        loader.load('objects/stick.obj', function (obj) {

            topStick = obj;

        }, onProgress, onError);

        loader.load('objects/stick.obj', function (obj) {

            botStick = obj;

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

//

function animate() {

    requestAnimationFrame(animate);
    controls.update();
    render();

}

function render() {

    // TODO: Change camera target here

    controls.target.set(targetPos.x, targetPos.y, targetPos.z);

    if (slide) {
        if (sliderL.position.x < Math.floor(sGapInput.value / -2 - 8.6)) {
            sliderL.position.x++;
        }
        else if (sliderL.position.x > Math.floor(sGapInput.value / -2 - 8.6)) {
            sliderL.position.x--;
        }
        if (sliderR.position.x < Math.floor(sGapInput.value / 2 + 8.6)) {
            sliderR.position.x++;
        }
        else if (sliderR.position.x > Math.floor(sGapInput.value / 2 + 8.6)) {
            sliderR.position.x--;

        }
        if (sliderR.position.x == Math.floor(sGapInput.value / 2 + 8.6)) {
            console.log(sliderL.position.x);
            console.log(sliderR.position.x);
            sound.detune = 0;
            slide = false;
        }
    }
    if (buzz) {
        if (time < 15) {
            time += 0.1;
        }
        else {
            sound.pause();
            buzz = false;
        }
    }
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

function setNote() {
    var letter = "C";
    var num = 4;
    var note = ( 6.93 + Number(halfStep));
    var add;

    while (note < 0) 
    {
        note += 12;
        num--;
    }
    while (note > 11) {
        note -= 12;
        num++;
    }
    note = Math.abs(note);
    var cents = note % 1;
    note -= cents;
    cents *= 100;
    cents = Math.floor(cents);
    if(cents > 50)
    {
        add = false;
        cents = 100 - cents;
        if (note == 11)
        {
            num++
            note = 0;
        }
        else
        {
            note++;
        }
    }


    var notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    for (var i = 0; i < 12; i++) 
    {
        if (note == i)
        {
            letter = notes[i];
        }
    }
    if (add)
    {
        return letter + num + " plus " + cents + " cents";
    }
    else
    {
        return letter + num + " minus " + cents + " cents";
    }


    // E4 plus 47 cents = 4.47 (for Harmonica)
    // G4 minus 7 cents  = 6.93 (for sound5)
}

function submitInputs() {
    sound.pause();
    document.getElementById("output-text").style.visibility = "hidden";

    input1 = clip(sGapInput.value, sGapMin, sGapMax);
    sGapInput.value = Math.round(input1 * 100) / 100;

    tone = (921 * (Math.pow(0.977, sGapInput.value)));
    halfStep = (12 * Math.log(tone / initFreq)) / Math.log(2);

    document.getElementById("Frequency").innerText = Math.floor(tone);
    document.getElementById("Note").innerText = setNote();

    //hrtz of original sound = 338.63; 

    sound.detune += halfStep * 100;

    sound.play();

    time = 0;

    slide = true;
    buzz = true;
}