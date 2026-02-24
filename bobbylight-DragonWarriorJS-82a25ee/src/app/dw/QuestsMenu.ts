// QuestsMenu.ts
// RPG Quests menu system
import { Game } from './DwGame';
import { drawFantasyLine, drawFantasyPanel } from './FantasyOverlayUI';

export class QuestsMenu {
    private game: Game;
    private quests: any[];
    private onQuestSelect?: (idx: number) => void;

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
            drawFantasyLine(ctx, `${quest.name} - ${quest.status}`, panel.bodyX, y, false, quest.status === 'Complete' ? 'accent' : 'normal');
            y += 22;
        }
        ctx.restore();
    }

    handleClick(x: number, y: number) {
        // Select quest based on click position
        let questY = 100;
        for (let i = 0; i < this.quests.length; i++) {
            if (questY - 16 <= y && questY + 8 >= y) {
                if (this.onQuestSelect) this.onQuestSelect(i);
                break;
            }
            questY += 24;
        }
    }
}
