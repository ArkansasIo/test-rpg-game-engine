// WeaponScaling.ts
// Elden Ring-style weapon scaling and upgrade system
export interface WeaponScaling {
    baseAttack: number;
    scaling: Record<string, string>; // e.g. { STR: 'C', DEX: 'B', INT: 'E' }
    upgradeLevel: number;
}

export function calculateAttack(weapon: WeaponScaling, stats: Record<string, number>): number {
    let attack = weapon.baseAttack;
    for (const stat in weapon.scaling) {
        const scale = weapon.scaling[stat];
        const statValue = stats[stat] || 0;
        let multiplier = 0;
        switch (scale) {
            case 'S': multiplier = 1.0; break;
            case 'A': multiplier = 0.8; break;
            case 'B': multiplier = 0.6; break;
            case 'C': multiplier = 0.4; break;
            case 'D': multiplier = 0.2; break;
            case 'E': multiplier = 0.1; break;
        }
        attack += statValue * multiplier;
    }
    // Upgrade bonus
    attack += weapon.upgradeLevel * 10;
    return Math.floor(attack);
}

export function upgradeWeapon(weapon: WeaponScaling): WeaponScaling {
    return { ...weapon, upgradeLevel: weapon.upgradeLevel + 1 };
}
