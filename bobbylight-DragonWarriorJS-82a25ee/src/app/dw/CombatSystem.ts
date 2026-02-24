// CombatSystem.ts
// MMORPG combat mechanics implementation
// CombatSystem.ts
// MMORPG combat mechanics implementation
import { Character, calculateAttackBonus } from './Character';

export interface CombatAction {
    type: 'Attack' | 'CastSpell' | 'UseSkill' | 'Defend' | 'Move' | 'BonusAction' | 'Reaction';
    actor: Character;
    target?: Character;
    skill?: string;
    spell?: string;
    damage?: number;
    result?: string;
}

export function rollD20(): number {
    return Math.floor(Math.random() * 20) + 1;
}

export function resolveAttack(attacker: Character, defender: Character, isProficient: boolean): CombatAction {
    const attackMod = attacker.modifiers[attacker.class.primaryAbilities[0]];
    const proficiency = attacker.proficiencyBonus;
    const attackBonus = calculateAttackBonus(attackMod, proficiency, isProficient);
    const roll = rollD20();
    const total = roll + attackBonus;
    const crit = roll === 20;
    const miss = roll === 1;
    const ac = defender.armorClass;
    let result: string;
    let damage = 0;
    if (miss) {
        result = 'Miss';
    } else if (total >= ac) {
        damage = crit ? attacker.class.hitDice.length * 2 : attacker.class.hitDice.length;
        result = crit ? 'Critical Hit' : 'Hit';
    } else {
        result = 'Miss';
    }
    return {
        type: 'Attack',
        actor: attacker,
        target: defender,
        damage,
        result
    };
}

export function resolveSpell(attacker: Character, defender: Character, spellName: string, spellDC: number): CombatAction {
    const roll = rollD20();
    const saveMod = defender.modifiers[attacker.class.spellcastingAbility ?? 'INT'];
    const saveTotal = roll + saveMod;
    let result: string;
    let damage = 0;
    if (saveTotal < spellDC) {
        damage = 10; // Example spell damage
        result = 'Spell Hit';
    } else {
        result = 'Resisted';
    }
    return {
        type: 'CastSpell',
        actor: attacker,
        target: defender,
        spell: spellName,
        damage,
        result
    };
}

export function applyStatusEffect(target: Character, effect: string) {
    if (!target.statusEffects.includes(effect)) {
        target.statusEffects.push(effect);
    }
}

export function removeStatusEffect(target: Character, effect: string) {
    target.statusEffects = target.statusEffects.filter(e => e !== effect);
}
