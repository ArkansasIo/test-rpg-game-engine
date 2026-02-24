// InventoryMenu.ts
// RPG Inventory menu system
import { Game } from './DwGame';
import { drawFantasyLine, drawFantasyPanel } from './FantasyOverlayUI';

export class InventoryMenu {
    private game: Game;
    private items: any[];
    private selectedIndex = 0;

    constructor(game: Game, items: any[]) {
        this.game = game;
        this.items = items;
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        const panel = drawFantasyPanel(ctx, 36, 54, this.game.getWidth() - 72, this.game.getHeight() - 104, 'Inventory');
        ctx.font = '15px Georgia';
        let y = panel.bodyY + 10;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            drawFantasyLine(ctx, `${item.name} x${item.count}`, panel.bodyX, y, i === this.selectedIndex);
            y += 22;
        }
        if (!this.items.length) {
            drawFantasyLine(ctx, 'No items in satchel.', panel.bodyX, y, false, 'muted');
        } else {
            const selected = this.items[this.selectedIndex];
            drawFantasyLine(ctx, `Selected: ${selected?.name ?? ''}`, panel.bodyX, panel.bodyY + panel.bodyHeight - 10, false, 'accent');
        }
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
        if (idx >= 0 && idx < this.items.length) {
            this.selectedIndex = idx;
            const selected = this.items[this.selectedIndex];
            this.game.setStatusMessage(`Selected item: ${selected?.name ?? ''}`);
        }
    }
}
