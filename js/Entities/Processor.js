import {ops} from "./Operations.js";

export class Processor {

    world = null;

    constructor(world) {
        this.world = world;
    }

    update(cube) {
        if (!cube.isAlive()) {
            return false;
        }
        let has_code  = true;
        let operation = undefined;
        let is_bad_op = false;

        const cube_id = cube.getId();
        const ip = cube.getIP();
        const code = cube.getCode();
        
        if (code.length) {
            operation = ops[code[ip]];
        } else {
            has_code = false;
        }
        if (has_code && !operation) {
            // this code is broken, go to next operation
            const err = `cube ${cube_id} has unknown opcode: ${code[ip]}, IP: ${ip}`;
            console.log(err, cube);

            let new_IP = ip + OPERATION_SIZE;
            if (new_IP >= code.length) {
                new_IP = 0;
            }
            cube.setIP(new_IP);
            is_bad_op = true;
        }
        if (cube.all_ticks_num % TICKS_NUM_TO_GET_ENERGY === 0) {
            cube.addEnergy(FREE_ENERGY);
        }
        if (is_bad_op || !has_code || cube.energy < operation.energy) {
            cube.idle_ticks_num++;

            if (cube.idle_ticks_num >= MAX_IDLE_TICKS) {
                cube.setDead();
                console.log(`cube ${cube_id} is dead`);
                return false;
            }
            return true;
        }
        if (cube.all_ticks_num === 0) {
            // this a new organism - calculate color and save in db
            cube.updateColor();

            console.log(`new cube found: ${cube_id}`, cube);

            this.world.checkNewSpecies(cube);
        }
        // perform operation
        cube.all_ticks_num++;
        cube.energy -= operation.energy;

        const operand1 = code[ip + 1];
        const operand2 = code[ip + 2];
        const new_IP = operation.proc(cube, operand1, operand2);

        if (new_IP % OPERATION_SIZE !== 0) {
            console.error('invalid cube IP', cube);
            throw `new IP ${new_IP} is invalid for cube ${cube_id}`;
        }
        if (new_IP >= code.length) {
            cube.setIP(0);
        } else {
            cube.setIP(new_IP);
        }
        if (cube.all_ticks_num >= MAX_OPERATIONS_TO_LIVE) {
            // planned death
            cube.setDead();
            //console.info(`cube ${cube_id} is dead, all ticks: ${cube.all_ticks_num}`);
            return false;
        }
        return true;    // alive
    }
}
