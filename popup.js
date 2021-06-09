/**
 * Ben Lepsch
 * bean runner or something idk
 */


/* create canvas */
const canvas = document.createElement('canvas');
canvas.width = 300;
canvas.height = 200;
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
        if (game.running) {
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
        } else {
            menu.draw();
        }
	}
}

startGame(60);