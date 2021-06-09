/* game stuff
    so that i can tweak numbers easily from one spot
    instead of hunting thru files
    
map width/height
obstacles spawning + rates + sizes + w/e
player speed

*/

class Constants {
    constructor() {
        // fps
        this.game_fps = 60;

        // background map
        this.canvas_width = 300;
        this.canvas_height = 200;
        this.ground_level = 150;
        this.ground_color = '#19e03a';
        this.sky_color = '#19869c';

        // menu screen
        this.menu_color = 'rgb(148, 90, 53)';

        // obstacles
        this.obstaclesEnabled = true;
        this.obstacleRate = [1,3]; // [min, max] seconds b4 obstacle spawns
        this.obstacle_color = '#c7c6bf';
        this.obstacle_width = 18;
        this.obstacle_speed = 5;
        this.obstacle_heights = [40, 60]; //[min, max] height

        // player movement
        this.player_gravity = 1;
        this.player_maxVelX = 15;
        this.player_maxVelY = 8;
        this.player_jumpAccel = 60;

        // key bindings
        this.key_left = 37;
        this.key_right = 39;
        this.key_jump = 38;
        this.key_start = 38;
    }
}