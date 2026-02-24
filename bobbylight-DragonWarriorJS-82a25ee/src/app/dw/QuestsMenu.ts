// QuestsMenu.ts
// RPG Quests menu system
import { Game } from './DwGame';

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
        ctx.font = '15px monospace';
        ctx.fillStyle = '#333';
        ctx.fillRect(40, 40, this.game.getWidth() - 80, this.game.getHeight() - 80);
        ctx.fillStyle = '#fff';
        ctx.fillText('Quests', 60, 70);
        let y = 100;
        for (let i = 0; i < this.quests.length; i++) {
            const quest = this.quests[i];
            ctx.fillText(`${quest.name} - ${quest.status}`, 60, y);
            y += 24;
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
