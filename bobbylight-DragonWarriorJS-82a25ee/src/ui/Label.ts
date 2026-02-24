import type { BitmapFont } from '../gfx/BitmapFont';
import { nesTheme } from '../gfx/Theme';
import { Widget } from './Widget';

export class Label extends Widget {
    constructor(
        rect: { x: number; y: number; w: number; h: number },
        private readonly font: BitmapFont,
        public text: string,
        public color: string = nesTheme.text,
    ) {
        super(rect);
    }

    override draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        this.font.drawText(ctx, this.text, this.rect.x, this.rect.y);
        super.draw(ctx);
    }
}
