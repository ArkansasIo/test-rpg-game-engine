// Character creation data: classes, races, types, subclasses, subtypes

export type CharacterClass = 'Warrior' | 'Mage' | 'Rogue' | 'Cleric' | 'Paladin' | 'Ranger' | 'Monk' | 'Bard' | 'Necromancer';
export type CharacterRace = 'Human' | 'Elf' | 'Dwarf' | 'Orc' | 'Halfling' | 'Dragonkin' | 'Undead' | 'Beastfolk' | 'Construct';

export interface CharacterType {
    name: string;
    subTypes: string[];
}

export interface CharacterClassOption {
    name: CharacterClass;
    types: CharacterType[];
    subClasses: string[];
}

export interface CharacterRaceOption {
    name: CharacterRace;
    description: string;
}

export const CHARACTER_CLASSES: CharacterClassOption[] = [
    {
        name: 'Warrior',
        types: [ { name: 'Tank', subTypes: [ 'Defender', 'Berserker' ] }, { name: 'Damage', subTypes: [ 'Duelist', 'Warlord' ] } ],
        subClasses: [ 'Knight', 'Samurai', 'Barbarian' ],
    },
    {
        name: 'Mage',
        types: [ { name: 'Elemental', subTypes: [ 'Fire', 'Ice', 'Lightning' ] }, { name: 'Arcane', subTypes: [ 'Illusionist', 'Enchanter' ] } ],
        subClasses: [ 'Sorcerer', 'Wizard', 'Warlock' ],
    },
    // ... Add 7 more classes with types and subtypes
];

export const CHARACTER_RACES: CharacterRaceOption[] = [
    { name: 'Human', description: 'Versatile and balanced.' },
    { name: 'Elf', description: 'Agile and attuned to magic.' },
    { name: 'Dwarf', description: 'Sturdy and resilient.' },
    { name: 'Orc', description: 'Strong and fierce.' },
    { name: 'Halfling', description: 'Small and nimble.' },
    { name: 'Dragonkin', description: 'Descendants of dragons.' },
    { name: 'Undead', description: 'Resilient to poison and fear.' },
    { name: 'Beastfolk', description: 'Animalistic traits and senses.' },
    { name: 'Construct', description: 'Artificial beings, immune to disease.' },
];
