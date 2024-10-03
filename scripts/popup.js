/**
 * Ben Lepsch
 * bean runner or something idk
 */

const c = new Constants();

/* create canvas */
const canvas = document.createElement('canvas');
canvas.width = c.canvas_width;
canvas.height = c.canvas_height;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

var mouse_x = 0, mouse_y = 0;

var game = new Game();
var menu = new Menu();

$(document).mousemove(function(event) {
    // -8 to adjust for canvas padding
    mouse_x = event.pageX - 8;
    mouse_y = event.pageY - 8;
});

// for interaction with menu, ignore if the game is being played
canvas.onmousedown = () => {
    if (!game.running) {
        if (menu.checkMouseOverStart(mouse_x, mouse_y)) {
            game.running = true;
            game.begin();
        }
    }
}

chrome.storage.local.get(["highscore"], function(items) {
    menu.highscore = (items.highscore == undefined) ? 0 : items.highscore;
});


/* main loop */
let fpsInterval, then, startTime, elapsed;
function startGame(fps) {
	fpsInterval = 1000 / fps;
	then = Date.now();
	startTime = then;
	runGame();
}

function runGame() {
	requestAnimationFrame(runGame);
	now = Date.now();
	elapsed = now - then;

	if (elapsed > fpsInterval) {
		then = now - (elapsed % fpsInterval);
        
		ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // draw
        if (game.running && !game.pause) {
            let inp = checkKeys();
            game.player.updateAccel(inp[0]);
            if (inp[1]) {
                game.player.startJump();
            }
            game.player.update();
            game.update();
            game.checkCollision();
            game.draw();
            if (game.running) {
                game.player.draw();
            }
        } else if (!game.pause) {
            menu.draw();
            checkStart();
        } else {
            game.draw();
            game.player.draw();
        }
	}
}

startGame(c.game_fps);