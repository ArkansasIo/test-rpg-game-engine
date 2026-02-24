// Character creation data: classes, races, types, subclasses, subtypes

export type CharacterClass =
    'Warrior' | 'Mage' | 'Rogue' | 'Cleric' | 'Paladin' | 'Ranger' | 'Monk' | 'Bard' | 'Necromancer';
export type CharacterRace =
    'Human' | 'Elf' | 'Dwarf' | 'Orc' | 'Halfling' | 'Dragonkin' | 'Undead' | 'Beastfolk' | 'Construct';

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
        types: [
            { name: 'Tank', subTypes: [ 'Defender', 'Juggernaut', 'Berserker' ] },
            { name: 'Damage', subTypes: [ 'Duelist', 'Warlord', 'Executioner' ] },
        ],
        subClasses: [ 'Knight', 'Samurai', 'Barbarian' ],
    },
    {
        name: 'Mage',
        types: [
            { name: 'Elemental', subTypes: [ 'Fire', 'Ice', 'Lightning' ] },
            { name: 'Arcane', subTypes: [ 'Illusionist', 'Enchanter', 'Chronomancer' ] },
        ],
        subClasses: [ 'Sorcerer', 'Wizard', 'Warlock' ],
    },
    {
        name: 'Rogue',
        types: [
            { name: 'Assassin', subTypes: [ 'Poison', 'Shadow', 'Bleed' ] },
            { name: 'Scout', subTypes: [ 'Sniper', 'Saboteur', 'Tracker' ] },
        ],
        subClasses: [ 'Ninja', 'Corsair', 'Outlaw' ],
    },
    {
        name: 'Cleric',
        types: [
            { name: 'Healer', subTypes: [ 'Life', 'Mercy', 'Restoration' ] },
            { name: 'Battle Priest', subTypes: [ 'Smite', 'Ward', 'Purifier' ] },
        ],
        subClasses: [ 'Oracle', 'Templar', 'Exorcist' ],
    },
    {
        name: 'Paladin',
        types: [
            { name: 'Holy Vanguard', subTypes: [ 'Guardian', 'Avenger', 'Crusader' ] },
            { name: 'Aura Master', subTypes: [ 'Valor', 'Justice', 'Sanctity' ] },
        ],
        subClasses: [ 'Oathkeeper', 'Dawnblade', 'Justicar' ],
    },
    {
        name: 'Ranger',
        types: [
            { name: 'Marksman', subTypes: [ 'Longbow', 'Crossbow', 'Trapper' ] },
            { name: 'Warden', subTypes: [ 'Beastmaster', 'Pathfinder', 'Druidic' ] },
        ],
        subClasses: [ 'Hunter', 'Falconer', 'Stalker' ],
    },
    {
        name: 'Monk',
        types: [
            { name: 'Striker', subTypes: [ 'Fist', 'Kick', 'Palm' ] },
            { name: 'Mystic', subTypes: [ 'Chi', 'Void', 'Spirit' ] },
        ],
        subClasses: [ 'Ascetic', 'Drunken Master', 'Windwalker' ],
    },
    {
        name: 'Bard',
        types: [
            { name: 'Maestro', subTypes: [ 'Ballad', 'Anthem', 'Dirge' ] },
            { name: 'Trickster', subTypes: [ 'Satire', 'Echo', 'Glamour' ] },
        ],
        subClasses: [ 'Skald', 'Minstrel', 'Virtuoso' ],
    },
    {
        name: 'Necromancer',
        types: [
            { name: 'Summoner', subTypes: [ 'Skeleton Legion', 'Wraith Host', 'Bone Golem' ] },
            { name: 'Blood Mage', subTypes: [ 'Hemomancy', 'Soul Drain', 'Plague' ] },
        ],
        subClasses: [ 'Lich', 'Gravecaller', 'Deathbinder' ],
    },
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

export const toPortraitToken = (value: string): string =>
    value.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');

export const toCharacterPortraitId = (...parts: string[]): string =>
    `CHAR__${parts.map(toPortraitToken).join('__')}`;
