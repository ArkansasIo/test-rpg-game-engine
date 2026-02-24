import { Panel } from '../ui/Panel';
export class QuestTracker extends Panel {
    constructor(rect, font) {
        super(rect, true);
        this.font = font;
        this.lines = [
            'QUESTS',
            '1. RUNE OF LIGHT',
            '2. SLIME CROWN',
            '3. CASTLE KEY',
        ];
    }
    update(dt, input) {
        super.update(dt, input);
    }
    draw(ctx) {
        super.draw(ctx);
        for (let i = 0; i < this.lines.length; i++) {
            this.font.drawText(ctx, this.lines[i], this.rect.x + 2, this.rect.y + 2 + i * 9);
        }
    }
}
//# sourceMappingURL=QuestTracker.js.map