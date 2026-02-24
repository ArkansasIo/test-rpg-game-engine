import { ConversationSegment } from './ConversationSegment';
import { merchantConversationTemplate } from './MerchantConversationTemplate';
import { innkeeperConversationTemplate } from './InnkeeperConversationTemplate';
/**
 * Conversations track everything an NPC says to the hero, along with events to trigger along the way -
 * sounds to play, actions to perform, etc. Conversations are usually loaded from the <code>mapLogic</code> folder.
 * A common pattern is:
 *
 * <code>
 * const conversation = new Conversation(game, true);
 * conversation.setSegments(mapLogic.npcText(npc, game));
 * // or, conversation.addSegment(singleSegment);
 * </code>
 */
export class Conversation {
    constructor(game, voice = false) {
        this.game = game;
        this.segmentIndex = 0;
        this.voice = voice;
        this.segments = [];
    }
    /**
     * Adds a segment to this conversation.
     *
     * @param segmentArgs Arguments for a segment to add to this
     *        conversation.  This can also be a simple string for a single
     *        text segment.
     * @param atCurIndex Whether to insert at the current index,
     *        as opposed to the end of the conversation.
     */
    addSegment(segmentArgs, atCurIndex = false) {
        if (typeof segmentArgs === 'string') {
            segmentArgs = { text: segmentArgs };
        }
        const segment = new ConversationSegment(this, this.game, segmentArgs);
        if (atCurIndex) {
            this.segments.splice(this.segmentIndex, 0, segment);
        }
        else {
            this.segments.push(segment);
        }
    }
    /**
     * Returns whether to play the "talking" sound effect for this conversation.
     *
     * @return Whether to play the sound effect.
     */
    getVoice() {
        return this.voice;
    }
    /**
     * Adds one or more segments to this conversation.
     *
     * @param segmentArgs The new conversation information.
     */
    setSegments(segmentArgs) {
        // One of our special templated conversation types. type narrowed via discriminated union. The default case
        // is only to catch if we add a new conversation template but forget to update this section.
        if (typeof segmentArgs !== 'string' && 'conversationType' in segmentArgs) {
            const conversationType = segmentArgs.conversationType;
            switch (conversationType) {
                case 'merchant':
                    this.setSegments(merchantConversationTemplate(this.game, this, segmentArgs));
                    break;
                case 'innkeeper':
                    this.setSegments(innkeeperConversationTemplate(this.game, segmentArgs));
                    break;
                default:
                    throw new Error(`Unknown conversation type: ${conversationType}`);
            }
        }
        else if (Array.isArray(segmentArgs)) {
            segmentArgs.forEach((args) => {
                this.addSegment(args);
            });
        }
        else { // A (string | ConversationSegmentArgs) that isn't merchant/innkeeper
            this.addSegment(segmentArgs);
        }
    }
    start() {
        this.segmentIndex = 0;
        const segment = this.segments[0];
        if (segment === null || segment === void 0 ? void 0 : segment.action) {
            segment.action();
        }
        return segment;
    }
    findIndexById(id) {
        const index = this.segments.findIndex((segment) => id === segment.id);
        return index !== -1 ? index : this.segments.length;
    }
    getNextIndex() {
        const current = this.current();
        if (!current) { // Already done
            return this.segments.length;
        }
        if (current.next) {
            if (current.next === Conversation.DONE) {
                return this.segments.length;
            }
            return this.findIndexById(current.next);
        }
        return this.segmentIndex + 1;
    }
    hasNext() {
        return this.getNextIndex() < this.segments.length;
    }
    current() {
        const segment = this.segmentIndex >= this.segments.length ? null :
            this.segments[this.segmentIndex];
        return segment;
    }
    next() {
        const nextIndex = this.getNextIndex();
        if (nextIndex < this.segments.length) {
            this.segmentIndex = nextIndex;
            const segment = this.segments[this.segmentIndex];
            return segment;
        }
        return null;
    }
    peekNext() {
        const nextIndex = this.getNextIndex();
        if (nextIndex < this.segments.length) {
            return this.segments[nextIndex];
        }
        return null;
    }
    setDialogueState(state) {
        if (!state) {
            // Assume we want the conversation to end
            this.segmentIndex = this.segments.length;
        }
        const index = this.findIndexById(state);
        if (index < this.segments.length) {
            this.segmentIndex = index;
            console.log(`Set dialogue state to "${state}" (${index})`);
            return this.segments[this.segmentIndex];
        }
        console.error('Unknown next dialogue state: "' + state + '"');
        this.segmentIndex = this.segments.length;
        return null;
    }
    /**
     * If a purchase is being discussed, this method will be called with the
     * item being haggled over.  This allows us to refer to the item by name
     * and state its price.
     */
    setItem(item) {
        this.item = item;
    }
}
Conversation.DONE = '_done';
Conversation.CHOICES_SEGMENT = 'choicesSegment';
Conversation.NOT_ENOUGH_SEGMENT = 'notEnoughGold';
Conversation.CONFIRM_SEGMENT = 'confirmPurchase';
Conversation.PURCHASE_SEGMENT = 'makePurchase';
Conversation.SOMETHING_ELSE_SEGMENT = 'somethingElse';
Conversation.DECLINED_PURCHASE_SEGMENT = 'declinedPurchase';
Conversation.BID_FAREWELL_SEGMENT = 'bidFarewell';
//# sourceMappingURL=Conversation.js.map