import { Nes } from './NesPalette';

export const NesTheme = {
    panelFill: Nes.DARK_BLUE,
    panelBorder: Nes.WHITE,
    panelAccent: Nes.CYAN,
    panelShadow: Nes.BLUE,
    text: Nes.WHITE,
    hp: Nes.GREEN,
    mp: Nes.CYAN,
    danger: Nes.RED,
    warning: Nes.YELLOW,
    atlasPath: '/assets/ui_kit.png',
} as const;

export function drawNesPanel(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    thick = false,
): void {
    ctx.fillStyle = NesTheme.panelFill;
    ctx.fillRect(x, y, w, h);

    // Dragon Warrior-style texture pass.
    ctx.fillStyle = NesTheme.panelShadow;
    for (let py = y + 1; py < y + h - 1; py++) {
        for (let px = x + 1; px < x + w - 1; px++) {
            if ((px + py) % 4 === 0) {
                ctx.fillRect(px, py, 1, 1);
            }
        }
    }

    const border = thick ? 2 : 1;
    ctx.strokeStyle = NesTheme.panelBorder;
    ctx.lineWidth = 1;
    for (let i = 0; i < border; i++) {
        ctx.strokeRect(x + 0.5 + i, y + 0.5 + i, w - 1 - 2 * i, h - 1 - 2 * i);
    }

    ctx.fillStyle = NesTheme.panelAccent;
    ctx.fillRect(x, y, 1, 1);
    ctx.fillRect(x + w - 1, y, 1, 1);
    ctx.fillRect(x, y + h - 1, 1, 1);
    ctx.fillRect(x + w - 1, y + h - 1, 1, 1);
}
