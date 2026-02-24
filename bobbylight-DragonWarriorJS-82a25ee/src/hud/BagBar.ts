import type { BitmapFont } from '../gfx/BitmapFont';
import { Panel } from '../ui/Panel';

export class BagBar extends Panel {
    constructor(
        rect: { x: number; y: number; w: number; h: number },
        private readonly font: BitmapFont,
    ) {
        super(rect);
    }

    override draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);
        this.font.drawText(ctx, 'BAGS 1 2 3 4', this.rect.x + 2, this.rect.y + 2);
    }
}
