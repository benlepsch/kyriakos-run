function constrain(val, min, max) {
    if (val < min) {
        val = min;
    }
    if (val > max) {
        val = max;
    }
    return val;
}

class ImageSrcHolder {
    constructor() {

    }
}

class Player {
    constructor(src_running='player_sprite', src_jumping='player_jumping', height=53, width=40) {
        this.rep = new ImageSrcHolder();
        this.rep.default = document.getElementById(src_running);
        this.rep.jumping = document.getElementById(src_running);
        this.left = 0;
        this.top = 0;
        this.height = height;
        this.width = width;

        this.velocityX = 0;
        this.velocityY = 0;
        this.accelX = 0;
        this.gravity = 1;
        this.jumpAccel = 60;
        this.accelY = 0;

        this.maxVelX = 15;
        this.maxVelY = 8;
    }

    startJump() {
        if (this.top + this.height == new Game().ground_level) {
            this.accelY = -1*this.jumpAccel;
        }
    }

    updateAccel(accelX) {
        this.accelX += accelX;
    }

    update() {
        this.velocityX = constrain(this.velocityX + this.accelX, -1*this.maxVelX, this.maxVelX);
		this.velocityY = constrain(this.velocityY + this.gravity + this.accelY, -1*this.maxVelY, this.maxVelY);
		
		this.velocityX = this.velocityX < 0 ? Math.ceil(this.velocityX/2) : Math.floor(this.velocityX/2);
		this.accelX = this.accelX < 0 ? Math.ceil(this.accelX/4) : Math.floor(this.accelX/4);
		this.accelY = this.accelY < 0 ? Math.ceil(this.accelY/2) : Math.floor(this.accelY/2);
    
        this.left += this.velocityX;
        this.top += this.velocityY;


        if (this.top + this.height >= new Game().ground_level && this.accelY >= 0) {
            this.top = new Game().ground_level - this.height;
        }

        if (this.left <= 0) {
            this.left = 0;
        }
        if (this.left + this.width >= canvas.width) {
            this.left = canvas.width - this.width;
        }
    }

    // draw onto the canvas
    draw() {
        if (this.top + this.height != new Game().ground_level) {
            ctx.drawImage(this.rep.jumping, this.left, this.top);
        } else {
            ctx.drawImage(this.rep.default, this.left, this.top);
        }
    }
}