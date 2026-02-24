export class Widget {
    constructor(rect) {
        this.visible = true;
        this.enabled = true;
        this.children = [];
        this.rect = rect;
    }
    add(child) {
        this.children.push(child);
        return child;
    }
    setRect(rect) {
        this.rect = rect;
    }
    hit(x, y) {
        const r = this.rect;
        return x >= r.x && y >= r.y && x < r.x + r.w && y < r.y + r.h;
    }
    update(dt, input) {
        for (const child of this.children) {
            if (child.visible) {
                child.update(dt, input);
            }
        }
    }
    draw(ctx) {
        for (const child of this.children) {
            if (child.visible) {
                child.draw(ctx);
            }
        }
    }
    dispatchClick(x, y) {
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
    onClick(_x, _y) {
        return false;
    }
}
//# sourceMappingURL=Widget.js.map