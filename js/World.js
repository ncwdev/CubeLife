import * as utils from './Utils/utils.js';
import * as dbg from './Utils/DebugPanel.js';
import * as info from './Gui/InfoPanel.js';

import {Scene} from "./Scene.js";
import {Cube} from "./Entities/Cube.js";
import {Processor} from "./Entities/Processor.js";

import ADAM from "./Adams/Adam02.js";

export class World {

    engine = null;
    config = null;

    scene  = null;
    getScene() {
        return this.scene;
    }

    light = null;
    root_box = null;

    prerender_observer = null;
    pointer_observer = null;

    is_paused = false;
    is_logging= true;

    processor = null;
    
    cubes = new Map();  // id = hash of position, value = Cube object
    cubes_it = null;
    
    cubes_counter = 0;  // for all created cubes ever
    alive_counter = 0;
    dead_counter  = 0;

    species_counter = 0;
    species_list = new Map();   // id = species code murmurhash, value = species object {counter, code length, color, calculated id}
    species_filter = null;

    constructor(engine, config) {
        this.engine = engine;
        this.config = config;

        this.scene = new Scene(engine);
        this.scene.createSkyBox(config.radius_max);
        this.scene.applyOptimizations();
    }

    start() {
        dbg.createAxises(10, 10, 10);
        dbg.setVisible(true);
        info.setVisible(true);

        const light = new BABYLON.PointLight("pl", BABYLON.Vector3.Zero(), this.scene);
        light.diffuse  = new BABYLON.Color3(1, 1, 1);
        light.specular = new BABYLON.Color3(1, 1, 1);
        light.intensity= 0.2;
        this.light = light;

        this.prerender_observer = this.scene.onBeforeRenderObservable.add(this.onPrerenderHandler.bind(this));
        this.pointer_observer = this.scene.onPointerObservable.add(this.onPointerHandler.bind(this));

        this.scene.onKeyboardObservable.add( (kbInfo) => {
            if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
                // Key was pressed
                console.log(kbInfo.event.key);

                if (kbInfo.event.key === 'p') {
                    this.is_paused = !this.is_paused;
                    console.log(`pause: ${this.is_paused}`);

                    if (this.is_paused) {
                        this.cubes.forEach( cube => {
                           cube.setPickable(true); 
                        });
                    } else {
                        this.cubes.forEach( cube => {
                            cube.setPickable(false);
                         });
                    }
                }
                if (kbInfo.event.key === 'l') {
                    this.is_logging = !this.is_logging;
                    
                    if (this.is_logging) {
                        console.log = native_log;
                    } else {
                        console.log = () => {};
                    }
                }
            }
        });

        // create parent box for all instances
        const box = BABYLON.MeshBuilder.CreateBox("root_box", {size: 1}, this.scene);
        box.alwaysSelectAsActiveMesh = true;
        
        const material = new BABYLON.StandardMaterial("material");
        //material.emissiveColor = BABYLON.Color3.White();
        material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        box.material = material;
        box.registerInstancedBuffer("color", 4);
        box.instancedBuffers.color = new BABYLON.Color4(0, 1, 0, 1);
        // opt: this works very well for a cube where it is more efficient to send 32 positions instead of 24 positions and 32 indices
        box.convertToUnIndexedMesh();
        box.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY;
        box.setEnabled(false);
        this.root_box = box;

        this.processor = new Processor(this);
        this.createAdam();

        //this.is_paused = true;
    }

    createAdam() {
        const pos = new BABYLON.Vector3(0, 0, 0);
        const adam = new Cube(this, pos, this.cubes_counter);
        
        adam.setCode(ADAM.code);
        adam.setEnergy(ADAM.energy);
        adam.setMemoryLen(ADAM.memory_len);
        adam.initMemory();

        for (let side = 0; side < CUBE_SIDES; ++side) {
            adam.setSideMarker(side, ADAM.marker);
        }
        adam.updateColor();
        
        const pos_hash = this.getPosHash(pos);
        this.cubes.set(pos_hash, adam);
        this.cubes_it = this.cubes[Symbol.iterator]();

        this.cubes_counter++;
    }

    checkNewSpecies(cube) {
        // check for new species and add to list if needed
        const hash = utils.murmurHash(cube.code);
        cube.setSpeciesId(hash);

        if (this.species_filter !== null && this.species_filter !== hash) {
            cube.setVisible(false);
        }

        const species = this.species_list.get(hash);
        if (species) {
            species.amount++;
            return;
        }
        this.species_counter++;

        const code_length = cube.code.length / OPERATION_SIZE;
        const new_species = {
            color: cube.color,
            generation: this.species_counter,
            code_length: code_length,
            amount: 1,
            hash: hash,
        };
        this.species_list.set(hash, new_species);

        info.updateSpeciesList(this.species_list);
    }
    
    onSpeciesItemDied(cube) {
        const hash = cube.getSpeciesId();
        const species = this.species_list.get(hash);
        if (species) {
            species.amount--;
            if (species.amount === 0) {
                this.species_list.delete(hash);
                info.updateSpeciesList(this.species_list);
            }
        }
    }

    getSpeciesNumber(cube) {
        const hash = cube.getSpeciesId();
        const species = this.species_list.get(hash);
        if (species) {
            return species.amount;
        }
        return 0;
    }

    showSpecies(hash) {
        this.species_filter = hash;

        this.cubes.forEach( cube => {
            if (cube.getSpeciesId() === hash) {
                cube.setVisible(true);
            } else {
                cube.setVisible(false);
            }
        });
    }

    showAllSpecies() {
        this.species_filter = null;

        this.cubes.forEach( cube => {
            cube.setVisible(true);
        });
    }

    onPrerenderHandler() {
        // calc interval in milliseconds between frames
        const dt = this.engine.getDeltaTime() / 1000;
        dbg.updateFps();

        this.light.position = this.scene.activeCamera.position;

        if (this.is_paused) {
            return;
        }
        // iterate the number of cubes that can be processed within 5 milliseconds
        const MAX_PROC_TIME = 5;
        const time1 = Date.now();
        
        while (true) {
            const it_value = this.cubes_it.next();
            if (it_value.done) {
                info.setCubesStats(this.cubes.size, this.alive_counter, this.dead_counter);

                this.cubes_it = this.cubes[Symbol.iterator]();

                this.alive_counter = 0;
                this.dead_counter  = 0;
            } else {
                const cube = it_value.value[1];
                if (this.processor.update(cube)) {
                    this.alive_counter++;
                } else {
                    this.dead_counter++;
                }
                const delta = Date.now() - time1;
                if (delta >= MAX_PROC_TIME) {
                    break;
                }
            }
        }
    }

    onPointerHandler(e) {
        const MOUSE_LEFT_BUTTON = 0;
        if (e.event.button !== MOUSE_LEFT_BUTTON) {
            return;
        }
        switch (e.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                if (e.pickInfo.hit) {
                    const mesh = e.pickInfo.pickedMesh;
                    if (mesh) {
                        const cube = mesh.cubeLifeObj;
                        if (cube) {
                            info.setSelectedCube(cube);
                        } else {
                            info.setSelectedCube(null);
                        }
                    }
                }
                break;
            case BABYLON.PointerEventTypes.POINTERUP:
                break;
        }
    }

    getPosHash(pos) {
        return `${pos.x.toFixed(0)}_${pos.y.toFixed(0)}_${pos.z.toFixed(0)}`;
    }

    getCubeNeighbor(cube, side) {
        // sides: 0, 1 - OX, 2, 3 - OY, 4, 5 - OZ
        const pos = cube.getNeighborPos(side);
        const pos_hash = this.getPosHash(pos);
        return this.cubes.get(pos_hash);
    }

    createCubeNeighbor(cube, side) {
        if (this.cubes.size >= MAX_CUBES_NUMBER) {
            const very_old_cube = this.findVeryOldCube();
            if (very_old_cube === cube) {
                // oops.. just leave it alone
                return null;
            }
            this.destroyCube(very_old_cube);
        }
        const pos = cube.getNeighborPos(side);
        const new_cube = new Cube(this, pos, this.cubes_counter);
        
        const pos_hash = this.getPosHash(pos);
        this.cubes.set(pos_hash, new_cube);

        this.cubes_counter++;
        return new_cube;
    }

    findVeryOldCube() {
        // javascript Map has order of elements by their adding to the map
        // so just get the first element
        let very_old_cube = null;
        for (const cube of this.cubes.values()) {
            very_old_cube = cube;
            break;
        }
        return very_old_cube;
    }

    destroyCube(cube) {
        const pos_hash = this.getPosHash(cube.getPosition());
        let is_success = this.cubes.delete(pos_hash);

        console.log(`destroyCube(): cube ${cube.id}, pos_hash: ${pos_hash}, is_success: ${is_success}`, cube);

        if (!is_success) {
            debugger;
        }
        cube.clear();
    }

    clear() {
        this.cubes = null;

        this.scene.onBeforeRenderObservable.remove(this.prerender_observer);
        this.scene.onPointerObservable.remove(this.pointer_observer);

        dbg.setVisible(false);
        info.setVisible(false);
    }
}