export class Grid2D {
    constructor(width, height, fill) {
        if (width <= 0 || height <= 0) {
            throw new Error('Grid2D width and height must be > 0');
        }
        this.width = width;
        this.height = height;
        this.data = Array.from({ length: width * height }, () => fill);
    }
    inBounds(x, y) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }
    get(x, y) {
        return this.data[this.index(x, y)];
    }
    set(x, y, value) {
        this.data[this.index(x, y)] = value;
    }
    fillWith(factory) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.set(x, y, factory(x, y));
            }
        }
    }
    neighbors4(x, y) {
        const neighbors = [];
        const candidates = [
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
    neighbors8(x, y) {
        const neighbors = [];
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
    index(x, y) {
        if (!this.inBounds(x, y)) {
            throw new RangeError(`Grid2D out of bounds: (${x},${y})`);
        }
        return y * this.width + x;
    }
}
//# sourceMappingURL=Grid2D.js.map