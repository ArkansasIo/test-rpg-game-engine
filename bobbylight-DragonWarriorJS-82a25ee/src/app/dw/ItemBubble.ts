import { DwGame } from './DwGame';
import { ChoiceBubble } from '@/app/dw/ChoiceBubble';
import { Item } from '@/app/dw/Item';
import { Weapon } from './Weapon';
import { Armor } from './Armor';
import { Shield } from './Shield';

export class ItemBubble extends ChoiceBubble<Item | Weapon | Armor | Shield> {
    constructor(game: DwGame) {
        const tileSize: number = game.getTileSize();
        const x: number = 9 * tileSize;
        const y: number = 3 * tileSize;
        const inventory = game.getParty().getInventory();
        const inventorySize = inventory.getSize();
        const w: number = 7 * tileSize;
        const h: number = (inventorySize + 5) * tileSize;
        // Combine items and equipment for display
        const choices = [
            ...inventory.getItems(),
            ...(game.hero.weapon ? [game.hero.weapon] : []),
            ...(game.hero.armor ? [game.hero.armor] : []),
            ...(game.hero.shield ? [game.hero.shield] : []),
        ];
        super(game, x, y, w, h, choices, (choice) => {
            if ('displayName' in choice) return choice.displayName;
            return choice.name;
        }, true);
    }

    // Called when the player selects an item or equipment
    handleEquipOrUse(selected: Item | Weapon | Armor | Shield, state: any): boolean {
        const hero = state.game.hero;
        // Equip logic
        if (selected instanceof Weapon) {
            const prev = hero.equipWeapon(selected);
            if (prev) state.game.getParty().getInventory().push(prev);
            state.game.setStatusMessage(`Equipped ${selected.displayName}`);
            return true;
        } else if (selected instanceof Armor) {
            const prev = hero.equipArmor(selected);
            if (prev) state.game.getParty().getInventory().push(prev);
            state.game.setStatusMessage(`Equipped ${selected.displayName}`);
            return true;
        } else if (selected instanceof Shield) {
            const prev = hero.equipShield(selected);
            if (prev) state.game.getParty().getInventory().push(prev);
            state.game.setStatusMessage(`Equipped ${selected.displayName}`);
            return true;
        } else if (selected instanceof Item) {
            // Use item as before
            return selected.use(state);
        }
        return false;
    }
}
