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

        // menu screen
        this.menu_color = 'rgb(148, 90, 53)';
        
        // background map
        this.canvas_width = 500;
        this.canvas_height = 250;
        this.ground_level = 190;
        this.ground_color = '#19e03a';
        this.sky_color = '#19869c';

        // clouds
        this.cloud_color = '#ffffff';
        this.cloud_outlines = false;
        this.cloud_height = [40, 80]; // [min, max] height
        this.cloud_width = [50, 100]; // [min, max] width
        this.cloud_top = [0, 40]; // [min, max] y pos
        this.cloud_speed = [2, 6]; // [min, max] speed
        this.cloud_rate = [1, 2]; // you get it by now

        // obstacles
        this.obstacles_enabled = true;
        this.obstacle_rate = [1*50,3*100]; // [min, max] seconds b4 obstacle spawns
        this.obstacle_color = '#c7c6bf';
        this.obstacle_width = [18, 25];
        this.obstacle_speed = 5;
        this.obstacle_heights = [40, 60]; //[min, max] height
        this.obstacle_speed_growth = (score) => {
            return Math.log10(score);
        }

        // player movement
        this.player_gravity = 1;
        this.player_maxVelX = 15;
        this.player_maxVelY = 15;
        this.player_jumpAccel = 17;

        // key bindings
        this.key_left = 37;
        this.key_right = 39;
        this.key_jump = 38;
        this.key_start = 38;
    }
}