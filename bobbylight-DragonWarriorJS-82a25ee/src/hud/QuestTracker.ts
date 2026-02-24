import type { InputSnapshot } from '../core/Input';
import type { BitmapFont } from '../gfx/BitmapFont';
import { Panel } from '../ui/Panel';

export class QuestTracker extends Panel {
    private readonly lines = [
        'QUESTS',
        '1. RUNE OF LIGHT',
        '2. SLIME CROWN',
        '3. CASTLE KEY',
    ];

    constructor(
        rect: { x: number; y: number; w: number; h: number },
        private readonly font: BitmapFont,
    ) {
        super(rect, true);
    }

    override update(dt: number, input: InputSnapshot): void {
        super.update(dt, input);
    }

    override draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);
        for (let i = 0; i < this.lines.length; i++) {
            this.font.drawText(ctx, this.lines[i], this.rect.x + 2, this.rect.y + 2 + i * 9);
        }
    }
}
