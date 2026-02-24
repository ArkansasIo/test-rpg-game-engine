// EquipmentMenu.ts
// RPG Equipment menu system
import { Game } from './DwGame';
import { drawFantasyLine, drawFantasyPanel } from './FantasyOverlayUI';

export class EquipmentMenu {
    private game: Game;
    private equipment: any;
    private selectedIndex = 0;
    private readonly slots: string[];

    constructor(game: Game, equipment: any) {
        this.game = game;
        this.equipment = equipment;
        this.slots = Object.keys(this.equipment);
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        const panel = drawFantasyPanel(ctx, 36, 54, this.game.getWidth() - 72, this.game.getHeight() - 104, 'Equipment');
        ctx.font = '15px Georgia';
        let y = panel.bodyY + 10;
        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots[i];
            drawFantasyLine(ctx, `${slot}: ${this.equipment[slot]?.name ?? '[Empty]'}`, panel.bodyX, y, i === this.selectedIndex);
            y += 22;
        }
        const selectedSlot = this.slots[this.selectedIndex];
        drawFantasyLine(ctx, `Focused slot: ${selectedSlot ?? 'none'}`, panel.bodyX, panel.bodyY + panel.bodyHeight - 10, false, 'accent');
        ctx.restore();
    }

    handleClick(x: number, y: number) {
        const panelX = 36;
        const panelY = 54;
        const bodyY = panelY + 34 + 14 + 10;
        if (x < panelX || x > this.game.getWidth() - 36 || y < bodyY) {
            return;
        }
        const idx = Math.floor((y - bodyY) / 22);
        if (idx >= 0 && idx < this.slots.length) {
            this.selectedIndex = idx;
            this.game.setStatusMessage(`Focused equipment slot: ${this.slots[idx]}`);
        }
    }
}
