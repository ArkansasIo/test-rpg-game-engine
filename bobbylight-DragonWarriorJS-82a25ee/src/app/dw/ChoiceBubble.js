import { Bubble } from './Bubble';
/**
 * A bubble that lets the user choose between several choices.
 */
export class ChoiceBubble extends Bubble {
    constructor(game, x, y, w, h, choices = [], choiceStringifier, cancellable = false, title) {
        super(game, title, x, y, w, h);
        this.choices = choices;
        this.choiceStringifier = choiceStringifier !== null && choiceStringifier !== void 0 ? choiceStringifier : ((choice) => choice);
        this.cancellable = cancellable;
        this.curChoice = 0;
    }
    /**
     * Returns the index of the item selected, or <code>-1</code> if the
     * user cancelled this dialog.
     */
    getSelectedIndex() {
        return this.curChoice;
    }
    /**
     * Returns the item selected, or <code>undefined</code> if the user
     * cancelled this dialog.
     */
    getSelectedItem() {
        return this.curChoice > -1 ? this.choices[this.curChoice] : undefined;
    }
    /**
     * Allows this bubble to react to user input.
     *
     * @return Whether a choice was made.
     */
    handleInput() {
        const im = this.game.inputManager;
        if (this.game.cancelKeyPressed()) {
            if (this.cancellable) {
                this.curChoice = -1;
                return true;
            }
            this.curChoice = 0;
            this.resetArrowTimer();
        }
        else if (this.game.actionKeyPressed()) {
            this.game.audio.playSound('menu');
            return true;
        }
        else if (im.up(true)) {
            this.curChoice = Math.max(0, this.curChoice - 1);
            this.resetArrowTimer();
        }
        else if (im.down(true)) {
            this.curChoice = Math.min(this.curChoice + 1, this.choices.length - 1);
            this.resetArrowTimer();
        }
        return false;
    }
    paintContent(ctx, x, y) {
        ctx.fillStyle = 'rgb(255,255,255)';
        this.choices.forEach((choice, index) => {
            if (this.curChoice === index) {
                this.drawArrow(this.x + Bubble.ARROW_MARGIN, y);
            }
            this.game.drawString(this.choiceStringifier(choice), x, y);
            y += 18 * this.game.scale;
        });
    }
    reset() {
        this.curChoice = 0;
    }
}
//# sourceMappingURL=ChoiceBubble.js.map