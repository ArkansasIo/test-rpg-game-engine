// EquipmentMenu.ts
// RPG Equipment menu system
import { Game } from './DwGame';
import { drawFantasyLine, drawFantasyPanel } from './FantasyOverlayUI';

export class EquipmentMenu {
    private game: Game;
    private equipment: any;

    constructor(game: Game, equipment: any) {
        this.game = game;
        this.equipment = equipment;
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        const panel = drawFantasyPanel(ctx, 36, 54, this.game.getWidth() - 72, this.game.getHeight() - 104, 'Equipment');
        ctx.font = '15px Georgia';
        let y = panel.bodyY + 10;
        for (const slot in this.equipment) {
            drawFantasyLine(ctx, `${slot}: ${this.equipment[slot]?.name ?? '[Empty]'}`, panel.bodyX, y);
            y += 22;
        }
        ctx.restore();
    }

    handleClick(x: number, y: number) {
        // Implement equipment selection logic
    }
}
