import { Bubble } from './Bubble';
export class ShoppingBubble extends Bubble {
    constructor(game, shoppingInfo) {
        const tileSize = game.getTileSize();
        const x = 5 * tileSize;
        const y = 1 * tileSize;
        const width = 9 * tileSize;
        const height = 6 * tileSize;
        super(game, undefined, x, y, width, height);
        this.choices = shoppingInfo.choices.map((choice) => {
            return game.getWeapon(choice) || game.getArmor(choice) || game.getShield(choice);
        });
        this.curChoice = 0;
    }
    /**
    * Returns whether the user is "done" talking; that is, whether the entire
    * conversation has been rendered (including multiple pages, if necessary).
    */
    handleInput() {
        const im = this.game.inputManager;
        if (this.game.cancelKeyPressed()) {
            this.curChoice = -1;
            return true;
        }
        else if (this.game.actionKeyPressed()) {
            return true;
        }
        else if (im.up(true)) {
            this.curChoice = Math.max(0, this.curChoice - 1);
        }
        else if (im.down(true)) {
            this.curChoice = Math.min(this.curChoice + 1, this.choices.length - 1);
        }
        return false;
    }
    paintContent(ctx, x, y) {
        ctx.fillStyle = 'rgb(255,255,255)';
        this.choices.forEach((choice, index) => {
            if (this.curChoice === index) {
                this.drawArrow(this.x + Bubble.ARROW_MARGIN, y);
            }
            this.game.drawString(choice.displayName, x, y);
            y += 10 * this.game.scale;
        });
    }
    getSelectedItem() {
        return this.curChoice === -1 ? undefined :
            this.choices[this.curChoice];
    }
    setChoices(choices) {
        this.choices = choices;
    }
}
//# sourceMappingURL=ShoppingBubble.js.map