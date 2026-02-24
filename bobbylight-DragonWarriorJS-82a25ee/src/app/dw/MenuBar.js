import { drawMenuChrome } from './FantasyOverlayUI';
export class MenuBar {
    constructor(game) {
        this.activeLabelByMenu = {
            inventory: 'Inventory',
            equipment: 'Equipment',
            skills: 'Skills',
            quests: 'Quests',
            map: 'Map',
            settings: 'Settings',
        };
        this.game = game;
        this.menus = [
            { label: 'Inventory', action: () => {
                    this.game.openInventory();
                } },
            { label: 'Equipment', action: () => {
                    this.game.openEquipment();
                } },
            { label: 'Skills', action: () => {
                    this.game.openSkills();
                } },
            { label: 'Quests', action: () => {
                    this.game.openQuests();
                } },
            { label: 'Map', action: () => {
                    this.game.openMap();
                } },
            { label: 'Settings', action: () => {
                    this.game.openSettings();
                } },
        ];
    }
    render(ctx) {
        var _a;
        ctx.save();
        const activeLabel = this.game.activeMenu ? (_a = this.activeLabelByMenu[this.game.activeMenu]) !== null && _a !== void 0 ? _a : null : null;
        drawMenuChrome(ctx, this.menus.map((menu) => menu.label), activeLabel, this.game.getWidth());
        ctx.restore();
    }
    handleClick(x, y) {
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
//# sourceMappingURL=MenuBar.js.map