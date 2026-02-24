import { Delay, Image, InputManager } from 'gtp';
import { BaseState } from './BaseState';
import { DwGame } from './DwGame';
import { InitialMenuState } from './InitialMenuState';

export class TitleScreenState extends BaseState {
    // 'game' is inherited from BaseState (via State<T>), no need to redeclare

    private delay?: Delay;
    private blink: boolean;

    constructor(game: DwGame) {
        super(game); // Pass game to BaseState/State
        this.blink = true;
    }

    override enter() {
        super.enter();
        this.game.canvas.addEventListener('touchstart', this.handleStart.bind(this), false);
        this.delay = new Delay({ millis: [ 600, 400 ] });
        this.blink = true;
        this.game.audio.playMusic('MUSIC_TITLE_SCREEN');
    }

    override leaving() {
        this.game.canvas.removeEventListener('touchstart', this.handleStart.bind(this), false);
    }

    handleStart() {
        console.log('yee, touch detected!');
        this.loadNextState();
    }

    override update(delta: number) {
        this.handleDefaultKeys();
        if (this.delay?.update(delta)) {
            this.delay.reset();
            this.blink = !this.blink;
        }
        const im: InputManager = this.game.inputManager;
        if (im.enter(true)) {
            this.loadNextState();
        }
    }

    override render(ctx: CanvasRenderingContext2D) {
        const game: DwGame = this.game;
        game.clearScreen();
        const w: number = game.getWidth();
        let x = 0;
        let y = 0;
        // Check if font asset is loaded before rendering
        let fontLoaded = true;
        try {
            game.assets.get('font');
        } catch (e) {
            fontLoaded = false;
        }
        if (!fontLoaded) {
            // Skip rendering if font asset is not loaded
            return;
        }
        let img: Image | undefined;
        try {
            img = game.assets.get('title');
        } catch (e) {
            img = undefined;
        }
        if (img?.width && img.height) {
            x = (w - img.width) / 2;
            y = 30;
            img.draw(ctx, x, y);
        } else {
            // Fallback: draw game title text if image missing or not loaded
            const title = 'Elders of the Ashen Realm';
            try {
                x = (w - game.stringWidth(title)) / 2;
                y = 60;
                game.drawString(title, x, y);
            } catch (e) {
                // Asset not loaded, skip rendering
            }
        }

        // Developer credits
        const devNames = [
            'BY: Stephen,  github.com/ArkansasIo',

            'Additional Contributors:',
        ];
        y = 120;
        for (const name of devNames) {
            x = (w - game.stringWidth(name)) / 2;
            game.drawString(name, x, y);
            y += 24;
        }

        if (!game.audio.isInitialized()) {
            let text = 'Sound is disabled as your';
            x = (w - game.stringWidth(text)) / 2;
            y = 390;
            game.drawString(text, x, y);
            text = 'browser does not support';
            x = (w - game.stringWidth(text)) / 2;
            y += 26;
            game.drawString(text, x, y);
            text = 'web audio';
            x = (w - game.stringWidth(text)) / 2;
            y += 26;
            if (this.blink) {
                const prompt = 'Press Enter';
                x = (w - game.stringWidth(prompt)) / 2;
                y = 240;
                game.drawString(prompt, x, y);
            }
        }
    }

    private loadNextState() {
        this.game.setState(new InitialMenuState(this.game));
    }
}
