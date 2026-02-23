import { BaseState } from './BaseState';
import { DwGame } from './DwGame';
import { CHARACTER_CLASSES, CHARACTER_RACES, CharacterClassOption, CharacterRaceOption } from './characterCreationData';

export class CharacterCreationState extends BaseState {
    private selectedName: string = '';
    private selectedRace: CharacterRaceOption | null = null;
    private selectedClass: CharacterClassOption | null = null;
    private selectedType: string | null = null;
    private selectedSubClass: string | null = null;
    private selectedSubType: string | null = null;
    private step: number = 0; // 0: name, 1: race, 2: class, 3: type, 4: subclass, 5: subtype, 6: confirm

    constructor(game: DwGame) {
        super(game);
    }

    override enter() {
        // Optionally reset selections
        this.selectedName = '';
        this.selectedRace = null;
        this.selectedClass = null;
        this.selectedType = null;
        this.selectedSubClass = null;
        this.selectedSubType = null;
        this.step = 0;
    }

    override update(delta: number) {
        // Handle input for each step (pseudo-code, UI integration needed)
        // For now, just cycle steps for demonstration
        // Replace with actual input handling and UI logic
        if (this.step < 6) {
            this.step++;
        } else if (this.step === 6) {
            // On confirmation, create and save a new AdventureLog, then start the game
            // (In real code, check for Enter key or confirmation input)
            const { createNewAdventureLog, saveAdventureLog } = require('./AdventureLog');
            const log = createNewAdventureLog();
            // Patch log with selected character options
            log.hero.name = this.selectedName || 'Hero';
            log.hero.race = this.selectedRace?.name || 'Human';
            log.hero.class = this.selectedClass?.name || 'Warrior';
            log.hero.type = this.selectedType || '';
            log.hero.subClass = this.selectedSubClass || '';
            log.hero.subType = this.selectedSubType || '';
            saveAdventureLog(log);
            // Set log and start game
            this.game.adventureLog = log;
            // Use the same transition as startNewGame
            // @ts-ignore
            this.game['transitionToGame']();
        }
    }

    override render(ctx: CanvasRenderingContext2D) {
        const game = this.game;
        game.clearScreen();
        let y = 40;
        ctx.font = '20px monospace';
        ctx.fillStyle = '#fff';
        ctx.fillText('Character Creation', 40, y);
        y += 40;
        // Show current selections at the top for context
        ctx.font = '16px monospace';
        ctx.fillText(`Name: ${this.selectedName || '[Not set]'}`, 40, y); y += 22;
        ctx.fillText(`Race: ${this.selectedRace?.name || '[Not set]'}`, 40, y); y += 22;
        ctx.fillText(`Class: ${this.selectedClass?.name || '[Not set]'}`, 40, y); y += 22;
        ctx.fillText(`Type: ${this.selectedType || '[Not set]'}`, 40, y); y += 22;
        ctx.fillText(`Subclass: ${this.selectedSubClass || '[Not set]'}`, 40, y); y += 22;
        ctx.fillText(`Subtype: ${this.selectedSubType || '[Not set]'}`, 40, y); y += 32;
        ctx.font = '20px monospace';
        switch (this.step) {
            case 0:
                ctx.fillText('Step 1: Enter your character name.', 40, y);
                ctx.fillText('Type your desired name and press Enter.', 40, y + 30);
                // Draw name input UI here
                break;
            case 1:
                ctx.fillText('Step 2: Select your race.', 40, y);
                ctx.fillText('Use arrow keys and Enter to choose:', 40, y + 30);
                CHARACTER_RACES.forEach((race, i) => {
                    ctx.fillText(`${i + 1}. ${race.name} - ${race.description}`, 60, y + 60 + i * 24);
                });
                break;
            case 2:
                ctx.fillText('Step 3: Select your class.', 40, y);
                ctx.fillText('Use arrow keys and Enter to choose:', 40, y + 30);
                CHARACTER_CLASSES.forEach((cls, i) => {
                    ctx.fillText(`${i + 1}. ${cls.name}`, 60, y + 60 + i * 24);
                });
                break;
            case 3:
                ctx.fillText('Step 4: Select your type.', 40, y);
                ctx.fillText('Use arrow keys and Enter to choose:', 40, y + 30);
                if (this.selectedClass) {
                    this.selectedClass.types.forEach((type, i) => {
                        ctx.fillText(`${i + 1}. ${type.name}`, 60, y + 60 + i * 24);
                    });
                }
                break;
            case 4:
                ctx.fillText('Step 5: Select your subclass.', 40, y);
                ctx.fillText('Use arrow keys and Enter to choose:', 40, y + 30);
                if (this.selectedClass) {
                    this.selectedClass.subClasses.forEach((sub, i) => {
                        ctx.fillText(`${i + 1}. ${sub}`, 60, y + 60 + i * 24);
                    });
                }
                break;
            case 5:
                ctx.fillText('Step 6: Select your subtype.', 40, y);
                ctx.fillText('Use arrow keys and Enter to choose:', 40, y + 30);
                if (this.selectedClass && this.selectedType) {
                    const typeObj = this.selectedClass.types.find(t => t.name === this.selectedType);
                    if (typeObj) {
                        typeObj.subTypes.forEach((sub, i) => {
                            ctx.fillText(`${i + 1}. ${sub}`, 60, y + 60 + i * 24);
                        });
                    }
                }
                break;
            case 6:
                ctx.fillText('Step 7: Confirm your character!', 40, y);
                ctx.fillText('Review all details above.', 40, y + 30);
                ctx.fillText('Press Enter to start your adventure.', 40, y + 60);
                break;
        }
    }
}
