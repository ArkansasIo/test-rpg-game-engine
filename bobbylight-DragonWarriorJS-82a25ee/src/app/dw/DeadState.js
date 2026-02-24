import { FadeOutInState } from 'gtp';
import { BaseState } from './BaseState';
import { TitleScreenState } from './TitleScreenState';
export class DeadState extends BaseState {
    constructor(game, battleState) {
        super(game);
        this.battleState = battleState;
        this.game.audio.playMusic(null);
        this.game.audio.playSound('dead', false, () => {
            this.allowUserInput = true;
        });
    }
    render(ctx) {
        this.battleState.render(ctx);
    }
    update(delta) {
        if (this.allowUserInput && this.game.anyKeyDown()) {
            this.game.setState(new FadeOutInState(this, new TitleScreenState(this.game)));
        }
    }
}
//# sourceMappingURL=DeadState.js.map