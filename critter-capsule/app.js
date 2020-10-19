init();

function init() {

    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var createScene = function(){
        var scene = new BABYLON.Scene(engine);

        var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI/2, Math.PI/2, 2, new BABYLON.Vector3(0, 0, 5), scene);
        camera.attachControl(canvas, true);
        
        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
        var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);
        
        return scene;
    }
    var scene = createScene();
    var gravityVector = new BABYLON.Vector3(0, -9.81, 0);
    var physicsPlugin = new BABYLON.AmmoJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);
    BABYLON.SceneLoader.ImportMesh("", "./objects/", "plate.stl", scene, function(meshes, particleSystems, skeletons){
        
    });
    BABYLON.SceneLoader.ImportMesh("", "./objects/", "ball.stl", scene, function(meshes, particleSystems, skeletons){
        
    });
    BABYLON.SceneLoader.ImportMesh("", "./objects/", "capsule.stl", scene, function(meshes, particleSystems, skeletons){
        
    });
    engine.runRenderLoop(function(){
        scene.render();
    });

    window.addEventListener("resize", function(){
        engine.resize();
    });

}

