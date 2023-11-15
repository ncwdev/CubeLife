const div_menu = document.getElementById("MainMenu");
const div_info = document.getElementById("InfoPanel");

export const MainMenu = {
    setVisible(flag) {
        div_menu.style.display = flag ? "grid" : "none";
        div_info.style.display = flag ? "none" : "grid";
    },
};