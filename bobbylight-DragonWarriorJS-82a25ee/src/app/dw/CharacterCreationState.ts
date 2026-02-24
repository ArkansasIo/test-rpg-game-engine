import { InputManager } from 'gtp';
import { BaseState } from './BaseState';
import { DwGame } from './DwGame';
import { CHARACTER_CLASSES, CHARACTER_RACES, CharacterClassOption, CharacterRaceOption, CharacterType } from './characterCreationData';

import { createNewAdventureLog, saveAdventureLog } from './AdventureLog';
import { ChoiceBubble } from './ChoiceBubble';

export class CharacterCreationState extends BaseState {
    private selectedName = '';
    private selectedRace: CharacterRaceOption | null = null;
    private selectedClass: CharacterClassOption | null = null;
    private selectedType: string | null = null;
    private selectedSubClass: string | null = null;
    private selectedSubType: string | null = null;
    private step = 0; // 0: name, 1: race, 2: class, 3: type, 4: subclass, 5: subtype, 6: confirm
    private readonly raceBubble: ChoiceBubble<CharacterRaceOption>;
    private readonly classBubble: ChoiceBubble<CharacterClassOption>;
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
                    if (im.isKeyDown(i, true)) {
                        this.selectedName += String.fromCharCode(i);
                    }
                }
                if (im.isKeyDown(8, true)) {
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
                        this.selectedType = this.typeBubble.getSelectedItem()?.name ?? null;
                        this.step = 4;
                    }
                }
                break;
            case 4: // Subclass selection
                if (this.selectedClass) {
                    this.subClassBubble = new ChoiceBubble(this.game, 120, 120, 400, 180, this.selectedClass.subClasses, (sub) => sub);
                    this.subClassBubble.update(delta);
                    if (this.subClassBubble.handleInput()) {
                        this.selectedSubClass = this.subClassBubble.getSelectedItem() ?? null;
                        this.step = 5;
                    }
                }
                break;
            case 5: // Subtype selection
                if (this.selectedClass && this.selectedType) {
                    const typeObj = this.selectedClass.types.find((t) => t.name === this.selectedType);
                    if (typeObj) {
                        this.subTypeBubble = new ChoiceBubble(this.game, 120, 120, 400, 180, typeObj.subTypes, (sub) => sub);
                        this.subTypeBubble.update(delta);
                        if (this.subTypeBubble.handleInput()) {
                            this.selectedSubType = this.subTypeBubble.getSelectedItem() ?? null;
                            this.step = 6;
                        }
                    }
                }
                break;
            case 6: // Confirm and start game
                if (im.enter(true)) {
                    const log = createNewAdventureLog();
                    log.hero.name = this.selectedName.length > 0 ? this.selectedName : 'Hero';
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
        // Draw modern styled background
        ctx.save();
        ctx.fillStyle = 'rgba(30, 30, 60, 0.95)';
        ctx.fillRect(0, 0, game.getWidth(), game.getHeight());
        ctx.restore();
        // Draw border
        ctx.save();
        ctx.strokeStyle = '#aaf';
        ctx.lineWidth = 4;
        ctx.strokeRect(10, 10, game.getWidth() - 20, game.getHeight() - 20);
        ctx.restore();
        let y = 30;
        ctx.font = 'bold 22px monospace';
        ctx.fillStyle = '#ffe066';
        ctx.textAlign = 'left';
        ctx.fillText('Character Creation', 30, y);
        y += 32;
        ctx.font = '16px monospace';
        const infoFields = [
            { label: 'Name', value: this.selectedName.length > 0 ? this.selectedName : '[Not set]', color: '#fff' },
            { label: 'Race', value: this.selectedRace?.name ?? '[Not set]', color: '#aaf' },
            { label: 'Class', value: this.selectedClass?.name ?? '[Not set]', color: '#fa7' },
            { label: 'Type', value: this.selectedType ?? '[Not set]', color: '#7fa' },
            { label: 'Subclass', value: this.selectedSubClass ?? '[Not set]', color: '#ff7' },
            { label: 'Subtype', value: this.selectedSubType ?? '[Not set]', color: '#7ff' }
        ];
        for (const field of infoFields) {
            ctx.fillStyle = field.color;
            ctx.fillText(`${field.label}: ${field.value}`, 30, y);
            y += 20;
        }
        y += 18;
        ctx.font = '15px monospace';
        // Helper for wrapping long text
        function wrapText(text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
            const words = text.split(' ');
            let line = '';
            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    ctx.fillText(line, x, y);
                    line = words[n] + ' ';
                    y += lineHeight;
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line, x, y);
            return y + lineHeight;
        }
        const maxWidth = game.getWidth() - 40;
        switch (this.step) {
            case 0:
                y = wrapText('Step 1: Enter your character name.', 30, y, maxWidth, 16);
                y = wrapText('Type your desired name and press Enter.', 30, y, maxWidth, 16);
                // Draw navigation button
                ctx.fillStyle = '#aaf';
                ctx.fillRect(game.getWidth() - 120, game.getHeight() - 60, 90, 40);
                ctx.font = 'bold 16px monospace';
                ctx.fillStyle = '#222';
                ctx.fillText('Next', game.getWidth() - 100, game.getHeight() - 35);
                break;
            case 1:
                y = wrapText('Step 2: Select your race.', 30, y, maxWidth, 16);
                this.raceBubble.paint(ctx);
                // Tooltip for race
                if (this.selectedRace) {
                    ctx.font = 'italic 14px monospace';
                    ctx.fillStyle = '#ffe066';
                    wrapText(this.selectedRace.description, 30, game.getHeight() - 80, maxWidth, 16);
                }
                // Navigation buttons
                ctx.fillStyle = '#aaf';
                ctx.fillRect(game.getWidth() - 220, game.getHeight() - 60, 90, 40);
                ctx.fillRect(game.getWidth() - 120, game.getHeight() - 60, 90, 40);
                ctx.font = 'bold 16px monospace';
                ctx.fillStyle = '#222';
                ctx.fillText('Back', game.getWidth() - 200, game.getHeight() - 35);
                ctx.fillText('Next', game.getWidth() - 100, game.getHeight() - 35);
                break;
            case 2:
                y = wrapText('Step 3: Select your class.', 30, y, maxWidth, 16);
                this.classBubble.paint(ctx);
                // Tooltip for class
                if (this.selectedClass) {
                    ctx.font = 'italic 14px monospace';
                    ctx.fillStyle = '#ffe066';
                    wrapText('Choose a class to define your abilities.', 30, game.getHeight() - 80, maxWidth, 16);
                }
                // Navigation buttons
                ctx.fillStyle = '#aaf';
                ctx.fillRect(game.getWidth() - 220, game.getHeight() - 60, 90, 40);
                ctx.fillRect(game.getWidth() - 120, game.getHeight() - 60, 90, 40);
                ctx.font = 'bold 16px monospace';
                ctx.fillStyle = '#222';
                ctx.fillText('Back', game.getWidth() - 200, game.getHeight() - 35);
                ctx.fillText('Next', game.getWidth() - 100, game.getHeight() - 35);
                break;
            case 3:
                y = wrapText('Step 4: Select your type.', 30, y, maxWidth, 16);
                this.typeBubble.paint(ctx);
                // Navigation buttons
                ctx.fillStyle = '#aaf';
                ctx.fillRect(game.getWidth() - 220, game.getHeight() - 60, 90, 40);
                ctx.fillRect(game.getWidth() - 120, game.getHeight() - 60, 90, 40);
                ctx.font = 'bold 16px monospace';
                ctx.fillStyle = '#222';
                ctx.fillText('Back', game.getWidth() - 200, game.getHeight() - 35);
                ctx.fillText('Next', game.getWidth() - 100, game.getHeight() - 35);
                break;
            case 4:
                y = wrapText('Step 5: Select your subclass.', 30, y, maxWidth, 16);
                this.subClassBubble.paint(ctx);
                // Navigation buttons
                ctx.fillStyle = '#aaf';
                ctx.fillRect(game.getWidth() - 220, game.getHeight() - 60, 90, 40);
                ctx.fillRect(game.getWidth() - 120, game.getHeight() - 60, 90, 40);
                ctx.font = 'bold 16px monospace';
                ctx.fillStyle = '#222';
                ctx.fillText('Back', game.getWidth() - 200, game.getHeight() - 35);
                ctx.fillText('Next', game.getWidth() - 100, game.getHeight() - 35);
                break;
            case 5:
                y = wrapText('Step 6: Select your subtype.', 30, y, maxWidth, 16);
                this.subTypeBubble.paint(ctx);
                // Navigation buttons
                ctx.fillStyle = '#aaf';
                ctx.fillRect(game.getWidth() - 220, game.getHeight() - 60, 90, 40);
                ctx.fillRect(game.getWidth() - 120, game.getHeight() - 60, 90, 40);
                ctx.font = 'bold 16px monospace';
                ctx.fillStyle = '#222';
                ctx.fillText('Back', game.getWidth() - 200, game.getHeight() - 35);
                ctx.fillText('Next', game.getWidth() - 100, game.getHeight() - 35);
                break;
            case 6:
                y = wrapText('Step 7: Confirm your character!', 30, y, maxWidth, 16);
                y = wrapText('Review all details above.', 30, y, maxWidth, 16);
                y = wrapText('Press Enter to start your adventure.', 30, y, maxWidth, 16);
                // Navigation button
                ctx.fillStyle = '#aaf';
                ctx.fillRect(game.getWidth() - 120, game.getHeight() - 60, 90, 40);
                ctx.font = 'bold 16px monospace';
                ctx.fillStyle = '#222';
                ctx.fillText('Start', game.getWidth() - 100, game.getHeight() - 35);
                break;
        }
    }
}
