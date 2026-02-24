// InventoryMenu.ts
// RPG Inventory menu system
import { Game } from './DwGame';
import { drawFantasyLine, drawFantasyPanel, drawPane, drawTabStrip } from './FantasyOverlayUI';

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
        drawTabStrip(ctx, panel.bodyX, panel.bodyY - 2, [ 'Bag', 'Consumables', 'Quest' ], 0);
        drawPane(ctx, panel.bodyX, panel.bodyY + 24, Math.floor(panel.bodyWidth * 0.52), panel.bodyHeight - 30, 'Items');
        drawPane(ctx, panel.bodyX + Math.floor(panel.bodyWidth * 0.52) + 10, panel.bodyY + 24, Math.floor(panel.bodyWidth * 0.48) - 10, panel.bodyHeight - 30, 'Details');
        ctx.font = '15px Georgia';
        let y = panel.bodyY + 46;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            drawFantasyLine(ctx, `${item.name} x${item.count}`, panel.bodyX, y, i === this.selectedIndex);
            y += 22;
        }
        if (!this.items.length) {
            drawFantasyLine(ctx, 'No items in satchel.', panel.bodyX + 8, y, false, 'muted');
        } else {
            const selected = this.items[this.selectedIndex];
            const rightX = panel.bodyX + Math.floor(panel.bodyWidth * 0.52) + 22;
            drawFantasyLine(ctx, selected?.name ?? '', rightX, panel.bodyY + 52, false, 'accent');
            drawFantasyLine(ctx, `Count: ${selected?.count ?? 0}`, rightX, panel.bodyY + 76, false, 'normal');
            drawFantasyLine(ctx, 'Type: Inventory Item', rightX, panel.bodyY + 100, false, 'muted');
            drawFantasyLine(ctx, 'Click item to focus.', rightX, panel.bodyY + panel.bodyHeight - 16, false, 'muted');
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
