import type { InputSnapshot } from '../core/Input';
import type { BitmapFont } from '../gfx/BitmapFont';
import { nesTheme } from '../gfx/Theme';
import { Panel } from '../ui/Panel';

export class ActionBar extends Panel {
    slotCount = 12;
    castProgress = 0.65;

    constructor(
        rect: { x: number; y: number; w: number; h: number },
        private readonly castRect: { x: number; y: number; w: number; h: number },
        private readonly font: BitmapFont,
    ) {
        super(rect, true);
    }

    override update(dt: number, input: InputSnapshot): void {
        if (input.keysPressed.has(' ')) {
            this.castProgress = 0;
        }
        this.castProgress = Math.min(1, this.castProgress + dt * 0.22);
        super.update(dt, input);
    }

    override draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);
        const inset = 2;
        const slotW = 14;
        const slotH = 14;
        const gap = 1;
        const startX = this.rect.x + inset;
        const y = this.rect.y + this.rect.h - slotH - inset;

        for (let i = 0; i < this.slotCount; i++) {
            const x = startX + i * (slotW + gap);
            ctx.fillStyle = nesTheme.panelFill;
            ctx.fillRect(x, y, slotW, slotH);
            ctx.strokeStyle = nesTheme.panelBorder;
            ctx.strokeRect(x + 0.5, y + 0.5, slotW - 1, slotH - 1);
            this.font.drawText(ctx, `${(i + 1) % 10}`, x + 3, y + 3);
        }

        // Cast bar above the action bar.
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.castRect.x, this.castRect.y, this.castRect.w, this.castRect.h);
        ctx.strokeStyle = nesTheme.panelBorder;
        ctx.strokeRect(this.castRect.x + 0.5, this.castRect.y + 0.5, this.castRect.w - 1, this.castRect.h - 1);
        ctx.fillStyle = nesTheme.panelAccent;
        ctx.fillRect(this.castRect.x + 1, this.castRect.y + 1, Math.floor((this.castRect.w - 2) * this.castProgress), this.castRect.h - 2);
        this.font.drawText(ctx, 'CAST', this.castRect.x + 2, this.castRect.y - 8);
    }
}
