// QuestsMenu.ts
// RPG Quests menu system
import { Game } from './DwGame';
import { drawFantasyLine, drawFantasyPanel, drawPane, drawTabStrip } from './FantasyOverlayUI';
import { Quest, QuestObjective } from './Party';

    private game: Game;
    private quests: Quest[];
    private onQuestSelect?: (idx: number) => void;
    private selectedIndex = 0;
    private showCompleted = false;

    constructor(game: Game, quests: Quest[], onQuestSelect?: (idx: number) => void) {
        this.game = game;
        this.quests = quests;
        this.onQuestSelect = onQuestSelect;
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        const panel = drawFantasyPanel(ctx, 36, 54, this.game.getWidth() - 72, this.game.getHeight() - 104, 'Quests');
        drawTabStrip(ctx, panel.bodyX, panel.bodyY - 2, [ 'Active', 'Completed' ], this.showCompleted ? 1 : 0);
        drawPane(ctx, panel.bodyX, panel.bodyY + 24, Math.floor(panel.bodyWidth * 0.56), panel.bodyHeight - 30, 'Quest Log');
        drawPane(ctx, panel.bodyX + Math.floor(panel.bodyWidth * 0.56) + 10, panel.bodyY + 24, Math.floor(panel.bodyWidth * 0.44) - 10, panel.bodyHeight - 30, 'Quest Detail');
        ctx.font = '15px Georgia';
        let y = panel.bodyY + 46;
        // Filter quests by status
        const filtered = this.quests.filter(q => this.showCompleted ? q.status === 'Complete' : q.status !== 'Complete');
        for (let i = 0; i < filtered.length; i++) {
            const quest = filtered[i];
            drawFantasyLine(ctx, `${quest.name} - ${quest.status}`, panel.bodyX, y, i === this.selectedIndex, quest.status === 'Complete' ? 'accent' : 'normal');
            y += 22;
        }
        if (filtered[this.selectedIndex]) {
            const rightX = panel.bodyX + Math.floor(panel.bodyWidth * 0.56) + 20;
            const quest = filtered[this.selectedIndex];
            drawFantasyLine(ctx, quest.name ?? '', rightX, panel.bodyY + 52, false, 'accent');
            drawFantasyLine(ctx, `Status: ${quest.status ?? 'Unknown'}`, rightX, panel.bodyY + 76, false, 'normal');
            drawFantasyLine(ctx, quest.description ?? '', rightX, panel.bodyY + 102, false, 'muted');
            // Show objectives
            if (quest.objectives && quest.objectives.length) {
                let objY = panel.bodyY + 130;
                for (let j = 0; j < quest.objectives.length; j++) {
                    const obj: QuestObjective = quest.objectives[j];
                    drawFantasyLine(ctx, `${obj.completed ? '[x]' : '[ ]'} ${obj.description}`, rightX, objY, false, obj.completed ? 'accent' : 'normal');
                    objY += 20;
                }
            }
        }
        ctx.restore();
    }

    handleClick(x: number, y: number) {
        // Toggle between active/completed tabs if tab strip clicked
        // (Assume tab strip is at panel.bodyY - 2, width covers two tabs)
        // For simplicity, toggle if click is in top 30px
        if (y < 90) {
            this.showCompleted = !this.showCompleted;
            this.selectedIndex = 0;
            return;
        }
        // Select quest based on click position
        let questY = 100;
        const filtered = this.quests.filter(q => this.showCompleted ? q.status === 'Complete' : q.status !== 'Complete');
        for (let i = 0; i < filtered.length; i++) {
            if (questY - 16 <= y && questY + 8 >= y) {
                this.selectedIndex = i;
                if (this.onQuestSelect) this.onQuestSelect(i);
                break;
            }
            questY += 24;
        }
    }

    selectNextQuest() {
        const filtered = this.quests.filter(q => this.showCompleted ? q.status === 'Complete' : q.status !== 'Complete');
        if (!filtered.length) return;
        this.selectedIndex = (this.selectedIndex + 1) % filtered.length;
    }

    selectPrevQuest() {
        const filtered = this.quests.filter(q => this.showCompleted ? q.status === 'Complete' : q.status !== 'Complete');
        if (!filtered.length) return;
        this.selectedIndex = (this.selectedIndex - 1 + filtered.length) % filtered.length;
    }

    activateSelectedQuest() {
        if (this.onQuestSelect && this.quests.length) {
            this.onQuestSelect(this.selectedIndex);
        }
    }
}
