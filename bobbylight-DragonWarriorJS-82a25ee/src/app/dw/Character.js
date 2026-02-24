// Character.ts
// Core MMORPG character framework
export function abilityModifier(score) {
    return Math.floor((score - 10) / 2);
}
export function calculateArmorClass(baseArmor, dexMod, shield = 0, bonuses = 0) {
    return baseArmor + dexMod + shield + bonuses;
}
export function calculateProficiencyBonus(level) {
    if (level >= 17)
        return 6;
    if (level >= 13)
        return 5;
    if (level >= 9)
        return 4;
    if (level >= 5)
        return 3;
    return 2;
}
export function calculateInitiative(dexMod) {
    return dexMod;
}
export function calculateAttackBonus(modifier, proficiency, isProficient) {
    return modifier + (isProficient ? proficiency : 0);
}
export function calculateSpellSaveDC(proficiency, spellcastingMod) {
    return 8 + proficiency + spellcastingMod;
}
//# sourceMappingURL=Character.js.map