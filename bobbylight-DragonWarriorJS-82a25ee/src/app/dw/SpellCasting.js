export function castSpell(spell, stats) {
    if ((stats.FP || 0) < spell.fpCost) {
        throw new Error('Not enough FP to cast spell!');
    }
    return Object.assign(Object.assign({}, spell.effect(stats)), { FP: (stats.FP || 0) - spell.fpCost });
}
// Example spell effect
export const cometAzur = {
    name: 'Comet Azur',
    fpCost: 40,
    effect: (stats) => (Object.assign(Object.assign({}, stats), { attack: (stats.attack || 0) + 100 }))
};
//# sourceMappingURL=SpellCasting.js.map