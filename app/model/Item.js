export class Item {
    constructor(itemDatum) {
        this.name = itemDatum.name;

        // location
        this.x = itemDatum.x;
        this.y = itemDatum.y;

        this.text = itemDatum.dialogueLines;
        this.text_index = 0;

        // load the skin, will exist before as another image
        this.skin = new Image();
        this.skin.src = "./sprites/" + this.name + ".png";


        this.area = null;
        this.show = true;
    }
}
