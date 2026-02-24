import { drawNesPanel } from '../gfx/Theme';
import { Widget } from './Widget';

export class Panel extends Widget {
    constructor(rect: { x: number; y: number; w: number; h: number }, private readonly thickBorder = false) {
        super(rect);
    }

    override draw(ctx: CanvasRenderingContext2D): void {
        const { x, y, w, h } = this.rect;
        drawNesPanel(ctx, x, y, w, h, this.thickBorder);
        super.draw(ctx);
    }
}
