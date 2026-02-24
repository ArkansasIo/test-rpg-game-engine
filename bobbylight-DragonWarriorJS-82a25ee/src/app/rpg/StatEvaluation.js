/**
 * Evaluates a character's stats, applying base, growth, and modifiers.
 */
export function evaluateStats(baseStats, growth, level, modifiers = []) {
    // Start with base + growth
    const stats = Object.assign({}, baseStats);
    for (const stat in growth) {
        stats[stat] = (stats[stat] || 0) + growth[stat] * (level - 1);
    }
    // Apply additive flat modifiers
    for (const mod of modifiers.filter((m) => m.type === 'flat')) {
        stats[mod.stat] = (stats[mod.stat] || 0) + mod.value;
    }
    // Apply additive percent modifiers
    for (const mod of modifiers.filter((m) => m.type === 'percent')) {
        stats[mod.stat] = (stats[mod.stat] || 0) * (1 + mod.value);
    }
    // Apply multiplicative modifiers
    for (const mod of modifiers.filter((m) => m.type === 'mult')) {
        stats[mod.stat] = (stats[mod.stat] || 0) * mod.value;
    }
    return stats;
}
/**
 * Example usage:
 * const finalStats = evaluateStats(baseStats, growth, level, [
 *   { stat: 'STR', value: 10, type: 'flat' },
 *   { stat: 'STR', value: 0.15, type: 'percent' },
 *   { stat: 'STR', value: 1.2, type: 'mult' }
 * ]);
 */
//# sourceMappingURL=StatEvaluation.js.map