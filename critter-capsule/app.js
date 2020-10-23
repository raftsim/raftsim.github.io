init();
var ball, plate, capsule;
function init() {

    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var createScene = function () {
        var scene = new BABYLON.Scene(engine);

        var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 0, 5), scene);
        camera.attachControl(canvas, true);

        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
        var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

        return scene;
    }
    var scene = createScene();
    var gravityVector = new BABYLON.Vector3(0, -9.81, 0);
    var physicsPlugin = new BABYLON.AmmoJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);
    const physEngine = scene.getPhysicsEngine();
    physEngine.setSubTimeStep(1000 / 60);
    const physicsRoot = new BABYLON.Mesh("physicsRoot");

    var assetsManager = new BABYLON.AssetsManager(scene);

    var ground = BABYLON.Mesh.CreateGround("ground1", 100, 100, -10, scene);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, scene);

    plate = assetsManager.addMeshTask("plate task", "", "./objects/", "plate.stl");
    plate.onSuccess = function(task){
        //task.loadedMeshes[0].position = BABYLON.Vector3.Zero();
        plate.physicsImpostor = new BABYLON.PhysicsImpostor(plate, BABYLON.PhysicsImpostor.CustomImpostor, { mass: 0.1 }, scene); 
    }
    plate.onError = function(task, message, exception){
        console.log(message, exception);
    }

    ball = assetsManager.addMeshTask("ball task", "", "./objects/", "ball.stl");
    ball.onSuccess = function(task){
        //task.loadedMeshes[0].position = BABYLON.Vector3.Zero();
        ball.physicsImpostor = new BABYLON.PhysicsImpostor(ball, BABYLON.PhysicsImpostor.CustomImpostor, { mass: 0.1 }, scene); 
    }
    ball.onError = function(task, message, exception){
        console.log(message, exception);
    }


    capsule = assetsManager.addMeshTask("capsule task", "", "./objects/", "capsule.stl");
    capsule.onSuccess = function(task){
        //task.loadedMeshes[0].position = BABYLON.Vector3.Zero();
        capsule.physicsImpostor = new BABYLON.PhysicsImpostor(capsule, BABYLON.PhysicsImpostor.CustomImpostor, { mass: 0.1 }, scene); 
    }
    capsule.onError = function(task, message, exception){
        console.log(message, exception);
    }


    

    /*BABYLON.SceneLoader.ImportMeshAsync("plate", "./objects/", "plate.stl", scene, function (meshes) {
        
    });
    

    BABYLON.SceneLoader.ImportMeshAsync("ball", "./objects/", "ball.stl", scene, function (meshes) {
        
    });

    BABYLON.SceneLoader.ImportMeshAsync("capsule", "./objects/", "capsule.stl", scene, function (meshes) {
        
    });*/

    
    
    

    
    
    capsule.parent = physicsRoot;
    ball.parent = physicsRoot;
    plate.parent = physicsRoot;  


    assetsManager.onFinish = function(tasks){
        engine.runRenderLoop(function () {
            scene.render();
        });
    }

    assetsManager.load();


    window.addEventListener("resize", function () {
        engine.resize();
    });

    

}

