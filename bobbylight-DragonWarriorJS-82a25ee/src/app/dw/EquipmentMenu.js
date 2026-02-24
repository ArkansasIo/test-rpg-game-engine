import { drawFantasyLine, drawFantasyPanel, drawPane, drawTabStrip } from './FantasyOverlayUI';
export class EquipmentMenu {
    constructor(game, equipment) {
        this.selectedIndex = 0;
        this.game = game;
        this.equipment = equipment;
        this.slots = Object.keys(this.equipment);
    }
    render(ctx) {
        var _a, _b, _c;
        ctx.save();
        const panel = drawFantasyPanel(ctx, 36, 54, this.game.getWidth() - 72, this.game.getHeight() - 104, 'Equipment');
        drawTabStrip(ctx, panel.bodyX, panel.bodyY - 2, ['Character', 'Stats', 'Loadout'], 2);
        drawPane(ctx, panel.bodyX, panel.bodyY + 24, Math.floor(panel.bodyWidth * 0.5), panel.bodyHeight - 30, 'Slots');
        drawPane(ctx, panel.bodyX + Math.floor(panel.bodyWidth * 0.5) + 10, panel.bodyY + 24, Math.floor(panel.bodyWidth * 0.5) - 10, panel.bodyHeight - 30, 'Inspect');
        ctx.font = '15px Georgia';
        let y = panel.bodyY + 46;
        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots[i];
            drawFantasyLine(ctx, `${slot}: ${(_b = (_a = this.equipment[slot]) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '[Empty]'}`, panel.bodyX, y, i === this.selectedIndex);
            y += 22;
        }
        const selectedSlot = this.slots[this.selectedIndex];
        const selectedItem = selectedSlot ? this.equipment[selectedSlot] : null;
        const rightX = panel.bodyX + Math.floor(panel.bodyWidth * 0.5) + 22;
        drawFantasyLine(ctx, `Slot: ${selectedSlot !== null && selectedSlot !== void 0 ? selectedSlot : 'none'}`, rightX, panel.bodyY + 52, false, 'accent');
        drawFantasyLine(ctx, `Item: ${(_c = selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.name) !== null && _c !== void 0 ? _c : '[Empty]'}`, rightX, panel.bodyY + 76, false, 'normal');
        drawFantasyLine(ctx, 'Power: --', rightX, panel.bodyY + 100, false, 'muted');
        drawFantasyLine(ctx, 'Defense: --', rightX, panel.bodyY + 122, false, 'muted');
        ctx.restore();
    }
    handleClick(x, y) {
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
//# sourceMappingURL=EquipmentMenu.js.map