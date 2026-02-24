import { TiledMap } from 'gtp';
export class DwMap extends TiledMap {
    constructor(name, data, args) {
        super(data, args);
        this.name = name;
        this.npcs = [];
        this.talkAcrosses = new Map();
        this.doors = [];
        this.chests = new Map();
        this.hiddenItems = new Map();
    }
    removeChest(chest) {
        this.chests.delete(chest.location);
    }
    removeHiddenItem(item) {
        this.hiddenItems.delete(item.location);
    }
}
//# sourceMappingURL=DwMap.js.map