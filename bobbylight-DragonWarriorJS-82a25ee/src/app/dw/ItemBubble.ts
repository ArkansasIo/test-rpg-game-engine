import { DwGame } from './DwGame';
import { Armor } from './Armor';
import { ChoiceBubble } from './ChoiceBubble';
import { Item } from './Item';
import { RoamingState } from './RoamingState';
import { Shield } from './Shield';
import { Weapon } from './Weapon';

export class ItemBubble extends ChoiceBubble<Item | Weapon | Armor | Shield> {
    constructor(game: DwGame) {
        const tileSize: number = game.getTileSize();
        const x: number = 9 * tileSize;
        const y: number = 3 * tileSize;
        const inventory = game.getParty().getInventory();
        const inventorySize = inventory.getSize();
        const w: number = 7 * tileSize;
        const h: number = (inventorySize + 5) * tileSize;
        const choices: (Item | Weapon | Armor | Shield)[] = inventory.getItems();
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
    handleEquipOrUse(selected: Item | Weapon | Armor | Shield, state: RoamingState): boolean {
        const hero = state.game.hero;
        // Equip logic
        if (selected instanceof Weapon) {
            hero.equipWeapon(selected);
            state.game.setStatusMessage(`Equipped ${selected.displayName}`);
            return true;
        } else if (selected instanceof Armor) {
            hero.equipArmor(selected);
            state.game.setStatusMessage(`Equipped ${selected.displayName}`);
            return true;
        } else if (selected instanceof Shield) {
            hero.equipShield(selected);
            state.game.setStatusMessage(`Equipped ${selected.displayName}`);
            return true;
        } else if (selected instanceof Item) {
            // Use item as before
            return selected.use(state);
        }
        return false;
    }
}
