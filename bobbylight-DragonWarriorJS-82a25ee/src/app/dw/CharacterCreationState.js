import { Keys } from 'gtp';
import { BaseState } from './BaseState';
import { CHARACTER_CLASSES, CHARACTER_RACES, toCharacterPortraitId, } from './characterCreationData';
import { createNewAdventureLog, saveAdventureLog } from './AdventureLog';
import { ChoiceBubble } from './ChoiceBubble';
export class CharacterCreationState extends BaseState {
    constructor(game) {
        super(game);
        this.selectedName = '';
        this.selectedRace = null;
        this.selectedClass = null;
        this.selectedType = null;
        this.selectedSubClass = null;
        this.selectedSubType = null;
        this.step = 0; // 0: name, 1: race, 2: class, 3: type, 4: subclass, 5: subtype, 6: confirm
        this.raceBubble = new ChoiceBubble(game, 34, 196, 450, 230, CHARACTER_RACES, (race) => race.name, true, 'Race');
        this.classBubble = new ChoiceBubble(game, 34, 196, 450, 230, CHARACTER_CLASSES, (cls) => cls.name, true, 'Class');
        this.typeBubble = new ChoiceBubble(game, 34, 196, 450, 230, [], (type) => type.name, true, 'Type');
        this.subClassBubble = new ChoiceBubble(game, 34, 196, 450, 230, [], (sub) => sub, true, 'Subclass');
        this.subTypeBubble = new ChoiceBubble(game, 34, 196, 450, 230, [], (sub) => sub, true, 'Subtype');
    }
    enter() {
        this.selectedName = '';
        this.selectedRace = null;
        this.selectedClass = null;
        this.selectedType = null;
        this.selectedSubClass = null;
        this.selectedSubType = null;
        this.setStep(0);
    }
    setStep(step) {
        this.step = step;
        if (this.step === 3 && this.selectedClass) {
            this.typeBubble = new ChoiceBubble(this.game, 34, 196, 450, 230, this.selectedClass.types, (type) => type.name, true, 'Type');
        }
        else if (this.step === 4 && this.selectedClass) {
            this.subClassBubble = new ChoiceBubble(this.game, 34, 196, 450, 230, this.selectedClass.subClasses, (sub) => sub, true, 'Subclass');
        }
        else if (this.step === 5 && this.selectedClass && this.selectedType) {
            const typeObj = this.selectedClass.types.find((t) => t.name === this.selectedType);
            this.subTypeBubble = new ChoiceBubble(this.game, 34, 196, 450, 230, typeObj ? typeObj.subTypes : [], (sub) => sub, true, 'Subtype');
        }
    }
    update(delta) {
        var _a, _b, _c, _d, _e, _f;
        const im = this.game.inputManager;
        if (im.isKeyDown(Keys.KEY_X, true) && this.step > 0) {
            this.setStep(this.step - 1);
            return;
        }
        switch (this.step) {
            case 0:
                this.updateNameEntry(im);
                break;
            case 1:
                this.raceBubble.update(delta);
                if (this.raceBubble.handleInput()) {
                    this.selectedRace = (_a = this.raceBubble.getSelectedItem()) !== null && _a !== void 0 ? _a : null;
                    this.setStep(2);
                }
                break;
            case 2:
                this.classBubble.update(delta);
                if (this.classBubble.handleInput()) {
                    this.selectedClass = (_b = this.classBubble.getSelectedItem()) !== null && _b !== void 0 ? _b : null;
                    this.selectedType = null;
                    this.selectedSubClass = null;
                    this.selectedSubType = null;
                    this.setStep(3);
                }
                break;
            case 3:
                this.typeBubble.update(delta);
                if (this.typeBubble.handleInput()) {
                    this.selectedType = (_d = (_c = this.typeBubble.getSelectedItem()) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : null;
                    this.selectedSubType = null;
                    this.setStep(4);
                }
                break;
            case 4:
                this.subClassBubble.update(delta);
                if (this.subClassBubble.handleInput()) {
                    this.selectedSubClass = (_e = this.subClassBubble.getSelectedItem()) !== null && _e !== void 0 ? _e : null;
                    this.setStep(5);
                }
                break;
            case 5:
                this.subTypeBubble.update(delta);
                if (this.subTypeBubble.handleInput()) {
                    this.selectedSubType = (_f = this.subTypeBubble.getSelectedItem()) !== null && _f !== void 0 ? _f : null;
                    this.setStep(6);
                }
                break;
            case 6:
                if (im.enter(true)) {
                    const log = createNewAdventureLog();
                    log.hero.name = this.selectedName.length > 0 ? this.selectedName : 'Hero';
                    saveAdventureLog(log);
                    this.game.continueGame(log.id);
                }
                break;
        }
    }
    updateNameEntry(im) {
        for (let i = 65; i <= 90; i++) {
            if (im.isKeyDown(i, true) && this.selectedName.length < 14) {
                this.selectedName += String.fromCharCode(i);
            }
        }
        if (im.isKeyDown(8, true)) {
            this.selectedName = this.selectedName.slice(0, -1);
        }
        if (im.enter(true) && this.selectedName.length > 0) {
            this.setStep(1);
        }
    }
    getActivePortraitId() {
        var _a, _b;
        const race = (_a = this.selectedRace) === null || _a === void 0 ? void 0 : _a.name;
        const cls = (_b = this.selectedClass) === null || _b === void 0 ? void 0 : _b.name;
        if (this.step === 1 && race) {
            return toCharacterPortraitId('RACE', race);
        }
        if (this.step === 2 && cls) {
            return toCharacterPortraitId('CLASS', cls);
        }
        if (this.step === 3 && cls && this.selectedType) {
            return toCharacterPortraitId('CLASS', cls, 'TYPE', this.selectedType);
        }
        if (this.step === 4 && cls && this.selectedSubClass) {
            return toCharacterPortraitId('CLASS', cls, 'SUBCLASS', this.selectedSubClass);
        }
        if (this.step === 5 && cls && this.selectedType && this.selectedSubType) {
            return toCharacterPortraitId('CLASS', cls, 'TYPE', this.selectedType, 'SUBTYPE', this.selectedSubType);
        }
        if (this.step >= 6 && cls && this.selectedType && this.selectedSubType && this.selectedSubClass) {
            return toCharacterPortraitId('CLASS', cls, 'SUBCLASS', this.selectedSubClass, 'TYPE', this.selectedType, 'SUBTYPE', this.selectedSubType);
        }
        if (race && cls) {
            return toCharacterPortraitId('RACE', race, 'CLASS', cls);
        }
        return null;
    }
    drawPortraitPreview(ctx) {
        const id = this.getActivePortraitId();
        if (!id) {
            return;
        }
        const image = this.game.assets.get(id);
        if (!image) {
            return;
        }
        const panelX = 530;
        const panelY = 196;
        const panelW = 220;
        const panelH = 230;
        ctx.fillStyle = 'rgba(13, 10, 20, 0.9)';
        ctx.fillRect(panelX, panelY, panelW, panelH);
        ctx.strokeStyle = '#d8b164';
        ctx.lineWidth = 2;
        ctx.strokeRect(panelX, panelY, panelW, panelH);
        ctx.fillStyle = '#f6e6be';
        ctx.font = 'bold 14px Georgia';
        ctx.fillText('Generated Portrait', panelX + 18, panelY + 24);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(image, panelX + 44, panelY + 40, 128, 128);
        ctx.imageSmoothingEnabled = true;
        ctx.font = '12px Georgia';
        ctx.fillStyle = '#c9b38b';
        ctx.fillText(id.replace('CHAR__', ''), panelX + 12, panelY + 190, panelW - 24);
    }
    render(ctx) {
        var _a, _b, _c, _d, _e, _f, _g;
        const game = this.game;
        ctx.fillStyle = 'rgba(12, 10, 16, 0.96)';
        ctx.fillRect(0, 0, game.getWidth(), game.getHeight());
        ctx.strokeStyle = '#c59c52';
        ctx.lineWidth = 3;
        ctx.strokeRect(10, 10, game.getWidth() - 20, game.getHeight() - 20);
        ctx.font = 'bold 26px Georgia';
        ctx.fillStyle = '#f0dbab';
        ctx.fillText('Character Forge', 34, 44);
        ctx.font = '14px Georgia';
        ctx.fillStyle = '#c7b184';
        ctx.fillText('Pixel portraits generated for class / subclass / type / subtype.', 34, 66);
        let y = 92;
        const rows = [
            ['Name', this.selectedName || '[Not set]'],
            ['Race', (_b = (_a = this.selectedRace) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '[Not set]'],
            ['Class', (_d = (_c = this.selectedClass) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : '[Not set]'],
            ['Type', (_e = this.selectedType) !== null && _e !== void 0 ? _e : '[Not set]'],
            ['Subclass', (_f = this.selectedSubClass) !== null && _f !== void 0 ? _f : '[Not set]'],
            ['Subtype', (_g = this.selectedSubType) !== null && _g !== void 0 ? _g : '[Not set]'],
        ];
        ctx.font = '16px Georgia';
        for (const [label, value] of rows) {
            ctx.fillStyle = '#bda57d';
            ctx.fillText(`${label}:`, 36, y);
            ctx.fillStyle = '#f2e5c2';
            ctx.fillText(value, 138, y);
            y += 22;
        }
        ctx.fillStyle = '#977748';
        ctx.font = '14px Georgia';
        ctx.fillText(`Step ${this.step + 1}/7`, 36, 454);
        ctx.fillText('Enter = Confirm / Next, X = Back', 126, 454);
        switch (this.step) {
            case 1:
                this.raceBubble.paint(ctx);
                break;
            case 2:
                this.classBubble.paint(ctx);
                break;
            case 3:
                this.typeBubble.paint(ctx);
                break;
            case 4:
                this.subClassBubble.paint(ctx);
                break;
            case 5:
                this.subTypeBubble.paint(ctx);
                break;
            default:
                break;
        }
        this.drawPortraitPreview(ctx);
    }
}
//# sourceMappingURL=CharacterCreationState.js.map