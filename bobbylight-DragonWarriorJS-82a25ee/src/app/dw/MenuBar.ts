// MenuBar.ts
// WoW-style menu bar for RPG game
import { DwGame } from './DwGame';
import { drawMenuChrome } from './FantasyOverlayUI';

export class MenuBar {
    private game: DwGame;
    private menus: { label: string; action: () => void }[];
    private readonly activeLabelByMenu: Record<string, string> = {
        inventory: 'Inventory',
        equipment: 'Equipment',
        skills: 'Skills',
        quests: 'Quests',
        map: 'Map',
        settings: 'Settings',
    };

    constructor(game: DwGame) {
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
        const activeLabel = this.game.activeMenu ? this.activeLabelByMenu[this.game.activeMenu] ?? null : null;
        drawMenuChrome(ctx, this.menus.map((menu) => menu.label), activeLabel, this.game.getWidth());
        ctx.restore();
    }

    handleClick(x: number, y: number) {
        // You must pass the CanvasRenderingContext2D to handleClick for width calculation
        // Example usage: menuBar.handleClick(x, y, ctx)
        // Here, fallback width calculation if ctx is not available
        if (y < 42) {
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
