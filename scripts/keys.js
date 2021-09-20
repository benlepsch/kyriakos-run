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

    if (key == c.key_jump) {
        game.jump_while_died = false;
    }

    // pause
    if (key == c.key_pause) {
        game.pause = !game.pause;
        console.log('game being paused');
    }
    
}

function checkKeys() {
    let accelX = 0;
    let jump = false;

    // left arrow
    if (keys[c.key_left]) {
        accelX -= 5;
    }

    // right arrow
    if (keys[c.key_right]) {
        accelX += 5;
    }

    // up arrow
    if (keys[c.key_jump]) {
        jump = true;
    }
    
    return [accelX, jump];
}

function checkStart() {
    if (keys[c.key_start] && !game.jump_while_died) {
        game.running = true;
        game.begin();
    }
}