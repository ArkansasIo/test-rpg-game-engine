import { BaseState } from './BaseState';
import { DwGame } from './DwGame';
import { ChoiceBubble } from './ChoiceBubble';
import { getAdventureLogSummaries } from './AdventureLog';
import { CharacterCreationState } from './CharacterCreationState';
import { CharacterSelectState } from './CharacterSelectState';

/**
 * The internal substates this menu can be in.  We break out the main menu
 * from the save-select screen for clarity.  Additional substates (like
 * an options menu) could be added here in the future.
 */
type Substate = 'mainMenu' | 'saveSelect';

/**
 * The initial menu shown to the user after pressing Enter on the title screen.
 */
export class InitialMenuState extends BaseState {

    private readonly menuBubble: ChoiceBubble<string>;
    private readonly saveSelectBubble: ChoiceBubble<string> | undefined;
    private substate: Substate;

    constructor(game: DwGame) {
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
    private createMenuBubble(): ChoiceBubble<string> {

        const game: DwGame = this.game;
        const tileSize: number = game.getTileSize();
        const w: number = game.getWidth() - 4 * tileSize;
        // Make the main menu a little shorter than the original to mirror
        // modern menus.  Four rows is plenty for four options.
        const h: number = 6 * tileSize;
        const x: number = (game.getWidth() - w) / 2;
        const y: number = (game.getHeight() - h) / 2;

        const choices: string[] = [
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

    override enter() {
        super.enter();
        this.substate = 'mainMenu';
        this.menuBubble.setActive(true);
        this.game.audio.playMusic('MUSIC_TOWN');
    }

    override update(delta: number) {

        this.handleDefaultKeys();

        switch (this.substate) {
            default:
            case 'mainMenu': {
                this.menuBubble.update(delta);
                if (this.menuBubble.handleInput()) {
                    const selection: number = this.menuBubble.getSelectedIndex();
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
                            try {
                                // Attempt to close the window gracefully
                                window.close();
                            } catch (e) {
                                // Fall back to reload
                                window.location.reload();
                            }
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
                const bubble = this.saveSelectBubble! as unknown as ChoiceBubble<{ id: string; label: string }>;
                bubble.update(delta);
                if (bubble.handleInput()) {
                    const selection: number = bubble.getSelectedIndex();
                    if (-1 === selection) {
                        this.substate = 'mainMenu';
                        this.menuBubble.setActive(true);
                    } else {
                        const summaries = getAdventureLogSummaries();
                        if (summaries.length === 0) {
                            this.game.audio.playSound('missed1');
                            this.substate = 'mainMenu';
                            this.menuBubble.setActive(true);
                        } else {
                            this.game.audio.playSound('menu');
                            const chosen = summaries[selection];
                            if (chosen?.id) {
                                this.game.continueGame(chosen.id);
                            } else {
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

    override render(ctx: CanvasRenderingContext2D) {

        const game: DwGame = this.game;
        game.clearScreen();

        this.menuBubble.paint(ctx);

        if (this.substate === 'saveSelect') {
            this.saveSelectBubble!.paint(ctx);
        }
    }
}


