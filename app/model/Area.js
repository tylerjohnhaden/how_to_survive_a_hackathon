export class Area {
    constructor(areaDatum) {
        this.map = areaDatum.map;
        this.startingCoordinates = areaDatum.startingCoordinates;
        this.scene = areaDatum.scene;
        this.size = areaDatum.size;

        // load the skin, will exist before as another image
        this.skin = new Image();
        this.skin.src = "./sprites/" + areaDatum.skinName + ".png";

        this.positionSets = areaDatum.positionSets;
    }

    get rows() {
        return this.map.length;
    }

    get cols() {
        if (this.map.length != 0) {
            return this.map[0].length;
        }

        return 0;
    }
}
