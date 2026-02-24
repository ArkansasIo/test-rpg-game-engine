export class Door {
    constructor(name, row, col, replacementTileIndex) {
        this.name = name;
        this.replacementTileIndex = replacementTileIndex;
        this.row = row;
        this.col = col;
    }
    isAt(row, col) {
        return this.row === row && this.col === col;
    }
    toString() {
        return `[Door: name=${this.name}, row=${this.row}, col=${this.col}]`;
    }
}
//# sourceMappingURL=Door.js.map