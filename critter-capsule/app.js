init();
var ball, plate, capsule;
var x;
async function init() {
    /* var makePhysObj = async function(obj, scene, z){
        var physicsRoot = new BABYLON.Mesh("physicsRoot", scene);
        obj.forEach((m, i)=>{
            if(m.name.indexOf("box") != -1){
                m.isVisible = false;
                physicsRoot.addChild(m);
            }
        });
        obj.forEach((m, i)=>{
            if(m.parent == null){
                physicsRoot.addChild(m)
            }
        });
        physicsRoot.getChildMeshes().forEach((m)=>{
            m.physicsImpostor = new BABYLON.PhysicsImpostor(m, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
        });
        physicsRoot.physicsImpostor = new BABYLON.PhysicsImpostor(physicsRoot, BABYLON.PhysicsImpostor.NoImpostor, {mass:z}, scene);
        return physicsRoot;
    } */
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var createScene = function () { 
        var scene = new BABYLON.Scene(engine);

        var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, -Math.PI/4, 100, new BABYLON.Vector3(0, 0, 0), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);

        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
        var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);
        scene.collisionsEnabled = true;
        camera.checkCollisions = true; 

        var gravityVector = new BABYLON.Vector3(0, -9.81, 0);
        var physicsPlugin = new BABYLON.AmmoJSPlugin();
        scene.enablePhysics(gravityVector, physicsPlugin);
        
        
        return scene;
    } 

    var scene = createScene(); 
    const physEngine = scene.getPhysicsEngine();
    physEngine.setSubTimeStep(1000 / 60);
    var collidersVisible = false;
    
    var ground = BABYLON.Mesh.CreateGround("ground1", 1000, 1000, 0, scene);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, scene);
    ground.checkCollisions = true;
    
    plate = (await BABYLON.SceneLoader.ImportMeshAsync("", "./objects/plate.stl", "", scene)).meshes;
    ball = (await BABYLON.SceneLoader.ImportMeshAsync("", "./objects/ball-2.stl", "", scene)).meshes;
    capsule = (await BABYLON.SceneLoader.ImportMeshAsync("", "./objects/capsule.stl", "", scene)).meshes;


    //plate colliders
    var platePhysicsRoot = new BABYLON.Mesh("platePhysicsRoot", scene);
    plate.forEach((m, i)=>{
        if(m.name.indexOf("box") != -1){
            m.isVisible = false;
            platePhysicsRoot.addChild(m);
        }
    });
    plate.forEach((m, i)=>{
        if(m.parent == null){
            platePhysicsRoot.addChild(m)
        }
    });

    platePhysicsRoot.getChildMeshes().forEach((m)=>{        
        m.scaling.x = Math.abs(m.scaling.x);
        m.scaling.y = Math.abs(m.scaling.y);
        m.scaling.z = Math.abs(m.scaling.z);
        m.physicsImpostor = new BABYLON.PhysicsImpostor(m, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);

    });
    platePhysicsRoot.position = new BABYLON.Vector3(0, 50, 0);

    //ball colliders
    var ballPhysicsRoot = new BABYLON.Mesh("ballPhysicsRoot", scene);
    ball.forEach((m, i)=>{
        if(m.name.indexOf("box") != -1){
            m.isVisible = false;
            ballPhysicsRoot.addChild(m);
        }
    });
    ball.forEach((m, i)=>{
        if(m.parent == null){
            ballPhysicsRoot.addChild(m)
        }
    });

    ballPhysicsRoot.getChildMeshes().forEach((m)=>{
        m.scaling.x = Math.abs(m.scaling.x);
        m.scaling.y = Math.abs(m.scaling.y);
        m.scaling.z = Math.abs(m.scaling.z);
        m.physicsImpostor = new BABYLON.PhysicsImpostor(m, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);

    });
    ballPhysicsRoot.position = new BABYLON.Vector3(0, 100, 0);

    //capsule colliders
    var capsulePhysicsRoot = new BABYLON.Mesh("capsulePhysicsRoot", scene);
    capsule.forEach((m, i)=>{
        if(m.name.indexOf("box") != -1){
            m.isVisible = false;
            capsulePhysicsRoot.addChild(m);
        }
    });
    capsule.forEach((m, i)=>{
        if(m.parent == null){
            capsulePhysicsRoot.addChild(m)
        }
    });

    capsulePhysicsRoot.getChildMeshes().forEach((m)=>{
        m.scaling.x = Math.abs(m.scaling.x);
        m.scaling.y = Math.abs(m.scaling.y);
        m.scaling.z = Math.abs(m.scaling.z);
        m.physicsImpostor = new BABYLON.PhysicsImpostor(m, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
    });
    capsulePhysicsRoot.position = new BABYLON.Vector3(0, 100, 0);
    
    /* capsulePhysicsRoot.scaling.scaleInPlace(scaling);
    ballPhysicsRoot.scaling.scaleInPlace(scaling);
    platePhysicsRoot.scaling.scaleInPlace(scaling); */
    capsulePhysicsRoot.physicsImpostor = new BABYLON.PhysicsImpostor(capsulePhysicsRoot, BABYLON.PhysicsImpostor.NoImpostor, {mass:50}, scene);
    ballPhysicsRoot.physicsImpostor = new BABYLON.PhysicsImpostor(ballPhysicsRoot, BABYLON.PhysicsImpostor.NoImpostor, {mass:10}, scene);
    platePhysicsRoot.physicsImpostor = new BABYLON.PhysicsImpostor(platePhysicsRoot, BABYLON.PhysicsImpostor.NoImpostor, {mass:100}, scene);

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener("resize", function () {
        engine.resize();
    });

}

