// Elden Ring Boss and Monster Data
// Format: Array of objects with full stats, lore, and info

export const ELDEN_RING_BOSSES_AND_MONSTERS = [
  {
    name: "Margit, the Fell Omen",
    title: "Gatekeeper of Stormveil",
    level: 10,
    rank: "Boss",
    appearanceOrder: 1,
    lorePower: 3,
    hp: 3500,
    attack: 120,
    defense: 80,
    abilities: ["Magic Hammer", "Holy Dagger"],
    resistances: ["Holy", "Magic"],
    speed: 2,
    location: "Stormveil Castle Entrance",
    drops: ["Margit's Shackle", "Runes"],
    lore: "Margit blocks the path to Stormveil, testing the Tarnished's resolve."
  },
  {
    name: "Godrick the Grafted",
    title: "Lord of Stormveil",
    level: 15,
    rank: "Boss",
    appearanceOrder: 2,
    lorePower: 4,
    hp: 5000,
    attack: 180,
    defense: 120,
    abilities: ["Axe Slam", "Dragon Breath"],
    resistances: ["Fire", "Physical"],
    speed: 2,
    location: "Stormveil Castle",
    drops: ["Godrick's Great Rune", "Remembrance of the Grafted"],
    lore: "Godrick is obsessed with power, grafting limbs to himself."
  },
  {
    name: "Starscourge Radahn",
    title: "General of the Redmane",
    level: 20,
    rank: "Legendary Boss",
    appearanceOrder: 3,
    lorePower: 5,
    hp: 12000,
    attack: 350,
    defense: 200,
    abilities: ["Gravity Magic", "Meteor Rain", "Horse Charge"],
    resistances: ["Magic", "Physical"],
    speed: 3,
    location: "Caelid - Radahn Festival",
    drops: ["Radahn's Great Rune", "Remembrance of the Starscourge"],
    lore: "Radahn commands gravity magic and rides his tiny horse into battle."
  },
  {
    name: "Malenia, Blade of Miquella",
    title: "Goddess of Rot",
    level: 25,
    rank: "Legendary Boss",
    appearanceOrder: 4,
    lorePower: 6,
    hp: 15000,
    attack: 400,
    defense: 220,
    abilities: ["Waterfowl Dance", "Scarlet Rot", "Healing"],
    resistances: ["Rot", "Physical"],
    speed: 4,
    location: "Haligtree",
    drops: ["Malenia's Great Rune", "Remembrance of the Rot Goddess"],
    lore: "Malenia is undefeated, but cursed with Scarlet Rot."
  },
  // ...continue for all bosses and monsters...
];
