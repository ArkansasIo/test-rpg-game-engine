import { drawFantasyLine, drawFantasyPanel, drawPane, drawTabStrip } from './FantasyOverlayUI';
export class QuestsMenu {
    constructor(game, quests, onQuestSelect) {
        this.selectedIndex = 0;
        this.game = game;
        this.quests = quests;
        this.onQuestSelect = onQuestSelect;
    }
    render(ctx) {
        var _a, _b, _c;
        ctx.save();
        const panel = drawFantasyPanel(ctx, 36, 54, this.game.getWidth() - 72, this.game.getHeight() - 104, 'Quests');
        drawTabStrip(ctx, panel.bodyX, panel.bodyY - 2, ['Main', 'Side', 'Completed'], 0);
        drawPane(ctx, panel.bodyX, panel.bodyY + 24, Math.floor(panel.bodyWidth * 0.56), panel.bodyHeight - 30, 'Quest Log');
        drawPane(ctx, panel.bodyX + Math.floor(panel.bodyWidth * 0.56) + 10, panel.bodyY + 24, Math.floor(panel.bodyWidth * 0.44) - 10, panel.bodyHeight - 30, 'Quest Detail');
        ctx.font = '15px Georgia';
        let y = panel.bodyY + 46;
        for (let i = 0; i < this.quests.length; i++) {
            const quest = this.quests[i];
            drawFantasyLine(ctx, `${quest.name} - ${quest.status}`, panel.bodyX, y, i === this.selectedIndex, quest.status === 'Complete' ? 'accent' : 'normal');
            y += 22;
        }
        if (this.quests[this.selectedIndex]) {
            const rightX = panel.bodyX + Math.floor(panel.bodyWidth * 0.56) + 20;
            const quest = this.quests[this.selectedIndex];
            drawFantasyLine(ctx, (_a = quest.name) !== null && _a !== void 0 ? _a : '', rightX, panel.bodyY + 52, false, 'accent');
            drawFantasyLine(ctx, `Status: ${(_b = quest.status) !== null && _b !== void 0 ? _b : 'Unknown'}`, rightX, panel.bodyY + 76, false, 'normal');
            drawFantasyLine(ctx, (_c = quest.description) !== null && _c !== void 0 ? _c : '', rightX, panel.bodyY + 102, false, 'muted');
        }
        ctx.restore();
    }
    handleClick(x, y) {
        // Select quest based on click position
        let questY = 100;
        for (let i = 0; i < this.quests.length; i++) {
            if (questY - 16 <= y && questY + 8 >= y) {
                this.selectedIndex = i;
                if (this.onQuestSelect)
                    this.onQuestSelect(i);
                break;
            }
            questY += 24;
        }
    }
    selectNextQuest() {
        if (!this.quests.length) {
            return;
        }
        this.selectedIndex = (this.selectedIndex + 1) % this.quests.length;
    }
    selectPrevQuest() {
        if (!this.quests.length) {
            return;
        }
        this.selectedIndex = (this.selectedIndex - 1 + this.quests.length) % this.quests.length;
    }
    activateSelectedQuest() {
        if (this.onQuestSelect && this.quests.length) {
            this.onQuestSelect(this.selectedIndex);
        }
    }
}
//# sourceMappingURL=QuestsMenu.js.map