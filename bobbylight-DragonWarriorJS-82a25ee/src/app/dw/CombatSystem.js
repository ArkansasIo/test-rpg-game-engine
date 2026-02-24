// CombatSystem.ts
// MMORPG combat mechanics implementation
// CombatSystem.ts
// MMORPG combat mechanics implementation
import { calculateAttackBonus } from './Character';
export function rollD20() {
    return Math.floor(Math.random() * 20) + 1;
}
export function resolveAttack(attacker, defender, isProficient) {
    const attackMod = attacker.modifiers[attacker.class.primaryAbilities[0]];
    const proficiency = attacker.proficiencyBonus;
    const attackBonus = calculateAttackBonus(attackMod, proficiency, isProficient);
    const roll = rollD20();
    const total = roll + attackBonus;
    const crit = roll === 20;
    const miss = roll === 1;
    const ac = defender.armorClass;
    let result;
    let damage = 0;
    if (miss) {
        result = 'Miss';
    }
    else if (total >= ac) {
        damage = crit ? attacker.class.hitDice.length * 2 : attacker.class.hitDice.length;
        result = crit ? 'Critical Hit' : 'Hit';
    }
    else {
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
export function resolveSpell(attacker, defender, spellName, spellDC) {
    var _a;
    const roll = rollD20();
    const saveMod = defender.modifiers[(_a = attacker.class.spellcastingAbility) !== null && _a !== void 0 ? _a : 'INT'];
    const saveTotal = roll + saveMod;
    let result;
    let damage = 0;
    if (saveTotal < spellDC) {
        damage = 10; // Example spell damage
        result = 'Spell Hit';
    }
    else {
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
export function applyStatusEffect(target, effect) {
    if (!target.statusEffects.includes(effect)) {
        target.statusEffects.push(effect);
    }
}
export function removeStatusEffect(target, effect) {
    target.statusEffects = target.statusEffects.filter(e => e !== effect);
}
//# sourceMappingURL=CombatSystem.js.map