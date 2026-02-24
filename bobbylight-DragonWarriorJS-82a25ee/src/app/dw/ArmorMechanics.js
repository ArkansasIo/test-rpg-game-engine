export function calculateTotalWeight(armor) {
    return armor.reduce((sum, piece) => sum + piece.weight, 0);
}
export function calculateTotalPoise(armor) {
    return armor.reduce((sum, piece) => sum + piece.poise, 0);
}
export function getEquipLoadStatus(totalWeight, maxLoad) {
    const ratio = totalWeight / maxLoad;
    if (ratio < 0.3)
        return 'Light Roll';
    if (ratio < 0.7)
        return 'Medium Roll';
    if (ratio < 1.0)
        return 'Heavy Roll';
    return 'Overloaded';
}
//# sourceMappingURL=ArmorMechanics.js.map