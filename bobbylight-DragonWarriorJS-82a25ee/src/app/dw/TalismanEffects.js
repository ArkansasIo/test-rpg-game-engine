export function applyTalismans(talismans, stats) {
    let modified = Object.assign({}, stats);
    for (const talisman of talismans) {
        modified = talisman.applyEffect(modified);
    }
    return modified;
}
// Example talisman effect
export const erdtreeFavor = {
    name: "Erdtree's Favor +2",
    effect: 'raises HP, stamina, and equip load',
    applyEffect: (stats) => {
        return Object.assign(Object.assign({}, stats), { HP: Math.floor((stats.HP || 0) * 1.07), stamina: Math.floor((stats.stamina || 0) * 1.07), equipLoad: Math.floor((stats.equipLoad || 0) * 1.07) });
    }
};
//# sourceMappingURL=TalismanEffects.js.map