// InventoryMenu.ts
import { drawNesPanel, nesTheme } from '../../gfx/Theme';
import { Game } from './DwGame';
import { Item } from './Item';

export class InventoryMenu {
    private readonly game: Game;
    private readonly items: Item[];
    private selectedIndex = 0;
    // NES-style font and UI elements
    // NES-style font and UI elements (removed, not used)

    constructor(game: Game, items: Item[]) {
        this.game = game;
        this.items = items;
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        // NES-style panel
        const panelX = 36;
        const panelY = 54;
        const panelW = this.game.getWidth() - 72;
        const panelH = this.game.getHeight() - 104;
        ctx.globalAlpha = 1;
        drawNesPanel(ctx, panelX, panelY, panelW, panelH, true);
        ctx.font = '16px monospace';
        ctx.fillStyle = nesTheme.text;
        ctx.fillText('Inventory', panelX + 12, panelY + 24);
        // Tab strip
        ctx.fillStyle = nesTheme.panelAccent;
        ctx.fillRect(panelX + 8, panelY + 32, 80, 18);
        ctx.fillStyle = nesTheme.text;
        ctx.fillText('Bag', panelX + 16, panelY + 46);
        ctx.fillText('Consumables', panelX + 48, panelY + 46);
        ctx.fillText('Quest', panelX + 140, panelY + 46);
        // Items pane
        ctx.fillStyle = nesTheme.panelFill;
        ctx.fillRect(panelX + 8, panelY + 60, Math.floor(panelW * 0.52), panelH - 70);
        ctx.strokeStyle = nesTheme.panelBorder;
        ctx.strokeRect(panelX + 8, panelY + 60, Math.floor(panelW * 0.52), panelH - 70);
        ctx.fillStyle = nesTheme.text;
        ctx.fillText('Items', panelX + 16, panelY + 80);
        // Details pane
        ctx.fillStyle = nesTheme.panelFill;
        ctx.fillRect(panelX + Math.floor(panelW * 0.52) + 18, panelY + 60, Math.floor(panelW * 0.48) - 26, panelH - 70);
        ctx.strokeStyle = nesTheme.panelBorder;
        ctx.strokeRect(panelX + Math.floor(panelW * 0.52) + 18, panelY + 60, Math.floor(panelW * 0.48) - 26, panelH - 70);
        ctx.fillStyle = nesTheme.text;
        ctx.fillText('Details', panelX + Math.floor(panelW * 0.52) + 26, panelY + 80);
        // Item list
        let y = panelY + 100;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            ctx.fillStyle = i === this.selectedIndex ? nesTheme.panelAccent : nesTheme.text;
            ctx.fillText(`${item.displayName} x1`, panelX + 16, y);
            y += 22;
        }
        if (!this.items.length) {
            ctx.fillStyle = nesTheme.danger;
            ctx.fillText('No items in satchel.', panelX + 24, y);
        } else {
            const selected = this.items[this.selectedIndex];
            const rightX = panelX + Math.floor(panelW * 0.52) + 32;
            ctx.fillStyle = nesTheme.panelAccent;
            ctx.fillText(selected?.displayName ?? '', rightX, panelY + 120);
            ctx.fillStyle = nesTheme.text;
            ctx.fillText('Count: 1', rightX, panelY + 144);
            ctx.fillStyle = nesTheme.warning;
            ctx.fillText('Type: Inventory Item', rightX, panelY + 168);
            ctx.fillStyle = nesTheme.panelAccent;
            ctx.fillText('Click item to focus.', rightX, panelY + panelH - 32);
        }
        ctx.restore();
    }

    handleClick(x: number, y: number): void {
        const panelX = 36;
        const panelY = 54;
        const itemStartY = panelY + 100;
        const itemEndY = itemStartY + this.items.length * 22;
        if (x < panelX + 8 || x > panelX + Math.floor((this.game.getWidth() - 72) * 0.52) || y < itemStartY || y > itemEndY) {
            return;
        }
        const idx = Math.floor((y - itemStartY) / 22);
        if (idx >= 0 && idx < this.items.length) {
            this.selectedIndex = idx;
            const selected = this.items[this.selectedIndex];
            this.game.setStatusMessage(`Selected item: ${selected?.displayName ?? ''}`);
        }
    }
}
