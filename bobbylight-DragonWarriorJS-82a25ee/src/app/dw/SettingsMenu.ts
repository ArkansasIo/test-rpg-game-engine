// SettingsMenu.ts
// RPG Settings menu system
import { Game } from './DwGame';
import { drawFantasyLine, drawFantasyPanel } from './FantasyOverlayUI';

export class SettingsMenu {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        const panel = drawFantasyPanel(ctx, 36, 54, this.game.getWidth() - 72, this.game.getHeight() - 104, 'Settings');
        ctx.font = '15px Georgia';
        let y = panel.bodyY + 10;
        drawFantasyLine(ctx, 'Audio: [On/Off]', panel.bodyX, y);
        y += 22;
        drawFantasyLine(ctx, 'Controls: [Customize]', panel.bodyX, y);
        y += 22;
        drawFantasyLine(ctx, 'Graphics: [Low/Med/High]', panel.bodyX, y);
        y += 22;
        drawFantasyLine(ctx, 'Theme: Elden/WoW Overlay Active', panel.bodyX, y, false, 'accent');
        ctx.restore();
    }

    handleClick(x: number, y: number) {
        // Implement settings interaction logic
    }
}
