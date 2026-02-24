import { Delay, Utils } from 'gtp';
import { RoamingEntity } from './RoamingEntity';
import { Direction } from './Direction';
import { Hero } from './Hero';
import { getNpcSpriteRow } from './NpcType';
export class Npc extends RoamingEntity {
    constructor(game, args) {
        var _a;
        super(game, args);
        this.type = (_a = args.type) !== null && _a !== void 0 ? _a : 'MERCHANT_GREEN';
        this.wanders = args.wanders;
        this.origMapRow = this.mapRow;
        this.origMapCol = this.mapCol;
        this.origDir = this.direction;
        if (this.wanders) {
            this.stepDelay = new Delay({ millis: 3000, minDelta: -500, maxDelta: 500 });
        }
        this.dirFuncs = [this.tryToMoveUp.bind(this), this.tryToMoveDown.bind(this),
            this.tryToMoveRight.bind(this), this.tryToMoveLeft.bind(this)];
        //gtp.Utils.mixin(RoamingEntityMixin.prototype, this);
        //RoamingEntityMixin.call(this);
    }
    // TODO: Change NPC image to remove the need for this
    computeColumn() {
        switch (this.direction) {
            case Direction.NORTH:
                return 4;
            case Direction.EAST:
                return 2;
            default:
            case Direction.SOUTH:
                return 0;
            case Direction.WEST:
                return 6;
        }
    }
    update(delta) {
        var _a;
        if ((_a = this.stepDelay) === null || _a === void 0 ? void 0 : _a.update(delta)) {
            this.step();
            this.stepDelay.reset();
        }
        else {
            this.handleIsMovingInUpdate();
        }
    }
    render(ctx) {
        const ss = this.game.assets.get('npcs');
        const ssRow = getNpcSpriteRow(this.type);
        let ssCol = this.computeColumn();
        let x = this.mapCol * this.game.getTileSize();
        x -= this.game.getMapXOffs();
        x += this.xOffs;
        let y = this.mapRow * this.game.getTileSize();
        y -= this.game.getMapYOffs();
        y += this.yOffs;
        ssCol += Hero.stepInc;
        ss.drawSprite(ctx, x, y, ssRow, ssCol);
    }
    reset() {
        var _a;
        this.setMapLocation(this.origMapRow, this.origMapCol);
        this.direction = this.origDir;
        (_a = this.stepDelay) === null || _a === void 0 ? void 0 : _a.reset();
    }
    step() {
        let triedToMove = false;
        while (!triedToMove) {
            const newDir = Utils.randomInt(0, 4);
            this.dirFuncs[newDir].call(this);
            // TODO: Provide means, in map or elsewhere, to restrict an NPC to
            // a specific region on the map.
            triedToMove = true;
        }
    }
}
//# sourceMappingURL=Npc.js.map