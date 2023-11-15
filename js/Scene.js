export class Scene extends BABYLON.Scene {

    constructor(engine) {
        // scene contains skybox, light, camera and some effects (glow, fog, ...)
        super(engine);

        const scene = this;
        //BABYLON.SceneOptimizer.OptimizeAsync(scene);

        // this Inspector helps to debug scene
        // scene.debugLayer.show();
        // scene.debugLayer.show({
        //     embedMode: false,
        // });

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0));
        light.intensity = 0.80;
        light.diffuse = new BABYLON.Color3(1.0, 1.0, 1.0);

        scene.createDefaultEnvironment({
            createGround: false,
            createSkybox: false,
        });

        //const camera = new BABYLON.ArcRotateCamera("MainCamera", 0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
        //const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

        const camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), scene);
        camera.inputs.addMouseWheel();
        camera.attachControl(canvas, true);
        this.activeCamera = camera;

        camera.angularSensibility = 1000;
        camera.inertia = 0.2;
        camera.speed = 5.0;

        // optimization
        this.skipPointerMovePicking = true;
        this.autoClear = false; // Color buffer
        this.autoClearDepthAndStencil = false;

        // Setting the option useGeometryIdsMap to true will speed-up the addition and removal of Geometry in the scene.
        this.useGeometryIdsMap = true;

        //this.performancePriority = BABYLON.ScenePerformancePriority.Aggressive;
    }

    createSkyBox(space_radius_max) {
        const scene = this;
        
        const dist = space_radius_max * 3;
        const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: dist }, scene);

        console.log(`skybox distance = ${dist}`);

        let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;

        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./assets/skybox/sky", scene);
        //skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./assets/skybox/starfieldspace", scene);
        //skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./assets/skybox/none", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor= new BABYLON.Color3(0, 0, 0);

        skybox.material = skyboxMaterial;

        skybox.infiniteDistance = true;
        skyboxMaterial.disableLighting = true;
        skyboxMaterial.freeze();

        //skybox.isPickable = false;
        //skybox.renderingGroupId = 0;    // behind any other objects
    }
}