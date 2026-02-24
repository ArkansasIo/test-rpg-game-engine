import type { BitmapFont } from '../gfx/BitmapFont';
import { Panel } from '../ui/Panel';

export class BuffRow extends Panel {
    private readonly buffs = [ 'ATK+', 'DEF+', 'REGEN' ];

    constructor(
        rect: { x: number; y: number; w: number; h: number },
        private readonly font: BitmapFont,
    ) {
        super(rect);
    }

    override draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);
        for (let i = 0; i < this.buffs.length; i++) {
            this.font.drawText(ctx, this.buffs[i], this.rect.x + 2 + i * 28, this.rect.y + 2);
        }
    }
}
