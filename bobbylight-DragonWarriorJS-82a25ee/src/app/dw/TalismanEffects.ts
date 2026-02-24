// TalismanEffects.ts
// Elden Ring-style talisman effects and inventory
export interface Talisman {
    name: string;
    effect: string;
    applyEffect: (stats: Record<string, number>) => Record<string, number>;
}

export function applyTalismans(talismans: Talisman[], stats: Record<string, number>): Record<string, number> {
    let modified = { ...stats };
    for (const talisman of talismans) {
        modified = talisman.applyEffect(modified);
    }
    return modified;
}

// Example talisman effect
export const erdtreeFavor: Talisman = {
    name: "Erdtree's Favor +2",
    effect: 'raises HP, stamina, and equip load',
    applyEffect: (stats) => {
        return {
            ...stats,
            HP: Math.floor((stats.HP || 0) * 1.07),
            stamina: Math.floor((stats.stamina || 0) * 1.07),
            equipLoad: Math.floor((stats.equipLoad || 0) * 1.07)
        };
    }
};
