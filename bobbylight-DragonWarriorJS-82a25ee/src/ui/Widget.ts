import type { InputSnapshot } from '../core/Input';

export type Rect = { x: number; y: number; w: number; h: number };

export abstract class Widget {
    rect: Rect;
    visible = true;
    enabled = true;
    protected readonly children: Widget[] = [];

    constructor(rect: Rect) {
        this.rect = rect;
    }

    add<T extends Widget>(child: T): T {
        this.children.push(child);
        return child;
    }

    setRect(rect: Rect): void {
        this.rect = rect;
    }

    hit(x: number, y: number): boolean {
        const r = this.rect;
        return x >= r.x && y >= r.y && x < r.x + r.w && y < r.y + r.h;
    }

    update(dt: number, input: InputSnapshot): void {
        for (const child of this.children) {
            if (child.visible) {
                child.update(dt, input);
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        for (const child of this.children) {
            if (child.visible) {
                child.draw(ctx);
            }
        }
    }

    dispatchClick(x: number, y: number): boolean {
        for (let i = this.children.length - 1; i >= 0; i--) {
            const child = this.children[i];
            if (child.visible && child.enabled && child.hit(x, y) && child.dispatchClick(x, y)) {
                return true;
            }
        }
        if (this.hit(x, y)) {
            return this.onClick(x, y);
        }
        return false;
    }

    protected onClick(_x: number, _y: number): boolean {
        return false;
    }
}
