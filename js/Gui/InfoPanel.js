const SORT_NONE = 0;
const SORT_ASC  = 1;
const SORT_DESC =-1;

const VueApp = {
    data() {
        return {
            species: new Map(),
            selected_cube: null,
            sorting_dir: SORT_NONE,
            sorting_column: 0,
            is_help_visible: false,
        }
    },
    methods: {
        updateSpecies(data) {
            this.species = data;
        },
        selectSpecies(item) {
            world.showSpecies(item.hash);
        },
        showAllSpecies() {
            world.showAllSpecies();
        },
        sortSpecies(sorting_column) {
            this.sorting_column = sorting_column;

            if (this.sorting_dir === SORT_NONE) {
                this.sorting_dir = SORT_ASC;
            } else {
                this.sorting_dir *= -1;
            }
        },
        clearSort() {
            this.sorting_dir = SORT_NONE;
            this.sorting_column = 0;
        },
        asdfasd() {
            this.is_help_visible = !this.is_help_visible;

            const div_help = document.getElementById("HelpPanel");
            div_help.style.display = this.is_help_visible ? "block" : "none";
        },
    }
};
const app = Vue.createApp(VueApp);
const vm = app.mount('#VueApp');


const div_panel= document.getElementById("InfoPanel");

const info_all  = document.getElementById("info_all");
const info_alive= document.getElementById("info_alive");
const info_dead = document.getElementById("info_dead");

export function setVisible(flag) {
    div_panel.style.display = flag ? "grid" : "none";
}

export function setCubesStats(all, alive, dead) {
    info_all.innerHTML  = "all: " + all;
    info_alive.innerHTML= "alive: " + alive;
    info_dead.innerHTML = "dead: " + dead;
}

export function setAllNumber(v) {
    info_all.innerHTML = v;
}

export function updateSpeciesList(map) {
    const array = Array.from(map, ([hash, obj]) => obj);
    if (vm.sorting_dir === SORT_NONE) {
        vm.species = array;
        return;
    }
    // generation - 0
    // code_length- 1 
    // amount     - 2

    let dir = vm.sorting_dir;

    if (vm.sorting_column === 0) {        
        array.sort( (a, b) => dir * (a.generation - b.generation));
    } else if (vm.sorting_column === 1) {
        array.sort((a, b) => dir * (a.code_length - b.code_length));
    } else if (vm.sorting_column === 2) {
        array.sort((a, b) => dir * (a.amount - b.amount));
    }
    vm.species = array;
}

export function setSelectedCube(cube) {
    vm.selected_cube = cube;
}