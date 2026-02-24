/**
 * A base class for map logics.
 */
export class AbstractMapLogic {
    constructor(conversationMap) {
        this.conversationMap = conversationMap;
    }
    init() {
    }
    npcText(npc, game) {
        var _a;
        console.log('Talking to: ' + JSON.stringify(npc.name));
        const data = this.conversationMap[npc.name];
        return (_a = data === null || data === void 0 ? void 0 : data.call(this, game)) !== null && _a !== void 0 ? _a : 'I have nothing to say...';
    }
}
//# sourceMappingURL=AbstractMapLogic.js.map