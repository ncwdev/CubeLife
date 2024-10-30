export class Scene extends BABYLON.Scene {

    constructor(engine) {
        // scene contains skybox, light, camera and some effects (glow, fog, ...)
        super(engine);

        const scene = this;

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

        const camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -100), scene);
        camera.inputs.addMouseWheel();
        camera.attachControl(canvas, true);
        this.activeCamera = camera;

        camera.angularSensibility = 1000;
        camera.inertia = 0.2;
        camera.speed = 5.0;
    }

    createSkyBox(space_radius_max) {
        const scene = this;

        const dist = space_radius_max * 3;
        const skybox = BABYLON.MeshBuilder.CreateBox('skyBox', { size: dist }, scene);

        const skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);
        skyboxMaterial.backFaceCulling = false;

        // Create dynamic textures for the skybox
        const skyboxTextureSize = 2048;
        const starsCount = 3000;
    
        const size = skyboxTextureSize;
        const arr = [];
        for (let i = 0; i < 6; i++) {
            const dynamicTexture = new BABYLON.DynamicTexture('dynamicTexture_' + i, { width: size, height: size }, scene);

            const context = dynamicTexture.getContext();
            context.fillStyle = '#112';
            context.fillRect(0, 0, size, size);
            dynamicTexture.update();

            arr.push(dynamicTexture);
        }
        const img = new Image();
        img.src = 'assets/cloud.png';
        img.onload = async function() {
            for (let i = 0; i < 6; i++) {
                const dynamicTexture = arr[i];
                const context = dynamicTexture.getContext();

                context.drawImage(this, 0, 0);
                dynamicTexture.update();

                scene.randomPoints(context, starsCount, size);
                dynamicTexture.update();

                const data = await dynamicTexture.readPixels();
                arr[i] = data;
            }
            const cubeTexture = new BABYLON.RawCubeTexture(scene, arr, size);
            skyboxMaterial.reflectionTexture = cubeTexture;
            skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

            skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
            skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

            skybox.material = skyboxMaterial;

            skybox.infiniteDistance = true;
            skyboxMaterial.disableLighting = true;
            skyboxMaterial.freeze();
        };
        // skybox.isPickable = false;
    }

    randomPoints(ctx, count, size) {
        const starColors = ['#4DB9FA', '#6ABDE9', '#92D3FB', '#8FD2ED', '#BFE3FB', '#D7EAF8', '#CFE0E7', '#F7FAF1', '#FAFBF5',
            '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF',
            '#FFFFFA', '#F3F6DB', '#FFFFD8', '#F0F2B1', '#FFFFB8', '#E9E85A', '#F9D67C', '#E9C46C', '#E0A465', '#DB8A5B'];
        for (let i = 0; i < count; ++i) {
            const x = Math.floor(Math.random() * size);
            const y = Math.floor(Math.random() * size);
            ctx.fillStyle = starColors[Math.floor(Math.random() * starColors.length)];
            if (Math.random() < 0.1) {
                ctx.fillRect(x, y, 2, 2);
            } else {
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }

    applyOptimizations() {
        this.pointerMoveTrianglePredicate = () => false;
        this.skipPointerMovePicking = true;
        this.autoClear = false; // Color buffer
        this.autoClearDepthAndStencil = false;

        // Setting the option useGeometryIdsMap to true will speed-up the addition and removal of Geometry in the scene.
        this.useGeometryIdsMap = true;

        const targetFPS = 60;
        const updateRate = 250;
        const options = new BABYLON.SceneOptimizerOptions(targetFPS, updateRate);

        this.optimizer = new BABYLON.SceneOptimizer(this, options, true, true);
        this.optimizer.targetFrameRate = targetFPS;
        this.optimizer.start();
    }
}
