import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from 'canvas';

const CHARACTER_CLASSES = [
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

const CHARACTER_RACES = [
    'Human',
    'Elf',
    'Dwarf',
    'Orc',
    'Halfling',
    'Dragonkin',
    'Undead',
    'Beastfolk',
    'Construct',
];

// Dragon Warrior/Dragon Quest style palettes (classic NES/SNES look)
const PALETTES = [
    [ '#181818', '#f8d878', '#a85838', '#f8b800', '#e8a800', '#a8a8a8', '#f8f8f8', '#3860d8' ], // Hero/warrior
    [ '#181818', '#b8f8d8', '#38a878', '#f8f8f8', '#a8a8a8', '#f8b800', '#3860d8', '#f8d878' ], // Mage
    [ '#181818', '#f8b800', '#a85838', '#f8d878', '#e8a800', '#a8a8a8', '#f8f8f8', '#3860d8' ], // Cleric/Paladin
    [ '#181818', '#a8a8a8', '#f8f8f8', '#3860d8', '#f8d878', '#f8b800', '#e8a800', '#38a878' ], // Rogue
    [ '#181818', '#f8f8f8', '#a8a8a8', '#f8d878', '#f8b800', '#e8a800', '#3860d8', '#38a878' ], // Bard/Monk
];

const toToken = (value) =>
    value.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');

const toId = (...parts) => `CHAR__${parts.map(toToken).join('__')}`;

const seedFromText = (text) => {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < text.length; i++) {
        h ^= text.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
};

const mulberry32 = (seed) => {
    let t = seed;
    return () => {
        t += 0x6D2B79F5;
        let r = Math.imul(t ^ (t >>> 15), 1 | t);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
};

const drawPixelRect = (ctx, x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
};

// Draw a Dragon Warrior/Dragon Quest style portrait
const drawPortrait = (id, titleParts) => {
    const canvas = createCanvas(32, 32);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const rng = mulberry32(seedFromText(id));
    // Pick palette based on class/race for more variety
    let paletteIdx = Math.floor(rng() * PALETTES.length);
    if (titleParts[0]) {
        const key = titleParts[0].toLowerCase();
        if (key.includes('warrior') || key.includes('paladin')) paletteIdx = 0;
        else if (key.includes('mage') || key.includes('necromancer')) paletteIdx = 1;
        else if (key.includes('cleric')) paletteIdx = 2;
        else if (key.includes('rogue') || key.includes('ranger')) paletteIdx = 3;
        else if (key.includes('bard') || key.includes('monk')) paletteIdx = 4;
    }
    const palette = PALETTES[paletteIdx];

    // Background
    drawPixelRect(ctx, 0, 0, 32, 32, palette[0]);

    // Head/face (Dragon Quest style: round, centered, with helmet/hair)
    drawPixelRect(ctx, 8, 8, 16, 16, palette[1]); // face base
    // Cheeks
    drawPixelRect(ctx, 10, 20, 4, 2, palette[3]);
    drawPixelRect(ctx, 18, 20, 4, 2, palette[3]);
    // Hair/helmet (top)
    drawPixelRect(ctx, 8, 6, 16, 4, palette[2]);
    // Hair/helmet (sides)
    drawPixelRect(ctx, 6, 12, 4, 8, palette[2]);
    drawPixelRect(ctx, 22, 12, 4, 8, palette[2]);
    // Eyes (big, DQ style)
    drawPixelRect(ctx, 12, 16, 2, 2, '#181818');
    drawPixelRect(ctx, 18, 16, 2, 2, '#181818');
    drawPixelRect(ctx, 12, 17, 1, 1, '#f8f8f8');
    drawPixelRect(ctx, 18, 17, 1, 1, '#f8f8f8');
    // Mouth (simple line)
    drawPixelRect(ctx, 15, 22, 2, 1, '#a85838');
    // Nose
    drawPixelRect(ctx, 16, 19, 1, 2, palette[2]);

    // Shoulders/armor
    drawPixelRect(ctx, 6, 24, 20, 4, palette[4]);
    // Accent/gem on helmet (randomized)
    if (rng() > 0.5) drawPixelRect(ctx, 15, 8, 2, 2, palette[5]);

    // Border (Dragon Quest style)
    drawPixelRect(ctx, 0, 0, 32, 1, palette[6]);
    drawPixelRect(ctx, 0, 31, 32, 1, palette[0]);
    drawPixelRect(ctx, 0, 0, 1, 32, palette[6]);
    drawPixelRect(ctx, 31, 0, 1, 32, palette[0]);

    // Optionally, add a blue accent (DQ hero scarf/cape)
    if (rng() > 0.7) drawPixelRect(ctx, 4, 28, 24, 2, palette[7]);

    return canvas;
};

const root = process.cwd();
const imageDir = path.join(root, 'public', 'res', 'generated', 'characterPortraits');
const manifestPath = path.join(imageDir, 'manifest.json');
const tsOutPath = path.join(root, 'src', 'app', 'dw', 'GeneratedCharacterPortraitPaths.ts');
fs.mkdirSync(imageDir, { recursive: true });

const manifest = {};

const emitPortrait = (id, parts) => {
    const fileName = `${id}.png`;
    const fullPath = path.join(imageDir, fileName);
    const canvas = drawPortrait(id, parts);
    fs.writeFileSync(fullPath, canvas.toBuffer('image/png'));
    manifest[id] = `res/generated/characterPortraits/${fileName}`;
};

for (const race of CHARACTER_RACES) {
    emitPortrait(toId('RACE', race), [ race ]);
}

for (const cls of CHARACTER_CLASSES) {
    emitPortrait(toId('CLASS', cls.name), [ cls.name ]);
    for (const subClass of cls.subClasses) {
        emitPortrait(toId('CLASS', cls.name, 'SUBCLASS', subClass), [ cls.name, subClass ]);
    }
    for (const type of cls.types) {
        emitPortrait(toId('CLASS', cls.name, 'TYPE', type.name), [ cls.name, type.name ]);
        for (const subType of type.subTypes) {
            emitPortrait(toId('CLASS', cls.name, 'TYPE', type.name, 'SUBTYPE', subType), [ cls.name, type.name, subType ]);
            for (const subClass of cls.subClasses) {
                emitPortrait(
                    toId('CLASS', cls.name, 'SUBCLASS', subClass, 'TYPE', type.name, 'SUBTYPE', subType),
                    [ cls.name, subClass, type.name, subType ],
                );
            }
        }
    }
}

for (const race of CHARACTER_RACES) {
    for (const cls of CHARACTER_CLASSES) {
        emitPortrait(toId('RACE', race, 'CLASS', cls.name), [ race, cls.name ]);
    }
}

const sortedIds = Object.keys(manifest).sort();
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

const tsMapEntries = sortedIds
    .map((id) => `    [ '${id}', '${manifest[id]}' ],`)
    .join('\n');
const tsContent = `export const GENERATED_CHARACTER_PORTRAIT_PATHS = new Map<string, string>([\n${tsMapEntries}\n]);\n`;
fs.writeFileSync(tsOutPath, tsContent, 'utf8');

console.log(`Generated ${sortedIds.length} character portrait PNG files in ${imageDir}`);
