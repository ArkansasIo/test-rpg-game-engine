import { nesTheme } from '../gfx/Theme';
import { Widget } from './Widget';
export class Label extends Widget {
    constructor(rect, font, text, color = nesTheme.text) {
        super(rect);
        this.font = font;
        this.text = text;
        this.color = color;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        this.font.drawText(ctx, this.text, this.rect.x, this.rect.y);
        super.draw(ctx);
    }
}
//# sourceMappingURL=Label.js.map