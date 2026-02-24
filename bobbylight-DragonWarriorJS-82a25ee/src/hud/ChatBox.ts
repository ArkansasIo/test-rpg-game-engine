import type { BitmapFont } from '../gfx/BitmapFont';
import { Panel } from '../ui/Panel';

export class ChatBox extends Panel {
    private readonly lines: string[] = [
        'WELCOME TO ALEFGARD',
        'COMMAND / SPELL / ITEM / STATUS',
        'PRESS SPACE TO CAST',
    ];

    constructor(
        rect: { x: number; y: number; w: number; h: number },
        private readonly font: BitmapFont,
    ) {
        super(rect, true);
    }

    push(text: string): void {
        this.lines.push(text.toUpperCase());
        while (this.lines.length > 6) {
            this.lines.shift();
        }
    }

    override draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);
        this.font.drawText(ctx, 'CHAT', this.rect.x + 2, this.rect.y + 2);
        for (let i = 0; i < this.lines.length; i++) {
            this.font.drawText(ctx, this.lines[i], this.rect.x + 2, this.rect.y + 11 + i * 9);
        }
    }
}
