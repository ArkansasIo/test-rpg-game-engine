import { fireballAbility, swordOfValor, warriorClass } from './SampleDefinitions';
import { evaluateStats } from './StatEvaluation';
import { calculateDamage } from './CombatPipeline';
// Example character creation UI logic (engine-agnostic, TypeScript)
export function createCharacter(name, classId, subclassId, level) {
    var _a;
    // For demo, use WarriorClass
    const classDef = warriorClass;
    const subclassDef = (_a = classDef.subclasses.find((s) => s.id === subclassId)) !== null && _a !== void 0 ? _a : classDef.subclasses[0];
    // Evaluate stats
    const stats = evaluateStats(classDef.baseStats, classDef.growth, level, subclassDef.passiveBonuses);
    // Example: assign Sword of Valor
    const equipment = { weapon: { def: swordOfValor, rolledAffixes: [], durability: 100 } };
    // Example: assign Fireball ability
    const skills = { skills: [{ def: fireballAbility, cooldownRemaining: 0, rank: 1 }] };
    // Build character object
    return {
        id: 'char_' + name,
        name,
        level,
        xp: 0,
        stats,
        equipment,
        skills,
        inventory: { items: [] },
        classId: classDef.id,
        subclassId: subclassDef.id,
    };
}
// Example stat display logic
export function displayStats(stats) {
    return Object.entries(stats)
        .map(([stat, value]) => `${stat}: ${value}`)
        .join('\n');
}
export function previewCombat(attacker, defender) {
    const ctx = {
        attacker: attacker.stats,
        defender: defender.stats,
        skillCoef: 1.2,
        flatBonus: 5,
        critChance: 0.15,
        critMult: 2,
        armor: defender.stats.CON * 2,
        kArmor: 50,
        damageDoneMult: 1,
        damageTakenMult: 1,
    };
    return calculateDamage(ctx);
}
//# sourceMappingURL=CharacterCreationUI.js.map