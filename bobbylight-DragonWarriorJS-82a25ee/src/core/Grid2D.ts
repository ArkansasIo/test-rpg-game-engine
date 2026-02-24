import type { Coord2D } from '../types/GridTypes';

export class Grid2D<T> {

    readonly width: number;
    readonly height: number;
    private readonly data: T[];

    public constructor(width: number, height: number, fill: T) {

        if (width <= 0 || height <= 0) {
            throw new Error('Grid2D width and height must be > 0');
        }

        this.width = width;
        this.height = height;
        this.data = Array.from({ length: width * height }, () => fill);
    }

    public inBounds(x: number, y: number): boolean {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }

    public get(x: number, y: number): T {
        return this.data[this.index(x, y)];
    }

    public set(x: number, y: number, value: T): void {
        this.data[this.index(x, y)] = value;
    }

    public fillWith(factory: (x: number, y: number) => T): void {

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.set(x, y, factory(x, y));
            }
        }
    }

    public neighbors4(x: number, y: number): Coord2D[] {

        const neighbors: Coord2D[] = [];
        const candidates: readonly Coord2D[] = [
            { x: x + 1, y },
            { x: x - 1, y },
            { x, y: y + 1 },
            { x, y: y - 1 },
        ];

        for (const p of candidates) {
            if (this.inBounds(p.x, p.y)) {
                neighbors.push(p);
            }
        }

        return neighbors;
    }

    public neighbors8(x: number, y: number): Coord2D[] {

        const neighbors: Coord2D[] = [];

        for (let oy = -1; oy <= 1; oy++) {
            for (let ox = -1; ox <= 1; ox++) {
                if (ox === 0 && oy === 0) {
                    continue;
                }

                const nx = x + ox;
                const ny = y + oy;
                if (this.inBounds(nx, ny)) {
                    neighbors.push({ x: nx, y: ny });
                }
            }
        }

        return neighbors;
    }

    private index(x: number, y: number): number {

        if (!this.inBounds(x, y)) {
            throw new RangeError(`Grid2D out of bounds: (${x},${y})`);
        }

        return y * this.width + x;
    }
}
