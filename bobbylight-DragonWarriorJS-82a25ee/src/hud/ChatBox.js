import { Panel } from '../ui/Panel';
export class ChatBox extends Panel {
    constructor(rect, font) {
        super(rect, true);
        this.font = font;
        this.lines = [
            'WELCOME TO ALEFGARD',
            'COMMAND / SPELL / ITEM / STATUS',
            'PRESS SPACE TO CAST',
        ];
    }
    push(text) {
        this.lines.push(text.toUpperCase());
        while (this.lines.length > 6) {
            this.lines.shift();
        }
    }
    draw(ctx) {
        super.draw(ctx);
        this.font.drawText(ctx, 'CHAT', this.rect.x + 2, this.rect.y + 2);
        for (let i = 0; i < this.lines.length; i++) {
            this.font.drawText(ctx, this.lines[i], this.rect.x + 2, this.rect.y + 11 + i * 9);
        }
    }
}
//# sourceMappingURL=ChatBox.js.map