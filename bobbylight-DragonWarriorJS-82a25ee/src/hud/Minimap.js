import { Panel } from '../ui/Panel';
export class Minimap extends Panel {
    constructor(rect) {
        super(rect, true);
        this.playerX = 0.6;
        this.playerY = 0.4;
    }
    draw(ctx) {
        super.draw(ctx);
        const innerX = this.rect.x + 2;
        const innerY = this.rect.y + 2;
        const innerW = this.rect.w - 4;
        const innerH = this.rect.h - 4;
        // Minimal tile-like noise map.
        for (let y = 0; y < innerH; y += 2) {
            for (let x = 0; x < innerW; x += 2) {
                const n = (x * 17 + y * 29) % 9;
                ctx.fillStyle = n < 3 ? '#003868' : n < 5 ? '#0058A8' : '#002048';
                ctx.fillRect(innerX + x, innerY + y, 2, 2);
            }
        }
        const px = innerX + Math.floor(innerW * this.playerX);
        const py = innerY + Math.floor(innerH * this.playerY);
        ctx.fillStyle = '#F8D878';
        ctx.fillRect(px, py, 2, 2);
    }
}
//# sourceMappingURL=Minimap.js.map