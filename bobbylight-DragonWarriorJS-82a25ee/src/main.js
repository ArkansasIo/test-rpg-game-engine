var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Input } from './core/Input';
import { Renderer } from './core/Renderer';
import { Time } from './core/Time';
import { BitmapFont } from './gfx/BitmapFont';
import { HudRoot } from './hud/HudRoot';
function loadImage(src) {
    return __awaiter(this, void 0, void 0, function* () {
        const img = new Image();
        img.src = src;
        yield img.decode();
        return img;
    });
}
function createFallbackFontSheet() {
    const c = document.createElement('canvas');
    c.width = 16 * 8;
    c.height = 6 * 8;
    const ctx = c.getContext('2d');
    if (ctx) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = '#fff';
        ctx.font = '8px monospace';
        ctx.textBaseline = 'top';
        for (let code = 32; code < 128; code++) {
            const i = code - 32;
            const x = (i % 16) * 8;
            const y = Math.floor(i / 16) * 8;
            ctx.fillText(String.fromCharCode(code), x, y);
        }
    }
    const img = new Image();
    img.src = c.toDataURL('image/png');
    return img;
}
function boot() {
    return __awaiter(this, void 0, void 0, function* () {
        const canvas = document.getElementById('game');
        if (!(canvas instanceof HTMLCanvasElement)) {
            throw new Error('Missing #game canvas');
        }
        const renderer = new Renderer(canvas);
        renderer.resizeToWindow();
        window.addEventListener('resize', () => renderer.resizeToWindow());
        const input = new Input(canvas, (x, y) => renderer.toLogical(x, y));
        const time = new Time();
        let fontImage;
        try {
            fontImage = yield loadImage('/assets/font_8x8_ascii.png');
        }
        catch (_a) {
            fontImage = createFallbackFontSheet();
            yield fontImage.decode();
        }
        const font = new BitmapFont(fontImage);
        const hud = new HudRoot(renderer.width, renderer.height, font);
        const loop = (now) => {
            time.tick(now);
            const snapshot = input.snapshot();
            hud.update(time.delta, snapshot);
            if (snapshot.mouseClicked) {
                hud.dispatchClick(snapshot.mouseX, snapshot.mouseY);
            }
            renderer.clear('#000000');
            hud.draw(renderer.ctx);
            font.drawText(renderer.ctx, 'NES WOW HUD - ENTER FOR CHAT', 4, 4);
            input.beginFrame();
            window.requestAnimationFrame(loop);
        };
        window.requestAnimationFrame(loop);
    });
}
void boot();
//# sourceMappingURL=main.js.map