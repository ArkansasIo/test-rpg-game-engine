import { Panel } from '../ui/Panel';
export class BagBar extends Panel {
    constructor(rect, font) {
        super(rect);
        this.font = font;
    }
    draw(ctx) {
        super.draw(ctx);
        this.font.drawText(ctx, 'BAGS 1 2 3 4', this.rect.x + 2, this.rect.y + 2);
    }
}
//# sourceMappingURL=BagBar.js.map