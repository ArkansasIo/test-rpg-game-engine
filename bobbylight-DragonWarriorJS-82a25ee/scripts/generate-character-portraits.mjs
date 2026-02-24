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

const PALETTES = [
    [ '#1b0f0a', '#5b2f1f', '#d89a68', '#f6dfb2' ],
    [ '#0c1726', '#345882', '#6ba6d6', '#d7f0ff' ],
    [ '#111a11', '#2f5a32', '#7fb06c', '#daf2cc' ],
    [ '#1d1224', '#5b3f7a', '#9e7dc7', '#eadfff' ],
    [ '#25150d', '#7b4e2a', '#c58a4f', '#f9ddb5' ],
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

const drawPortrait = (id, titleParts) => {
    const canvas = createCanvas(32, 32);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const rng = mulberry32(seedFromText(id));
    const palette = PALETTES[Math.floor(rng() * PALETTES.length)];

    drawPixelRect(ctx, 0, 0, 32, 32, palette[0]);
    for (let i = 0; i < 50; i++) {
        const x = Math.floor(rng() * 32);
        const y = Math.floor(rng() * 32);
        drawPixelRect(ctx, x, y, 1, 1, rng() > 0.6 ? palette[2] : palette[1]);
    }

    drawPixelRect(ctx, 7, 6, 18, 22, palette[1]);
    drawPixelRect(ctx, 9, 8, 14, 10, palette[3]);
    drawPixelRect(ctx, 11, 11, 2, 2, '#000');
    drawPixelRect(ctx, 19, 11, 2, 2, '#000');
    drawPixelRect(ctx, 13, 15, 6, 1, '#000');
    drawPixelRect(ctx, 6, 26, 20, 3, palette[2]);

    const sig = titleParts.join('').toUpperCase();
    const glyphCount = Math.min(5, sig.length);
    for (let i = 0; i < glyphCount; i++) {
        const c = sig.charCodeAt(i);
        const gx = 2 + i * 6;
        const gh = 3 + c % 6;
        drawPixelRect(ctx, gx, 31 - gh, 3, gh, palette[3]);
    }

    drawPixelRect(ctx, 0, 0, 32, 1, '#f7e6bc');
    drawPixelRect(ctx, 0, 31, 32, 1, '#2a1a10');
    drawPixelRect(ctx, 0, 0, 1, 32, '#f7e6bc');
    drawPixelRect(ctx, 31, 0, 1, 32, '#2a1a10');
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
