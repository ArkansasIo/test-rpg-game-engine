// Character.ts
// Core MMORPG character framework

export type AbilityScore = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

export interface AbilityScores {
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;
}

export function abilityModifier(score: number): number {
    return Math.floor((score - 10) / 2);
}

export interface CharacterClass {
    name: string;
    role: 'Tank' | 'DPS' | 'Support' | 'Hybrid';
    hitDice: string;
    primaryAbilities: AbilityScore[];
    spellcastingAbility?: AbilityScore;
    proficiencyBonus: number;
    savingThrows: AbilityScore[];
    skills: string[];
}

export interface EquipmentSlots {
    head?: string;
    chest?: string;
    legs?: string;
    hands?: string;
    feet?: string;
    weapon?: string;
    shield?: string;
    rings?: string[];
    amulet?: string;
    cloak?: string;
}

export interface Character {
    name: string;
    level: number;
    xp: number;
    class: CharacterClass;
    abilityScores: AbilityScores;
    modifiers: Record<AbilityScore, number>;
    maxHP: number;
    currentHP: number;
    tempHP: number;
    armorClass: number;
    initiative: number;
    speed: number;
    proficiencyBonus: number;
    skills: Record<string, number>;
    equipment: EquipmentSlots;
    statusEffects: string[];
    mana?: number;
    rage?: number;
    energy?: number;
    stamina?: number;
    spellSlots?: Record<number, number>;
    talents?: string[];
    partyRole?: 'Tank' | 'Healer' | 'DPS' | 'Hybrid';
    threat?: number;
}

export function calculateArmorClass(baseArmor: number, dexMod: number, shield: number = 0, bonuses: number = 0): number {
    return baseArmor + dexMod + shield + bonuses;
}

export function calculateProficiencyBonus(level: number): number {
    if (level >= 17) return 6;
    if (level >= 13) return 5;
    if (level >= 9) return 4;
    if (level >= 5) return 3;
    return 2;
}

export function calculateInitiative(dexMod: number): number {
    return dexMod;
}

export function calculateAttackBonus(modifier: number, proficiency: number, isProficient: boolean): number {
    return modifier + (isProficient ? proficiency : 0);
}

export function calculateSpellSaveDC(proficiency: number, spellcastingMod: number): number {
    return 8 + proficiency + spellcastingMod;
}
