init();
var ball, plate, capsule;
var x;
async function init() {

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
    

    /* BABYLON.SceneLoader.ImportMesh("", "./objects/", "plate.stl", scene, function (meshes) {
        plate = meshes[0];
        plate.position.set(0, 0, 0);
        //plate.parent = physicsRoot;
        plate.physicsImpostor = new BABYLON.PhysicsImpostor(plate, BABYLON.PhysicsImpostor.CustomImpostor, { mass: 0.1 }, scene);
        plate.checkCollisions = true;
    });

    
    BABYLON.SceneLoader.ImportMesh("", "./objects/", "ball.stl", scene, function (meshes) {
        ball = meshes[0];
        ball.position.set(0, 100, 0);
        //ball.parent = physicsRoot;
        ball.physicsImpostor = new BABYLON.PhysicsImpostor(ball, BABYLON.PhysicsImpostor.CustomImpostor, { mass: 0.1 }, scene);
        ball.checkCollisions = true;
    });

    
    BABYLON.SceneLoader.ImportMesh("", "./objects/", "capsule.stl", scene, function (meshes) {
        capsule = meshes[0];
        capsule.position.set(0, 100, 0);
        //capsule.parent = physicsRoot;
        capsule.physicsImpostor = new BABYLON.PhysicsImpostor(capsule, BABYLON.PhysicsImpostor.CustomImpostor, { mass: 0.1 }, scene);
        capsule.checkCollisions = true;
    }); */
    plate = (await BABYLON.SceneLoader.ImportMeshAsync("", "./objects/plate.stl", "", scene)).meshes;


    //plate colliders
    var platePhysicsRoot = new BABYLON.Mesh("");
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
        if(m.name.indexOf("box") != -1){
            m.physicsImpostor = new BABYLON.PhysicsImpostor(m, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 100 }, scene);
        }
    });
    platePhysicsRoot.position.set(0, 50, 0);

    //var plateTorusCol = BABYLON.MeshBuilder.CreateTorus("plateTorusCol", {thickness: 30, diameter: 120});

    //capsule colliders
    var capsuleCol = BABYLON.MeshBuilder.CreateCapsule("sphere", {radius: 7.9375, height: 49.873});
 
    //ball colliders
    //var ballCol = BABYLON.Mesh.CreateSphere("ballCol", {diameter: 15.876});
    var ballCol = BABYLON.Mesh.CreateSphere("ballCol", 16, 15.6, scene);

    capsuleCol.position.set(0, 100, 0);
    ballCol.position.set(0, 100, 0);
    //plateTorusCol.position.set(0, 0, 0);
     
    /* physicsRoot.addChild(plateTorusCol);
    physicsRoot.addChild(capsuleCol); 
    physicsRoot.addChild(ballCol);  */
    


    

    
    //plateTorusCol.physicsImpostor = new BABYLON.PhysicsImpostor(plateTorusCol, BABYLON.PhysicsImpostor.ConvexHullImpostor, {mass:0}, scene);
    capsuleCol.physicsImpostor = new BABYLON.PhysicsImpostor(capsuleCol, BABYLON.PhysicsImpostor.CapsuleImpostor, {mass:100}, scene);
    ballCol.physicsImpostor = new BABYLON.PhysicsImpostor(ballCol, BABYLON.PhysicsImpostor.SphereImpostor, {mass:100}, scene);
    platePhysicsRoot.physicsImpostor = new BABYLON.PhysicsImpostor(platePhysicsRoot, BABYLON.PhysicsImpostor.NoImpostor, {mass:3}, scene);

    /* physicsRoot.rotation.x = Math.PI/5;
    physicsRoot.rotation.z = Math.PI/6; */

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener("resize", function () {
        engine.resize();
    });

}

