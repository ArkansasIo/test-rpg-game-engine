// MapMenu.ts
// RPG Map menu system
import { Game } from './DwGame';
import { drawFantasyLine, drawFantasyPanel, drawPane, drawTabStrip } from './FantasyOverlayUI';

export class MapMenu {
    private game: Game;
    private mapData: any;
    private selectedZone = 0;

    constructor(game: Game, mapData: any) {
        this.game = game;
        this.mapData = mapData;
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        const panel = drawFantasyPanel(ctx, 36, 54, this.game.getWidth() - 72, this.game.getHeight() - 104, 'Elden World Atlas');
        drawTabStrip(ctx, panel.bodyX, panel.bodyY - 2, [ 'World', 'Regions', 'Fast Travel' ], 0);
        drawPane(ctx, panel.bodyX, panel.bodyY + 24, Math.floor(panel.bodyWidth * 0.58), panel.bodyHeight - 30, 'Regions');
        drawPane(ctx, panel.bodyX + Math.floor(panel.bodyWidth * 0.58) + 10, panel.bodyY + 24, Math.floor(panel.bodyWidth * 0.42) - 10, panel.bodyHeight - 30, 'Zone Notes');
        ctx.font = '15px Georgia';
        let y = panel.bodyY + 46;
        const zones = this.mapData.eldenZones || [];
        // const biomes = this.mapData.eldenBiomes || [];
        const zoneTiles = this.mapData.eldenZoneTiles || [];
        if (!zones.length) {
            drawFantasyLine(ctx, `Current map: ${this.mapData.name ?? 'Unknown'}`, panel.bodyX + 8, y, false, 'accent');
            drawFantasyLine(ctx, 'No zone index available for this map.', panel.bodyX + 8, y + 24, false, 'muted');
            ctx.restore();
            return;
        }
        for (let i = 0; i < zones.length; i++) {
            const zone = zones[i];
            drawFantasyLine(ctx, `${zone.name} [${zone.biome}]`, panel.bodyX, y, i === this.selectedZone, 'accent');
            // Render tile preview for each zone
            const tileData = zoneTiles.find((z: any) => z.zone === zone.name);
            if (tileData && tileData.tiles) {
                let tileX = panel.bodyX + 240;
                for (const tile of tileData.tiles) {
                    ctx.fillStyle = '#705f45';
                    ctx.fillRect(tileX, y - 12, 18, 18);
                    ctx.fillStyle = '#f0e2c1';
                    ctx.fillText(tile.type, tileX + 2, y + 2);
                    tileX += 60;
                }
            }
            y += 24;
        }
        const zone = zones[this.selectedZone];
        if (zone) {
            const rightX = panel.bodyX + Math.floor(panel.bodyWidth * 0.58) + 20;
            drawFantasyLine(ctx, zone.name, rightX, panel.bodyY + 52, false, 'accent');
            drawFantasyLine(ctx, `Biome: ${zone.biome}`, rightX, panel.bodyY + 76, false, 'normal');
            drawFantasyLine(ctx, 'Select with click or arrows.', rightX, panel.bodyY + panel.bodyHeight - 16, false, 'muted');
        }
        ctx.restore();
    }

    handleClick(x: number, y: number) {
        const zones = this.mapData.eldenZones || [];
        if (!zones.length) {
            this.game.setStatusMessage(`Map: ${this.mapData.name ?? 'Unknown'}`);
            return;
        }
        const bodyY = 54 + 34 + 14 + 10;
        const idx = Math.floor((y - bodyY) / 24);
        if (idx >= 0 && idx < zones.length) {
            this.selectedZone = idx;
            this.game.setStatusMessage(`Zone selected: ${zones[idx].name}`);
        }
    }

    selectNextZone() {
        const zones = this.mapData.eldenZones || [];
        if (!zones.length) {
            return;
        }
        this.selectedZone = (this.selectedZone + 1) % zones.length;
        this.game.setStatusMessage(`Zone selected: ${zones[this.selectedZone].name}`);
    }

    selectPrevZone() {
        const zones = this.mapData.eldenZones || [];
        if (!zones.length) {
            return;
        }
        this.selectedZone = (this.selectedZone - 1 + zones.length) % zones.length;
        this.game.setStatusMessage(`Zone selected: ${zones[this.selectedZone].name}`);
    }
}
