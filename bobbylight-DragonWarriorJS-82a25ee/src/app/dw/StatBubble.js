import { Bubble } from './Bubble';
// ...existing code...
export class StatBubble extends Bubble {
    constructor(game) {
        const scale = game.scale;
        const tileSize = game.getTileSize();
        const w = 60 * scale;
        const h = 100 * scale;
        const x = tileSize;
        const y = tileSize * 3 / 2;
        let title = game.hero.name;
        if (title.length > 4) {
            title = title.substring(0, 4);
        }
        super(game, title, x, y, w, h);
        this.selection = 0;
    }
    calculateX2Offs(val) {
        return this.game.stringWidth(val.toString(10));
        //         var digits = 1;
        //         while (val > 10) {
        //            digits++;
        //            val /= 10;
        //         }
        //         return digits * 10 * this.game.scale;
    }
    /**
     * This bubble is a little more space-constrained so its
     * x-margin is smaller.
     */
    getXMargin() {
        const scale = this.game.scale;
        // Inset + border width + inner spacing
        return (1 + 2 + 2) * scale;
    }
    handleInput() {
    }
    paintContent(ctx, x, y) {
        const SCALE = this.game.scale;
        const x2 = this.x + this.w - this.getXMargin();
        let y0 = y;
        const Y_INC = this.game.stringHeight() + 7 * SCALE;
        const party = this.game.party;
        const hero = this.game.hero;
        this.game.drawString('LV', x, y0);
        let xOffs = this.calculateX2Offs(hero.level);
        this.game.drawString(hero.level, x2 - xOffs, y0);
        y0 += Y_INC;
        this.game.drawString('HP', x, y0);
        xOffs = this.calculateX2Offs(hero.hp);
        this.game.drawString(hero.hp, x2 - xOffs, y0);
        y0 += Y_INC;
        this.game.drawString('MP', x, y0);
        xOffs = this.calculateX2Offs(hero.mp);
        this.game.drawString(hero.mp, x2 - xOffs, y0);
        y0 += Y_INC;
        this.game.drawString('G', x, y0);
        xOffs = this.calculateX2Offs(party.gold);
        this.game.drawString(party.gold, x2 - xOffs, y0);
        y0 += Y_INC;
        this.game.drawString('E', x, y0);
        xOffs = this.calculateX2Offs(hero.exp);
        this.game.drawString(hero.exp, x2 - xOffs, y0);
        y0 += Y_INC;
    }
}
//# sourceMappingURL=StatBubble.js.map