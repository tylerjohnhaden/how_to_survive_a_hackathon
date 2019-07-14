import { story } from './story.js';

// area for collision (x and y are relative to the object starting from the top right)
export function boundArea(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}


function getIMGNPC(name) {
    var charIMG = new Image();
    charIMG.src = "./sprites/" + name + ".png";

    var charReady = false;
    charIMG.onload = function () {
        charReady = true;
    };

    this.skin = charIMG;
    this.ready = charReady;
}

export function hacker(name, x, y, classType, skillSet) {
    this.name = name;
    this.x = x * story.size;
    this.y = y * story.size;
    this.classType = classType;
    this.skillSet = skillSet;

    this.width = 16;
    this.height = 16;
    this.dir = "north";
    this.action = "idle";


    // movement
    this.speed = 1;
    this.initPos = 0;
    this.moving = false;
    this.velX = 0;
    this.velY = 0;

    // other properties
    this.text = ["Hi! My name is " + name + "!", "I'm a " + classType + "<0>"];
    this.text_index = 0;
    this.interact = false;
    this.move = "drunk_walk";
    this.boundary;
    this.wt = 0;

    var set = new getIMGNPC(classType);
    this.skin = set.skin;
    this.ready = set.ready;
    this.show = true;


}

export function npc(x, y, text, skin) {
    this.name = "???";
    this.x = x * story.size;
    this.y = y * story.size;

    // sprite properties
    this.width = 16;
    this.height = 16;
    this.dir = "north";
    this.action = "idle";

    //movement
    this.speed = 1;
    this.initPos = 0;
    this.moving = false;
    this.velX = 0;
    this.velY = 0;

    //other properties
    this.text = text;
    this.text_index = 0;
    this.interact = false;
    this.move = "drunk_walk";
    this.boundary;
    this.wt = 0;

    var set = new getIMGNPC(skin);
    this.skin = set.skin;
    this.ready = set.ready;
    this.show = true;
}
