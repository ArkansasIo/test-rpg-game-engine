import { BaseState } from './BaseState';
import { ChoiceBubble } from './ChoiceBubble';
import { InventoryMenu } from './InventoryMenu';
import { EquipmentMenu } from './EquipmentMenu';
import { StatusBubble } from './StatusBubble';
import { SkillsMenu } from './SkillsMenu';
import { QuestsMenu } from './QuestsMenu';
import { MapMenu } from './MapMenu';
/**
 * OG-style in-game menu state (vertical panel, classic RPG style)
 */
export class GameMenuState extends BaseState {
    constructor(game) {
        super(game);
        this.submenuState = null;
        this.choices = [
            'ITEMS',
            'SPELLS',
            'EQUIP',
            'INVENTORY',
            'SKILLS',
            'QUESTS',
            'MAP',
            'STATUS',
            'CLOSE',
        ];
        const tileSize = game.getTileSize();
        const w = 80 * game.scale;
        const h = this.choices.length * (game.stringHeight() + 10) + 24;
        const x = Math.floor((game.getWidth() - w) / 2);
        const y = Math.floor((game.getHeight() - h) / 2);
        this.menuBubble = new ChoiceBubble(game, x, y, w, h, this.choices);
    }
    enter() {
        super.enter();
        this.menuBubble.setActive(true);
    }
    update(delta) {
        if (this.submenuState) {
            this.submenuState.update(delta);
            return;
        }
        if (this.menuBubble.handleInput()) {
            const idx = this.menuBubble.getSelectedIndex();
            switch (idx) {
                case 0: // ITEMS
                    this.game.setState(new InventoryMenu(this.game, this.game.getParty().getInventory().items));
                    break;
                case 1: // SPELLS
                    // TODO: Implement SpellsMenu
                    this.game.audio.playSound('missed1');
                    break;
                case 2: // EQUIP
                    this.game.setState(new EquipmentMenu(this.game, this.game.getParty().equipment));
                    break;
                case 3: // INVENTORY
                    this.game.setState(new InventoryMenu(this.game, this.game.getParty().getInventory().items));
                    break;
                case 4: // SKILLS
                    this.game.setState(new SkillsMenu(this.game, this.game.getParty().skills));
                    break;
                case 5: // QUESTS
                    this.game.setState(new QuestsMenu(this.game, this.game.getParty().quests));
                    break;
                case 6: // MAP
                    this.game.setState(new MapMenu(this.game, this.game.getParty().mapData));
                    break;
                case 7: // STATUS
                    this.game.setState(new StatusBubble(this.game));
                    break;
                case 8: // CLOSE
                default:
                    this.game.popState();
                    break;
            }
        }
    }
    render(ctx) {
        if (this.submenuState) {
            this.submenuState.render(ctx);
            return;
        }
        this.menuBubble.paint(ctx);
    }
}
//# sourceMappingURL=GameMenuState.js.map