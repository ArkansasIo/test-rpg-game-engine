export function calculateDamage(ctx) {
    // Raw damage
    const raw = (ctx.attacker.STR * ctx.skillCoef + ctx.flatBonus) * randomVariance();
    // Mitigation
    const dr = ctx.armor / (ctx.armor + ctx.kArmor);
    const afterMit = raw * (1 - dr);
    // Multipliers
    let final = afterMit * ctx.damageDoneMult * ctx.damageTakenMult;
    // Crit
    if (Math.random() < ctx.critChance)
        final *= ctx.critMult;
    return Math.max(0, Math.round(final));
}
function randomVariance() {
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
//# sourceMappingURL=CombatPipeline.js.map