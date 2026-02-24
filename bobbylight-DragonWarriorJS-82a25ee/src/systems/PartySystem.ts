import type { CharacterStats, PartyMember } from '../types/RpgTypes';

export class PartySystem {

    private readonly membersById: Map<string, PartyMember>;

    public constructor(members: PartyMember[]) {
        this.membersById = new Map(members.map((member) => [ member.id, member ]));
    }

    public getAllMembers(): PartyMember[] {
        return Array.from(this.membersById.values());
    }

    public getMember(id: string): PartyMember | null {
        return this.membersById.get(id) ?? null;
    }

    public applyDamage(id: string, amount: number): number {

        const member = this.membersById.get(id);
        if (!member) {
            return 0;
        }

        const hpBefore = member.stats.hp;
        member.stats.hp = Math.max(0, hpBefore - Math.max(0, Math.floor(amount)));
        return hpBefore - member.stats.hp;
    }

    public heal(id: string, amount: number): number {

        const member = this.membersById.get(id);
        if (!member) {
            return 0;
        }

        const hpBefore = member.stats.hp;
        member.stats.hp = Math.min(member.stats.maxHp, hpBefore + Math.max(0, Math.floor(amount)));
        return member.stats.hp - hpBefore;
    }

    public spendMp(id: string, amount: number): boolean {

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

    public isAlive(id: string): boolean {
        const member = this.membersById.get(id);
        return !!member && member.stats.hp > 0;
    }

    public static calculateAttackPower(stats: CharacterStats): number {
        return stats.str + Math.floor(stats.agi / 4);
    }
}
