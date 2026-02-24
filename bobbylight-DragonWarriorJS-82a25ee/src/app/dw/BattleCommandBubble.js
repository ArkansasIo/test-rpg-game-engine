import { Bubble } from './Bubble';
export class BattleCommandBubble extends Bubble {
    constructor(game) {
        const tileSize = game.getTileSize();
        super(game, 'COMMAND', 8 * tileSize, tileSize, tileSize * 8, tileSize * 3);
        this.selection = 0;
    }
    handleCommandChosen(state) {
        switch (this.selection) {
            case 0: // Fight
                state.fight();
                break;
            case 1: // Run
                state.run();
                break;
            case 2: // Spell
                //state.spell();
                break;
            case 3: // Item
                state.item();
                break;
        }
    }
    handleInput() {
        const im = this.game.inputManager;
        if (im.up(true)) {
            this.selection = this.selection - 1;
            if (this.selection < 0) {
                this.selection = 3;
            }
        }
        else if (im.down(true)) {
            this.selection = Math.floor((this.selection + 1) % 4);
        }
        else if (this.selection > 1 && im.left(true)) {
            this.selection -= 2;
        }
        else if (this.selection < 2 && im.right(true)) {
            this.selection += 2;
        }
        else if (this.game.cancelKeyPressed()) {
            this.reset();
            return false;
        }
        else if (this.game.actionKeyPressed()) {
            this.game.audio.playSound('menu');
            return true;
        }
        return false;
    }
    paintContent(ctx, x, y) {
        const SCALE = this.game.scale;
        let y0 = y;
        const Y_INC = this.game.stringHeight() + 6 * SCALE;
        this.game.drawString('FIGHT', x, y0);
        y0 += Y_INC;
        this.game.drawString('RUN', x, y0);
        y0 += Y_INC;
        x += 64 * SCALE;
        y0 -= 2 * Y_INC;
        this.game.drawString('SPELL', x, y0);
        y0 += Y_INC;
        this.game.drawString('ITEM', x, y0);
        y0 += Y_INC;
        if (this.selection < 2) {
            x -= 64 * SCALE;
        }
        x -= this.game.stringWidth('>') + 2 * SCALE;
        y0 = y + Y_INC * (this.selection % 2);
        this.drawArrow(x, y0);
    }
    reset() {
        this.selection = 0;
    }
}
//# sourceMappingURL=BattleCommandBubble.js.map