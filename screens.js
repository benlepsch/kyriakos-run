
class Menu {
    constructor() {
        this.icon = document.getElementById('bean');
        this.iconHeight = 69;
        this.iconWidth = 122;
    }

    // if the mouse is on the bean button
    checkMouseOverStart(mx, my) {
        if (mx >= 0 && mx <= this.iconWidth && my >= 0 && my <= this.iconHeight) {
            return true;
        }
    }

    // big ass bean and some text underneath that says "Click te bean to start game"
    draw() {
        ctx.fillStyle = c.menu_color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.icon, 0, 0);
        ctx.font = '30px Calibri';
        ctx.fillStyle = 'black';
        ctx.fillText('click theb ean to start', 20, 100);
    }
}

// draw background, move clouds, spawn obstacles, what have you
class Game {
    constructor() {
        this.ground_level = c.ground_level;
        this.ground_color = c.ground_color;
        this.sky_color = c.sky_color;
        this.obstaclesEnabled = c.obstaclesEnabled;
        this.obstacles = [];
        this.lastObstacle = 0;
        this.obstacleTimer = 0;
        this.obstacleUpperTick = c.obstacleRate[1];
        this.obstacleLowerTick = c.obstacleRate[0];
        this.running = false;
        this.player = null;
    }

    begin() {
        this.player = new Player();
    }

    // game over!
    lose() {
        this.player = null;
        this.running = false;
        this.obstacleTimer = 0;
        this.lastObstacle = 0;
        this.obstacles = [];
    }

    // generate/move obstackles/clouds
    update() {
        let current = new Date().getTime();
        let dt = Math.round((current - this.lastObstacle)/1000);

        if (dt >= this.obstacleTimer && this.obstaclesEnabled) {
            this.lastObstacle = current;
            this.obstacles.push(new Obstacle());
            this.obstacleTimer = Math.round(Math.random() * this.obstacleUpperTick) + this.obstacleLowerTick;
        }

        for (let i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i].update();
            if (this.obstacles[i].remove) {
                this.obstacles.splice(i, 1);
                i --;
            }
        }
    }

    // detect player collision with obstacles
    checkCollision() {
        let collide = false;
        let player_left = this.player.left;
        let player_right = player_left + this.player.width;
        let player_bottom = this.player.top + this.player.height;

        for (let i = 0; i < this.obstacles.length; i++) {
            let obst = this.obstacles[i].corners();

            if (player_bottom < obst['top']) {
                continue;
            }

            if ((player_right >= obst['left'] && player_left <= obst['left']) ||
                (player_left <= obst['right'] && player_right >= obst['right']) ||
                (player_left <= obst['left'] && player_right >= obst['right'])) {
                
                collide = true;
            }
        }

        if (collide) {
            this.lose();
        }
    }

    // draw background + obstacles
    draw() {
        ctx.fillStyle = this.sky_color;
        ctx.fillRect(0, 0, canvas.width, this.ground_level);

        ctx.fillStyle = this.ground_color;
        ctx.fillRect(0, this.ground_level, canvas.width, canvas.height);

        for (let i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i].draw();
        }
    }
}

// walls? lightsabers? what are these
class Obstacle {
    constructor() {
        this.color = c.obstacle_color;
        this.height = Math.random() * (c.obstacle_heights[1] - c.obstacle_heights[0]) + c.obstacle_heights[0];
        this.width = c.obstacle_width;
        this.speed = c.obstacle_speed;
        this.left = canvas.width;
        this.remove = false;
    }

    // for collision checking with player
    corners() {
        return {
            'left': this.left, 
            'top': new Game().ground_level - this.height, 
            'right': this.left + this.width
        };
    }

    // move position
    update() {
        console.log('left: ' + this.left);
        this.left -= this.speed;
        if (this.left + this.width <= 0) {
            this.remove = true;
        }
    }

    // draw
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.left, new Game().ground_level - this.height, this.width, this.height);
    }
}