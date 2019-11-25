"use strict";
//почему то не работает с первого раза
// function toggle() {
//     if (mobileMenu.style.display==="block") {
//         mobileMenu.style.display = "none";
//     } else {
//         mobileMenu.style.display = "none";
//     }
// }

let mobileMenu = document.getElementById("listmenu").style;
let threeBars = document.getElementById("threebars");
let threeBars_close = document.getElementById("threebars_close");
let scroll_lock = document.body.style;


// function off() {
//     return mobileMenu.style.display = "none";
// }

// function on() {
//     return mobileMenu.style.display = "block";
// }

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

// threeBars.onclick = on;
// threeBars_close.onclick = off;
if (window.matchMedia("(max-width: 700px)").matches) {
    threeBars.onclick = toggle;
    threeBars_close.onclick = toggle;
  }
