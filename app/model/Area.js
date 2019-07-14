export class Area {
    constructor(map, scene, size, setToStart) {
        this.map = map;
        this.scene = scene;
        this.size = size;
        this.setToStart = setToStart;
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
