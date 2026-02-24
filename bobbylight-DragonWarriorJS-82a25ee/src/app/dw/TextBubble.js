import { Delay } from 'gtp';
import { Bubble } from './Bubble';
import { ShoppingBubble } from './ShoppingBubble';
import { Conversation } from './Conversation';
import { ChoiceBubble } from './ChoiceBubble';
export class TextBubble extends Bubble {
    constructor(game) {
        const tileSize = game.getTileSize();
        const x = tileSize;
        const width = game.getWidth() - 2 * x;
        const height = game.getTileSize() * 5;
        const y = game.getHeight() - tileSize - height;
        super(game, undefined, x, y, width, height);
        this.conversation = new Conversation(game);
        this.conversationDone = false;
        this.text = '';
        this.curLine = 0;
        this.lines = [];
        this.delays = [];
        this.curOffs = -1;
        this.curCharMillis = 0;
        this.textDone = true;
        this.doneCallbacks = [];
        this.afterAutoAdvanceDelay = 0;
        this.inAutoAdvanceDelay = false;
    }
    addToConversation(text, autoAdvance = false) {
        this.conversation.addSegment(text);
        if (autoAdvance && this.textDone) {
            this.updateConversation();
        }
        else {
            console.log(`oh no - ${autoAdvance}, ${this.textDone}`);
        }
    }
    append(segment) {
        const curText = segment.currentText();
        if (!curText) {
            return;
        }
        this.text = this.text + '\n' + curText;
        this.curLine = this.lines.length;
        const w = this.w - 2 * this.getXMargin();
        const breakApartResult = this.breakApart(curText, w);
        this.lines = this.lines.concat(breakApartResult.lines);
        this.delays = breakApartResult.delays;
        this.curOffs = -1;
        this.curCharMillis = 0;
        this.textDone = false;
        console.log('>>> textDone set to false');
        if (segment.choices) {
            this.choiceBubble = this.createChoiceBubble(segment.choices);
            this.setActive(false);
        }
        else if (segment.shopping) {
            this.shoppingBubble = new ShoppingBubble(this.game, segment.shopping);
            this.setActive(false);
        }
    }
    createChoiceBubble(choices) {
        const tileSize = this.game.getTileSize();
        const x = this.game.getWidth() - tileSize * 6;
        const y = tileSize;
        const width = tileSize * 5;
        const height = tileSize * (choices.length + 1);
        return new ChoiceBubble(this.game, x, y, width, height, choices, (choice) => {
            if (typeof choice === 'string') {
                return choice;
            }
            return choice.text;
        });
    }
    /**
     * Returns the next state from a conversation segment's arguments.
     */
    static getNextState(choice) {
        if (typeof choice === 'string') {
            return undefined;
        }
        if (typeof choice.next === 'string') {
            return choice.next;
        }
        return choice.next();
    }
    /**
     * Returns whether the user is "done" talking; that is, whether the entire
     * conversation has been rendered (including multiple pages, if necessary).
     */
    handleInput() {
        let result;
        let nextState;
        if (this.textDone) {
            if (this.shoppingBubble) {
                result = this.shoppingBubble.handleInput();
                if (result) {
                    const item = this.shoppingBubble.getSelectedItem();
                    delete this.shoppingBubble;
                    this.setActive(true);
                    if (item) {
                        this.conversation.setItem(item);
                        nextState = item.baseCost > this.game.party.gold ?
                            Conversation.NOT_ENOUGH_SEGMENT : Conversation.CONFIRM_SEGMENT;
                        return !this.updateConversation(nextState);
                    }
                    else {
                        return !this.updateConversation(Conversation.SOMETHING_ELSE_SEGMENT);
                    }
                }
                return false;
            }
            else if (this.choiceBubble) {
                result = this.choiceBubble.handleInput();
                if (result) {
                    const choice = this.choiceBubble.getSelectedItem();
                    nextState = TextBubble.getNextState(choice);
                    delete this.choiceBubble;
                    this.setActive(true);
                    return !this.updateConversation(nextState);
                }
                return false;
            }
        }
        // A little cheap, but we currently don't support pressing a key to auto-advance text when an
        // auto-advance delay is pending or running. This could be implemented in the future but might be a little
        // complex.
        if (this.game.anyKeyDown() && !this.hasPendingOrRunningAutoAdvanceDelay()) {
            if (!this.textDone) {
                this.textDone = true;
                if (this.lines.length > TextBubble.MAX_LINE_COUNT) {
                    this.lines.splice(0, this.lines.length - TextBubble.MAX_LINE_COUNT);
                }
                this.curLine = this.lines.length - 1;
            }
            else {
                return !this.updateConversation();
            }
        }
        return false;
    }
    /**
     * Initializes local state based on the upcoming conversation segment.
     */
    handleSegmentExtraProperties(segment) {
        var _a;
        // Sound or music to play immediately
        if (segment.sound) {
            this.game.audio.playSound(segment.sound);
        }
        if (segment.music) {
            this.game.audio.playMusic(segment.music);
        }
        // A sound to play when this segment's text finishes rendering
        if (segment.afterSound) {
            this.afterSound = segment.afterSound;
        }
        else if (segment.choices) {
            this.afterSound = 'confirmation';
        }
        this.afterAutoAdvanceDelay = (_a = segment.afterAutoAdvanceDelay) !== null && _a !== void 0 ? _a : 0;
        this.inAutoAdvanceDelay = false;
    }
    /**
     * Returns true if there is a pending or running auto-advance delay. Used to disallow the player from
     * auto-advancing text when a delay is imminent. In practice this should be allowed, skipping just to the
     * delay, but we'll add that in a future ticket.
     */
    hasPendingOrRunningAutoAdvanceDelay() {
        return this.afterAutoAdvanceDelay > 0 || this.inAutoAdvanceDelay;
    }
    init() {
        super.init();
        this.conversationDone = false;
    }
    /**
     * Forces the conversation to go to the next segment.  Should only be called
     * internally.  This is a sign of bad design.
     */
    nudgeConversation() {
        this.updateConversation();
    }
    /**
     * Returns true if the current conversation has completed.
     */
    isDone() {
        var _a;
        return this.textDone && !this.choiceBubble &&
            !this.shoppingBubble && !((_a = this.conversation) === null || _a === void 0 ? void 0 : _a.hasNext());
    }
    currentTextDone() {
        return this.textDone;
    }
    isOvernight() {
        return !!this.overnight;
    }
    clearOvernight() {
        delete this.overnight;
    }
    onDone(callback) {
        if (this.isDone()) {
            callback();
        }
        else {
            this.doneCallbacks.push(callback);
        }
    }
    updateImpl(delta) {
        if (this.delay) {
            if (this.delay.update(delta)) {
                delete this.delay;
            }
            else {
                return;
            }
        }
        // Ensure the blinking "down" arrow is always on a line
        if (this.textDone &&
            this.curOffs === -1 && this.curLine === TextBubble.MAX_LINE_COUNT - 1 &&
            this.conversation.hasNext()) {
            this.lines.shift();
            this.curLine--;
        }
        if (!this.textDone) {
            this.curCharMillis += delta;
            if (this.curCharMillis > TextBubble.CHAR_RENDER_MILLIS) {
                this.curCharMillis -= TextBubble.CHAR_RENDER_MILLIS;
                if (this.curOffs === -1 && this.curLine === TextBubble.MAX_LINE_COUNT) {
                    this.lines.shift();
                    this.curLine--;
                }
                // TODO: This could be more performant...
                if (this.delays && this.delays.length > 0) {
                    const elem = this.delays[0];
                    if (elem.offs === this.curOffs + 1) {
                        this.delays.shift();
                        this.delay = new Delay({ millis: elem.millis });
                        return;
                    }
                }
                this.curOffs++;
                if (this.curOffs === this.lines[this.curLine].length) {
                    if (this.curLine === this.lines.length - 1) {
                        if (this.afterSound) {
                            this.game.audio.playSound(this.afterSound);
                            delete this.afterSound;
                        }
                        if (this.afterAutoAdvanceDelay > 0) {
                            this.inAutoAdvanceDelay = true;
                            this.delay = new Delay({
                                millis: this.afterAutoAdvanceDelay,
                                callback: () => {
                                    console.log('Setting textDone to true');
                                    this.textDone = true;
                                    this.inAutoAdvanceDelay = false;
                                    this.updateConversation();
                                },
                            });
                            this.afterAutoAdvanceDelay = 0;
                        }
                        else {
                            console.log('Setting textDone to true');
                            this.textDone = true;
                        }
                    }
                    else {
                        console.log('Going to next line');
                        this.curLine++;
                        this.curOffs = -1;
                    }
                }
                else if (this.conversation.getVoice() &&
                    this.curOffs % 2 === 0 && this.lines[this.curLine][this.curOffs] !== ' ') {
                    this.game.audio.playSound('talk');
                }
            }
        }
        else if (this.shoppingBubble) {
            this.shoppingBubble.update(delta);
        }
        else if (this.choiceBubble) {
            this.choiceBubble.update(delta);
        }
        if (this.doneCallbacks.length > 0 && this.isDone()) {
            // Only run the callbacks that existed at the time the check was made.
            // Done callbacks may add new done callbacks to run later.
            const count = this.doneCallbacks.length;
            for (let i = 0; i < count; i++) {
                this.doneCallbacks[i]();
            }
            this.doneCallbacks.splice(0, count);
        }
    }
    paintContent(ctx, x, y) {
        ctx.fillStyle = 'rgb(255,255,255)';
        if (this.lines) {
            for (let i = 0; i <= this.curLine; i++) {
                let text = this.lines[i];
                if (!this.textDone && i === this.curLine) {
                    const end = Math.max(0, this.curOffs);
                    text = text.substring(0, end);
                }
                this.game.drawString(text, x, y);
                y += 10 * this.game.scale;
            }
            if (this.textDone && this.conversation.hasNext()) {
                // TODO: Remove magic constants
                const x = this.x + (this.w - this.game.stringWidth('\\')) / 2;
                this.drawDownArrow(x, y);
                /*
                var conv = this._conversation;
                console.log('--- ' +
                      JSON.stringify(this._conversation.peekNext(),
                            // Custom replacer to prevent circular printing of conversation
                            function(key, value) {
                               if (value === conv) {
                                  return;
                               }
                               return value;
                            }
                      )
                );
                */
            }
        }
        if (this.textDone) {
            if (this.shoppingBubble) {
                this.shoppingBubble.paint(ctx);
            }
            else if (this.choiceBubble) {
                this.choiceBubble.paint(ctx);
            }
        }
    }
    /**
     * Renders text in this bubble.
     *
     * @param segment The text to render.
     */
    setText(segment) {
        var _a;
        this.text = (_a = segment.currentText()) !== null && _a !== void 0 ? _a : '';
        if (this.text) {
            const w = this.w - 2 * this.getXMargin();
            const breakApartResult = this.breakApart(this.text, w);
            this.lines = breakApartResult.lines;
            this.delays = breakApartResult.delays;
            this.curLine = 0;
            this.curOffs = -1;
            this.curCharMillis = 0;
            this.textDone = false;
            console.log('>>> textDone set to false');
        }
        if (segment.choices) {
            this.choiceBubble = this.createChoiceBubble(segment.choices);
            this.setActive(false);
        }
        else if (segment.shopping) {
            this.shoppingBubble = new ShoppingBubble(this.game, segment.shopping);
            this.setActive(false);
        }
    }
    setConversation(conversation) {
        delete this.shoppingBubble;
        delete this.choiceBubble;
        this.conversation = conversation;
        const segment = this.conversation.start();
        this.setText(segment);
        this.handleSegmentExtraProperties(segment);
    }
    updateConversation(forcedNextState) {
        var _a, _b;
        if (this.conversationDone) {
            return false;
        }
        const prevSegment = this.conversation.current();
        if (prevSegment) {
            if (prevSegment.overnight && this.textDone) {
                this.overnight = true;
            }
            const segmentsToAdd = (_a = prevSegment.afterAction) === null || _a === void 0 ? void 0 : _a.call(prevSegment);
            if (prevSegment.afterAction && !segmentsToAdd && !this.conversation.hasNext()) {
                this.conversation.next();
                this.conversationDone = true;
                return false;
            }
            segmentsToAdd === null || segmentsToAdd === void 0 ? void 0 : segmentsToAdd.forEach((segment) => {
                this.conversation.addSegment(segment);
                this.textDone = false;
            });
        }
        if (forcedNextState || this.conversation.hasNext()) {
            let segment;
            if (forcedNextState) {
                segment = this.conversation.setDialogueState(forcedNextState);
            }
            else {
                segment = this.conversation.next();
            }
            (_b = segment.action) === null || _b === void 0 ? void 0 : _b.call(segment);
            if (segment.clear) {
                this.setText(segment);
            }
            else {
                this.append(segment);
            }
            this.handleSegmentExtraProperties(segment);
            return true;
        }
        this.conversationDone = true;
        return false;
    }
}
TextBubble.CHAR_RENDER_MILLIS = 0;
TextBubble.MAX_LINE_COUNT = 6;
//# sourceMappingURL=TextBubble.js.map