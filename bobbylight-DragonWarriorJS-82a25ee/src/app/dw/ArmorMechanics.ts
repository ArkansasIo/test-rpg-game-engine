// ArmorMechanics.ts
// Elden Ring-style armor weight and poise mechanics
export interface ArmorPiece {
    weight: number;
    poise: number;
}

export function calculateTotalWeight(armor: ArmorPiece[]): number {
    return armor.reduce((sum, piece) => sum + piece.weight, 0);
}

export function calculateTotalPoise(armor: ArmorPiece[]): number {
    return armor.reduce((sum, piece) => sum + piece.poise, 0);
}

export function getEquipLoadStatus(totalWeight: number, maxLoad: number): string {
    const ratio = totalWeight / maxLoad;
    if (ratio < 0.3) return 'Light Roll';
    if (ratio < 0.7) return 'Medium Roll';
    if (ratio < 1.0) return 'Heavy Roll';
    return 'Overloaded';
}
