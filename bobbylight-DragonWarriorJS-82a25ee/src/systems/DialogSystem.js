export class DialogSystem {
    constructor(scripts) {
        this.scripts = new Map();
        for (const script of scripts) {
            this.scripts.set(script.id, script);
        }
    }
    getLines(scriptId) {
        var _a, _b;
        return (_b = (_a = this.scripts.get(scriptId)) === null || _a === void 0 ? void 0 : _a.lines) !== null && _b !== void 0 ? _b : [];
    }
    hasScript(scriptId) {
        return this.scripts.has(scriptId);
    }
}
//# sourceMappingURL=DialogSystem.js.map