import type { BitmapFont } from '../gfx/BitmapFont';
import { Panel } from './Panel';

export class Button extends Panel {
    constructor(
        rect: { x: number; y: number; w: number; h: number },
        private readonly font: BitmapFont,
        public text: string,
        private readonly onPress: () => void,
    ) {
        super(rect);
    }

    override draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);
        const tx = this.rect.x + 4;
        const ty = this.rect.y + Math.max(1, Math.floor((this.rect.h - this.font.charH) / 2));
        this.font.drawText(ctx, this.text, tx, ty);
    }

    protected override onClick(): boolean {
        this.onPress();
        return true;
    }
}
