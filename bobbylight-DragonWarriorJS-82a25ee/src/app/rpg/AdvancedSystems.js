export const warriorSkillTree = [
    {
        id: 'root',
        name: 'Warrior Training',
        description: 'Unlock basic warrior abilities.',
        requiredLevel: 1,
        children: [
            {
                id: 'power_strike',
                name: 'Power Strike',
                description: 'A powerful melee attack.',
                requiredLevel: 2,
                ability: {
                    id: 'power_strike',
                    name: 'Power Strike',
                    type: 'ActiveSkill',
                    targeting: 'SingleTarget',
                    cost: 10,
                    cooldown: 3,
                    coefficient: 1.3,
                    flatBonus: 3,
                    tags: ['physical'],
                    effects: [],
                },
            },
            {
                id: 'iron_skin',
                name: 'Iron Skin',
                description: 'Increase defense.',
                requiredLevel: 3,
                statBonus: { stat: 'CON', value: 0.10, type: 'percent' },
            },
            {
                id: 'battle_cry',
                name: 'Battle Cry',
                description: 'Buff allies with increased STR.',
                requiredLevel: 4,
                ability: {
                    id: 'battle_cry',
                    name: 'Battle Cry',
                    type: 'ActiveSkill',
                    targeting: 'PartyTarget',
                    cost: 15,
                    cooldown: 5,
                    coefficient: 0,
                    flatBonus: 0,
                    tags: ['buff'],
                    effects: [],
                },
            },
        ],
    },
];
// Example loot table
export const epicLootTable = [
    {
        itemId: 'sword_valor',
        dropChance: 0.05,
    },
    {
        itemId: 'shield_glory',
        dropChance: 0.03,
    },
    {
        itemId: 'ring_fortune',
        dropChance: 0.02,
    },
];
export const affixPool = [
    { id: 'crit', name: 'of Precision', statBonus: { stat: 'DEX', value: 2, type: 'flat' }, rarity: 'Rare' },
    { id: 'strength', name: 'of Power', statBonus: { stat: 'STR', value: 3, type: 'flat' }, rarity: 'Epic' },
    { id: 'vitality', name: 'of Vitality', statBonus: { stat: 'CON', value: 2, type: 'flat' }, rarity: 'Uncommon' },
];
//# sourceMappingURL=AdvancedSystems.js.map