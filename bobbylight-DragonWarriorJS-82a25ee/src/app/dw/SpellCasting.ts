// SpellCasting.ts
// Elden Ring-style spell casting and FP system
export interface Spell {
    name: string;
    fpCost: number;
    effect: (stats: Record<string, number>) => Record<string, number>;
}

export function castSpell(spell: Spell, stats: Record<string, number>): Record<string, number> {
    if ((stats.FP || 0) < spell.fpCost) {
        throw new Error('Not enough FP to cast spell!');
    }
    return {
        ...spell.effect(stats),
        FP: (stats.FP || 0) - spell.fpCost
    };
}

// Example spell effect
export const cometAzur: Spell = {
    name: 'Comet Azur',
    fpCost: 40,
    effect: (stats) => ({ ...stats, attack: (stats.attack || 0) + 100 })
};
