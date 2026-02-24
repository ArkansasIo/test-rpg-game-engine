import { Grid2D } from '../core/Grid2D';
import { Grid2DDeltaTime } from '../core/Grid2DDeltaTime';
import type { TileDefinition, TileOverlay } from '../types/RpgTypes';

export class RpgMapSystem {

    private readonly tiles: Grid2D<TileDefinition>;
    private readonly overlays: Grid2DDeltaTime<TileOverlay | null>;

    public constructor(width: number, height: number, defaultTile: TileDefinition, historyTicks = 50) {
        this.tiles = new Grid2D<TileDefinition>(width, height, defaultTile);
        this.overlays = new Grid2DDeltaTime<TileOverlay | null>(width, height, null, historyTicks);
    }

    public get width(): number {
        return this.tiles.width;
    }

    public get height(): number {
        return this.tiles.height;
    }

    public getTick(): number {
        return this.overlays.getLatestTick();
    }

    public advanceTick(): number {
        return this.overlays.advanceTick();
    }

    public setBaseTile(x: number, y: number, tile: TileDefinition): void {
        this.tiles.set(x, y, tile);
    }

    public setOverlay(x: number, y: number, overlay: TileOverlay | null, tick = this.getTick()): void {
        this.overlays.setAtTick(x, y, tick, overlay);
    }

    public resolveTile(x: number, y: number, tick = this.getTick()): TileDefinition {

        const base = this.tiles.get(x, y);
        const overlay = this.overlays.getAtTick(x, y, tick);
        if (!overlay) {
            return base;
        }

        return {
            ...base,
            ...overlay,
        };
    }

    public isWalkableAt(x: number, y: number, tick = this.getTick()): boolean {
        if (!this.tiles.inBounds(x, y)) {
            return false;
        }

        return this.resolveTile(x, y, tick).walkable;
    }
}
