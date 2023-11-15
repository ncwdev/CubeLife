import * as utils from '../Utils/utils.js';

import {ops} from "./Operations.js";

export class Cube {

    world = null;
    scene = null;
    box = null;

    getWorld() {
        return this.world;
    }

    id = '';

    is_alive = true;
    energy = 0;
    idle_ticks_num= 0;
    all_ticks_num = 0;  // organism lifetime
    
    code = [];
    IP = 0; // instruction pointer

    memory_len = 0; // mutable
    memory = [];

    regA = 0;
    regB = 0;
    regLoop = 0;
    regAddr1 = 0;
    regAddr2 = 0;

    side_markers = new Array(CUBE_SIDES);    // mutable
    color = [1, 1, 1];

    species_id = 0;

    // sides: 0, 1 - OX, 2, 3 - OY, 4, 5 - OZ

    constructor(world, position, cubes_counter) {
        this.world = world;
        this.scene = world.getScene();

        this.id = "id_" + cubes_counter;

        // create box using root instance
        let box = this.world.root_box.createInstance("box" + cubes_counter);
        box.position = position;
        box.alwaysSelectAsActiveMesh = true;
        box.isPickable = false;
        box.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY;
        box.material.freeze();
        this.box = box;

        // optimization
        box.doNotSyncBoundingInfo = true;

        box.cubeLifeObj = this;

        console.log(`Cube ${this.id} created`);
    }

    getId() {
        return this.id;
    }
    isAlive() {
        return this.is_alive;
    }
    setDead() {
        this.is_alive = false;
        this.box.instancedBuffers.color = new BABYLON.Color4(0, 0, 0, 1);

        this.world.onSpeciesItemDied(this);
    }
    getEnergy() {
        return this.energy;
    }
    setEnergy(v) {
        if (v < 0) {
            throw `setEnergy(): energy cannot be negative: ${v}, cube: ${this.id}`;
        }
        this.energy = v;
    }
    addEnergy(v) {
        this.energy += v;

        if (this.energy < 0) {
            this.energy = 0;
        }
    }
    getCode() {
        return this.code;
    }
    setCode(v) {
        this.code = v;
    }
    getIP() {
        return this.IP;
    }
    setIP(v) {
        this.IP = v;
    }
    getMemoryLen() {
        return this.memory_len;
    }
    setMemoryLen(v) {
        this.memory_len = v;
    }
    getMemory() {
        return this.memory;
    }
    setMemory(v) {
        this.memory = v;
    }
    initMemory() {
        this.memory = new Array(this.memory_len).fill(0);
    }
    getRegA() {
        return this.regA;
    }
    setRegA(v) {
        this.regA = v;
    }
    getRegB() {
        return this.regB;
    }
    setRegB(v) {
        this.regB = v;
    }
    getRegLoop() {
        return this.regLoop;
    }
    setRegLoop(v) {
        this.regLoop = v;
    }
    getRegAddr1() {
        return this.regAddr1;
    }
    setRegAddr1(v) {
        this.regAddr1 = v;
    }
    getRegAddr2() {
        return this.regAddr2;
    }
    setRegAddr2(v) {
        this.regAddr2 = v;
    }
    getSideMarkers() {
        return this.side_markers;
    }
    setSideMarker(i, v) {
        const mutation_chance = utils.randomInt(0, MUTATION_MARKER_BASE);
        if (mutation_chance < MUTATION_MARKER_CHANCE) {
            v = utils.randomInt(1, MAX_MARKER_VALUE);
        }
        this.side_markers[i] = v;
    }
    getPosition() {
        return this.box.position;
    }
    getSpeciesId() {
        return this.species_id;
    }
    setSpeciesId(v) {
        this.species_id = v;
    }
    setVisible(flag) {
        this.box.isVisible = flag;
    }
    setPickable(flag) {
        this.box.isPickable = flag;
    }
    getColor() {
        return this.color;
    }
    updateColor() {
        // calculate color from code: R is summ of all opcodes, G is summ of all operands 1 % , B is summ of all operands 2
        for (let i = 0; i < this.code.length; i += OPERATION_SIZE) {
            this.color[0] += this.code[i];
            this.color[1] += this.code[i + 1];
            this.color[2] += this.code[i + 2];
        }
        this.color.forEach( (v, i) => {
            let c = (v % 256) / 256;
            if (c < 0.2) {
                c = 0.2;
            }
            this.color[i] = c;
        });
        console.log(`cube ${this.id} color: ${this.color[0]}, ${this.color[1]}, ${this.color[2]}`);

        this.box.instancedBuffers.color = new BABYLON.Color4(this.color[0], this.color[1], this.color[2], 1);
    }
    getGeneration() {
        const species = this.world.species_list.get(this.species_id);
        if (species) {
            return species.generation;
        }
        return 'unknown';
    }

    getNeighborPos(side) {
        // sides: 0, 1 - OX, 2, 3 - OY, 4, 5 - OZ
        const pos = this.box.position;
        switch (side) {
            case 0:
                return new BABYLON.Vector3(pos.x + 1, pos.y, pos.z);
            case 1:
                return new BABYLON.Vector3(pos.x - 1, pos.y, pos.z);
            case 2:
                return new BABYLON.Vector3(pos.x, pos.y + 1, pos.z);
            case 3:
                return new BABYLON.Vector3(pos.x, pos.y - 1, pos.z);
            case 4:
                return new BABYLON.Vector3(pos.x, pos.y, pos.z + 1);
            case 5:
                return new BABYLON.Vector3(pos.x, pos.y, pos.z - 1);
        }
        throw `getNeighborPos(): invalid side: ${side} of cube ${this.id}`;
    }

    move(side) {
        const hash = this.world.getPosHash(this.box.position);
        this.world.cubes.delete(hash);
        
        //this.box.unfreezeWorldMatrix();
        this.box.position = this.getNeighborPos(side);
        //this.box.freezeWorldMatrix();

        const new_hash = this.world.getPosHash(this.box.position);

        this.world.cubes.set(new_hash, this);
    }

    compareSideMarker(rel_cube, side) {
        let rel_side = 0;
        switch (side) {
            case 0:
                rel_side = 1;
                break;
            case 1:
                rel_side = 0;
                break;
            case 2:
                rel_side = 3;
                break;
            case 3:
                rel_side = 2;
                break;
            case 4:
                rel_side = 5;
                break;
            case 5:
                rel_side = 4;
                break;
        }
        return this.side_markers[side] === rel_cube.side_markers[rel_side];
    }

    getCodeStr() {
        let str = "";
        for (let i = 0; i < this.code.length; i += OPERATION_SIZE) {
            const op_id = this.code[i];            
            const operation = ops[op_id];
            if (operation) {
                const operand1 = this.code[i + 1];
                const operand2 = this.code[i + 2];
    
                str += parseInt(i/OPERATION_SIZE) + ": " +  operation.getStr(operand1, operand2) + "\n";
            }
        }
        return str;
    }

    clear() {
        console.log(`cube ${this.id} clear() called`);

        this.setDead();
        this.box.isVisible = false;
        this.box.cubeLifeObj = null;
        this.box.dispose();
        this.box = null;

        this.world = null;
        this.scene = null;

        this.code = null;
        this.memory = null;
    }
}