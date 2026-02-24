import { Grid2D } from './Grid2D';
export class Grid2DTime {
    constructor(width, height, time, fill) {
        if (width <= 0 || height <= 0 || time <= 0) {
            throw new Error('Grid2DTime width, height, and time must be > 0');
        }
        this.width = width;
        this.height = height;
        this.time = time;
        this.data = Array.from({ length: width * height * time }, () => fill);
    }
    inBounds(x, y, t) {
        return x >= 0 && y >= 0 && t >= 0 &&
            x < this.width && y < this.height && t < this.time;
    }
    get(x, y, t) {
        return this.data[this.index(x, y, t)];
    }
    set(x, y, t, value) {
        this.data[this.index(x, y, t)] = value;
    }
    frame(t) {
        if (t < 0 || t >= this.time) {
            throw new RangeError(`Grid2DTime frame out of bounds: ${t}`);
        }
        const frameGrid = new Grid2D(this.width, this.height, this.get(0, 0, t));
        frameGrid.fillWith((x, y) => this.get(x, y, t));
        return frameGrid;
    }
    neighbors4(x, y, t) {
        const nextT = t + 1;
        if (nextT >= this.time) {
            return [];
        }
        const neighbors = [];
        const candidates = [
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
    index(x, y, t) {
        if (!this.inBounds(x, y, t)) {
            throw new RangeError(`Grid2DTime out of bounds: (${x},${y},${t})`);
        }
        return (t * this.height + y) * this.width + x;
    }
}
//# sourceMappingURL=Grid2DTime.js.map