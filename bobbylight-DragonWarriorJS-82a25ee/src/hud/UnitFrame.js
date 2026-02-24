import { nesTheme } from '../gfx/Theme';
import { Panel } from '../ui/Panel';
import { ProgressBar } from '../ui/ProgressBar';
export class UnitFrame extends Panel {
    constructor(rect, font, name) {
        super(rect, true);
        this.font = font;
        this.name = name;
        this.hp = 32;
        this.maxHp = 32;
        this.mp = 10;
        this.maxMp = 10;
        this.hpBar = this.add(new ProgressBar({ x: rect.x + 2, y: rect.y + 11, w: rect.w - 4, h: 5 }, nesTheme.hp));
        this.mpBar = this.add(new ProgressBar({ x: rect.x + 2, y: rect.y + 18, w: rect.w - 4, h: 5 }, nesTheme.mp));
    }
    update(dt, input) {
        this.hpBar.value = this.maxHp > 0 ? this.hp / this.maxHp : 0;
        this.mpBar.value = this.maxMp > 0 ? this.mp / this.maxMp : 0;
        super.update(dt, input);
    }
    draw(ctx) {
        super.draw(ctx);
        this.font.drawText(ctx, this.name, this.rect.x + 2, this.rect.y + 2);
        this.font.drawText(ctx, `HP ${this.hp}/${this.maxHp}`, this.rect.x + 2, this.rect.y + 10);
        this.font.drawText(ctx, `MP ${this.mp}/${this.maxMp}`, this.rect.x + 2, this.rect.y + 17);
    }
}
//# sourceMappingURL=UnitFrame.js.map