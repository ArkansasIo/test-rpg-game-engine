import { Utils } from 'gtp';
/**
 * A part of a conversation between the hero and an NPC, or between two NPCs. At its core, it represents some
 * text that the user must press an action key to advance past, but it also includes a lot of configurability -
 * tie sound effects to the text, add logic to run before or after the text renders, etc.
 */
export class ConversationSegment {
    constructor(parentConversation, game, args) {
        this.parentConversation = parentConversation;
        this.game = game;
        Utils.mixin(args, this);
    }
    getParameterizedText() {
        var _a, _b, _c, _d;
        let text = this.text;
        if (!text) {
            return text;
        }
        // TODO: This could be much, much better
        let lbrace = text.indexOf('\\w{');
        while (lbrace > -1) {
            const rbrace = text.indexOf('}', lbrace + 3);
            if (rbrace > -1) {
                const expression = text.substring(lbrace + 3, rbrace);
                let expRemaining;
                let itemName;
                let itemCost;
                switch (expression) {
                    case 'hero.name':
                        text = text.substring(0, lbrace) + this.game.hero.name + text.substring(rbrace + 1);
                        lbrace = text.indexOf('\\w{', lbrace + this.game.hero.name.length);
                        break;
                    case 'hero.expRemaining':
                        expRemaining = this.game.hero.exp.toString(); // TODO: Correct value
                        text = text.substring(0, lbrace) + expRemaining + text.substring(rbrace + 1);
                        lbrace = text.indexOf('\\w{', lbrace + expRemaining.length);
                        break;
                    case 'item.name':
                        itemName = (_b = (_a = this.parentConversation.item) === null || _a === void 0 ? void 0 : _a.displayName) !== null && _b !== void 0 ? _b : '(error)';
                        text = text.substring(0, lbrace) + itemName + text.substring(rbrace + 1);
                        lbrace = text.indexOf('\\w{', lbrace + itemName.length);
                        break;
                    case 'item.baseCost':
                        itemCost = (_d = (_c = this.parentConversation.item) === null || _c === void 0 ? void 0 : _c.baseCost.toString()) !== null && _d !== void 0 ? _d : '(error)';
                        text = `${text.substring(0, lbrace)}${itemCost}${text.substring(rbrace + 1)}`;
                        lbrace = text.indexOf('\\w{', lbrace + itemCost.length);
                        break;
                    default:
                        console.error('Unknown token in NPC text: ' + expression);
                        lbrace = -1;
                        break;
                }
            }
        }
        return text;
    }
    currentText() {
        return this.getParameterizedText();
    }
}
//# sourceMappingURL=ConversationSegment.js.map