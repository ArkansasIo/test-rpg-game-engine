import { drawNesPanel } from '../gfx/Theme';
import { Widget } from './Widget';
export class Panel extends Widget {
    constructor(rect, thickBorder = false) {
        super(rect);
        this.thickBorder = thickBorder;
    }
    draw(ctx) {
        const { x, y, w, h } = this.rect;
        drawNesPanel(ctx, x, y, w, h, this.thickBorder);
        super.draw(ctx);
    }
}
//# sourceMappingURL=Panel.js.map