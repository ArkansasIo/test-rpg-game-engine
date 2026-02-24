import { NesTheme } from '../gfx/Theme';
import type { BitmapFont } from '../gfx/BitmapFont';
import { Panel } from '../ui/Panel';
import { ProgressBar } from '../ui/ProgressBar';

export class UnitFrame extends Panel {
    readonly hpBar: ProgressBar;
    readonly mpBar: ProgressBar;
    hp = 32;
    maxHp = 32;
    mp = 10;
    maxMp = 10;

    constructor(
        rect: { x: number; y: number; w: number; h: number },
        private readonly font: BitmapFont,
        private readonly name: string,
    ) {
        super(rect, true);
        this.hpBar = this.add(new ProgressBar({ x: rect.x + 2, y: rect.y + 11, w: rect.w - 4, h: 5 }, NesTheme.hp));
        this.mpBar = this.add(new ProgressBar({ x: rect.x + 2, y: rect.y + 18, w: rect.w - 4, h: 5 }, NesTheme.mp));
    }

    override update(dt: number, input: import('../core/Input').InputSnapshot): void {
        this.hpBar.value = this.maxHp > 0 ? this.hp / this.maxHp : 0;
        this.mpBar.value = this.maxMp > 0 ? this.mp / this.maxMp : 0;
        super.update(dt, input);
    }

    override draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);
        this.font.drawText(ctx, this.name, this.rect.x + 2, this.rect.y + 2);
        this.font.drawText(ctx, `HP ${this.hp}/${this.maxHp}`, this.rect.x + 2, this.rect.y + 10);
        this.font.drawText(ctx, `MP ${this.mp}/${this.maxMp}`, this.rect.x + 2, this.rect.y + 17);
    }
}
