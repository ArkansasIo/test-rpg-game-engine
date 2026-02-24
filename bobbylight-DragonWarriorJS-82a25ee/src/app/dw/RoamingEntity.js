import { Direction } from './Direction';
import { Hero } from './Hero';
export class RoamingEntity {
    constructor(game, args) {
        var _a, _b, _c;
        this.game = game;
        this.name = args.name;
        this.direction = (_a = args.direction) !== null && _a !== void 0 ? _a : Direction.SOUTH;
        this.mapCol = (_b = args.mapCol) !== null && _b !== void 0 ? _b : 0;
        this.mapRow = (_c = args.mapRow) !== null && _c !== void 0 ? _c : 0;
        this.range = args.range;
        this.xOffs = 0;
        this.yOffs = 0;
        this.stepTick = 0;
        // TODO: Make this time-dependent!
        this.moveInc = this.game.scale * (this.game.targetFps === 30 ? 2 : 1);
    }
    getMoveIncrement() {
        return this.moveInc;
    }
    handleIsMovingInUpdate() {
        if (this.isMoving()) {
            if (this.xOffs < 0) {
                this.xOffs += this.getMoveIncrement();
            }
            else if (this.xOffs > 0) {
                this.xOffs -= this.getMoveIncrement();
            }
            else if (this.yOffs < 0) {
                this.yOffs += this.getMoveIncrement();
            }
            else if (this.yOffs > 0) {
                this.yOffs -= this.getMoveIncrement();
            }
            if (!this.isMoving()) {
                this.handlePostMove();
            }
        }
    }
    handlePostMove() {
        // Do nothing; subclasses can override
    }
    /**
     * Returns whether this entity is at the specified row and column in the
     * map.
     *
     * @param row The row.
     * @param col The column.
     * @return Whether this entity is at that row and column.
     */
    isAt(row, col) {
        return this.mapRow === row && this.mapCol === col;
    }
    isMoving() {
        return this.xOffs !== 0 || this.yOffs !== 0;
    }
    /**
     * If this entity is only allowed to walk around in a certain range, this
     * method returns true iff the specified location is outside that range.
     */
    isOutOfRange(row, col) {
        if (this.range) {
            return col < this.range.minCol || col > this.range.maxCol ||
                row < this.range.minRow || row > this.range.maxRow;
        }
        return false;
    }
    setMapLocation(row, col) {
        if (this.mapRow != null && this.mapCol != null) {
            const layer = this.game.getCollisionLayer();
            layer.setData(this.mapRow, this.mapCol, 0);
            if (row > -1 && col > -1) { // row===-1 && col===-1 => don't display
                layer.setData(row, col, 1);
            }
        }
        this.mapRow = row;
        this.mapCol = col;
        this.xOffs = this.yOffs = 0;
    }
    /**
     * Call this with care.
     */
    setMoveIncrement(moveInc) {
        moveInc = Math.max(0, moveInc);
        this.moveInc = moveInc;
    }
    /**
     * Tries to move the player onto the specified tile.
     *
     * @param row The row to attempt to move to.
     * @param col The column to attempt to move to.
     * @return Whether the move was successful.
     */
    tryToMove(row, col) {
        if (this.isOutOfRange(row, col)) {
            return false;
        }
        const data = this.game.getCollisionLayer().getData(row, col);
        const canWalk = data === 0; // -1;
        if (canWalk) {
            this.setMapLocation(row, col);
        }
        else if (data === 361 && this.constructor === Hero) { // i.e., not an NPC
            // TODO: Is there a better way to determine that I'm the hero?
            this.game.bump();
        }
        /*
        else {
           console.log("Can't walk (" + row + ", " + col + "): " + data);
        }
        */
        return canWalk;
    }
    tryToMoveLeft() {
        let success = false;
        let col = this.mapCol - 1;
        if (col < 0) {
            col += this.game.getMap().width;
        }
        if (this.tryToMove(this.mapRow, col)) {
            this.xOffs = this.game.getTileSize();
            success = true;
        }
        this.direction = Direction.WEST;
        return success;
    }
    tryToMoveRight() {
        let success = false;
        const col = Math.floor((this.mapCol + 1) % this.game.getMap().width);
        if (this.tryToMove(this.mapRow, col)) {
            this.xOffs = -this.game.getTileSize();
            success = true;
        }
        this.direction = Direction.EAST;
        return success;
    }
    tryToMoveUp() {
        let success = false;
        let row = this.mapRow - 1;
        if (row < 0) {
            row += this.game.getMap().height;
        }
        if (this.tryToMove(row, this.mapCol)) {
            this.yOffs += this.game.getTileSize();
            success = true;
        }
        this.direction = Direction.NORTH;
        return success;
    }
    tryToMoveDown() {
        let success = false;
        const row = Math.floor((this.mapRow + 1) % this.game.getMap().height);
        if (this.tryToMove(row, this.mapCol)) {
            this.yOffs -= this.game.getTileSize();
            success = true;
        }
        this.direction = Direction.SOUTH;
        return success;
    }
}
//# sourceMappingURL=RoamingEntity.js.map