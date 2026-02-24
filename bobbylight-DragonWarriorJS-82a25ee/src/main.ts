import { Input } from './core/Input';
import { Renderer } from './core/Renderer';
import { Time } from './core/Time';
import { BitmapFont } from './gfx/BitmapFont';
import { HudRoot } from './hud/HudRoot';

async function loadImage(src: string): Promise<HTMLImageElement> {
    const img = new Image();
    img.src = src;
    await img.decode();
    return img;
}

function createFallbackFontSheet(): HTMLImageElement {
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

async function boot(): Promise<void> {
    const canvas = document.getElementById('game');
    if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error('Missing #game canvas');
    }

    const renderer = new Renderer(canvas);
    renderer.resizeToWindow();
    window.addEventListener('resize', () => renderer.resizeToWindow());

    const input = new Input(canvas, (x, y) => renderer.toLogical(x, y));
    const time = new Time();

    let fontImage: HTMLImageElement;
    try {
        fontImage = await loadImage('/assets/font_8x8_ascii.png');
    }
    catch {
        fontImage = createFallbackFontSheet();
        await fontImage.decode();
    }

    const font = new BitmapFont(fontImage);
    const hud = new HudRoot(renderer.width, renderer.height, font);

    const loop = (now: number): void => {
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
}

void boot();
