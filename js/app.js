const native_log = console.log;
console.log = () => {};

let world = null;

let engine = null;
let canvas = null;
let scene  = null;

// structure
const OPERATION_SIZE = 3; // all operations are 3 bytes: OPCODE, OPERAND 1, OPERAND 2
const CUBE_SIDES = 6;
const MAX_MARKER_VALUE = 999999;
const MAX_MEMORY_LEN = 3000; // and code len too
const MAX_CUBES_NUMBER = 10000;

// death
const MAX_IDLE_TICKS = 10;
const MAX_OPERATIONS_TO_LIVE = 20000;

// life
const TICKS_NUM_TO_GET_ENERGY = 10;
const FREE_ENERGY = 3;

// mutations of memory and markers
const MUTATION_MARKER_CHANCE = 3;
const MUTATION_MARKER_BASE = 9000;

const MUTATION_MEM_CHANCE = 3;
const MUTATION_MEM_BASE = 1000;

// mutations of operations
const MUTATION_COPY_CHANCE = 3;
const MUTATION_COPY_BASE = 9000;

const DUBLE_COPY_CHANCE = 9;
const DUBLE_COPY_BASE = 9000;

const INSERT_OP_CHANCE = 6;
const INSERT_OP_BASE = 9000;

const DEL_OP_CHANCE = 3;
const DEL_OP_BASE = 9000;


const initEngine = async function() {
    canvas = document.getElementById("renderCanvas");
    if (!canvas) {
        throw 'initEngine(): canvas was not found';
    }
    const antialias = true;
    const adapt_to_ratio = false;
    const options = { preserveDrawingBuffer: false, stencil: true, disableWebGL2Support: false };
    engine = new BABYLON.Engine(canvas, antialias, options, adapt_to_ratio);

    if (!engine) {
        throw 'initEngine(): engine should not be null';
    }

    const { World } = await import('./World.js');

    const config = {
        radius_max: 840,
    };
    world = new World(engine, config);
    scene = world.getScene();
    if (!scene) {
        throw 'initEngine(): cannot get World scene';
    }
    runRenderLoop();

    canvas.focus();
};

function runRenderLoop() {
    engine.runRenderLoop(function () {
        if (scene && scene.activeCamera) {
            engine.resize();
            scene.render();
        }
    });
}

async function startGame() {
    // menu button click handler
    const { MainMenu } = await import('./Gui/MainMenu.js');
    MainMenu.setVisible(false);

    world.start();
}

// Entry point
initEngine();
