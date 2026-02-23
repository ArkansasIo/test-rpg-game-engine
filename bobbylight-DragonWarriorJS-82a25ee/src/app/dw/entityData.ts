import { Monster, Weapon, Armor, Item } from './entities';

// Example monsters (expand to 350+ as needed)
export const MONSTERS: Monster[] = [
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
        drops: [1]
    },
    {
        id: 2,
        name: 'Goblin',
        class: 'humanoid',
        subClass: 'goblin',
        zoneIds: [1,2],
        level: 2,
        hp: 15,
        attack: 5,
        defense: 2,
        abilities: ['steal'],
        drops: [2,3]
    }
    // ... up to 350
];

// Example weapons
export const WEAPONS: Weapon[] = [
    { id: 1, name: 'Wooden Sword', type: 'sword', class: 'basic', attack: 2 },
    { id: 2, name: 'Iron Axe', type: 'axe', class: 'standard', attack: 5 }
    // ... up to 350
];

// Example armor
export const ARMORS: Armor[] = [
    { id: 1, name: 'Cloth Tunic', type: 'chest', class: 'basic', defense: 1 },
    { id: 2, name: 'Iron Shield', type: 'shield', class: 'standard', defense: 4 }
    // ... up to 350
];

// Example items
export const ITEMS: Item[] = [
    { id: 1, name: 'Potion', type: 'consumable', class: 'healing', effect: 'Restore 20 HP', value: 10 },
    { id: 2, name: 'Antidote', type: 'consumable', class: 'cure', effect: 'Cures poison', value: 8 }
    // ... up to 350
];
