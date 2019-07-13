export class Player {
    constructor(scale) {
        //sprite properties
        this.name = "Hax"
        this.width = 16
        this.height = 16

        // load the skin will exist before as another image
        this.skin = new Image();
        this.skin.src = "./sprites/main.png";

        //movement
        this.speed = 2
        this.initPos = 0
        this.moving = false
        this.x = 8 * scale
        this.y = 4 * scale
        this.velX = 0
        this.velY = 0
        this.show = true

        //other properties
        this.interact = false
        this.other = null
        this.pathQueue = []
        this.lastPos = []
        this.following = false
    }
}
