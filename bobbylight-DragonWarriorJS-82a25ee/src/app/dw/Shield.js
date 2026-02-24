export class Shield {
    constructor(name, args) {
        var _a, _b, _c;
        this.name = name;
        this.displayName = (_a = args.displayName) !== null && _a !== void 0 ? _a : this.name;
        this.baseCost = (_b = args.baseCost) !== null && _b !== void 0 ? _b : 0;
        this.defense = (_c = args.defense) !== null && _c !== void 0 ? _c : 1;
    }
    toString() {
        return `[Shield: name=${this.name}, baseCost=${this.baseCost}, defense=${this.defense}]`;
    }
}
//# sourceMappingURL=Shield.js.map