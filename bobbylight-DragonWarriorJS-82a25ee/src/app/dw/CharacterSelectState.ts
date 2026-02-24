import { BaseState } from './BaseState';
import { DwGame } from './DwGame';
import { getAdventureLogSummaries } from './AdventureLog';
import { ChoiceBubble } from './ChoiceBubble';
import { InitialMenuState } from './InitialMenuState';

/**
 * Character loading/select screen, inspired by WoW.
 */
export class CharacterSelectState extends BaseState {
    private readonly selectBubble: ChoiceBubble<{ id: string; label: string }>;
    private readonly summaries: ReturnType<typeof getAdventureLogSummaries>;

    constructor(game: DwGame) {
        super(game);
        this.summaries = getAdventureLogSummaries();
        this.selectBubble = this.createSelectBubble();
    }

    private createSelectBubble(): ChoiceBubble<{ id: string; label: string }> {
        const game = this.game;
        const tileSize = game.getTileSize();
        const w = game.getWidth() - 6 * tileSize;
        const h = Math.min(8 * tileSize, game.getHeight() - 4 * tileSize);
        const x = (game.getWidth() - w) / 2;
        const y = (game.getHeight() - h) / 2;
        const choices = this.summaries.map((summary, idx) => {
            return {
                id: summary.id,
                label: `LOG ${idx + 1}: ${summary.heroName} (Lv ${summary.level}) - ${new Date(summary.modifiedAt).toLocaleString()}`,
            };
        });
        return new ChoiceBubble(game, x, y, w, h, choices, (c) => c.label, true, 'Select Your Character');
    }

    override enter() {
        super.enter();
        this.game.audio.playMusic('MUSIC_TOWN');
    }

    override update(delta: number) {
        this.selectBubble.update(delta);
        if (this.selectBubble.handleInput()) {
            const idx = this.selectBubble.getSelectedIndex();
            if (idx === -1) {
                // Cancel: return to main menu
                this.game.setState(new InitialMenuState(this.game));
                return;
            }
            const chosen = this.summaries[idx];
            if (chosen?.id) {
                this.game.continueGame(chosen.id);
            }
        }
    }

    override render(ctx: CanvasRenderingContext2D) {
        const game = this.game;
        // Modern styled background
        ctx.save();
        ctx.fillStyle = 'rgba(30, 30, 60, 0.95)';
        ctx.fillRect(0, 0, game.getWidth(), game.getHeight());
        ctx.restore();
        // Border
        ctx.save();
        ctx.strokeStyle = '#aaf';
        ctx.lineWidth = 4;
        ctx.strokeRect(10, 10, game.getWidth() - 20, game.getHeight() - 20);
        ctx.restore();
        // Title
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFD700';
        ctx.fillText('Character Select', game.getWidth() / 2, 60);
        // Paint select bubble
        this.selectBubble.paint(ctx);
        // Tooltip for selected log
        const idx = this.selectBubble.getSelectedIndex();
        if (idx >= 0 && this.summaries[idx]) {
            ctx.font = 'italic 16px monospace';
            ctx.textAlign = 'left';
            ctx.fillStyle = '#ffe066';
            const summary = this.summaries[idx];
            const tooltip = `Last played: ${new Date(summary.modifiedAt).toLocaleString()}\nHero: ${summary.heroName} (Lv ${summary.level})`;
            const lines = tooltip.split('\n');
            let y = game.getHeight() - 80;
            for (const line of lines) {
                ctx.fillText(line, 30, y);
                y += 20;
            }
        }
        // Navigation button
        ctx.fillStyle = '#aaf';
        ctx.fillRect(game.getWidth() - 120, game.getHeight() - 60, 90, 40);
        ctx.font = 'bold 16px monospace';
        ctx.fillStyle = '#222';
        ctx.textAlign = 'center';
        ctx.fillText('Back', game.getWidth() - 75, game.getHeight() - 35);
    }
}
