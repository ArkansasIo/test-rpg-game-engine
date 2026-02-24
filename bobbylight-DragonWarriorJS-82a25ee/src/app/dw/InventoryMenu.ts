// InventoryMenu.ts
// RPG Inventory menu system
import { Game } from './DwGame';

export class InventoryMenu {
    private game: Game;
    private items: any[];

    constructor(game: Game, items: any[]) {
        this.game = game;
        this.items = items;
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.font = '15px monospace';
        ctx.fillStyle = '#333';
        ctx.fillRect(40, 40, this.game.getWidth() - 80, this.game.getHeight() - 80);
        ctx.fillStyle = '#fff';
        ctx.fillText('Inventory', 60, 70);
        let y = 100;
        for (const item of this.items) {
            ctx.fillText(`${item.name} x${item.count}`, 60, y);
            y += 24;
        }
        ctx.restore();
    }

    handleClick(x: number, y: number) {
        // Implement item selection logic
    }
}
