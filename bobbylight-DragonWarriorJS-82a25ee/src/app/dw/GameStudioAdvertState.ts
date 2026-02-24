import { Delay, FadeOutInState } from 'gtp';
import { BaseState } from './BaseState';
import { DwGame } from './DwGame';
import { TitleScreenState } from './TitleScreenState';

export class GameStudioAdvertState extends BaseState {

    private readonly delay: Delay;

    constructor(game: DwGame) {
        super(game);
        this.delay = new Delay({ millis: 3000 });
    }

    override update(delta: number) {

        this.handleDefaultKeys();

        if (this.delay.update(delta) || this.game.anyKeyDown(true)) {
            this.startGame();
        }
    }

    override render(ctx: CanvasRenderingContext2D) {

        const game: DwGame = this.game;
        game.clearScreen();
        const w: number = game.getWidth();

        // Only render if font asset is loaded
        try {
            const logo = 'RolePlayGme JS Engine';
            const devs = 'by: ArkansasIo';
            const presents = 'Presents';
            const xLogo = (w - game.stringWidth(logo)) / 2;
            const yLogo = 120;
            game.drawString(logo, xLogo, yLogo);
            const xDevs = (w - game.stringWidth(devs)) / 2;
            const yDevs = yLogo + 40;
            game.drawString(devs, xDevs, yDevs);
            const xPres = (w - game.stringWidth(presents)) / 2;
            const yPres = yDevs + 40;
            game.drawString(presents, xPres, yPres);
        } catch (e) {
            // Asset not loaded, skip rendering
        }
    }

    private startGame() {
        this.game.setState(new FadeOutInState(this, new TitleScreenState(this.game)));
    }
}
