import { Armor } from './Armor';
import { ChoiceBubble } from './ChoiceBubble';
import { Item } from './Item';
import { Shield } from './Shield';
import { Weapon } from './Weapon';
export class ItemBubble extends ChoiceBubble {
    constructor(game) {
        const tileSize = game.getTileSize();
        const x = 9 * tileSize;
        const y = 3 * tileSize;
        const inventory = game.getParty().getInventory();
        const inventorySize = inventory.getSize();
        const w = 7 * tileSize;
        const h = (inventorySize + 5) * tileSize;
        const choices = inventory.getItems();
        if (game.hero.weapon) {
            choices.push(game.hero.weapon);
        }
        if (game.hero.armor) {
            choices.push(game.hero.armor);
        }
        if (game.hero.shield) {
            choices.push(game.hero.shield);
        }
        super(game, x, y, w, h, choices, (choice) => {
            return choice.displayName;
        }, true);
    }
    // Called when the player selects an item or equipment
    handleEquipOrUse(selected, state) {
        const hero = state.game.hero;
        // Equip logic
        if (selected instanceof Weapon) {
            hero.equipWeapon(selected);
            state.game.setStatusMessage(`Equipped ${selected.displayName}`);
            return true;
        }
        else if (selected instanceof Armor) {
            hero.equipArmor(selected);
            state.game.setStatusMessage(`Equipped ${selected.displayName}`);
            return true;
        }
        else if (selected instanceof Shield) {
            hero.equipShield(selected);
            state.game.setStatusMessage(`Equipped ${selected.displayName}`);
            return true;
        }
        else if (selected instanceof Item) {
            // Use item as before
            return selected.use(state);
        }
        return false;
    }
}
//# sourceMappingURL=ItemBubble.js.map