// EquipmentMenu.ts
// RPG Equipment menu system
import { Game } from './DwGame';

export class EquipmentMenu {
    private game: Game;
    private equipment: any;

    constructor(game: Game, equipment: any) {
        this.game = game;
        this.equipment = equipment;
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.font = '15px monospace';
        ctx.fillStyle = '#333';
        ctx.fillRect(40, 40, this.game.getWidth() - 80, this.game.getHeight() - 80);
        ctx.fillStyle = '#fff';
        ctx.fillText('Equipment', 60, 70);
        let y = 100;
        for (const slot in this.equipment) {
            ctx.fillText(`${slot}: ${this.equipment[slot]?.name ?? '[Empty]'}`, 60, y);
            y += 24;
        }
        ctx.restore();
    }

    handleClick(x: number, y: number) {
        // Implement equipment selection logic
    }
}
