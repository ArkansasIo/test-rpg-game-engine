import { BaseState } from './BaseState';
import { DwGame } from './DwGame';
import { ChoiceBubble } from './ChoiceBubble';
import { InventoryMenu } from './InventoryMenu';
import { EquipmentMenu } from './EquipmentMenu';
import { StatusBubble } from './StatusBubble';

/**
 * OG-style in-game menu state (vertical panel, classic RPG style)
 */
export class GameMenuState extends BaseState {
    private readonly menuBubble: ChoiceBubble<string>;
    private submenuState: BaseState | null = null;
    private readonly choices = [
        'ITEMS',
        'SPELLS',
        'EQUIP',
        'STATUS',
        'CLOSE',
    ];

    constructor(game: DwGame) {
        super(game);
        const tileSize = game.getTileSize();
        const w = 80 * game.scale;
        const h = this.choices.length * (game.stringHeight() + 10) + 24;
        const x = Math.floor((game.getWidth() - w) / 2);
        const y = Math.floor((game.getHeight() - h) / 2);
        this.menuBubble = new ChoiceBubble(game, x, y, w, h, this.choices);
    }

    override enter() {
        super.enter();
        this.menuBubble.setActive(true);
    }

    override update(delta: number) {
        if (this.submenuState) {
            this.submenuState.update(delta);
            return;
        }
        if (this.menuBubble.handleInput()) {
            const idx = this.menuBubble.getSelectedIndex();
            switch (idx) {
                case 0: // ITEMS
                    this.game.setState(new InventoryMenu(this.game));
                    break;
                case 1: // SPELLS
                    // TODO: Implement SpellsMenu
                    this.game.audio.playSound('missed1');
                    break;
                case 2: // EQUIP
                    this.game.setState(new EquipmentMenu(this.game));
                    break;
                case 3: // STATUS
                    this.game.setState(new StatusBubble(this.game));
                    break;
                case 4: // CLOSE
                default:
                    this.game.popState();
                    break;
            }
        }
    }

    override render(ctx: CanvasRenderingContext2D) {
        if (this.submenuState) {
            this.submenuState.render(ctx);
            return;
        }
        this.menuBubble.paint(ctx);
    }
}
