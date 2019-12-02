"use strict";

let mobileMenu = document.getElementById("listmenu").style;
let threeBars = document.getElementById("threebars");
let threeBars_close = document.getElementById("threebars_close");
let scroll_lock = document.body.style;

//overflow здесь <div style="overflow">
function toggle() {
    if (mobileMenu.display === "block") {
        scroll_lock.overflow = null; 
        mobileMenu.display = null; 
    } else {
        scroll_lock.overflow = "hidden";
        mobileMenu.display = "block";
    }
}

if (window.matchMedia("(max-width: 700px)").matches) {
    threeBars.onclick = toggle;
    threeBars_close.onclick = toggle;
}
