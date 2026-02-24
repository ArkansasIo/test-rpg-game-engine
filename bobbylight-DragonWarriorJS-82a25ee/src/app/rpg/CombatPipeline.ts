import { Stats } from './RPGCoreTypes';

export interface CombatContext {
  attacker: Stats;
  defender: Stats;
  skillCoef: number;
  flatBonus: number;
  critChance: number;
  critMult: number;
  armor: number;
  kArmor: number;
  damageDoneMult: number;
  damageTakenMult: number;
}

export function calculateDamage(ctx: CombatContext): number {
  // Raw damage
  let raw = (ctx.attacker.STR * ctx.skillCoef + ctx.flatBonus) * randomVariance();
  // Mitigation
  const dr = ctx.armor / (ctx.armor + ctx.kArmor);
  let afterMit = raw * (1 - dr);
  // Multipliers
  let final = afterMit * ctx.damageDoneMult * ctx.damageTakenMult;
  // Crit
  if (Math.random() < ctx.critChance) final *= ctx.critMult;
  return Math.max(0, Math.round(final));
}

function randomVariance(): number {
  return 0.95 + Math.random() * 0.1; // 0.95–1.05
}

/**
 * Example usage:
 * const dmg = calculateDamage({
 *   attacker: { STR: 20, ... },
 *   defender: { ... },
 *   skillCoef: 1.2,
 *   flatBonus: 5,
 *   critChance: 0.15,
 *   critMult: 2,
 *   armor: 30,
 *   kArmor: 50,
 *   damageDoneMult: 1,
 *   damageTakenMult: 1
 * });
 */
