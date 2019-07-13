export class Hacker {
    constructor(hackerDatum, scale) {
        this.name = hackerDatum.name;
        this.dialogueLines = hackerDatum.dialogueLines.unshift("Hi! My name is " + this.name + "!");
        this.dialogueIndex = 0;
        this.skillSet = hackerDatum.skillSet;

        // load the skin, will exist before as another image
        this.skin = new Image();
        this.skin.src = "./sprites/" + hackerDatum.classType + ".png";

        // location
        this.x = hackerDatum.x * scale;
        this.y = hackerDatum.y * scale;
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
        this.interact = false;
        this.move = "drunk_walk";
        this.wt = 0;
    }
}
