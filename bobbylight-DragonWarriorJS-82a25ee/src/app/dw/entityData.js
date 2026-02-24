import { eldenArmor, eldenKeyItems, eldenMobs, eldenWeapons } from './eldenRingContent';
// Example monsters (expand to 350+ as needed)
export const MONSTERS = [
    {
        id: 1,
        name: 'Slime',
        class: 'slime',
        zoneIds: [1],
        level: 1,
        hp: 8,
        attack: 3,
        defense: 1,
        abilities: ['split'],
        drops: [1],
    },
    {
        id: 2,
        name: 'Goblin',
        class: 'humanoid',
        subClass: 'goblin',
        zoneIds: [1, 2],
        level: 2,
        hp: 15,
        attack: 5,
        defense: 2,
        abilities: ['steal'],
        drops: [2, 3],
    },
    // ... up to 350
];
// Example weapons
export const WEAPONS = [
    { id: 1, name: 'Wooden Sword', type: 'sword', class: 'basic', attack: 2 },
    { id: 2, name: 'Iron Axe', type: 'axe', class: 'standard', attack: 5 },
    // ... up to 350
];
// Example armor
export const ARMORS = [
    { id: 1, name: 'Cloth Tunic', type: 'chest', class: 'basic', defense: 1 },
    { id: 2, name: 'Iron Shield', type: 'shield', class: 'standard', defense: 4 },
    // ... up to 350
];
// Example items
export const ITEMS = [
    { id: 1, name: 'Potion', type: 'consumable', class: 'healing', effect: 'Restore 20 HP', value: 10 },
    { id: 2, name: 'Antidote', type: 'consumable', class: 'cure', effect: 'Cures poison', value: 8 },
    // ... up to 350
];
export const ELDEN_MONSTERS = eldenMobs.map((mob) => {
    return {
        id: 10000 + mob.id,
        name: mob.name,
        class: 'other',
        subClass: mob.mobType,
        zoneIds: mob.zoneIds,
        level: mob.level,
        hp: mob.hp,
        attack: mob.attack,
        defense: mob.defense,
        abilities: [],
        drops: [],
    };
});
export const ELDEN_WEAPONS = eldenWeapons.map((weapon) => {
    return {
        id: 10000 + weapon.id,
        name: weapon.name,
        type: 'other',
        class: weapon.weaponType,
        subClass: weapon.source,
        attack: weapon.attack,
        special: weapon.scaling.join(', '),
        rarity: weapon.source === 'shadowOfTheErdtree' ? 'dlc' : 'base',
    };
});
export const ELDEN_ARMORS = eldenArmor.map((armor) => {
    return {
        id: 10000 + armor.id,
        name: armor.pieceName,
        type: 'other',
        class: armor.setName,
        subClass: armor.slot,
        defense: armor.poise,
        special: `${armor.weight} wt`,
        rarity: armor.source === 'shadowOfTheErdtree' ? 'dlc' : 'base',
    };
});
export const ELDEN_ITEMS = eldenKeyItems.map((item) => {
    return {
        id: 10000 + item.id,
        name: item.name,
        type: 'key',
        class: item.itemType,
        effect: item.source,
        value: 0,
        rarity: item.source === 'shadowOfTheErdtree' ? 'dlc' : 'base',
    };
});
//# sourceMappingURL=entityData.js.map