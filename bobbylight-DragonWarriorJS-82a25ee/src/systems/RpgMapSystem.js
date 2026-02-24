import { Grid2D } from '../core/Grid2D';
import { Grid2DDeltaTime } from '../core/Grid2DDeltaTime';
export class RpgMapSystem {
    constructor(width, height, defaultTile, historyTicks = 50) {
        this.tiles = new Grid2D(width, height, defaultTile);
        this.overlays = new Grid2DDeltaTime(width, height, null, historyTicks);
    }
    get width() {
        return this.tiles.width;
    }
    get height() {
        return this.tiles.height;
    }
    getTick() {
        return this.overlays.getLatestTick();
    }
    advanceTick() {
        return this.overlays.advanceTick();
    }
    setBaseTile(x, y, tile) {
        this.tiles.set(x, y, tile);
    }
    setOverlay(x, y, overlay, tick = this.getTick()) {
        this.overlays.setAtTick(x, y, tick, overlay);
    }
    resolveTile(x, y, tick = this.getTick()) {
        const base = this.tiles.get(x, y);
        const overlay = this.overlays.getAtTick(x, y, tick);
        if (!overlay) {
            return base;
        }
        return Object.assign(Object.assign({}, base), overlay);
    }
    isWalkableAt(x, y, tick = this.getTick()) {
        if (!this.tiles.inBounds(x, y)) {
            return false;
        }
        return this.resolveTile(x, y, tick).walkable;
    }
}
//# sourceMappingURL=RpgMapSystem.js.map