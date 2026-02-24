// NES color palette constants
export const nesPalette = {
    darkBlue: '#001040',
    white: '#FFFFFF',
    cyan: '#00B8F8',
    blue: '#0050A0',
    green: '#00FF00',
    red: '#FF0000',
    yellow: '#FFFF00',
};
export const nesTheme = {
    panelFill: nesPalette.darkBlue,
    panelBorder: nesPalette.white,
    panelAccent: nesPalette.cyan,
    panelShadow: nesPalette.blue,
    text: nesPalette.white,
    hp: nesPalette.green,
    mp: nesPalette.cyan,
    danger: nesPalette.red,
    warning: nesPalette.yellow,
    atlasPath: '/assets/ui_kit.png',
};
export function drawNesPanel(ctx, x, y, w, h, thick = false) {
    ctx.fillStyle = nesTheme.panelFill;
    ctx.fillRect(x, y, w, h);
    // Dragon Warrior-style texture pass.
    ctx.fillStyle = nesTheme.panelShadow;
    for (let py = y + 1; py < y + h - 1; py++) {
        for (let px = x + 1; px < x + w - 1; px++) {
            if ((px + py) % 4 === 0) {
                ctx.fillRect(px, py, 1, 1);
            }
        }
    }
    const border = thick ? 2 : 1;
    ctx.strokeStyle = nesTheme.panelBorder;
    ctx.lineWidth = 1;
    for (let i = 0; i < border; i++) {
        ctx.strokeRect(x + 0.5 + i, y + 0.5 + i, w - 1 - 2 * i, h - 1 - 2 * i);
    }
    ctx.fillStyle = nesTheme.panelAccent;
    ctx.fillRect(x, y, 1, 1);
    ctx.fillRect(x + w - 1, y, 1, 1);
    ctx.fillRect(x, y + h - 1, 1, 1);
    ctx.fillRect(x + w - 1, y + h - 1, 1, 1);
}
//# sourceMappingURL=Theme.js.map