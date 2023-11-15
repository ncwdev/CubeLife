import * as utils from '../Utils/utils.js';

function nextIP(cube) {
    return cube.getIP() + OPERATION_SIZE;
}
function jumpIP(cube, jmp) {
    jmp = parseInt(jmp);
    if (isNaN(jmp)) {
        jmp = 0;
    }
    let address = cube.getIP() + jmp * OPERATION_SIZE;
    if (address < 0 || address >= cube.getCode().length) {
        address = 0;
    }
    return address;
}
function getSideRegB(cube) {
    let side = cube.getRegB();
    side = parseInt(side);
    
    if (isNaN(side)) {
        side = 0;
    }
    side = Math.abs(side);
    side = side % CUBE_SIDES;
    return side;
}
function getPositiveNum(v) {
    v = parseInt(v);
    if (isNaN(v)) {
        v = 0;
    }
    v = Math.abs(v);
    return v;
}

export const ops = {

0:  {name: "NOP", energy: 0, proc(cube, op1, op2) {
    return nextIP(cube);
}, getStr(op1, op2) { return "NOP"; },
},

// 10 записать в А op1
10: {name: "SETA_OP1", energy: 1, proc(cube, op1, op2) {
    cube.setRegA(op1);
    return nextIP(cube);
}, getStr(op1, op2) { return "SETA_OP1 " + op1; },
},

// 20 получить в А regB
20: {name: "SETA_B", energy: 1, proc(cube, op1, op2) {
    cube.setRegA(cube.getRegB());
    return nextIP(cube);
}, getStr(op1, op2) { return "SETA_B"; },
},

// 30 получить в A regLoop
30: {name: "SETA_LOOP", energy: 1, proc(cube, op1, op2) {
    cube.setRegA(cube.getRegLoop());
    return nextIP(cube);
}, getStr(op1, op2) { return "SETA_LOOP"; },
},

// 40 получить в А regAddr1
40: {name: "SETA_ADDR1", energy: 1, proc(cube, op1, op2) {
    cube.setRegA(cube.getRegAddr1());
    return nextIP(cube);
}, getStr(op1, op2) { return "SETA_ADDR1"; },
},

// 50 получить в А regAddr2
50: {name: "SETA_ADDR2", energy: 1, proc(cube, op1, op2) {
    cube.setRegA(cube.getRegAddr2());
    return nextIP(cube);
}, getStr(op1, op2) { return "SETA_ADDR2"; },
},

// 60 получить в А размер кода
60: {name: "GET_CODE_LEN", energy: 1, proc(cube, op1, op2) {
    cube.setRegA(cube.getCode().length);
    return nextIP(cube);
}, getStr(op1, op2) { return "GET_CODE_LEN"; },
},

// 70 получить в А размер памяти
70: {name: "GET_MEM_LEN", energy: 1, proc(cube, op1, op2) {
    cube.setRegA(cube.getMemoryLen());
    return nextIP(cube);
}, getStr(op1, op2) { return "GET_MEM_LEN"; },
},

// 80 получить в А кол-во энергии
80: {name: "GET_ENERGY", energy: 1, proc(cube, op1, op2) {
    cube.setRegA(cube.getEnergy());
    return nextIP(cube);
}, getStr(op1, op2) { return "GET_ENERGY"; },
},

// 90 записать в regB A
90: {name: "SET_B", energy: 1, proc(cube, op1, op2) {
    cube.setRegB(cube.getRegA());
    return nextIP(cube);
}, getStr(op1, op2) { return "SET_B"; },
},

// 100 записать в regLoop A
100: {name: "SET_LOOP", energy: 1, proc(cube, op1, op2) {
    cube.setRegLoop(cube.getRegA());
    return nextIP(cube);
}, getStr(op1, op2) { return "SET_LOOP"; },
},

// 110 записать в regAddr1 A
110: {name: "SET_ADDR1", energy: 1, proc(cube, op1, op2) {
    cube.setRegAddr1(cube.getRegA());
    return nextIP(cube);
}, getStr(op1, op2) { return "SET_ADDR1"; },
},

// 120 записать в regAddr2 A
120: {name: "SET_ADDR2", energy: 1, proc(cube, op1, op2) {
    cube.setRegAddr2(cube.getRegA());
    return nextIP(cube);
}, getStr(op1, op2) { return "SET_ADDR2"; },
},

// 130 обменять A and B
130: {name: "SWAP_AB", energy: 1, proc(cube, op1, op2) {
    const tmp = cube.getRegA();
    cube.setRegA(cube.getRegB());
    cube.setRegB(tmp);
    return nextIP(cube);
}, getStr(op1, op2) { return "SWAP_AB"; },
},

// 140 обменять A and Loop
140: {name: "SWAP_LOOP", energy: 1, proc(cube, op1, op2) {
    const tmp = cube.getRegLoop();
    cube.setRegLoop(cube.getRegA());
    cube.setRegA(tmp);
    return nextIP(cube);
}, getStr(op1, op2) { return "SWAP_LOOP"; },
},

// 150 обменять Addr1 and Addr2
150: {name: "SWAP_ADDR12", energy: 1, proc(cube, op1, op2) {
    const tmp = cube.getRegAddr1();
    cube.setRegAddr1(cube.getRegAddr2());
    cube.setRegAddr2(tmp);
    return nextIP(cube);
}, getStr(op1, op2) { return "SWAP_ADDR12"; },
},

// 160 записать в regB op1
160: {name: "SETB_OP1", energy: 1, proc(cube, op1, op2) {
    cube.setRegB(op1);
    return nextIP(cube);
}, getStr(op1, op2) { return "SETB_OP1 " + op1; },
},

// 170 записать в Loop op1
170: {name: "SETLOOP_OP1", energy: 1, proc(cube, op1, op2) {
    cube.setRegLoop(op1);
    return nextIP(cube);
}, getStr(op1, op2) { return "SETLOOP_OP1 " + op1; },
},

// 180 записать в Addr1 op1
180: {name: "SETADDR1_OP1", energy: 1, proc(cube, op1, op2) {
    cube.setRegAddr1(op1);
    return nextIP(cube);
}, getStr(op1, op2) { return "SETADDR1_OP1 " + op1; },
},

// 190 записать в Addr2 op1
190: {name: "SETADDR2_OP1", energy: 1, proc(cube, op1, op2) {
    cube.setRegAddr2(op1);
    return nextIP(cube);
}, getStr(op1, op2) { return "SETADDR2_OP1 " + op1; },
},

// 200 записать в Addr1 op1, в Addr2 op2
200: {name: "SET_ADDRESSES", energy: 1, proc(cube, op1, op2) {
    cube.setRegAddr1(op1);
    cube.setRegAddr2(op2);
    return nextIP(cube);
}, getStr(op1, op2) { return "SETADDRESSES " + op1 + " " + op2; },
},

// 210 сложение А и op1
210: {name: "ADD_OP1", energy: 1, proc(cube, op1, op2) {
    cube.setRegA(cube.getRegA() + op1);
    return nextIP(cube);
}, getStr(op1, op2) { return "ADD_OP1 " + op1; },
},

// 220 отнять от А op1
220: {name: "SUB_OP1", energy: 1, proc(cube, op1, op2) {
    cube.setRegA(cube.getRegA() - op1);
    return nextIP(cube);
}, getStr(op1, op2) { return "SUB_OP1 " + op1; },
},

// 230 умножить А на op1
230: {name: "MUL_OP1", energy: 1, proc(cube, op1, op2) {
    cube.setRegA(cube.getRegA() * op1);
    return nextIP(cube);
}, getStr(op1, op2) { return "MUL_OP1 " + op1; },
},

// 240 делить А на op1
240: {name: "DIV_OP1", energy: 1, proc(cube, op1, op2) {
    cube.setRegA(cube.getRegA() / op1);
    return nextIP(cube);
}, getStr(op1, op2) { return "DIV_OP1 " + op1; },
},

// 250 инкремент А
250: {name: "INC_A", energy: 1, proc(cube, op1, op2) {
    cube.setRegA(cube.getRegA() + 1);
    return nextIP(cube);
}, getStr(op1, op2) { return "INC_A"; },
},

// 260 декремент А
260: {name: "DEC_A", energy: 1, proc(cube, op1, op2) {
    cube.setRegA(cube.getRegA() - 1);
    return nextIP(cube);
}, getStr(op1, op2) { return "DEC_A"; },
},

// 270 сложить A and B, result in A
270: {name: "ADD_AB", energy: 1, proc(cube, op1, op2) {
    cube.setRegA(cube.getRegA() + cube.getRegB());
    return nextIP(cube);
}, getStr(op1, op2) { return "ADD_AB"; },
},

// 280 отнять от A B, result in A
280: {name: "SUB_AB", energy: 1, proc(cube, op1, op2) {
    cube.setRegA(cube.getRegA() - cube.getRegB());
    return nextIP(cube);
}, getStr(op1, op2) { return "SUB_AB"; },
},

// 290 умножить A and B, result in A
290: {name: "MUL_AB", energy: 1, proc(cube, op1, op2) {
    cube.setRegA(cube.getRegA() * cube.getRegB());
    return nextIP(cube);
}, getStr(op1, op2) { return "MUL_AB"; },
},

// 300 делить A на B, result in A
300: {name: "DIV_AB", energy: 1, proc(cube, op1, op2) {
    cube.setRegA(cube.getRegA() / cube.getRegB());
    return nextIP(cube);
}, getStr(op1, op2) { return "DIV_AB"; },
},

// 310 инкремент Addr1
310: {name: "INC_ADDR1", energy: 1, proc(cube, op1, op2) {
    cube.setRegAddr1(cube.getRegAddr1() + 1);
    return nextIP(cube);
}, getStr(op1, op2) { return "INC_ADDR1"; },
},

// 320 декремент Addr1
320: {name: "DEC_ADDR1", energy: 1, proc(cube, op1, op2) {
    cube.setRegAddr1(cube.getRegAddr1() - 1);
    return nextIP(cube);
}, getStr(op1, op2) { return "DEC_ADDR1"; },
},

// 330 инкремент Addr2
330: {name: "INC_ADDR2", energy: 1, proc(cube, op1, op2) {
    cube.setRegAddr2(cube.getRegAddr2() + 1);
    return nextIP(cube);
}, getStr(op1, op2) { return "INC_ADDR2"; },
},


// 340 декремент Addr2
340: {name: "DEC_ADDR2", energy: 1, proc(cube, op1, op2) {
    cube.setRegAddr2(cube.getRegAddr2() - 1);
    return nextIP(cube);
}, getStr(op1, op2) { return "DEC_ADDR2"; },
},

// 350 безусловный переход на команду номер op1
350: {name: "JUMP", energy: 1, proc(cube, op1, op2) {
    // do not allow jump outside of code
    const jmp = parseInt(op1);
    if (isNaN(jmp)) {
        return nextIP(cube);
    }
    const next_IP = jmp * OPERATION_SIZE;
    if (next_IP < 0 || next_IP >= cube.getCode().length) {
        return nextIP(cube);
    }
    return next_IP;
}, getStr(op1, op2) { return "JUMP " + op1; },
},

// 360 безусловный переход на команду номер addr1
360: {name: "JUMP_ADDR1", energy: 1, proc(cube, op1, op2) {
    // do not allow jump outside of code
    const jmp = parseInt(cube.getRegAddr1());
    if (isNaN(jmp)) {
        return nextIP(cube);
    }
    const next_IP = jmp * OPERATION_SIZE;
    if (next_IP < 0 || next_IP >= cube.getCode().length) {
        return nextIP(cube);
    }
    return next_IP;
}, getStr(op1, op2) { return "JUMP_ADDR1"; },
},

// 370 безусловный переход на команду номер addr2
370: {name: "JUMP_ADDR2", energy: 1, proc(cube, op1, op2) {
    // do not allow jump outside of code
    let jmp = parseInt(cube.getRegAddr2());
    if (isNaN(jmp)) {
        return nextIP(cube);
    }
    const next_IP = jmp * OPERATION_SIZE;
    if (next_IP < 0 || next_IP >= cube.getCode().length) {
        return nextIP(cube);
    }
    return next_IP;
}, getStr(op1, op2) { return "JUMP_ADDR2"; },
},

// 380 записать в память по адресу Addr1 число op1
380: {name: "STORE_OP1", energy: 1, proc(cube, op1, op2) {
    const memory = cube.getMemory();
    const address= parseInt(cube.getRegAddr1());
    if (isNaN(address)) {
        return nextIP(cube);
    }
    // do not allow writing outside of memory
    if (address >= 0 && address < memory.length) {
        memory[address] = op1;
    }    
    return nextIP(cube);
}, getStr(op1, op2) { return "STORE_OP1 " + op1; },
},

// 390 записать в память по адресу Addr1 значение А
390: {name: "STORE_A", energy: 1, proc(cube, op1, op2) {
    const memory = cube.getMemory();
    const address= parseInt(cube.getRegAddr1());
    if (isNaN(address)) {
        return nextIP(cube);
    }
    // do not allow writing outside of memory
    if (address >= 0 && address < memory.length) {
        memory[address] = cube.getRegA();
    }
    return nextIP(cube);
}, getStr(op1, op2) { return "STORE_A"; },
},

// 400 записать в память по адресу Addr1 значение B
400: {name: "STORE_B", energy: 1, proc(cube, op1, op2) {
    const memory = cube.getMemory();
    const address= parseInt(cube.getRegAddr1());
    if (isNaN(address)) {
        return nextIP(cube);
    }
    // do not allow writing outside of memory
    if (address >= 0 && address < memory.length) {
        memory[address] = cube.getRegB();
    }
    return nextIP(cube);
}, getStr(op1, op2) { return "STORE_B"; },
},

// 410 прочитать из памяти по адресу Addr1 ячейку в А
410: {name: "READ_A", energy: 1, proc(cube, op1, op2) {
    const memory = cube.getMemory();
    const address= parseInt(cube.getRegAddr1());
    if (isNaN(address)) {
        return nextIP(cube);
    }
    // do not allow reading outside of memory
    if (address >= 0 && address < memory.length) {
        cube.setRegA(memory[address]);
    }
    return nextIP(cube);
}, getStr(op1, op2) { return "READ_A"; },
},

// 420 прочитать из памяти по адресу Addr1 ячейку в B
420: {name: "READ_B", energy: 1, proc(cube, op1, op2) {
    const memory = cube.getMemory();
    const address= parseInt(cube.getRegAddr1());
    if (isNaN(address)) {
        return nextIP(cube);
    }
    // do not allow reading outside of memory
    if (address >= 0 && address < memory.length) {
        cube.setRegB(memory[address]);
    }
    return nextIP(cube);
}, getStr(op1, op2) { return "READ_B"; },
},

// 430 прочитать из памяти по адресу Addr1 ячейку в Loop
430: {name: "READ_LOOP", energy: 1, proc(cube, op1, op2) {
    const memory = cube.getMemory();
    const address= parseInt(cube.getRegAddr1());
    if (isNaN(address)) {
        return nextIP(cube);
    }
    // do not allow reading outside of memory
    if (address >= 0 && address < memory.length) {
        cube.setRegLoop(memory[address]);
    }
    return nextIP(cube);
}, getStr(op1, op2) { return "READ_LOOP"; },
},

// 440 записать в память по адресу Addr2 число op1
440: {name: "STORE_OP1_ADDR2", energy: 1, proc(cube, op1, op2) {
    const memory = cube.getMemory();
    const address= parseInt(cube.getRegAddr2());
    if (isNaN(address)) {
        return nextIP(cube);
    }
    // do not allow writing outside of memory
    if (address >= 0 && address < memory.length) {
        memory[address] = op1;
    }
    return nextIP(cube);
}, getStr(op1, op2) { return "STORE_OP1_ADDR2 " + op1; },
},

// 450 записать в память по адресу Addr2 значение А
450: {name: "STORE_A_ADDR2", energy: 1, proc(cube, op1, op2) {
    const memory = cube.getMemory();
    const address= parseInt(cube.getRegAddr2());
    if (isNaN(address)) {
        return nextIP(cube);
    }
    // do not allow writing outside of memory
    if (address >= 0 && address < memory.length) {
        memory[address] = cube.getRegA();
    }
    return nextIP(cube);
}, getStr(op1, op2) { return "STORE_A_ADDR2"; },
},

// 460 записать в память по адресу Addr2 значение B
460: {name: "STORE_B_ADDR2", energy: 1, proc(cube, op1, op2) {
    const memory = cube.getMemory();
    const address= parseInt(cube.getRegAddr2());
    if (isNaN(address)) {
        return nextIP(cube);
    }
    // do not allow writing outside of memory
    if (address >= 0 && address < memory.length) {
        memory[address] = cube.getRegB();
    }
    return nextIP(cube);
}, getStr(op1, op2) { return "STORE_B_ADDR2"; },
},

// 470 прочитать из памяти по адресу Addr2 ячейку в А
470: {name: "READ_A_ADDR2", energy: 1, proc(cube, op1, op2) {
    const memory = cube.getMemory();
    const address= parseInt(cube.getRegAddr2());

    // do not allow reading outside of memory
    if (address >= 0 && address < memory.length) {
        cube.setRegA(memory[address]);
    }
    return nextIP(cube);
}, getStr(op1, op2) { return "READ_A_ADDR2"; },
},

// 480 прочитать из памяти по адресу Addr2 ячейку в B
480: {name: "READ_B_ADDR2", energy: 1, proc(cube, op1, op2) {
    const memory = cube.getMemory();
    const address= parseInt(cube.getRegAddr2());
    if (isNaN(address)) {
        return nextIP(cube);
    }
    // do not allow reading outside of memory
    if (address >= 0 && address < memory.length) {
        cube.setRegB(memory[address]);
    }
    return nextIP(cube);
}, getStr(op1, op2) { return "READ_B_ADDR2"; },
},

// 490 прочитать из памяти по адресу Addr2 ячейку в Loop
490: {name: "READ_LOOP_ADDR2", energy: 1, proc(cube, op1, op2) {
    const memory = cube.getMemory();
    const address= parseInt(cube.getRegAddr2());
    if (isNaN(address)) {
        return nextIP(cube);
    }
    // do not allow reading outside of memory
    if (address >= 0 && address < memory.length) {
        cube.setRegLoop(memory[address]);
    }
    return nextIP(cube);
}, getStr(op1, op2) { return "READ_LOOP_ADDR2"; },
},

// 500 прочитать значение по адресу Addr1 из кода и поместить в А
500: {name: "READ_CODE", energy: 1, proc(cube, op1, op2) {
    const code = cube.getCode();
    const address = parseInt(cube.getRegAddr1());
    if (isNaN(address)) {
        return nextIP(cube);
    }
    // do not allow reading outside of code
    if (address >= 0 && address < code.length) {
        cube.setRegA(code[address]);
    }
    return nextIP(cube);
}, getStr(op1, op2) { return "READ_CODE"; },
},

// 510 прочитать значение по адресу Addr1 из кода и записать по этому же адресу в память
510: {name: "RW_CODE_TO_MEM", energy: 1, proc(cube, op1, op2) {
    const code = cube.getCode();
    const memory = cube.getMemory();
    const address= getPositiveNum(cube.getRegAddr1());

    // do not allow reading outside of code
    if (address >= 0 && address < code.length) {
        let value = code[address];
        memory[address] = value;

        console.log(`RW_CODE_TO_MEM in cube ${cube.getId()}: value ${value} at address ${address}`);
    }
    return nextIP(cube);
}, getStr(op1, op2) { return "RW_CODE_TO_MEM"; },
},

// 520 уменьшить значение в Loop на 1 и если не равно 0, перейти на +op1 команд
520: {name: "LOOP_OP1", energy: 1, proc(cube, op1, op2) {
    const value = cube.getRegLoop() - 1;
    cube.setRegLoop(value);

    console.log(`LOOP in cube ${cube.getId()}: value ${value}`);

    if (value <= 0) {
        // move to next command
        return nextIP(cube);
    }
    // do not allow jump outside of code
    return jumpIP(cube, op1);
}, getStr(op1, op2) { return "LOOP_OP1 " + op1; },
},

// 530 уменьшить значение в Loop на 1 и если не равно 0, перейти на +B команд
530: {name: "LOOP_B", energy: 1, proc(cube, op1, op2) {
    const value = cube.getRegLoop() - 1;
    cube.setRegLoop(value);

    console.log(`LOOP_B in cube ${cube.getId()}: value ${value}`);

    if (value <= 0) {
        // move to next command
        return nextIP(cube);
    }
    // do not allow jump outside of code
    return jumpIP(cube, cube.getRegB());
}, getStr(op1, op2) { return "LOOP_B"; },
},

// 540 если А больше числа op1, то перейти вперед/назад на op2 команд
540: {name: "IF_A_GT_OP1", energy: 1, proc(cube, op1, op2) {
    const value = cube.getRegA();
    if (value <= op1) {
        // move to next command
        return nextIP(cube);
    }
    // do not allow jump outside of code
    return jumpIP(cube, op2);
}, getStr(op1, op2) { return "IF_A_GT_OP1 " + op1 + " " + op2; },
},

// 550 если А меньше числа op1, то перейти вперед/назад на op2 команд
550: {name: "IF_A_LT_OP1", energy: 1, proc(cube, op1, op2) {
    const value = cube.getRegA();
    if (value >= op1) {
        // move to next command
        return nextIP(cube);
    }
    // do not allow jump outside of code
    return jumpIP(cube, op2);
}, getStr(op1, op2) { return "IF_A_LT_OP1 " + op1 + " " + op2; },
},

// 560 если А равно числу op1,  то перейти вперед/назад на op2 команд
560: {name: "IF_A_EQ_OP1", energy: 1, proc(cube, op1, op2) {
    const value = cube.getRegA();
    if (value !== op1) {
        // move to next command
        return nextIP(cube);
    }
    // do not allow jump outside of code
    return jumpIP(cube, op2);
}, getStr(op1, op2) { return "IF_A_EQ_OP1 " + op1 + " " + op2; },
},

// 570 если А не равно числу op1, то перейти вперед/назад на op2 команд
570: {name: "IF_A_NEQ_OP1", energy: 1, proc(cube, op1, op2) {
    const value = cube.getRegA();
    if (value === op1) {
        // move to next command
        return nextIP(cube);
    }
    // do not allow jump outside of code
    return jumpIP(cube, op2);
}, getStr(op1, op2) { return "IF_A_NEQ_OP1 " + op1 + " " + op2; },
},

// 580 если А больше B, то перейти вперед/назад на op1 команд
580: {name: "IF_A_GT_B", energy: 1, proc(cube, op1, op2) {
    const value = cube.getRegA();
    if (value <= cube.getRegB()) {
        // move to next command
        return nextIP(cube);
    }
    // do not allow jump outside of code
    return jumpIP(cube, op1);
}, getStr(op1, op2) { return "IF_A_GT_B " + op1; },
},

// 590 если А меньше B, то перейти вперед/назад на op1 команд
590: {name: "IF_A_LT_B", energy: 1, proc(cube, op1, op2) {
    const value = cube.getRegA();
    if (value >= cube.getRegB()) {
        // move to next command
        return nextIP(cube);
    }
    // do not allow jump outside of code
    return jumpIP(cube, op1);
}, getStr(op1, op2) { return "IF_A_LT_B " + op1; },
},

// 600 если А равно B,  то перейти вперед/назад на op1 команд
600: {name: "IF_A_EQ_B", energy: 1, proc(cube, op1, op2) {
    const value = cube.getRegA();
    if (value !== cube.getRegB()) {
        // move to next command
        return nextIP(cube);
    }
    // do not allow jump outside of code
    return jumpIP(cube, op1);
}, getStr(op1, op2) { return "IF_A_EQ_B " + op1; },
},

// 610 если А не равно B, то перейти вперед/назад на op1 команд
610: {name: "IF_A_NEQ_B", energy: 1, proc(cube, op1, op2) {
    const value = cube.getRegA();
    if (value === cube.getRegB()) {
        // move to next command
        return nextIP(cube);
    }
    // do not allow jump outside of code
    return jumpIP(cube, op1);
}, getStr(op1, op2) { return "IF_A_NEQ_B " + op1; },
},

// 620 если А больше B, то перейти вперед/назад на Addr1 команд
620: {name: "IF_A_GT_B_ADDR1", energy: 1, proc(cube, op1, op2) {
    const value = cube.getRegA();
    if (value <= cube.getRegB()) {
        // move to next command
        return nextIP(cube);
    }
    // do not allow jump outside of code
    return jumpIP(cube, cube.getRegAddr1());
}, getStr(op1, op2) { return "IF_A_GT_B_ADDR1"; },
},

// 630 если А меньше B, то перейти вперед/назад на Addr1 команд
630: {name: "IF_A_LT_B_ADDR1", energy: 1, proc(cube, op1, op2) {
    const value = cube.getRegA();
    if (value >= cube.getRegB()) {
        // move to next command
        return nextIP(cube);
    }
    // do not allow jump outside of code
    return jumpIP(cube, cube.getRegAddr1());
}, getStr(op1, op2) { return "IF_A_LT_B_ADDR1"; },
},

// 640 если А равно  B, то перейти вперед/назад на Addr1 команд
640: {name: "IF_A_EQ_B_ADDR1", energy: 1, proc(cube, op1, op2) {
    const value = cube.getRegA();
    if (value !== cube.getRegB()) {
        // move to next command
        return nextIP(cube);
    }
    // do not allow jump outside of code
    return jumpIP(cube, cube.getRegAddr1());
}, getStr(op1, op2) { return "IF_A_EQ_B_ADDR1"; },
},

// 650 если А не равно B, то перейти вперед/назад на Addr1 команд
650: {name: "IF_A_NEQ_B_ADDR1", energy: 1, proc(cube, op1, op2) {
    const value = cube.getRegA();
    if (value === cube.getRegB()) {
        // move to next command
        return nextIP(cube);
    }
    // do not allow jump outside of code
    return jumpIP(cube, cube.getRegAddr1());
}, getStr(op1, op2) { return "IF_A_NEQ_B_ADDR1"; },
},

// 660 взять синус op1 и поместить в А
660: {name: "SIN_OP1", energy: 1, proc(cube, op1, op2) {
    cube.setRegA(Math.sin(op1));
    return nextIP(cube);
}, getStr(op1, op2) { return "SIN_OP1 " + op1; },
},

// 670 взять синус B и поместить в А
670: {name: "SIN_B", energy: 1, proc(cube, op1, op2) {
    cube.setRegA(Math.sin(cube.getRegB()));
    return nextIP(cube);
}, getStr(op1, op2) { return "SIN_B"; },
},

// 680 взять случайное число [0, 1] и записать в А
680: {name: "RAND", energy: 1, proc(cube, op1, op2) {
    cube.setRegA(Math.random());
    return nextIP(cube);
}, getStr(op1, op2) { return "RAND"; },
},

// 690 взять случайное число [op1, op2] и записать в А
690: {name: "RAND_RANGE", energy: 1, proc(cube, op1, op2) {
    cube.setRegA(utils.randomInt(op1, op2));
    return nextIP(cube);
}, getStr(op1, op2) { return "RAND_RANGE " + op1 + " " + op2; },
},

// 700 взять случайное число [addr1, addr2] и записать в А
700: {name: "RAND_RANGE_ADDR", energy: 1, proc(cube, op1, op2) {
    const v1 = cube.getRegAddr1();
    const v2 = cube.getRegAddr2();
    cube.setRegA(utils.randomInt(v1, v2));
    return nextIP(cube);
}, getStr(op1, op2) { return "RAND_RANGE_ADDR"; },
},

// 710 создать пустую живую оболочку на стороне B, маркеры сторон будут скопированы с родителя (только если ячейка свободна)
710: {name: "CREATE", energy: 10, proc(cube, op1, op2) {
    // need to test empty cell on specified side
    const world = cube.getWorld();
    const side = getSideRegB(cube);

    const rel_cube = world.getCubeNeighbor(cube, side);
    if (rel_cube) {
        // cell is not empty - just quit
        console.log(`neighbor of cube ${cube.getId()} on the side ${side} is not empty - cancel CREATE operation`);
        return nextIP(cube);
    }
    // create new cube
    const new_cube = world.createCubeNeighbor(cube, side);
    if (!new_cube) {
        return nextIP(cube);
    }
    // create memory - length can mutate
    let memory_len = cube.getMemoryLen();
    try {
        const mutation_chance = utils.randomInt(0, MUTATION_MEM_BASE);
        if (mutation_chance < MUTATION_MEM_CHANCE) {
            const min_value = parseInt(memory_len / 2);
            memory_len = utils.randomInt(min_value, MAX_MEMORY_LEN);
        }
        new_cube.setMemoryLen(memory_len);
        new_cube.initMemory();
    } catch (e) {
        console.error(e);
        console.error(`Failed to create memory, memory_len: `, memory_len);
        console.error(cube);
        console.error(new_cube);

        new_cube.setMemoryLen(cube.getMemoryLen());
        new_cube.initMemory();
    }
    // copy markers from parent - mutations can happen
    const markers = cube.getSideMarkers();
    for (let i = 0; i < CUBE_SIDES; ++i) {
        let marker = markers[i];
        new_cube.setSideMarker(i, marker);
    }
    return nextIP(cube);
}, getStr(op1, op2) { return "CREATE"; },
},

// 720 разрушить кубик на стороне B (только если он мертвый)
720: {name: "DESTROY", energy: 3, proc(cube, op1, op2) {
    const world = cube.getWorld();
    const side = getSideRegB(cube);

    const rel_cube = world.getCubeNeighbor(cube, side);
    if (rel_cube && !rel_cube.isAlive()) {
        world.destroyCube(rel_cube);

        console.log(`DESTROY: cube ${cube.getId()} destroys cube ${rel_cube.getId()} on the side ${side}`);
    }
    return nextIP(cube);
}, getStr(op1, op2) { return "DESTROY"; },
},

// 730 подключиться к кубику на стороне B и передать ему часть своей энергии op1 в процентах от 0 до 1, и в абсолютных единицах op2
730: {name: "ENERGY_OUT", energy: 1, proc(cube, op1, op2) {
    const world = cube.getWorld();
    const side = getSideRegB(cube);

    const rel_cube = world.getCubeNeighbor(cube, side);
    if (rel_cube) {
        const is_connected = cube.compareSideMarker(rel_cube, side);
        if (is_connected) {
            let energy = cube.getEnergy();

            console.log(`ENERGY_OUT enter: cube ${cube.getId()} energy = ${energy}, cube ${rel_cube.getId()} energy = ${rel_cube.getEnergy()}`);

            let part1 = 0;
            op1 = utils.clamp(op1, 0, 1);
            if (op1 > 0 && op1 <= 1) {
                part1 = parseInt(energy * op1);
                rel_cube.addEnergy(part1);

                energy -= part1;
                if (energy <= 0) {
                    energy = 0;
                }
            }
            let part2 = getPositiveNum(op2);
            if (energy >= part2) {
                rel_cube.addEnergy(part2);

                energy -= part2;
                if (energy <= 0) {
                    energy = 0;
                }
            }
            cube.setEnergy(energy);
        
            console.log(`ENERGY_OUT: cube ${cube.getId()} send energy: ${part1} + ${part2}`);
            console.log(`ENERGY_OUT exit: cube ${cube.getId()} energy = ${energy}, cube ${rel_cube.getId()} energy = ${rel_cube.getEnergy()}`);
        }
    }
    return nextIP(cube);
}, getStr(op1, op2) { return "ENERGY_OUT " + op1 + " " + op2; },
},

// 740 подключиться к кубику на стороне B и забрать у него часть энергии op1 в процентах от 0 до 1, и в абсолютных единицах op2
740: {name: "ENERGY_IN", energy: 1, proc(cube, op1, op2) {
    const world = cube.getWorld();
    const side = getSideRegB(cube);

    const rel_cube = world.getCubeNeighbor(cube, side);
    if (rel_cube) {
        const is_connected = cube.compareSideMarker(rel_cube, side);
        if (is_connected) {
            let energy = rel_cube.getEnergy();

            console.log(`ENERGY_IN enter: cube ${cube.getId()} energy = ${cube.getEnergy()}, cube ${rel_cube.getId()} energy = ${energy}`);

            let part1 = 0;
            op1 = utils.clamp(op1, 0, 1);
            if (op1 > 0 && op1 <= 1) {
                part1 = parseInt(energy * op1);
                cube.addEnergy(part1);

                energy -= part1;
                if (energy <= 0) {
                    energy = 0;
                }
            }
            let part2 = getPositiveNum(op2);
            if (energy >= part2) {
                cube.addEnergy(part2);

                energy -= part2;
                if (energy <= 0) {
                    energy = 0;
                }
            }
            rel_cube.setEnergy(energy);
        
            console.log(`ENERGY_IN: cube ${cube.getId()} got energy: ${part1} + ${part2}`);
            console.log(`ENERGY_IN exit: cube ${cube.getId()} energy = ${cube.getEnergy()}, cube ${rel_cube.getId()} energy = ${energy}`);
        }
    }
    return nextIP(cube);
}, getStr(op1, op2) { return "ENERGY_IN " + op1 + " " + op2; },
},

// 750 подключиться к кубику на стороне B и сохранить в его код участок памяти от адреса Addr1 длиной в А байт (пишем всегда в начало)
// если маркеры совпадают
// если код кубика недостаточной длины, то расширим его
// энергия кубика уменьшается на 1 единицу за каждый скопированный байт
// если энергия закончилась, операция прерывается
// Это основная операция для размножения, подверженная мутациям.
// Четыре вида изменчивости: замена операции, удаление операции, вставка новой операции, дублирование операции.
750: {name: "COPY_CODE", energy: 0, proc(cube, op1, op2) {
    console.log(`COPY_CODE: cube ${cube.getId()}`);

    let energy = cube.getEnergy();
    if (energy <= 0) {
        console.log(`COPY_CODE: cube ${cube.getId()} - not enough energy`);
        return nextIP(cube);
    }
    const world = cube.getWorld();
    const side = getSideRegB(cube);

    const rel_cube = world.getCubeNeighbor(cube, side);
    if (!rel_cube) {
        console.log(`COPY_CODE: cube ${cube.getId()} - neighbor was not found`);
        return nextIP(cube);
    }
    const is_connected = cube.compareSideMarker(rel_cube, side);
    if (!is_connected) {
        // markers are not equal - failed to connect
        console.log(`COPY_CODE: cube ${cube.getId()} - marker is not equal with neighbor's`);
        return nextIP(cube);
    }
    const memory = cube.getMemory();
    const code = rel_cube.getCode();
    
    let len = getPositiveNum(cube.getRegA());
    let read_addr = getPositiveNum(cube.getRegAddr1());

    if (read_addr + len >= memory.length) {
        len = memory.length - read_addr;
    }
    console.log(`COPY_CODE: cube ${cube.getId()}, len: ${len}, read_addr: ${read_addr}`);
    try {
        let write_address = 0;
        for (let i = 0; i < len; i += OPERATION_SIZE) {
            let read_address = read_addr + i;
            if (read_address >= memory.length || write_address >= MAX_MEMORY_LEN) {
                break;
            }
            // deletion
            if (utils.isRandomEvent(DEL_OP_CHANCE, DEL_OP_BASE)) {
                // just ignore coping, do not change write address, and save energy
                energy += OPERATION_SIZE;

            } else if (utils.isRandomEvent(MUTATION_COPY_CHANCE, MUTATION_COPY_BASE)) {
                // mutation
                let op_code = memory[read_address];
                op_code = mutateDuringCopy(cube, op_code, read_address);

                code[write_address + 0] = op_code;
                code[write_address + 1] = memory[read_address + 1];
                code[write_address + 2] = memory[read_address + 2];
    
                write_address += OPERATION_SIZE;
            } else {
                // copy without mutation
                code[write_address + 0] = memory[read_address + 0];
                code[write_address + 1] = memory[read_address + 1];
                code[write_address + 2] = memory[read_address + 2];

                write_address += OPERATION_SIZE;
                if (write_address < MAX_MEMORY_LEN) {
                    // insertion
                    if (utils.isRandomEvent(INSERT_OP_CHANCE, INSERT_OP_BASE)) {
                        // create and insert a new operation with random operands
                        const op_code = mutateDuringCopy(cube, 0, 0);
                        const op1 = mutateDuringCopy(cube, 0, 1);
                        const op2 = mutateDuringCopy(cube, 0, 2);

                        code[write_address + 0] = op_code;
                        code[write_address + 1] = op1;
                        code[write_address + 2] = op2;

                        write_address += OPERATION_SIZE;
                    } else if (utils.isRandomEvent(DUBLE_COPY_CHANCE, DUBLE_COPY_BASE)) {
                        // duplication                        
                        code[write_address + 0] = memory[read_address + 0];
                        code[write_address + 1] = memory[read_address + 1];
                        code[write_address + 2] = memory[read_address + 2];

                        //console.info(`DUBLE_COPY: cube ${cube.getId()}, len: ${len}, read_addr: ${read_addr}, write_addr: ${write_address}`);
                        write_address += OPERATION_SIZE;
                    }
                }
            }
            cube.setRegAddr1(read_address + OPERATION_SIZE);

            energy -= OPERATION_SIZE;
            if (energy <= 0) {
                energy = 0;
                break;
            }
        }
    } catch (e) {
        console.error(e);
        console.error(cube);
        console.error(rel_cube);

        throw e;
    }
    cube.setEnergy(energy);

    //console.log(`COPY_CODE: cube ${cube.getId()}, new child code:`, code);
    return nextIP(cube);
}, getStr(op1, op2) { return "COPY_CODE"; },
},

// 760 подключиться к кубику на стороне B и сохранить в его память по адресу Addr2 участок памяти от адреса Addr1 длиной А байт
760: {name: "COPY_MEMORY", energy: 0, proc(cube, op1, op2) {
    console.log(`COPY_MEMORY: cube ${cube.getId()}`);

    let energy = cube.getEnergy();
    if (energy <= 0) {
        console.log(`COPY_MEMORY: cube ${cube.getId()} - not enough energy`);
        return nextIP(cube);
    }
    const world = cube.getWorld();
    const side = getSideRegB(cube);

    const rel_cube = world.getCubeNeighbor(cube, side);
    if (!rel_cube) {
        console.log(`COPY_MEMORY: cube ${cube.getId()} - neighbor was not found`);
        return nextIP(cube);
    }
    const is_connected = cube.compareSideMarker(rel_cube, side);
    if (!is_connected) {
        // markers are not equal - failed to connect
        console.log(`COPY_MEMORY: cube ${cube.getId()} - marker is not equal with neighbor`);
        return nextIP(cube);
    }
    const memory1 = cube.getMemory();
    const memory2 = rel_cube.getMemory();

    const len = getPositiveNum(cube.getRegA());
    const read_addr = getPositiveNum(cube.getRegAddr1());
    const write_addr= getPositiveNum(cube.getRegAddr2());

    for (let i = 0; i < len; ++i) {
        let read_address = read_addr + i;
        let write_address= write_addr + i;
        if (read_address >= memory1.length || write_address >= memory2.length) {
            break;
        }
        memory2[write_address] = memory1[read_address];

        cube.setRegAddr1(read_address);
        cube.setRegAddr2(write_address);

        energy--;
        if (energy <= 0) {
            energy = 0;
            break;
        }
    }
    cube.setEnergy(energy);

    //console.log(`COPY_MEMORY: cube ${cube.getId()}, new neighbor memory:`, memory2);
    return nextIP(cube);
}, getStr(op1, op2) { return "COPY_MEMORY"; },
},

// 770 подключиться к кубику на стороне B и прочитать его код от команды Addr1 в свою память по адресу Addr2, A команд
770: {name: "STEAL_CODE", energy: 0, proc(cube, op1, op2) {
    console.log(`STEAL_CODE: cube ${cube.getId()}`);

    let energy = cube.getEnergy();
    if (energy <= 0) {
        console.log(`STEAL_CODE: cube ${cube.getId()} - not enough energy`);
        return nextIP(cube);
    }
    const world = cube.getWorld();
    const side = getSideRegB(cube);

    const rel_cube = world.getCubeNeighbor(cube, side);
    if (!rel_cube) {
        console.log(`STEAL_CODE: cube ${cube.getId()} - neighbor was not found`);
        return nextIP(cube);
    }
    const is_connected = cube.compareSideMarker(rel_cube, side);
    if (!is_connected) {
        // markers are not equal - failed to connect
        console.log(`STEAL_CODE: cube ${cube.getId()} - marker is not equal with neighbor`);
        return nextIP(cube);
    }
    const memory = cube.getMemory();
    const code = rel_cube.getCode();

    //console.log(`STEAL_CODE: cube ${cube.getId()}, code: `, code);
    
    let len = getPositiveNum(cube.getRegA()) * OPERATION_SIZE;
    let read_addr = getPositiveNum(cube.getRegAddr1());
    if (read_addr + len >= code.length) {
        len = code.length - read_addr;
    }
    
    const write_addr = getPositiveNum(cube.getRegAddr2());
    for (let i = 0; i < len; i += OPERATION_SIZE) {
        let read_address = read_addr + i;
        let write_address= write_addr+ i;
        if (read_address >= code.length || write_address >= memory.length) {
            break;
        }
        memory[write_address + 0] = code[read_address + 0];
        memory[write_address + 1] = code[read_address + 1];
        memory[write_address + 2] = code[read_address + 2];

        cube.setRegAddr1(read_address + 2);
        cube.setRegAddr2(write_address+ 2);

        energy -= OPERATION_SIZE;
        if (energy <= 0) {
            energy = 0;
            break;
        }
    }
    cube.setEnergy(energy);

    //console.log(`STEAL_CODE: cube ${cube.getId()} from cube ${rel_cube.getId()}, memory: `, memory);
    return nextIP(cube);
}, getStr(op1, op2) { return "STEAL_CODE"; },
},

// 780 подключиться к кубику на стороне B и прочитать его память от адреса Addr1 длиной А байт в свою память по адресу Addr2
780: {name: "STEAL_MEMORY", energy: 0, proc(cube, op1, op2) {
    let energy = cube.getEnergy();
    if (energy <= 0) {
        console.log(`STEAL_MEMORY: cube ${cube.getId()} - not enough energy`);
        return nextIP(cube);
    }
    const world = cube.getWorld();
    const side = getSideRegB(cube);

    const rel_cube = world.getCubeNeighbor(cube, side);
    if (!rel_cube) {
        console.log(`STEAL_MEMORY: cube ${cube.getId()} - neighbor was not found`);
        return nextIP(cube);
    }
    const is_connected = cube.compareSideMarker(rel_cube, side);
    if (!is_connected) {
        // markers are not equal - failed to connect
        console.log(`STEAL_MEMORY: cube ${cube.getId()} - marker is not equal with neighbor`);
        return nextIP(cube);
    }
    const memory1 = cube.getMemory();
    const memory2 = rel_cube.getMemory();

    let len = getPositiveNum(cube.getRegA());
    let read_addr = getPositiveNum(cube.getRegAddr1());

    if (read_addr + len >= memory2.length) {
        len = memory2.length - read_addr;
    }
    const write_addr = getPositiveNum(cube.getRegAddr2());
    for (let i = 0; i < len; ++i) {
        let read_address = read_addr + i;
        let write_address= write_addr+ i;
        if (read_address >= memory2.length || write_address >= memory1.length) {
            break;
        }
        memory1[write_address] = memory2[read_address];
        cube.setRegAddr1(read_address);
        cube.setRegAddr2(write_address);

        energy--;
        if (energy <= 0) {
            energy = 0;
            break;
        }
    }
    cube.setEnergy(energy);

    //console.log(`STEAL_MEMORY: cube ${cube.getId()}, memory: `, memory1);
    return nextIP(cube);
}, getStr(op1, op2) { return "STEAL_MEMORY"; },
},

// 790 копировать участок кода в участок памяти от адреса Addr1 длиной в А команд в Addr2 (мутации)
790: {name: "COPY_MY_CODE", energy: 0, proc(cube, op1, op2) {
    console.log(`COPY_MY_CODE for cube ${cube.getId()}`);

    let energy = cube.getEnergy();
    if (energy <= 0) {
        console.log(`COPY_MY_CODE for cube ${cube.getId()} - not enough energy`);
        return nextIP(cube);
    }
    const code = cube.getCode();
    const memory = cube.getMemory();
    
    const len = getPositiveNum(cube.getRegA());
    let read_addr = getPositiveNum(cube.getRegAddr1());
    let write_addr= getPositiveNum(cube.getRegAddr2());

    console.log(`COPY_MY_CODE: cube ${cube.getId()}: len = ${len}, read_addr = ${read_addr}, write_addr = ${write_addr}, energy = ${energy}`);

    for (let i = 0; i < len; ++i) {
        // copy all triplet at once
        for (let j = 0; j < OPERATION_SIZE; j++) {
            let address = read_addr + i*OPERATION_SIZE + j;
            if (address < code.length) {
                let value = code[address];
                if (utils.isRandomEvent(MUTATION_COPY_CHANCE, MUTATION_COPY_BASE)) {
                    value = mutateDuringCopy(cube, value, address);
                }
                let write_address = write_addr + i*OPERATION_SIZE + j;
                if (write_address >= memory.length) {
                    break;
                }
                memory[write_address] = value;
            
                energy--;
                cube.setRegAddr1(address);
                cube.setRegAddr2(write_address);
            }
        }
        if (energy <= 0) {
            energy = 0;
            break;
        }
    }
    cube.setEnergy(energy);

    //console.log(`COPY_MY_CODE: cube ${cube.getId()} finished, memory: `, memory);
    return nextIP(cube);
}, getStr(op1, op2) { return "COPY_MY_CODE"; },
},

// 800 перемещение в ячейку по стороне B (только если она свободна)
800: {name: "MOVE", energy: 1, proc(cube, op1, op2) {
    const world = cube.getWorld();
    const side  = getSideRegB(cube);

    const rel_cube = world.getCubeNeighbor(cube, side);
    if (!rel_cube) {
        cube.move(side);
    }
    return nextIP(cube);
}, getStr(op1, op2) { return "MOVE"; },
},

// 810 подключиться к кубику на стороне B и объединить с ним память и код
810: {name: "JOINT", energy: 5, proc(cube, op1, op2) {
    console.log(`JOINT: ${cube.getId()}`);

    const world = cube.getWorld();
    const side = getSideRegB(cube);

    const rel_cube = world.getCubeNeighbor(cube, side);
    if (!rel_cube) {
        console.log(`JOINT: cube ${cube.getId()} - neighbor was not found`);
        return nextIP(cube);
    }
    const is_connected = cube.compareSideMarker(rel_cube, side);
    if (!is_connected) {
        // markers are not equal - failed to connect
        console.log(`JOINT: cube ${cube.getId()} - marker is not equal with neighbor's`);
        return nextIP(cube);
    }
    const new_code = rel_cube.getCode().concat(cube.getCode());
    if (new_code.length > MAX_MEMORY_LEN) {
        new_code.splice(MAX_MEMORY_LEN, new_code.length-MAX_MEMORY_LEN);
    }
    rel_cube.setCode(new_code);

    const new_memory = rel_cube.getMemory().concat(cube.getMemory());
    if (new_memory.length > MAX_MEMORY_LEN) {
        new_memory.splice(MAX_MEMORY_LEN, new_memory.length-MAX_MEMORY_LEN);
    }
    rel_cube.setMemory(new_memory);
    rel_cube.setMemoryLen(new_memory.length);

    return nextIP(cube);
}, getStr(op1, op2) { return "JOINT"; },
},

};
//-----------------------------------------------------------------------------

let ops_array = Object.keys(ops);
ops_array.forEach( (op, i) => {
    ops_array[i] = Number(op);
});
console.log(ops_array);


function mutateDuringCopy(cube, value, address) {
    if (address % OPERATION_SIZE === 0) {
        // this is operation
        const i = utils.randomInt(0, ops_array.length-1);
        const new_operation = ops_array[i];

        console.log(`mutation in cube ${cube.getId()}: address ${address}, operation ${value} -> ${new_operation}`);

        value = new_operation;
    } else {
        // this is operand
        let new_value = 0;
        if (Math.random() < 0.5) {
            new_value = Math.random();
        } else {
            new_value = utils.randomInt(-100, 100);
        }
        console.log(`mutation in cube ${cube.getId()}: address ${address}, operand ${value} -> ${new_value}`);
        value = new_value;
    }
    return value;
}
