import { Item, getItemByName } from './Item';
import { Party } from '@/app/dw/Party';
export class Inventory {
    // Add custom procedural asset item
    pushCustomAsset(assetKey, assetData) {
        // Create a minimal Item with custom sprite
        const item = new Item(assetKey, {
            baseCost: 0,
            use: () => true
        });
        item.proceduralSprite = assetData.pngUrl;
        this.items.push(item);
    }
    constructor() {
        this.items = [];
    }
    getItems() {
        return this.items.slice();
    }
    /**
     * Returns the number of items in the inventory.
     */
    getSize() {
        return this.items.length;
    }
    clear() {
        this.items.length = 0;
    }
    push(item) {
        if (this.items.length < Party.INVENTORY_MAX_SIZE) {
            this.items.push(item);
        }
    }
    remove(itemName) {
        const item = getItemByName(itemName);
        if (!item) {
            return false;
        }
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }
    toString() {
        return `[Inventory: size=${this.items.length}]`;
    }
}
//# sourceMappingURL=Inventory.js.map