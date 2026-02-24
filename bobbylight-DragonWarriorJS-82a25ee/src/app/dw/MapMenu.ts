// MapMenu.ts
// RPG Map menu system
import { Game } from './DwGame';

export class MapMenu {
    private game: Game;
    private mapData: any;

    constructor(game: Game, mapData: any) {
        this.game = game;
        this.mapData = mapData;
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.font = '15px monospace';
        ctx.fillStyle = '#333';
        ctx.fillRect(40, 40, this.game.getWidth() - 80, this.game.getHeight() - 80);
        ctx.fillStyle = '#fff';
        ctx.fillText('Elden Ring World Map', 60, 70);
        let y = 100;
        const zones = this.mapData.eldenZones || [];
        // const biomes = this.mapData.eldenBiomes || [];
        const zoneTiles = this.mapData.eldenZoneTiles || [];
        for (const zone of zones) {
            ctx.fillText(`${zone.name} [${zone.biome}]`, 60, y);
            // Render tile preview for each zone
            const tileData = zoneTiles.find((z: any) => z.zone === zone.name);
            if (tileData && tileData.tiles) {
                let tileX = 300;
                for (const tile of tileData.tiles) {
                    ctx.fillStyle = '#888';
                    ctx.fillRect(tileX, y - 12, 18, 18);
                    ctx.fillStyle = '#fff';
                    ctx.fillText(tile.type, tileX + 2, y + 2);
                    tileX += 60;
                }
            }
            y += 28;
        }
        ctx.restore();
    }

    handleClick(x: number, y: number) {
        // Implement map interaction logic
    }
}
