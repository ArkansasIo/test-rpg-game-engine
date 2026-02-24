import { BaseState } from './BaseState';
import { ChoiceBubble } from './ChoiceBubble';
import { getAdventureLogSummaries } from './AdventureLog';
import { CharacterCreationState } from './CharacterCreationState';
import { CharacterSelectState } from './CharacterSelectState';
/**
 * The initial menu shown to the user after pressing Enter on the title screen.
 */
export class InitialMenuState extends BaseState {
    constructor(game) {
        super(game);
        this.menuBubble = this.createMenuBubble();
        this.substate = 'mainMenu';
    }
    /**
     * Creates the main menu bubble.  The Unreal 5-inspired menu is simplified
     * into four core actions: start a new game, load an existing game, open
     * the options menu and exit the game.  Additional actions can be added
     * here later.
     */
    createMenuBubble() {
        const game = this.game;
        const tileSize = game.getTileSize();
        const w = game.getWidth() - 4 * tileSize;
        // Make the main menu a little shorter than the original to mirror
        // modern menus.  Four rows is plenty for four options.
        const h = 6 * tileSize;
        const x = (game.getWidth() - w) / 2;
        const y = (game.getHeight() - h) / 2;
        const choices = [
            'START NEW ADVENTURE',
            'CONTINUE JOURNEY',
            'SETTINGS',
            'CREDITS',
            'EXIT GAME',
        ];
        return new ChoiceBubble(this.game, x, y, w, h, choices);
    }
    /**
     * Creates a save-select bubble.  When the player chooses to load a game
     * they are presented with a list of existing adventure logs pulled from
     * localStorage.  Each entry includes the hero's name, level and the
     * modified timestamp.  If there are no saved games then a single entry
     * invites the player to return.
     */
    enter() {
        super.enter();
        this.substate = 'mainMenu';
        this.menuBubble.setActive(true);
        this.game.audio.playMusic('MUSIC_TOWN');
    }
    update(delta) {
        this.handleDefaultKeys();
        switch (this.substate) {
            default:
            case 'mainMenu': {
                this.menuBubble.update(delta);
                if (this.menuBubble.handleInput()) {
                    const selection = this.menuBubble.getSelectedIndex();
                    switch (selection) {
                        case 0: // New game
                            this.game.audio.playSound('menu');
                            this.game.setState(new CharacterCreationState(this.game));
                            break;
                        case 1: { // Load game
                            this.game.audio.playSound('menu');
                            this.game.setState(new CharacterSelectState(this.game));
                            break;
                        }
                        case 2: // Options
                            // Options menu is not yet implemented; notify user
                            this.game.audio.playSound('missed1');
                            break;
                        case 3: { // Exit
                            this.game.audio.playSound('menu');
                            // Instead of closing the window, reload the page
                            window.location.reload();
                            break;
                        }
                        default:
                            this.game.audio.playSound('missed1');
                            break;
                    }
                }
                break;
            }
            case 'saveSelect': {
                // The save-select bubble stores objects with id/label pairs.  We
                // cast here to get proper typings.  If the player cancels
                // (selection === -1) we return to the main menu.  Otherwise we
                // continue the chosen adventure.
                const bubble = this.saveSelectBubble;
                bubble.update(delta);
                if (bubble.handleInput()) {
                    const selection = bubble.getSelectedIndex();
                    if (-1 === selection) {
                        this.substate = 'mainMenu';
                        this.menuBubble.setActive(true);
                    }
                    else {
                        const summaries = getAdventureLogSummaries();
                        if (summaries.length === 0) {
                            this.game.audio.playSound('missed1');
                            this.substate = 'mainMenu';
                            this.menuBubble.setActive(true);
                        }
                        else {
                            this.game.audio.playSound('menu');
                            const chosen = summaries[selection];
                            if (chosen === null || chosen === void 0 ? void 0 : chosen.id) {
                                this.game.continueGame(chosen.id);
                            }
                            else {
                                // Should never happen, fallback to new game
                                this.game.startNewGame();
                            }
                        }
                    }
                }
                break;
            }
        }
    }
    render(ctx) {
        const game = this.game;
        game.clearScreen();
        this.menuBubble.paint(ctx);
        if (this.substate === 'saveSelect') {
            this.saveSelectBubble.paint(ctx);
        }
    }
}
//# sourceMappingURL=InitialMenuState.js.map