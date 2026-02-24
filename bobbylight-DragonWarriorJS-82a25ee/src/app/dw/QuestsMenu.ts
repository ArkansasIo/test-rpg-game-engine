// QuestsMenu.ts
// RPG Quests menu system
import { Game } from './DwGame';
import { drawFantasyLine, drawFantasyPanel } from './FantasyOverlayUI';

export class QuestsMenu {
    private game: Game;
    private quests: any[];
    private onQuestSelect?: (idx: number) => void;
    private selectedIndex = 0;

    constructor(game: Game, quests: any[], onQuestSelect?: (idx: number) => void) {
        this.game = game;
        this.quests = quests;
        this.onQuestSelect = onQuestSelect;
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        const panel = drawFantasyPanel(ctx, 36, 54, this.game.getWidth() - 72, this.game.getHeight() - 104, 'Quests');
        ctx.font = '15px Georgia';
        let y = panel.bodyY + 10;
        for (let i = 0; i < this.quests.length; i++) {
            const quest = this.quests[i];
            drawFantasyLine(ctx, `${quest.name} - ${quest.status}`, panel.bodyX, y, i === this.selectedIndex, quest.status === 'Complete' ? 'accent' : 'normal');
            y += 22;
        }
        if (this.quests[this.selectedIndex]) {
            drawFantasyLine(ctx, this.quests[this.selectedIndex].description ?? '', panel.bodyX, panel.bodyY + panel.bodyHeight - 10, false, 'muted');
        }
        ctx.restore();
    }

    handleClick(x: number, y: number) {
        // Select quest based on click position
        let questY = 100;
        for (let i = 0; i < this.quests.length; i++) {
            if (questY - 16 <= y && questY + 8 >= y) {
                this.selectedIndex = i;
                if (this.onQuestSelect) this.onQuestSelect(i);
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
