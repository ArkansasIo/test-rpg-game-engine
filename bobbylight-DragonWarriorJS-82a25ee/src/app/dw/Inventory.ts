import { Item, getItemByName } from './Item';
import { Party } from '@/app/dw/Party';

export interface InventoryEntry {
    item: Item;
    count: number;
}

export class Inventory {
    private readonly items: InventoryEntry[];

    constructor() {
        this.items = [];
    }

    pushCustomAsset(assetKey: string, assetData: any) {
        const item = new Item(assetKey, {
            baseCost: 0,
            use: () => true
        });
        item.proceduralSprite = assetData.pngUrl;
        this.addItem(item, 1);
    }

    getItems(): InventoryEntry[] {
        return this.items.slice();
    }

    getSize(): number {
        return this.items.reduce((sum, entry) => sum + entry.count, 0);
    }

    clear() {
        this.items.length = 0;
    }

    addItem(item: Item, count = 1) {
        let entry = this.items.find(e => e.item.name === item.name);
        if (entry) {
            entry.count += count;
        } else if (this.items.length < Party.INVENTORY_MAX_SIZE) {
            this.items.push({ item, count });
        }
    }

    remove(itemName: string, count = 1): boolean {
        const entry = this.items.find(e => e.item.name === itemName);
        if (!entry) return false;
        if (entry.count > count) {
            entry.count -= count;
            return true;
        } else if (entry.count === count) {
            this.items.splice(this.items.indexOf(entry), 1);
            return true;
        }
        return false;
    }

    toString(): string {
        return `[Inventory: size=${this.getSize()}]`;
    }
}
