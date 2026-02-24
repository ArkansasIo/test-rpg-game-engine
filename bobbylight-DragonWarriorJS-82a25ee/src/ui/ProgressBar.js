import { nesTheme } from '../gfx/Theme';
import { Widget } from './Widget';
export class ProgressBar extends Widget {
    constructor(rect, fillColor) {
        super(rect);
        this.fillColor = fillColor;
        this.value = 1;
    }
    draw(ctx) {
        const { x, y, w, h } = this.rect;
        ctx.fillStyle = '#000000';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = nesTheme.panelBorder;
        ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
        const innerW = Math.max(0, w - 2);
        const fillW = Math.floor(innerW * Math.max(0, Math.min(1, this.value)));
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(x + 1, y + 1, fillW, Math.max(1, h - 2));
        super.draw(ctx);
    }
}
//# sourceMappingURL=ProgressBar.js.map