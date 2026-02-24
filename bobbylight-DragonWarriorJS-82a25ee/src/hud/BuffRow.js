import { Panel } from '../ui/Panel';
export class BuffRow extends Panel {
    constructor(rect, font) {
        super(rect);
        this.font = font;
        this.buffs = ['ATK+', 'DEF+', 'REGEN'];
    }
    draw(ctx) {
        super.draw(ctx);
        for (let i = 0; i < this.buffs.length; i++) {
            this.font.drawText(ctx, this.buffs[i], this.rect.x + 2 + i * 28, this.rect.y + 2);
        }
    }
}
//# sourceMappingURL=BuffRow.js.map