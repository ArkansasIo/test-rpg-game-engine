import type { Coord2DTime } from '../types/GridTypes';
import { Grid2D } from './Grid2D';

export class Grid2DTime<T> {

    readonly width: number;
    readonly height: number;
    readonly time: number;
    private readonly data: T[];

    public constructor(width: number, height: number, time: number, fill: T) {

        if (width <= 0 || height <= 0 || time <= 0) {
            throw new Error('Grid2DTime width, height, and time must be > 0');
        }

        this.width = width;
        this.height = height;
        this.time = time;
        this.data = Array.from({ length: width * height * time }, () => fill);
    }

    public inBounds(x: number, y: number, t: number): boolean {
        return x >= 0 && y >= 0 && t >= 0 &&
            x < this.width && y < this.height && t < this.time;
    }

    public get(x: number, y: number, t: number): T {
        return this.data[this.index(x, y, t)];
    }

    public set(x: number, y: number, t: number, value: T): void {
        this.data[this.index(x, y, t)] = value;
    }

    public frame(t: number): Grid2D<T> {

        if (t < 0 || t >= this.time) {
            throw new RangeError(`Grid2DTime frame out of bounds: ${t}`);
        }

        const frameGrid = new Grid2D<T>(this.width, this.height, this.get(0, 0, t));
        frameGrid.fillWith((x, y) => this.get(x, y, t));
        return frameGrid;
    }

    public neighbors4(x: number, y: number, t: number): Coord2DTime[] {

        const nextT = t + 1;
        if (nextT >= this.time) {
            return [];
        }

        const neighbors: Coord2DTime[] = [];
        const candidates: readonly Coord2DTime[] = [
            { x, y, t: nextT },
            { x: x + 1, y, t: nextT },
            { x: x - 1, y, t: nextT },
            { x, y: y + 1, t: nextT },
            { x, y: y - 1, t: nextT },
        ];

        for (const p of candidates) {
            if (this.inBounds(p.x, p.y, p.t)) {
                neighbors.push(p);
            }
        }

        return neighbors;
    }

    private index(x: number, y: number, t: number): number {

        if (!this.inBounds(x, y, t)) {
            throw new RangeError(`Grid2DTime out of bounds: (${x},${y},${t})`);
        }

        return (t * this.height + y) * this.width + x;
    }
}
