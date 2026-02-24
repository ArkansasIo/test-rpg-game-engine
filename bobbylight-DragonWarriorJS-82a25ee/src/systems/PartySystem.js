export class PartySystem {
    constructor(members) {
        this.membersById = new Map(members.map((member) => [member.id, member]));
    }
    getAllMembers() {
        return Array.from(this.membersById.values());
    }
    getMember(id) {
        var _a;
        return (_a = this.membersById.get(id)) !== null && _a !== void 0 ? _a : null;
    }
    applyDamage(id, amount) {
        const member = this.membersById.get(id);
        if (!member) {
            return 0;
        }
        const hpBefore = member.stats.hp;
        member.stats.hp = Math.max(0, hpBefore - Math.max(0, Math.floor(amount)));
        return hpBefore - member.stats.hp;
    }
    heal(id, amount) {
        const member = this.membersById.get(id);
        if (!member) {
            return 0;
        }
        const hpBefore = member.stats.hp;
        member.stats.hp = Math.min(member.stats.maxHp, hpBefore + Math.max(0, Math.floor(amount)));
        return member.stats.hp - hpBefore;
    }
    spendMp(id, amount) {
        const member = this.membersById.get(id);
        if (!member) {
            return false;
        }
        if (member.stats.mp < amount) {
            return false;
        }
        member.stats.mp -= amount;
        return true;
    }
    isAlive(id) {
        const member = this.membersById.get(id);
        return !!member && member.stats.hp > 0;
    }
    static calculateAttackPower(stats) {
        return stats.str + Math.floor(stats.agi / 4);
    }
}
//# sourceMappingURL=PartySystem.js.map