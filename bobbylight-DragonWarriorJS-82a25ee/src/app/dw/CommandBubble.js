import { Bubble } from './Bubble';
export class CommandBubble extends Bubble {
    constructor(game) {
        const scale = game.scale;
        const yInc = game.stringHeight() + 7 * scale;
        const tileSize = game.getTileSize();
        const w = 140 * scale;
        let h = 85 * scale;
        if (game.getCheatsEnabled()) {
            h += yInc;
        }
        const x = game.getWidth() - tileSize * 2 - w;
        const y = tileSize / 2;
        super(game, 'COMMAND', x, y, w, h);
        this.selection = 0;
        this.yInc = yInc;
        this.choices = CommandBubble.createChoices(game);
    }
    static createChoices(game) {
        const choices = [
            'TALK',
            'STATUS',
            'STAIRS',
            'SEARCH',
            'SPELL',
            'ITEM',
            'EQUIP', // New equipment menu
            'DOOR',
            'TAKE',
        ];
        if (game.getCheatsEnabled()) {
            choices.splice(choices.length / 2, 0, 'WARP*');
            choices.push('CHEAT*');
        }
        return choices;
    }
    getRowCount() {
        return this.choices.length / 2;
    }
    handleCommandChosen(screen) {
        // If the user canceled, close the dialog
        if (this.selection === -1) {
            screen.startRoaming();
            return;
        }
        switch (this.choices[this.selection]) {
            case 'TALK':
                screen.talkToNpc();
                break;
            case 'STATUS':
                screen.showStatus();
                break;
            case 'STAIRS':
                screen.takeStairs();
                break;
            case 'SEARCH':
                screen.search();
                break;
            case 'WARP*':
                screen.showWarpBubble();
                break;
            case 'SPELL':
                screen.showSpellList();
                break;
            case 'ITEM':
                screen.showInventory();
                break;
            case 'EQUIP':
                screen.showEquipmentMenu();
                break;
            case 'DOOR':
                screen.openDoor();
                break;
            case 'TAKE':
                screen.take();
                break;
            case 'CHEAT*':
                screen.showCheatBubble();
                break;
        }
    }
    handleInput() {
        const im = this.game.inputManager;
        const rowCount = this.getRowCount();
        if (im.up(true)) {
            this.selection = this.selection - 1;
            if (this.selection < 0) {
                this.selection = rowCount * 2 - 1;
            }
            this.resetArrowTimer();
        }
        else if (im.down(true)) {
            this.selection = Math.floor((this.selection + 1) % (rowCount * 2));
            this.resetArrowTimer();
        }
        else if (this.selection >= rowCount && im.left(true)) {
            this.selection -= rowCount;
            this.resetArrowTimer();
        }
        else if (this.selection < rowCount && im.right(true)) {
            this.selection += rowCount;
            this.resetArrowTimer();
        }
        else if (this.game.cancelKeyPressed()) {
            this.selection = -1;
            return true;
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
        // Draw the choices in 2 columns
        const rowCount = this.getRowCount();
        this.choices.forEach((choice, index) => {
            this.game.drawString(choice, x, y0);
            if (index !== rowCount - 1) {
                y0 += this.yInc;
            }
            else {
                x += 70 * SCALE;
                y0 -= (rowCount - 1) * this.yInc;
            }
        });
        // Draw the arrow beside the active item
        if (this.selection < rowCount) {
            x -= 70 * SCALE;
        }
        x -= this.game.stringWidth('>') + 2 * SCALE;
        y0 = y + this.yInc * (this.selection % rowCount);
        this.drawArrow(x, y0);
    }
    reset() {
        this.selection = 0;
    }
}
//# sourceMappingURL=CommandBubble.js.map