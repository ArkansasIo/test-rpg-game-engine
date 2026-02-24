import { Delay, FadeOutInState } from 'gtp';
import { BaseState } from './BaseState';
import { TitleScreenState } from './TitleScreenState';
export class GameStudioAdvertState extends BaseState {
    constructor(game) {
        super(game);
        this.delay = new Delay({ millis: 3000 });
    }
    update(delta) {
        this.handleDefaultKeys();
        if (this.delay.update(delta) || this.game.anyKeyDown(true)) {
            this.startGame();
        }
    }
    render(ctx) {
        const game = this.game;
        game.clearScreen();
        const w = game.getWidth();
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
        }
        catch (e) {
            // Asset not loaded, skip rendering
        }
    }
    startGame() {
        this.game.setState(new FadeOutInState(this, new TitleScreenState(this.game)));
    }
}
//# sourceMappingURL=GameStudioAdvertState.js.map