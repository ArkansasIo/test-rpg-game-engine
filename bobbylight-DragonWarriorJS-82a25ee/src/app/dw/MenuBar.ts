// MenuBar.ts
// WoW-style menu bar for RPG game
import { Game } from './DwGame';

export class MenuBar {
    private game: Game;
    private menus: { label: string; action: () => void }[];

    constructor(game: Game) {
        this.game = game;
        this.menus = [
            { label: 'Inventory', action: () => this.game.openInventory() },
            { label: 'Equipment', action: () => this.game.openEquipment() },
            { label: 'Skills', action: () => this.game.openSkills() },
            { label: 'Quests', action: () => this.game.openQuests() },
            { label: 'Map', action: () => this.game.openMap() },
            { label: 'Settings', action: () => this.game.openSettings() }
        ];
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.font = '16px monospace';
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, this.game.getWidth(), 32);
        ctx.fillStyle = '#fff';
        let x = 10;
        for (const menu of this.menus) {
            ctx.fillText(menu.label, x, 22);
            x += ctx.measureText(menu.label).width + 30;
        }
        ctx.restore();
    }

    handleClick(x: number, y: number) {
        // You must pass the CanvasRenderingContext2D to handleClick for width calculation
        // Example usage: menuBar.handleClick(x, y, ctx)
        // Here, fallback width calculation if ctx is not available
        if (y < 32) {
            let curX = 10;
            for (const menu of this.menus) {
                // Fallback width: assume average label width
                const width = menu.label.length * 10 + 30;
                if (x >= curX && x <= curX + width) {
                    menu.action();
                    break;
                }
                curX += width;
            }
        }
    }
}
