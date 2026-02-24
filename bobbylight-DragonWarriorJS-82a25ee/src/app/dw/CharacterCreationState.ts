import { InputManager } from 'gtp';
import { BaseState } from './BaseState';
import { DwGame } from './DwGame';
import { CHARACTER_CLASSES, CHARACTER_RACES, CharacterClassOption, CharacterRaceOption } from './characterCreationData';
import { CharacterType } from './characterCreationData';
import { createNewAdventureLog, saveAdventureLog } from './AdventureLog';
import { ChoiceBubble } from './ChoiceBubble';

export class CharacterCreationState extends BaseState {
    private selectedName: string = '';
    private selectedRace: CharacterRaceOption | null = null;
    private selectedClass: CharacterClassOption | null = null;
    private selectedType: string | null = null;
    private selectedSubClass: string | null = null;
    private selectedSubType: string | null = null;
    private step: number = 0; // 0: name, 1: race, 2: class, 3: type, 4: subclass, 5: subtype, 6: confirm
    private raceBubble: ChoiceBubble<CharacterRaceOption>;
    private classBubble: ChoiceBubble<CharacterClassOption>;
    private typeBubble: ChoiceBubble<CharacterType>;
    private subClassBubble: ChoiceBubble<string>;
    private subTypeBubble: ChoiceBubble<string>;

    constructor(game: DwGame) {
        super(game);
        this.raceBubble = new ChoiceBubble(game, 120, 120, 400, 180, CHARACTER_RACES, (race: CharacterRaceOption) => race.name);
        this.classBubble = new ChoiceBubble(game, 120, 120, 400, 180, CHARACTER_CLASSES, (cls: CharacterClassOption) => cls.name);
        this.typeBubble = new ChoiceBubble(game, 120, 120, 400, 180, [], (type: CharacterType) => type.name);
        this.subClassBubble = new ChoiceBubble(game, 120, 120, 400, 180, [], (sub: string) => sub);
        this.subTypeBubble = new ChoiceBubble(game, 120, 120, 400, 180, [], (sub: string) => sub);
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
        const im: InputManager = this.game.inputManager;
        switch (this.step) {
            case 0: // Name input
                for (let i = 65; i <= 90; i++) { // A-Z
                    if (im.isKeyDown && im.isKeyDown(i, true)) {
                        this.selectedName += String.fromCharCode(i);
                    }
                }
                if (im.isKeyDown && im.isKeyDown(8, true)) {
                    this.selectedName = this.selectedName.slice(0, -1);
                }
                if (im.enter(true) && this.selectedName.length > 0) {
                    this.step = 1;
                }
                break;
            case 1: // Race selection
                this.raceBubble.update(delta);
                if (this.raceBubble.handleInput()) {
                    this.selectedRace = this.raceBubble.getSelectedItem()!;
                    this.step = 2;
                }
                break;
            case 2: // Class selection
                this.classBubble.update(delta);
                if (this.classBubble.handleInput()) {
                    this.selectedClass = this.classBubble.getSelectedItem()!;
                    this.step = 3;
                }
                break;
            case 3: // Type selection
                if (this.selectedClass) {
                    this.typeBubble = new ChoiceBubble(this.game, 120, 120, 400, 180, this.selectedClass.types, (type: CharacterType) => type.name);
                    this.typeBubble.update(delta);
                    if (this.typeBubble.handleInput()) {
                        this.selectedType = this.typeBubble.getSelectedItem()?.name || null;
                        this.step = 4;
                    }
                }
                break;
            case 4: // Subclass selection
                if (this.selectedClass) {
                    this.subClassBubble = new ChoiceBubble(this.game, 120, 120, 400, 180, this.selectedClass.subClasses, (sub) => sub);
                    this.subClassBubble.update(delta);
                    if (this.subClassBubble.handleInput()) {
                        this.selectedSubClass = this.subClassBubble.getSelectedItem() || null;
                        this.step = 5;
                    }
                }
                break;
            case 5: // Subtype selection
                if (this.selectedClass && this.selectedType) {
                    const typeObj = this.selectedClass.types.find(t => t.name === this.selectedType);
                    if (typeObj) {
                        this.subTypeBubble = new ChoiceBubble(this.game, 120, 120, 400, 180, typeObj.subTypes, (sub) => sub);
                        this.subTypeBubble.update(delta);
                        if (this.subTypeBubble.handleInput()) {
                            this.selectedSubType = this.subTypeBubble.getSelectedItem() || null;
                            this.step = 6;
                        }
                    }
                }
                break;
            case 6: // Confirm and start game
                if (im.enter(true)) {
                    const log = createNewAdventureLog();
                    log.hero.name = this.selectedName || 'Hero';
                    saveAdventureLog(log);
                    if (typeof this.game.continueGame === 'function') {
                        this.game.continueGame(log.id);
                    }
                }
                break;
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
                break;
            case 1:
                ctx.fillText('Step 2: Select your race.', 40, y);
                this.raceBubble.paint(ctx);
                break;
            case 2:
                ctx.fillText('Step 3: Select your class.', 40, y);
                this.classBubble.paint(ctx);
                break;
            case 3:
                ctx.fillText('Step 4: Select your type.', 40, y);
                this.typeBubble.paint(ctx);
                break;
            case 4:
                ctx.fillText('Step 5: Select your subclass.', 40, y);
                this.subClassBubble.paint(ctx);
                break;
            case 5:
                ctx.fillText('Step 6: Select your subtype.', 40, y);
                this.subTypeBubble.paint(ctx);
                break;
            case 6:
                ctx.fillText('Step 7: Confirm your character!', 40, y);
                ctx.fillText('Review all details above.', 40, y + 30);
                ctx.fillText('Press Enter to start your adventure.', 40, y + 60);
                break;
        }
    }
}
