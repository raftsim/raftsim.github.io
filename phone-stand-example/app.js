import * as THREE from 'https://unpkg.com/three/build/three.module.js';

import { OBJLoader } from 'https://unpkg.com/three/examples/jsm/loaders/OBJLoader.js';

var container;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var mouseFactor = 0.02;
var speedFactor = 0.05;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var object;

init();
animate();


function init() {

	container = document.createElement('div');
	document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
	camera.position.z = 10;

	// scene

	scene = new THREE.Scene();

	var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
	scene.add(ambientLight);

	var pointLight = new THREE.PointLight(0xffffff, 0.8);
	camera.add(pointLight);
	scene.add(camera);

	// manager

	function loadModel() {

		object.traverse(function (child) {

			// if (child.isMesh) child.material.map = texture;

		});

		object.position.y = -2;
		scene.add(object);

	}

	var manager = new THREE.LoadingManager(loadModel);

	manager.onProgress = function (item, loaded, total) {

		console.log(item, loaded, total);

	};

	// texture

	// var textureLoader = new THREE.TextureLoader(manager);

	// var texture = textureLoader.load('textures/uv_grid_opengl.jpg');

	// model

	function onProgress(xhr) {

		if (xhr.lengthComputable) {

			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log('model ' + Math.round(percentComplete, 2) + '% downloaded');

		}

	}

	function onError() { }

	var loader = new OBJLoader(manager);

	loader.load('phone-stand.obj', function (obj) {

		object = obj;

	}, onProgress, onError);

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

	camera.position.x += (mouseX * mouseFactor - camera.position.x) * speedFactor;
	camera.position.y += (- mouseY * mouseFactor - camera.position.y) * speedFactor;

	camera.lookAt(scene.position);

	renderer.render(scene, camera);

}