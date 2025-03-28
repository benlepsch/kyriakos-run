class Menu {
    constructor() {
        this.icon = document.getElementById('bean');
        this.iconHeight = 69;
        this.iconWidth = 122;
        this.highscore = 0;
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
        ctx.fillText('click the bean or press', 20, 100);
        ctx.fillText('up arrow \nto start', 20, 140);
        ctx.font = '20px Calibri';
        ctx.fillText('highscore: ' + this.highscore, 30, 180);
        ctx.fillText('last score: ' + game.lastscore, 30, 210);
    }
}

// draw background, move clouds, spawn obstacles, what have you
class Game {
    constructor() {
        // backgruond
        this.ground_level = c.ground_level;
        this.ground_color = c.ground_color;
        this.sky_color = c.sky_color;

        // clouds
        this.clouds = [];
        this.lastCloud = 0;
        this.cloudTimer = 0;
        this.cloudUpperTick = c.cloud_rate[1];
        this.cloudLowerTick = c.cloud_rate[0];

        // obstacles
        this.obstaclesEnabled = c.obstacles_enabled;
        this.obstacles = [];
        this.lastObstacle = 0;
        this.obstacleTimer = 0;
        this.obstacleUpperTick = c.obstacle_rate[1];
        this.obstacleLowerTick = c.obstacle_rate[0];
        this.obstacleLastClose = false;

        // main loop/player
        this.running = false;
        this.player = null;
        this.jump_while_died = false;
        this.score = 0;
        this.lastscore = 0;
        this.pause = false;
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
        this.lastscore = this.score;
        if (this.score > menu.highscore) {
            menu.highscore = this.score;

            chrome.storage.local.set({"highscore": this.score}, function() {
                console.log('saving highscore');
            });
        }

        this.score = 0;
        this.obstacles = [];
        this.clouds = [];
        if (keys[c.key_jump]) {
            this.jump_while_died = true;
        }
    }

    // generate/move obstackles/clouds
    update() {
        this.score += 1*c.score_const;

        let current = new Date().getTime();
        this.obstacleTimer -= 1000/200;
        let clouds_dt = Math.round((current - this.lastCloud)/1000);
        
        // obstacles
        if (this.obstacleTimer <= 0 && this.obstaclesEnabled) {
            this.lastObstacle = current;
            this.obstacles.push(new Obstacle());
            let l = Math.random();
            if (!this.obstacleLastClose && l < c.obstacle_close_chance) {
                this.obstacleTimer = c.obstacle_close_dist;
                this.obstacleLastClose = true;
            } else if (this.obstacleLastClose && l < c.obstacle_second_close_chance) {
                this.obstacleTimer = c.obstacle_close_dist;
            } else {
                this.obstacleTimer = (l * this.obstacleUpperTick) + (l * this.obstacleUpperTick/2) + this.obstacleLowerTick;
                this.obstacleLastClose = false;
            }
        }

        for (let i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i].update();
            if (this.obstacles[i].remove) {
                this.obstacles.splice(i, 1);
                i --;
            }
        }

        // clouds
        if (clouds_dt >= this.cloudTimer) {
            this.lastCloud = current;
            this.clouds.push(new Cloud());
            this.cloudTimer = Math.round(Math.random()* this.cloudUpperTick) + this.cloudLowerTick;
        }

        for (let i = 0; i < this.clouds.length; i++) {
            this.clouds[i].update();
            if (this.clouds[i].remove) {
                this.clouds.splice(i, 1);
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
        
        for (let i = 0; i < this.clouds.length; i++) {
            this.clouds[i].draw();
        }

        for (let i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i].draw();
        }

        ctx.font = '30px Calibri';
        ctx.fillStyle = 'yellow';
        ctx.fillText(this.score, canvas.width - 100, 20);
    }
}

class Cloud {
    constructor() {
        this.color = c.cloud_color;
        this.outlines = c.cloud_outlines;
        this.height = Math.random() * (c.cloud_height[1] - c.cloud_height[0]) + c.cloud_height[0];
        this.width = Math.random() * (c.cloud_width[1] - c.cloud_width[0]) + c.cloud_width[0];
        this.top = Math.random() * (c.cloud_top[1] - c.cloud_top[0]) + c.cloud_top[0];
        this.speed = Math.random() * (c.cloud_speed[1] - c.cloud_speed[0]) + c.cloud_speed[0];
        this.left = canvas.width;
        this.remove = false;
    }

    update() {
        this.left -= this.speed;
        if (this.left + this.width <= 0) {
            this.remove = true;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.left, this.top, this.width, this.height);

        if (this.outlines) {
            ctx.strokeStyle = 'black';
            ctx.beginPath();
            ctx.rect(this.left, this.top, this.width, this.height);
            ctx.stroke();
        }
    }
}

// walls? lightsabers? what are these
class Obstacle {
    constructor() {
        this.color = c.obstacle_color;
        this.height = Math.random() * (c.obstacle_heights[1] - c.obstacle_heights[0]) + c.obstacle_heights[0];
        this.width = Math.random() * (c.obstacle_width[1] - c.obstacle_width[0]) + c.obstacle_width[0];
        if (game.score >= 5000) {
            this.height = c.ground_level;
            this.width = c.canvas_width;
        }
        this.speed = c.obstacle_speed + c.obstacle_speed_growth(game.score);
        this.left = canvas.width;
        this.remove = false;

        this.rep = new ImageSrcHolder();
        this.rep.default = document.getElementById('ground_obstacle');
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
        //console.log('left: ' + this.left);
        this.left -= this.speed;
        if (this.left + this.width <= 0) {
            this.remove = true;
        }
    }

    // draw
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.left, new Game().ground_level - this.height, this.width, this.height);
        ctx.drawImage(this.rep.default, this.left, this.top);
        // i do not need to log this every tick
        // console.log('drawing rep at ' + this.left + ',' + this.height);
    }
}