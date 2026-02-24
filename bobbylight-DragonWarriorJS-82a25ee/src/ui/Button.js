import { Panel } from './Panel';
export class Button extends Panel {
    constructor(rect, font, text, onPress) {
        super(rect);
        this.font = font;
        this.text = text;
        this.onPress = onPress;
    }
    draw(ctx) {
        super.draw(ctx);
        const tx = this.rect.x + 4;
        const ty = this.rect.y + Math.max(1, Math.floor((this.rect.h - this.font.charH) / 2));
        this.font.drawText(ctx, this.text, tx, ty);
    }
    onClick() {
        this.onPress();
        return true;
    }
}
//# sourceMappingURL=Button.js.map