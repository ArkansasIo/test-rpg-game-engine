import { WarriorClass, SwordOfValor, FireballAbility } from './SampleDefinitions';
import { evaluateStats } from './StatEvaluation';
import { calculateDamage } from './CombatPipeline';

// Example character creation UI logic (engine-agnostic, TypeScript)
export function createCharacter(name: string, classId: string, subclassId: string, level: number) {
  // For demo, use WarriorClass
  const classDef = WarriorClass;
  const subclassDef = classDef.subclasses.find(s => s.id === subclassId) || classDef.subclasses[0];

  // Evaluate stats
  const stats = evaluateStats(
    classDef.baseStats,
    classDef.growth,
    level,
    subclassDef.passiveBonuses
  );

  // Example: assign Sword of Valor
  const equipment = { weapon: { def: SwordOfValor, rolledAffixes: [], durability: 100 } };

  // Example: assign Fireball ability
  const skills = { skills: [{ def: FireballAbility, cooldownRemaining: 0, rank: 1 }] };

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
export function displayStats(stats: Record<string, number>) {
  return Object.entries(stats)
    .map(([stat, value]) => `${stat}: ${value}`)
    .join('\n');
}

// Example combat preview
import { Character } from './RPGCoreTypes';

export function previewCombat(attacker: Character, defender: Character) {
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
