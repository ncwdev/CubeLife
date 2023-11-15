# CubeLife
Artificial life

Hobby project on Babylon.js.

Artificial organism has pseudo assembler code as DNA, memory, registers, side markers and energy. It represented in space as cube with color defined by hash of it's code.

Executing operations consumes energy. If the organism runs out of energy and fails to replenish it for a period of time, it dies.

Every side of cube has marker (some integer value). If two side-contacting cubes have the same markers, they can "communicate" - exchange code, memory and energy.

With some chances code can mutate during coping in four ways:
- change operation or operand to random value;
- duplicate operation;
- insert new random operation;
- delete operation.

TODO:
- remove a potential possibility of immortality;
- add energy sources like some kind of "food".