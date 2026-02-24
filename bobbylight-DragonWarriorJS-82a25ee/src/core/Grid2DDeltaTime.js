import { Grid2D } from './Grid2D';
export class Grid2DDeltaTime {
    constructor(width, height, initial, maxTicks = 50) {
        this.changesByTick = new Map();
        this.earliestTick = 0;
        this.latestTick = 0;
        if (maxTicks <= 0) {
            throw new Error('Grid2DDeltaTime maxTicks must be > 0');
        }
        this.width = width;
        this.height = height;
        this.maxTicks = maxTicks;
        this.baseGrid = new Grid2D(width, height, initial);
    }
    inBounds(x, y) {
        return this.baseGrid.inBounds(x, y);
    }
    getEarliestTick() {
        return this.earliestTick;
    }
    getLatestTick() {
        return this.latestTick;
    }
    setBaseCell(x, y, value) {
        this.baseGrid.set(x, y, value);
    }
    advanceTick() {
        this.latestTick++;
        this.pruneIfNeeded();
        return this.latestTick;
    }
    setAtTick(x, y, tick, value) {
        if (!this.inBounds(x, y)) {
            throw new RangeError(`Grid2DDeltaTime out of bounds: (${x},${y})`);
        }
        if (tick < this.earliestTick || tick > this.latestTick) {
            throw new RangeError(`Grid2DDeltaTime tick out of range: ${tick}`);
        }
        let tickChanges = this.changesByTick.get(tick);
        if (!tickChanges) {
            tickChanges = new Map();
            this.changesByTick.set(tick, tickChanges);
        }
        tickChanges.set(this.index(x, y), value);
    }
    getAtTick(x, y, tick) {
        if (!this.inBounds(x, y)) {
            throw new RangeError(`Grid2DDeltaTime out of bounds: (${x},${y})`);
        }
        if (tick < this.earliestTick || tick > this.latestTick) {
            throw new RangeError(`Grid2DDeltaTime tick out of range: ${tick}`);
        }
        const idx = this.index(x, y);
        for (let t = tick; t >= this.earliestTick; t--) {
            const tickChanges = this.changesByTick.get(t);
            if (!tickChanges) {
                continue;
            }
            const value = tickChanges.get(idx);
            if (value !== undefined) {
                return value;
            }
        }
        return this.baseGrid.get(x, y);
    }
    snapshotAt(tick) {
        if (tick < this.earliestTick || tick > this.latestTick) {
            throw new RangeError(`Grid2DDeltaTime tick out of range: ${tick}`);
        }
        const snapshot = new Grid2D(this.width, this.height, this.baseGrid.get(0, 0));
        snapshot.fillWith((x, y) => this.getAtTick(x, y, tick));
        return snapshot;
    }
    pruneIfNeeded() {
        while (this.latestTick - this.earliestTick > this.maxTicks) {
            const tickToFold = this.earliestTick;
            const tickChanges = this.changesByTick.get(tickToFold);
            if (tickChanges) {
                for (const [index, value] of tickChanges.entries()) {
                    const x = index % this.width;
                    const y = Math.floor(index / this.width);
                    this.baseGrid.set(x, y, value);
                }
            }
            this.changesByTick.delete(tickToFold);
            this.earliestTick++;
        }
    }
    index(x, y) {
        return y * this.width + x;
    }
}
//# sourceMappingURL=Grid2DDeltaTime.js.map