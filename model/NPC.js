export class NPC {
    constructor(npcDatum, scale) {
        this.name = "???";
        this.dialogueLines = npcDatum.dialogueLines.unshift("Hi! My name is " + this.name + "!");
        this.dialogueIndex = 0;

        // load the skin, will exist before as another image
        this.skin = new Image();
        this.skin.src = "./sprites/" + npcDatum.skin + ".png";

        // location
        this.x = npcDatum.x * scale;
        this.y = npcDatum.y * scale;
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
        this.boundary;
        this.wt = 0;
    }
}
