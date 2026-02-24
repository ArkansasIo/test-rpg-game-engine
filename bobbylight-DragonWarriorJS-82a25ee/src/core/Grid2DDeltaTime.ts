import { Grid2D } from './Grid2D';

export class Grid2DDeltaTime<T> {

    private readonly width: number;
    private readonly height: number;
    private readonly maxTicks: number;
    private readonly baseGrid: Grid2D<T>;
    private readonly changesByTick = new Map<number, Map<number, T>>();
    private earliestTick = 0;
    private latestTick = 0;

    public constructor(width: number, height: number, initial: T, maxTicks = 50) {

        if (maxTicks <= 0) {
            throw new Error('Grid2DDeltaTime maxTicks must be > 0');
        }

        this.width = width;
        this.height = height;
        this.maxTicks = maxTicks;
        this.baseGrid = new Grid2D<T>(width, height, initial);
    }

    public inBounds(x: number, y: number): boolean {
        return this.baseGrid.inBounds(x, y);
    }

    public getEarliestTick(): number {
        return this.earliestTick;
    }

    public getLatestTick(): number {
        return this.latestTick;
    }

    public setBaseCell(x: number, y: number, value: T): void {
        this.baseGrid.set(x, y, value);
    }

    public advanceTick(): number {
        this.latestTick++;
        this.pruneIfNeeded();
        return this.latestTick;
    }

    public setAtTick(x: number, y: number, tick: number, value: T): void {

        if (!this.inBounds(x, y)) {
            throw new RangeError(`Grid2DDeltaTime out of bounds: (${x},${y})`);
        }
        if (tick < this.earliestTick || tick > this.latestTick) {
            throw new RangeError(`Grid2DDeltaTime tick out of range: ${tick}`);
        }

        let tickChanges = this.changesByTick.get(tick);
        if (!tickChanges) {
            tickChanges = new Map<number, T>();
            this.changesByTick.set(tick, tickChanges);
        }

        tickChanges.set(this.index(x, y), value);
    }

    public getAtTick(x: number, y: number, tick: number): T {

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

    public snapshotAt(tick: number): Grid2D<T> {

        if (tick < this.earliestTick || tick > this.latestTick) {
            throw new RangeError(`Grid2DDeltaTime tick out of range: ${tick}`);
        }

        const snapshot = new Grid2D<T>(this.width, this.height, this.baseGrid.get(0, 0));
        snapshot.fillWith((x, y) => this.getAtTick(x, y, tick));
        return snapshot;
    }

    private pruneIfNeeded(): void {

        while (this.latestTick - this.earliestTick > this.maxTicks) {
            const tickToFold = this.earliestTick;
            const tickChanges = this.changesByTick.get(tickToFold);

            if (tickChanges) {
                for (const [ index, value ] of tickChanges.entries()) {
                    const x = index % this.width;
                    const y = Math.floor(index / this.width);
                    this.baseGrid.set(x, y, value);
                }
            }

            this.changesByTick.delete(tickToFold);
            this.earliestTick++;
        }
    }

    private index(x: number, y: number): number {
        return y * this.width + x;
    }
}
