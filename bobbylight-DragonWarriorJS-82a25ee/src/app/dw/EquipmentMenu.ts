// EquipmentMenu.ts
// RPG Equipment menu system
import { Game } from './DwGame';
import { drawFantasyLine, drawFantasyPanel, drawPane, drawTabStrip } from './FantasyOverlayUI';

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
        drawTabStrip(ctx, panel.bodyX, panel.bodyY - 2, [ 'Character', 'Stats', 'Loadout' ], 2);
        drawPane(ctx, panel.bodyX, panel.bodyY + 24, Math.floor(panel.bodyWidth * 0.5), panel.bodyHeight - 30, 'Slots');
        drawPane(ctx, panel.bodyX + Math.floor(panel.bodyWidth * 0.5) + 10, panel.bodyY + 24, Math.floor(panel.bodyWidth * 0.5) - 10, panel.bodyHeight - 30, 'Inspect');
        ctx.font = '15px Georgia';
        let y = panel.bodyY + 46;
        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots[i];
            drawFantasyLine(ctx, `${slot}: ${this.equipment[slot]?.name ?? '[Empty]'}`, panel.bodyX, y, i === this.selectedIndex);
            y += 22;
        }
        const selectedSlot = this.slots[this.selectedIndex];
        const selectedItem = selectedSlot ? this.equipment[selectedSlot] : null;
        const rightX = panel.bodyX + Math.floor(panel.bodyWidth * 0.5) + 22;
        drawFantasyLine(ctx, `Slot: ${selectedSlot ?? 'none'}`, rightX, panel.bodyY + 52, false, 'accent');
        drawFantasyLine(ctx, `Item: ${selectedItem?.name ?? '[Empty]'}`, rightX, panel.bodyY + 76, false, 'normal');
        drawFantasyLine(ctx, 'Power: --', rightX, panel.bodyY + 100, false, 'muted');
        drawFantasyLine(ctx, 'Defense: --', rightX, panel.bodyY + 122, false, 'muted');
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
