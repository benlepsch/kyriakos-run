/**
 * listen for key presses
 */

/* key press listeners */
const keys = {};

window.onkeydown = function(e) {
    let key = e.keyCode ? e.keyCode : e.which;

    keys[key] = true;
}

window.onkeyup = function(e) {
    let key = e.keyCode ? e.keyCode : e.which;

    keys[key] = false;
}

function checkKeys() {
    let accelX = 0;
    let jump = false;

    // left arrow
    if (keys[37]) {
        accelX -= 5;
    }

    // right arrow
    if (keys[39]) {
        accelX += 5;
    }

    // up arrow
    if (keys[38]) {
        jump = true;
    }
    
    return [accelX, jump];
}