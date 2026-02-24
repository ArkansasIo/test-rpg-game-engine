import { ClassDef, AbilityDef, ItemDef } from './RPGCoreTypes';

// Example Warrior class definition
export const warriorClass: ClassDef = {
    id: 'warrior',
    name: 'Warrior',
    baseStats: {
        STR: 15,
        DEX: 10,
        CON: 14,
        INT: 6,
        WIS: 8,
        CHA: 10,
        LUK: 8,
    },
    growth: {
        STR: 3,
        DEX: 2,
        CON: 3,
        INT: 1,
        WIS: 1,
        CHA: 1,
        LUK: 1,
    },
    allowedWeapons: [ 'sword', 'axe', 'mace' ],
    allowedArmor: [ 'plate', 'mail', 'shield' ],
    subclasses: [
        {
            id: 'guardian',
            name: 'Guardian',
            passiveBonuses: [
                { stat: 'CON', value: 0.15, type: 'percent' },
                { stat: 'STR', value: 0.10, type: 'percent' },
            ],
            skillList: [
                {
                    id: 'shield_bash',
                    name: 'Shield Bash',
                    type: 'ActiveSkill',
                    targeting: 'SingleTarget',
                    cost: 10,
                    cooldown: 5,
                    coefficient: 1.2,
                    flatBonus: 5,
                    tags: [ 'stun', 'physical' ],
                    effects: [],
                },
            ],
            mechanicTags: [ 'tank', 'stun' ],
        },
        {
            id: 'berserker',
            name: 'Berserker',
            passiveBonuses: [
                { stat: 'STR', value: 0.20, type: 'percent' },
                { stat: 'CON', value: -0.10, type: 'percent' },
            ],
            skillList: [
                {
                    id: 'rage_strike',
                    name: 'Rage Strike',
                    type: 'ActiveSkill',
                    targeting: 'SingleTarget',
                    cost: 15,
                    cooldown: 3,
                    coefficient: 1.5,
                    flatBonus: 0,
                    tags: [ 'physical', 'burst' ],
                    effects: [],
                },
            ],
            mechanicTags: [ 'dps', 'burst' ],
        },
    ],
};

// Example item definition
export const swordOfValor: ItemDef = {
    id: 'sword_valor',
    name: 'Sword of Valor',
    slot: 'weapon',
    baseStats: {
        STR: 5,
        DEX: 2,
        CON: 0,
        INT: 0,
        WIS: 0,
        CHA: 0,
        LUK: 1,
    },
    affixPools: [ 'crit', 'damage' ],
    rarity: 'Epic',
    setId: undefined,
};

// Example ability definition
export const fireballAbility: AbilityDef = {
    id: 'fireball',
    name: 'Fireball',
    type: 'Spell',
    targeting: 'SingleTarget',
    cost: 20,
    cooldown: 4,
    coefficient: 1.8,
    flatBonus: 10,
    tags: [ 'fire', 'magic', 'burn' ],
    effects: [],
};
