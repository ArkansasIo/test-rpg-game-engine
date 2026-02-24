import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from 'canvas';

const NES = {
    black: '#000000',
    white: '#F8F8F8',
    cyan: '#00B8F8',
    darkBlue: '#0028A0',
    blue: '#0058F8',
    red: '#A80020',
    yellow: '#F8D878',
    green: '#00A800',
    gray: '#7C7C7C',
};

const root = process.cwd();
const assetDir = path.join(root, 'public', 'assets');
fs.mkdirSync(assetDir, { recursive: true });

function writePng(fileName, canvas) {
    fs.writeFileSync(path.join(assetDir, fileName), canvas.toBuffer('image/png'));
}

function fillDither(ctx, x, y, w, h, c0, c1) {
    ctx.fillStyle = c0;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = c1;
    for (let py = y; py < y + h; py++) {
        for (let px = x; px < x + w; px++) {
            if ((px + py) % 4 === 0) {
                ctx.fillRect(px, py, 1, 1);
            }
        }
    }
}

function makeFontSheet() {
    const canvas = createCanvas(16 * 8, 6 * 8);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = NES.black;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = NES.white;
    ctx.font = '8px monospace';
    ctx.textBaseline = 'top';

    for (let code = 32; code < 128; code++) {
        const i = code - 32;
        const x = (i % 16) * 8;
        const y = Math.floor(i / 16) * 8;
        ctx.fillText(String.fromCharCode(code), x, y);
    }

    return canvas;
}

function drawNesWindow(ctx, x, y, w, h) {
    fillDither(ctx, x, y, w, h, NES.darkBlue, NES.blue);
    ctx.strokeStyle = NES.white;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    ctx.fillStyle = NES.cyan;
    ctx.fillRect(x, y, 1, 1);
    ctx.fillRect(x + w - 1, y, 1, 1);
    ctx.fillRect(x, y + h - 1, 1, 1);
    ctx.fillRect(x + w - 1, y + h - 1, 1, 1);
}

function makeUiKit() {
    const canvas = createCanvas(128, 128);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = NES.black;
    ctx.fillRect(0, 0, 128, 128);

    drawNesWindow(ctx, 0, 0, 24, 24);
    drawNesWindow(ctx, 24, 0, 24, 24);
    drawNesWindow(ctx, 48, 0, 24, 24);

    ctx.fillStyle = NES.yellow;
    ctx.fillRect(4, 32, 8, 8);
    ctx.fillStyle = NES.red;
    ctx.fillRect(16, 32, 8, 8);
    ctx.fillStyle = NES.green;
    ctx.fillRect(28, 32, 8, 8);

    // 16x16 icon row (3 colors + transparent).
    const iconX = 0;
    const iconY = 48;
    ctx.fillStyle = NES.white;
    ctx.fillRect(iconX + 6, iconY + 2, 4, 12);
    ctx.fillRect(iconX + 2, iconY + 6, 12, 4);

    ctx.fillStyle = NES.yellow;
    ctx.fillRect(20, iconY + 2, 12, 12);
    ctx.fillStyle = NES.red;
    ctx.fillRect(24, iconY + 4, 4, 8);

    ctx.fillStyle = NES.cyan;
    ctx.fillRect(40, iconY + 2, 12, 12);
    ctx.fillStyle = NES.white;
    ctx.fillRect(44, iconY + 4, 4, 8);

    return canvas;
}

function tileAt(ctx, tx, ty, drawFn) {
    const x = tx * 16;
    const y = ty * 16;
    drawFn(x, y);
}

function makeTileset() {
    const canvas = createCanvas(16 * 8, 16);
    const ctx = canvas.getContext('2d');

    tileAt(ctx, 0, 0, (x, y) => {
        fillDither(ctx, x, y, 16, 16, '#1B5E20', '#2E7D32');
        ctx.fillStyle = '#8BC34A';
        for (let i = 0; i < 28; i++) ctx.fillRect(x + (i * 7) % 16, y + (i * 11) % 16, 1, 1);
    });

    tileAt(ctx, 1, 0, (x, y) => {
        fillDither(ctx, x, y, 16, 16, '#1A1A1A', '#333333');
        ctx.fillStyle = '#666666';
        for (let gy = 0; gy < 16; gy += 4) ctx.fillRect(x, y + gy, 16, 1);
        for (let gx = 0; gx < 16; gx += 4) ctx.fillRect(x + gx, y, 1, 16);
    });

    tileAt(ctx, 2, 0, (x, y) => {
        fillDither(ctx, x, y, 16, 16, '#0D47A1', '#1976D2');
        ctx.fillStyle = '#64B5F6';
        for (let i = 0; i < 10; i++) ctx.fillRect(x + (i * 3) % 16, y + (i * 5) % 16, 3, 1);
    });

    tileAt(ctx, 3, 0, (x, y) => {
        fillDither(ctx, x, y, 16, 16, '#6D4C41', '#8D6E63');
        ctx.fillStyle = '#BCAAA4';
        for (let i = 0; i < 20; i++) ctx.fillRect(x + (i * 5) % 16, y + (i * 9) % 16, 1, 1);
    });

    tileAt(ctx, 4, 0, (x, y) => {
        fillDither(ctx, x, y, 16, 16, '#263238', '#37474F');
        ctx.fillStyle = '#607D8B';
        ctx.fillRect(x + 3, y + 9, 10, 5);
        ctx.fillRect(x + 5, y + 5, 6, 5);
    });

    tileAt(ctx, 5, 0, (x, y) => {
        fillDither(ctx, x, y, 16, 16, '#33691E', '#558B2F');
        ctx.fillStyle = '#8BC34A';
        ctx.fillRect(x + 6, y + 3, 4, 9);
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(x + 7, y + 11, 2, 5);
    });

    tileAt(ctx, 6, 0, (x, y) => {
        fillDither(ctx, x, y, 16, 16, '#4E342E', '#6D4C41');
        ctx.fillStyle = '#A1887F';
        for (let py = 0; py < 16; py += 3) ctx.fillRect(x, y + py, 16, 1);
    });

    tileAt(ctx, 7, 0, (x, y) => {
        fillDither(ctx, x, y, 16, 16, '#BF360C', '#D84315');
        ctx.fillStyle = '#FFB74D';
        for (let i = 0; i < 8; i++) ctx.fillRect(x + (i * 2) % 16, y + (i * 3) % 16, 3, 2);
    });

    return canvas;
}

function drawMonster(ctx, x, y, c0, c1, c2, horn = false) {
    ctx.fillStyle = c0;
    ctx.fillRect(x, y, 16, 16);
    ctx.fillStyle = c1;
    ctx.fillRect(x + 3, y + 4, 10, 9);
    ctx.fillRect(x + 5, y + 2, 6, 2);
    ctx.fillStyle = c2;
    ctx.fillRect(x + 6, y + 6, 1, 1);
    ctx.fillRect(x + 9, y + 6, 1, 1);
    ctx.fillRect(x + 6, y + 10, 4, 1);
    if (horn) {
        ctx.fillRect(x + 4, y + 1, 2, 2);
        ctx.fillRect(x + 10, y + 1, 2, 2);
    }
}

function makeMonsters() {
    const cols = 8;
    const canvas = createCanvas(cols * 16, 16);
    const ctx = canvas.getContext('2d');

    const sets = [
        [ '#101820', '#4DD0E1', '#E1F5FE', false ],
        [ '#1A0D0D', '#C62828', '#FFCDD2', true ],
        [ '#0E1A0E', '#43A047', '#C8E6C9', false ],
        [ '#120F1A', '#7E57C2', '#EDE7F6', true ],
        [ '#18120C', '#FF8F00', '#FFE082', false ],
        [ '#0A0F1A', '#1565C0', '#BBDEFB', true ],
        [ '#181818', '#9E9E9E', '#FAFAFA', false ],
        [ '#16080A', '#AD1457', '#F8BBD0', true ],
    ];

    sets.forEach((s, i) => drawMonster(ctx, i * 16, 0, s[0], s[1], s[2], s[3]));
    return canvas;
}

function makeClassSprites() {
    const names = [ 'WARR', 'MAGE', 'CLER', 'ROGE', 'RANG', 'MONK', 'BARD', 'PALA', 'NECR' ];
    const canvas = createCanvas(names.length * 16, 24);
    const ctx = canvas.getContext('2d');

    names.forEach((name, i) => {
        const x = i * 16;
        fillDither(ctx, x, 0, 16, 24, '#0B0B0B', '#111111');
        ctx.fillStyle = NES.white;
        ctx.fillRect(x + 7, 3, 2, 3);
        ctx.fillRect(x + 5, 6, 6, 8);
        ctx.fillRect(x + 4, 14, 3, 8);
        ctx.fillRect(x + 9, 14, 3, 8);
        ctx.fillStyle = NES.cyan;
        ctx.font = '6px monospace';
        ctx.fillText(name, x + 1, 17);
    });

    return canvas;
}

function main() {
    const outputs = {
        font: 'font_8x8_ascii.png',
        uiKit: 'ui_kit.png',
        tileset: 'nes_tileset.png',
        monsters: 'nes_monsters.png',
        classes: 'nes_class_sprites.png',
    };

    writePng(outputs.font, makeFontSheet());
    writePng(outputs.uiKit, makeUiKit());
    writePng(outputs.tileset, makeTileset());
    writePng(outputs.monsters, makeMonsters());
    writePng(outputs.classes, makeClassSprites());

    const manifest = {
        generatedAt: new Date().toISOString(),
        outputs,
        notes: [
            'NES-style generated assets for HUD, tiles, monsters, and class sheet',
            'Palette-limited sprites with transparent background where applicable',
        ],
    };

    fs.writeFileSync(path.join(assetDir, 'nes_assets_manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`Generated NES assets in ${assetDir}`);
}

main();
