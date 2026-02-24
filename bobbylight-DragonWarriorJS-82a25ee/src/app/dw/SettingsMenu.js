// SettingsMenu.ts
// RPG Settings menu system
import { drawFantasyLine, drawFantasyPanel, drawPane, drawTabStrip } from './FantasyOverlayUI';
export class SettingsMenu {
    constructor(game) {
        this.selected = 0;
        this.options = [
            { label: 'Audio', type: 'audio', values: ['On', 'Off'], valueIdx: 0 },
            { label: 'Controls', type: 'controls', values: ['Default', 'Customize'], valueIdx: 0 },
            { label: 'Graphics', type: 'graphics', values: ['Low', 'Medium', 'High'], valueIdx: 1 },
            { label: 'Theme', type: 'theme', values: ['Elden', 'WoW'], valueIdx: 0 },
        ];
        this.game = game;
        this.options[0].valueIdx = SettingsMenu.audioOn ? 0 : 1;
        this.options[1].valueIdx = SettingsMenu.controlsMode === 'Default' ? 0 : 1;
        this.options[2].valueIdx = ['Low', 'Medium', 'High'].indexOf(SettingsMenu.currentGraphics);
        this.options[3].valueIdx = SettingsMenu.currentTheme === 'Elden' ? 0 : 1;
    }
    render(ctx) {
        ctx.save();
        const panel = drawFantasyPanel(ctx, 36, 54, this.game.getWidth() - 72, this.game.getHeight() - 104, 'Settings');
        drawTabStrip(ctx, panel.bodyX, panel.bodyY - 2, ['System', 'Controls', 'Visual'], 0);
        drawPane(ctx, panel.bodyX, panel.bodyY + 24, Math.floor(panel.bodyWidth * 0.56), panel.bodyHeight - 30, 'Options');
        drawPane(ctx, panel.bodyX + Math.floor(panel.bodyWidth * 0.56) + 10, panel.bodyY + 24, Math.floor(panel.bodyWidth * 0.44) - 10, panel.bodyHeight - 30, 'Description');
        ctx.font = '15px Georgia';
        let y = panel.bodyY + 46;
        this.options.forEach((opt, i) => {
            let label = `${opt.label}: [${opt.values[opt.valueIdx]}]`;
            drawFantasyLine(ctx, label, panel.bodyX + (this.selected === i ? 16 : 0), y, this.selected === i, this.selected === i ? 'accent' : undefined);
            y += 28;
        });
        const active = this.options[this.selected];
        const rightX = panel.bodyX + Math.floor(panel.bodyWidth * 0.56) + 20;
        drawFantasyLine(ctx, active.label, rightX, panel.bodyY + 52, false, 'accent');
        drawFantasyLine(ctx, `Current: ${active.values[active.valueIdx]}`, rightX, panel.bodyY + 76, false, 'normal');
        drawFantasyLine(ctx, 'Use arrows to change value.', rightX, panel.bodyY + 102, false, 'muted');
        ctx.restore();
    }
    handleKey(key) {
        if (key === 'ArrowUp') {
            this.selected = (this.selected - 1 + this.options.length) % this.options.length;
        }
        else if (key === 'ArrowDown') {
            this.selected = (this.selected + 1) % this.options.length;
        }
        else if (key === 'ArrowLeft') {
            this.cycleOption(-1);
        }
        else if (key === 'ArrowRight') {
            this.cycleOption(1);
        }
        else if (key === 'Enter') {
            this.applyOption();
        }
        else if (key === 'Escape') {
            this.game.closeMenu();
        }
    }
    handleClick(x, y) {
        // Simple hit test for each option
        const panelY = 54 + 10;
        const lineHeight = 28;
        for (let i = 0; i < this.options.length; ++i) {
            const optY = panelY + i * lineHeight;
            if (y >= optY && y < optY + lineHeight) {
                this.selected = i;
                this.cycleOption(1);
                break;
            }
        }
    }
    cycleOption(dir) {
        const opt = this.options[this.selected];
        opt.valueIdx = (opt.valueIdx + dir + opt.values.length) % opt.values.length;
        this.applyOption();
    }
    applyOption() {
        const opt = this.options[this.selected];
        switch (opt.type) {
            case 'audio':
                if ((opt.valueIdx === 0) !== SettingsMenu.audioOn) {
                    this.game.toggleMuted();
                }
                SettingsMenu.audioOn = opt.valueIdx === 0;
                break;
            case 'graphics':
                SettingsMenu.currentGraphics = opt.values[opt.valueIdx];
                if (SettingsMenu.currentGraphics === 'Low') {
                    this.game.canvas.style.imageRendering = 'pixelated';
                    this.game.canvas.style.filter = 'contrast(0.92) saturate(0.9)';
                }
                else if (SettingsMenu.currentGraphics === 'Medium') {
                    this.game.canvas.style.imageRendering = 'pixelated';
                    this.game.canvas.style.filter = 'none';
                }
                else {
                    this.game.canvas.style.imageRendering = 'auto';
                    this.game.canvas.style.filter = 'contrast(1.05) saturate(1.1)';
                }
                break;
            case 'theme':
                SettingsMenu.currentTheme = opt.values[opt.valueIdx];
                document.body.dataset.uiTheme = SettingsMenu.currentTheme.toLowerCase();
                break;
            case 'controls':
                SettingsMenu.controlsMode = opt.values[opt.valueIdx];
                break;
        }
        this.game.setStatusMessage(`${opt.label} set to ${opt.values[opt.valueIdx]}`);
    }
}
SettingsMenu.currentTheme = 'Elden';
SettingsMenu.currentGraphics = 'Medium';
SettingsMenu.controlsMode = 'Default';
SettingsMenu.audioOn = true;
//# sourceMappingURL=SettingsMenu.js.map