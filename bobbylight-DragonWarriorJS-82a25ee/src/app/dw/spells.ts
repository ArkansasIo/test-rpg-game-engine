// Magic spell types, subtypes, classes, subclasses, names, ranks, levels, schools, and details

export type SpellSchool = 'Elemental' | 'Arcane' | 'Divine' | 'Necromancy' | 'Illusion' | 'Enchantment' | 'Summoning' | 'Nature' | 'Blood' | 'Other';
export type SpellClass = 'Attack' | 'Defense' | 'Healing' | 'Buff' | 'Debuff' | 'Utility' | 'Summon' | 'Transformation' | 'Passive';
export type SpellSubClass = 'Fire' | 'Ice' | 'Lightning' | 'Earth' | 'Wind' | 'Water' | 'Light' | 'Dark' | 'Poison' | 'Charm' | 'Ward' | 'Shield' | 'Teleport' | 'Detect' | 'Curse' | 'Blessing' | 'Other';

export interface SpellRank {
    name: string; // e.g. 'Novice', 'Adept', 'Master', 'Legendary'
    levelRequired: number;
    powerMultiplier: number;
}

export interface Spell {
    id: number;
    name: string;
    school: SpellSchool;
    class: SpellClass;
    subClass: SpellSubClass;
    type: string; // e.g. 'Single Target', 'Area', 'Passive', etc.
    description: string;
    rank: SpellRank;
    manaCost: number;
    basePower: number;
    unlockLevel: number;
    effects: string[];
}

export const SPELL_RANKS: SpellRank[] = [
    { name: 'Novice', levelRequired: 1, powerMultiplier: 1 },
    { name: 'Adept', levelRequired: 5, powerMultiplier: 1.5 },
    { name: 'Expert', levelRequired: 10, powerMultiplier: 2 },
    { name: 'Master', levelRequired: 20, powerMultiplier: 3 },
    { name: 'Legendary', levelRequired: 40, powerMultiplier: 5 },
];

// Example spell list (expand as needed)
export const SPELLS: Spell[] = [
    {
        id: 1,
        name: 'Fireball',
        school: 'Elemental',
        class: 'Attack',
        subClass: 'Fire',
        type: 'Single Target',
        description: 'Hurls a blazing fireball at a single enemy.',
        rank: SPELL_RANKS[0],
        manaCost: 5,
        basePower: 20,
        unlockLevel: 1,
        effects: [ 'Burn' ],
    },
    {
        id: 2,
        name: 'Ice Storm',
        school: 'Elemental',
        class: 'Attack',
        subClass: 'Ice',
        type: 'Area',
        description: 'Unleashes a storm of ice shards on all enemies.',
        rank: SPELL_RANKS[1],
        manaCost: 12,
        basePower: 30,
        unlockLevel: 5,
        effects: [ 'Freeze' ],
    },
    {
        id: 3,
        name: 'Heal',
        school: 'Divine',
        class: 'Healing',
        subClass: 'Blessing',
        type: 'Single Target',
        description: 'Restores HP to a single ally.',
        rank: SPELL_RANKS[0],
        manaCost: 6,
        basePower: 18,
        unlockLevel: 1,
        effects: [ 'Restore HP' ],
    },
    {
        id: 4,
        name: 'Lightning Bolt',
        school: 'Elemental',
        class: 'Attack',
        subClass: 'Lightning',
        type: 'Single Target',
        description: 'Strikes an enemy with a bolt of lightning.',
        rank: SPELL_RANKS[1],
        manaCost: 10,
        basePower: 28,
        unlockLevel: 4,
        effects: [ 'Shock' ],
    },
    {
        id: 5,
        name: 'Raise Dead',
        school: 'Necromancy',
        class: 'Summon',
        subClass: 'Dark',
        type: 'Single Target',
        description: 'Revives a fallen ally with partial HP.',
        rank: SPELL_RANKS[2],
        manaCost: 20,
        basePower: 0,
        unlockLevel: 12,
        effects: [ 'Revive' ],
    },
    // ...add more spells as needed
];
