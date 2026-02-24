export class EncounterSystem {
    constructor(tables) {
        this.tablesByTile = new Map(tables.map((table) => [table.tileKind, table]));
    }
    roll(tileKind, rng = Math.random) {
        var _a, _b;
        const table = this.tablesByTile.get(tileKind);
        if (!table) {
            return null;
        }
        if (rng() >= table.chance) {
            return null;
        }
        const totalWeight = table.entries.reduce((sum, entry) => sum + entry.weight, 0);
        if (totalWeight <= 0) {
            return null;
        }
        let roll = rng() * totalWeight;
        for (const entry of table.entries) {
            roll -= entry.weight;
            if (roll <= 0) {
                return entry.pack;
            }
        }
        return (_b = (_a = table.entries[table.entries.length - 1]) === null || _a === void 0 ? void 0 : _a.pack) !== null && _b !== void 0 ? _b : null;
    }
}
//# sourceMappingURL=EncounterSystem.js.map