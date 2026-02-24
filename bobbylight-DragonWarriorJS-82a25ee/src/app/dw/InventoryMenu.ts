// InventoryMenu.ts
import { drawNesPanel, nesTheme } from '../../gfx';
import { Game } from './DwGame';
import { Item } from './Item';
import { Inventory, InventoryEntry } from './Inventory';
import { PartyMember } from './PartyMember';

    private readonly game: Game;
    private readonly inventory: Inventory;
    private readonly party: PartyMember[];
    private selectedIndex = 0;
    private mode: 'view' | 'use' | 'equip' | 'discard' = 'view';

    constructor(game: Game, inventory: Inventory, party: PartyMember[]) {
        this.game = game;
        this.inventory = inventory;
        this.party = party;
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.save();
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
        const entries = this.inventory.getItems();
        let y = panelY + 100;
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            ctx.fillStyle = i === this.selectedIndex ? nesTheme.panelAccent : nesTheme.text;
            ctx.fillText(`${entry.item.displayName} x${entry.count}`, panelX + 16, y);
            y += 22;
        }
        if (!entries.length) {
            ctx.fillStyle = nesTheme.danger;
            ctx.fillText('No items in satchel.', panelX + 24, y);
        } else {
            const selected = entries[this.selectedIndex];
            const rightX = panelX + Math.floor(panelW * 0.52) + 32;
            ctx.fillStyle = nesTheme.panelAccent;
            ctx.fillText(selected?.item.displayName ?? '', rightX, panelY + 120);
            ctx.fillStyle = nesTheme.text;
            ctx.fillText(`Count: ${selected?.count ?? 1}`, rightX, panelY + 144);
            ctx.fillStyle = nesTheme.warning;
            ctx.fillText('Type: Inventory Item', rightX, panelY + 168);
            ctx.fillStyle = nesTheme.panelAccent;
            ctx.fillText('A: Use  B: Equip  X: Discard', rightX, panelY + panelH - 32);
        }
        ctx.restore();
    }

    handleClick(x: number, y: number): void {
        const panelX = 36;
        const panelY = 54;
        const entries = this.inventory.getItems();
        const itemStartY = panelY + 100;
        const itemEndY = itemStartY + entries.length * 22;
        if (x < panelX + 8 || x > panelX + Math.floor((this.game.getWidth() - 72) * 0.52) || y < itemStartY || y > itemEndY) {
            return;
        }
        const idx = Math.floor((y - itemStartY) / 22);
        if (idx >= 0 && idx < entries.length) {
            this.selectedIndex = idx;
            const selected = entries[this.selectedIndex];
            this.game.setStatusMessage(`Selected item: ${selected?.item.displayName ?? ''}`);
        }
    }

    handleAction(action: 'use' | 'equip' | 'discard', target?: PartyMember) {
        const entries = this.inventory.getItems();
        const selected = entries[this.selectedIndex];
        if (!selected) return;
        if (action === 'use') {
            // Use item (assume consumable)
            if (selected.item.use && typeof selected.item.use === 'function') {
                // For now, just call use with no state
                selected.item.use(undefined as any);
                this.inventory.remove(selected.item.name, 1);
                this.game.setStatusMessage(`Used ${selected.item.displayName}`);
            }
        } else if (action === 'equip' && target) {
            // Equip item (if weapon/armor/shield)
            // Example: if (selected.item instanceof Weapon) target.equipWeapon(selected.item as any);
            // ...implement equip logic as needed
            this.game.setStatusMessage(`Equipped ${selected.item.displayName} to ${target.name}`);
        } else if (action === 'discard') {
            this.inventory.remove(selected.item.name, 1);
            this.game.setStatusMessage(`Discarded ${selected.item.displayName}`);
        }
    }
}
