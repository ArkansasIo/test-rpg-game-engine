// InventoryMenu.ts
// RPG Inventory menu system
import { Game } from './DwGame';
import { drawFantasyLine, drawFantasyPanel } from './FantasyOverlayUI';

export class InventoryMenu {
    private game: Game;
    private items: any[];

    constructor(game: Game, items: any[]) {
        this.game = game;
        this.items = items;
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        const panel = drawFantasyPanel(ctx, 36, 54, this.game.getWidth() - 72, this.game.getHeight() - 104, 'Inventory');
        ctx.font = '15px Georgia';
        let y = panel.bodyY + 10;
        for (const item of this.items) {
            drawFantasyLine(ctx, `${item.name} x${item.count}`, panel.bodyX, y);
            y += 22;
        }
        if (!this.items.length) {
            drawFantasyLine(ctx, 'No items in satchel.', panel.bodyX, y, false, 'muted');
        }
        ctx.restore();
    }

    handleClick(x: number, y: number) {
        // Implement item selection logic
    }
}
