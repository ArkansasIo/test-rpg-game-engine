import { Utils } from 'gtp';
export class BattleEntity {
    constructor(args) {
        if (typeof args.hp === 'number') {
            this.hp = args.hp;
        }
        else {
            this.hp = Utils.randomInt(args.hp[0], args.hp[1] + 1);
        }
        this.maxHp = this.hp;
        this.mp = this.maxMp = 0; // args.mp;
    }
    isDead() {
        return this.hp <= 0;
    }
    takeDamage(amount) {
        this.hp = Math.max(0, this.hp - amount);
        return this.isDead();
    }
}
//# sourceMappingURL=BattleEntity.js.map