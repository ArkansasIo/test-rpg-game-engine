import { BaseState } from './BaseState';
import { DwGame } from './DwGame';
import { getAdventureLogSummaries } from './AdventureLog';
import { ChoiceBubble } from './ChoiceBubble';

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
                label: `LOG ${idx + 1}: ${summary.heroName} (Lv ${summary.level}) - ${new Date(summary.modifiedAt).toLocaleString()}`
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
                // @ts-ignore
                const { InitialMenuState } = require('./InitialMenuState');
                this.game.setState(new InitialMenuState(this.game));
                return;
            }
            const chosen = this.summaries[idx];
            if (chosen && chosen.id) {
                this.game.continueGame(chosen.id);
            }
        }
    }

    override render(ctx: CanvasRenderingContext2D) {
        const game = this.game;
        game.clearScreen();
        ctx.font = '28px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFD700';
        ctx.fillText('Character Select', game.getWidth() / 2, 60);
        this.selectBubble.paint(ctx);
    }
}
