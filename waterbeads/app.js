import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { STLLoader } from 'https://unpkg.com/three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';

var container;
var camera, scene, renderer, controls;
var stage1, stage2, stage3, stage4;
let cupx = 40;
let cupy = -55;
let cupz = 0;
var cupopac = 0.4;
var wateropac = 0.6;
var col = Math.floor(Math.random() * 2) + 1;

var hot_cup, cold_cup, marble, test_tube, hbead, cbead, ccup_water, hcup_water, ttube_water;
var sizeh = 1;
var sizec = 1;
var hdiam, cdiam;
var time = 0;
var t;
var ptime = 0;

let tempMin = -31.6;
let tempMax = 50;
let saltMin = 0;
let saltMax = 17.9;
let timeMin = 0.00;
let timeMax = 8.00;

var hgrow, cgrow;

var num = 0;

var coldTempInput, hotTempInput, salinityInput, timeInput;
var submitInputsButton;

var beadsRise = true;
var hfirst = false;
var cfirst = false;
var hdown = false;
var cdown = false;

let targetPos = new THREE.Vector3(0, 0, 0);

init();
animate();

function init() {

    container = document.createElement('div');
    container.id = "container";
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.x = 0;
    camera.position.y = -10;
    camera.position.z = 154;

    submitInputsButton = document.getElementById("submit");
    submitInputsButton.onclick = submitInputs;

    // scene

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);
    var loader = new STLLoader();

    var hbeadmat = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: false, opacity: 1 });
    var cbeadmat = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: false, opacity: 1 });
    var hotcupmat = new THREE.MeshPhongMaterial({ color: 0xffcccb, transparent: true, opacity: cupopac });
    var colcupmat = new THREE.MeshPhongMaterial({ color: 0xb2ecff, transparent: true, opacity: cupopac });
    var coltube = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
    var colmar = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    var watermat = new THREE.MeshPhongMaterial({ color: 0x74ccf4, transparent: true, opacity: wateropac });

    loader.load('objects/cup.stl', function (geometry) {

        hot_cup = new THREE.Mesh(geometry, hotcupmat);
        scene.add(hot_cup);

        hot_cup.rotation.x = -Math.PI / 2;
        hot_cup.position.x = -cupx;
        hot_cup.position.y = cupy;
        hot_cup.position.z = cupz;

    });

    loader.load('objects/cup.stl', function (geometry) {

        cold_cup = new THREE.Mesh(geometry, colcupmat);
        scene.add(cold_cup);

        cold_cup.rotation.x = -Math.PI / 2;
        cold_cup.position.x = cupx;
        cold_cup.position.y = cupy;
        cold_cup.position.z = cupz;
    });

    loader.load('objects/cup_water.stl', function (geometry) {

        hcup_water = new THREE.Mesh(geometry, watermat);
        scene.add(hcup_water);

        hcup_water.rotation.x = -Math.PI / 2;
        hcup_water.position.x = -cupx;
        hcup_water.position.y = cupy;
        hcup_water.position.z = cupz;

    });

    loader.load('objects/cup_water.stl', function (geometry) {

        ccup_water = new THREE.Mesh(geometry, watermat);
        scene.add(ccup_water);

        ccup_water.rotation.x = -Math.PI / 2;
        ccup_water.position.x = cupx;
        ccup_water.position.y = cupy;
        ccup_water.position.z = cupz;

    });

    loader.load('objects/marble.stl', function (geometry) {

        marble = new THREE.Mesh(geometry, colmar);
        scene.add(marble);

        marble.visible = false;
        marble.position.y = -45;

    });

    loader.load('objects/test_tube.stl', function (geometry) {

        test_tube = new THREE.Mesh(geometry, coltube);

        scene.add(test_tube);
        test_tube.rotation.x = -Math.PI / 2;
        test_tube.visible = false;

    });

    loader.load('objects/test_tube_water.stl', function (geometry) {

        ttube_water = new THREE.Mesh(geometry, watermat);
        scene.add(ttube_water);
        
        ttube_water.rotation.x = -Math.PI / 2;
        ttube_water.visible = false;

    });

    loader.load('objects/waterbead.stl', function (geometry) {

        hbead = new THREE.Mesh(geometry, hbeadmat);
        scene.add(hbead);

        hbead.position.x = -cupx;
        hbead.position.y = cupy + 1.85;
    });

    loader.load('objects/waterbead.stl', function (geometry) {

        cbead = new THREE.Mesh(geometry, cbeadmat);
        scene.add(cbead);

        cbead.position.x = cupx;
        cbead.position.y = cupy + 1.85;
    });

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // orbit controls

    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    controls.enablePan = false;
    controls.enableDamping = true;

    //

    window.addEventListener('resize', onWindowResize, false);

    reset();

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

function color() {

    var h = Math.floor(Math.random() * 360)
    var s = Math.floor(Math.random() * 100)
    return new THREE.Color('hsl(' + h + ', ' + s + '%, 50%)');

}

function grow(i, j) {

    hbead.scale.x = i;
    hbead.scale.y = i;
    hbead.scale.z = i;

    cbead.scale.x = j;
    cbead.scale.y = j;
    cbead.scale.z = j;

}

function submitInputs() {

    hot_cup.position.x = -cupx;
    hot_cup.position.y = cupy;
    hot_cup.position.z = cupz;

    hcup_water.position.x = -cupx;
    hcup_water.position.y = cupy;
    hcup_water.position.z = cupz;

    cold_cup.position.x = cupx;
    cold_cup.position.y = cupy;
    cold_cup.position.z = cupz;

    ccup_water.position.x = cupx;
    ccup_water.position.y = cupy;
    ccup_water.position.z = cupz;

    cbead.position.x = cold_cup.position.x;
    cbead.position.y = cold_cup.position.y + 1.7;

    hbead.position.x = hot_cup.position.x;
    hbead.position.y = hot_cup.position.y + 1.7;

    ptime = 0;

    marble.visible = false;
    test_tube.visible = false;
    ttube_water.visible = false;
    cold_cup.visible = true;
    hot_cup.visible = true;
    hcup_water.visible = true;
    ccup_water.visible = true;
    hbead.visible = true;
    cbead.visible = true;

    beadsRise = true;
    hfirst = false;
    cfirst = false;
    hdown = false;
    cdown = false;

    col = Math.floor(Math.random() * 2) + 1;

    if (col == 1) {
        hbead.material.color = color();
        cbead.material.color = new THREE.Color(0xffffff);
        cbead.visible = false;
    }
    else if (col == 2) {
        cbead.material.color = color();
        hbead.material.color = new THREE.Color(0xffffff);
        hbead.visible = false;
    }

    camera.position.x = 0;
    camera.position.y = -10;
    camera.position.z = 154;

    stage1 = true;
    stage2 = false;
    stage3 = false;
    stage4 = false;

    reset();

    if (hotTempInput > coldTempInput) {
        hot_cup.material.color = new THREE.Color(0xffcccb);
        cold_cup.material.color = new THREE.Color(0xb2ecff);

    } else if (hotTempInput < coldTempInput) {
        cold_cup.material.color = new THREE.Color(0xffcccb);
        hot_cup.material.color = new THREE.Color(0xb2ecff);
    } else if (hotTempInput == coldTempInput) {
        cold_cup.material.color = new THREE.Color(0xffffff);
        hot_cup.material.color = new THREE.Color(0xffffff);
    }
}

function reset() {

    targetPos.x = 0;
    targetPos.y = -20;
    targetPos.z = 0;

    document.getElementById("hbead").innerText = "";
    document.getElementById("cbead").innerText = "";

    time = 0;
    t = time;

    hotTempInput = clip(document.getElementById("hotTemp").value, tempMin, tempMax);
    coldTempInput = clip(document.getElementById("coldTemp").value, tempMin, tempMax);
    salinityInput = clip(document.getElementById("salinity").value, saltMin, saltMax);
    timeInput = clip(document.getElementById("hours").value, timeMin, timeMax);

    document.getElementById("hotTemp").value = hotTempInput;
    document.getElementById("coldTemp").value = coldTempInput;
    document.getElementById("salinity").value = salinityInput;
    document.getElementById("hours").value = timeInput;

    hdiam = ((-1 * Math.pow(2, ((-0.01 * hotTempInput) + 5))) + 42.5);
    hdiam = hdiam * Math.pow(Math.E, (-0.18 * salinityInput));

    if (hdiam < 2.65) {
        hdiam = 2.65;
    }

    cdiam = ((-1 * Math.pow(2, ((-0.01 * coldTempInput) + 5))) + 42.5);
    cdiam = cdiam * Math.pow(Math.E, (-0.18 * salinityInput));
    
    if (cdiam < 2.65) {
        cdiam = 2.65;
    }

    cdiam = cdiam * (timeInput / 8);
    hdiam = hdiam * (timeInput / 8);

    sizeh = 1;
    sizec = 1;

    hgrow = ((hdiam / 2.65) - 1) / (timeInput / 0.01);
    cgrow = ((cdiam / 2.65) - 1) / (timeInput / 0.01);

    console.log(hdiam);
    console.log(cdiam);

}

function render() {

    controls.target.set(targetPos.x, targetPos.y, targetPos.z);

    if (stage1) {

        grow(sizeh, sizec);
        sizeh += hgrow;
        sizec += cgrow;
        time += 0.01;
        hbead.position.y += (0.014 * hgrow) / 0.01;
        cbead.position.y += (0.014 * cgrow) / 0.01;
        t = time.toFixed(2);
        document.getElementById("time").innerText = t;

        if (time >= (timeInput - 0.001)) {

            document.getElementById("hbead").innerText = hdiam.toFixed(2);
            document.getElementById("cbead").innerText = cdiam.toFixed(2);
            stage1 = false;
            time = 0;
            t = time;
            stage2 = true;
            
            if (col == 1) {
                cbead.visible = true;
            } else {
                hbead.visible = true;
            }
        }
    }
    if (stage2) {

        document.getElementById("timer-txt").style.display = 'block';
        hot_cup.material.opacity -= (cupopac / 80).toFixed(4);
        cold_cup.material.opacity -= (cupopac / 80).toFixed(4);
        hcup_water.material.opacity -= (wateropac / 80).toFixed(4);
        ccup_water.material.opacity -= (wateropac / 80).toFixed(4);
        
        if (cold_cup.material.opacity <= 0 && hot_cup.material.opacity <= 0) {
        
            cold_cup.visible = false;
            hot_cup.visible = false;
            ccup_water.visible = false;
            hcup_water.visible = false;
            hot_cup.material.opacity = cupopac;
            cold_cup.material.opacity = cupopac;
            hcup_water.material.opacity = wateropac;
            ccup_water.material.opacity = wateropac;

            stage3 = true;
            stage2 = false;
            ttube_water.visible = true;
            test_tube.visible = true;

        }
    }

    if (stage3) {

        ptime++;
        var x = camera.position.z > 203 || ptime > 300;
        var y = camera.position.y > 44 || ptime > 300;
        var z = targetPos.y > 10;
        
        if (!x) {
            camera.position.z++;
        }

        if (!y) {
            camera.position.y++;
        }

        if (!z) {
            targetPos.y++;
        }
        
        if (x & y & z) {
            stage3 = false;
            stage4 = true;
        }
    }

    if (stage4) {
        
        marble.visible = true;
        
        if (beadsRise) {
            if (cbead.position.y < 75) {
                cbead.position.y++;
                hbead.position.y++;
            } else {
                beadsRise = false;

                if (col == 1) {
                    cfirst = true;
                } else {
                    hfirst = true;
                }
            }
        }

        if (hfirst) {
            if (hbead.position.x < 0) {
                hbead.position.x++;
            } else {
                hfirst = false;
                hdown = true;
            }
        }

        if (cfirst) {
            if (cbead.position.x > 0) {
                cbead.position.x--;
            } else {
                cfirst = false;
                cdown = true;
            }
        }

        if (hdown) {
            if (hbead.position.y > marble.position.y + 7.875 + (sizec * 2.7) + (sizeh * (2.7 / 2))) {
                hbead.position.y--;

                if (hbead.position.y < 30 && col == 2) {
                    hbead.visible = false;
                    cfirst = true;
                }
            } else {
                hdown = false;
            }
        }

        if (cdown) {
            if (cbead.position.y > marble.position.y + 7.875 + (sizeh * (2.7)) + (sizec * (2.7 / 2))) {
                cbead.position.y--;

                if (cbead.position.y < 30 && col == 1) {
                    cbead.visible = false;
                    hfirst = true;
                }
            } else {
                cdown = false;
            }
        }
    } else {
        num++;

        if (num > 40) {
            submitInputsButton.style.visibility = 'visible';
            num = 0;
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
