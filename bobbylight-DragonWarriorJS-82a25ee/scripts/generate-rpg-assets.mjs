import fs from 'node:fs';
import path from 'node:path';

const SAMPLE_RATE = 22050;
const MAX_AMPLITUDE = 32767;

const audioRecipes = new Map([
    [ 'stairs', { attackMs: 6, releaseMs: 60, steps: [ { durationMs: 120, startHz: 520, endHz: 790, amplitude: 0.42, waveform: 'triangle' } ] } ],
    [ 'run', { attackMs: 3, releaseMs: 70, steps: [ { durationMs: 90, startHz: 720, endHz: 300, amplitude: 0.48, waveform: 'square' } ] } ],
    [ 'menu', { attackMs: 2, releaseMs: 35, steps: [ { durationMs: 55, startHz: 640, endHz: 660, amplitude: 0.38, waveform: 'square' } ] } ],
    [ 'confirmation', { attackMs: 4, releaseMs: 55, steps: [ { durationMs: 65, startHz: 660, endHz: 900, amplitude: 0.4, waveform: 'triangle' } ] } ],
    [ 'hit', { attackMs: 1, releaseMs: 90, steps: [ { durationMs: 110, startHz: 330, endHz: 90, amplitude: 0.55, waveform: 'noise' } ] } ],
    [ 'excellentMove', { attackMs: 3, releaseMs: 90, steps: [ { durationMs: 150, startHz: 840, endHz: 1160, amplitude: 0.45, waveform: 'triangle' } ] } ],
    [ 'attack', { attackMs: 2, releaseMs: 85, steps: [ { durationMs: 120, startHz: 190, endHz: 75, amplitude: 0.58, waveform: 'square' } ] } ],
    [ 'receiveDamage', { attackMs: 1, releaseMs: 110, steps: [ { durationMs: 125, startHz: 280, endHz: 120, amplitude: 0.55, waveform: 'noise' } ] } ],
    [ 'prepareToAttack', { attackMs: 2, releaseMs: 70, steps: [ { durationMs: 95, startHz: 360, endHz: 540, amplitude: 0.42, waveform: 'triangle' } ] } ],
    [ 'missed1', { attackMs: 2, releaseMs: 65, steps: [ { durationMs: 95, startHz: 820, endHz: 360, amplitude: 0.38, waveform: 'square' } ] } ],
    [ 'missed2', { attackMs: 2, releaseMs: 80, steps: [ { durationMs: 110, startHz: 930, endHz: 280, amplitude: 0.4, waveform: 'square' } ] } ],
    [ 'bump', { attackMs: 1, releaseMs: 70, steps: [ { durationMs: 100, startHz: 220, endHz: 60, amplitude: 0.6, waveform: 'noise' } ] } ],
    [ 'castSpell', { attackMs: 4, releaseMs: 130, steps: [ { durationMs: 170, startHz: 360, endHz: 1220, amplitude: 0.36, waveform: 'sine' } ] } ],
    [ 'openChest', { attackMs: 5, releaseMs: 120, steps: [ { durationMs: 180, startHz: 520, endHz: 1020, amplitude: 0.36, waveform: 'triangle' } ] } ],
    [ 'door', { attackMs: 2, releaseMs: 100, steps: [ { durationMs: 115, startHz: 420, endHz: 150, amplitude: 0.48, waveform: 'noise' } ] } ],
    [ 'talk', { attackMs: 2, releaseMs: 18, steps: [ { durationMs: 28, startHz: 250, endHz: 280, amplitude: 0.3, waveform: 'square' } ] } ],
    [ 'eldenBladeSlash', { attackMs: 1, releaseMs: 85, steps: [ { durationMs: 145, startHz: 980, endHz: 260, amplitude: 0.52, waveform: 'noise' } ] } ],
    [ 'eldenHeavyImpact', { attackMs: 1, releaseMs: 130, steps: [ { durationMs: 180, startHz: 180, endHz: 38, amplitude: 0.75, waveform: 'noise' } ] } ],
    [ 'eldenParry', { attackMs: 2, releaseMs: 70, steps: [ { durationMs: 95, startHz: 1220, endHz: 760, amplitude: 0.5, waveform: 'triangle' } ] } ],
    [ 'eldenRunePickup', { attackMs: 8, releaseMs: 140, steps: [ { durationMs: 220, startHz: 320, endHz: 1520, amplitude: 0.34, waveform: 'sine' } ] } ],
    [ 'eldenMagicBurst', { attackMs: 3, releaseMs: 120, steps: [ { durationMs: 190, startHz: 260, endHz: 1320, amplitude: 0.44, waveform: 'sine' } ] } ],
    [ 'eldenHolyBurst', { attackMs: 4, releaseMs: 150, steps: [ { durationMs: 190, startHz: 480, endHz: 1840, amplitude: 0.34, waveform: 'triangle' } ] } ],
    [ 'eldenBloodFlame', { attackMs: 2, releaseMs: 150, steps: [ { durationMs: 220, startHz: 260, endHz: 90, amplitude: 0.56, waveform: 'noise' } ] } ],
    [ 'eldenMountStep', { attackMs: 1, releaseMs: 95, steps: [ { durationMs: 120, startHz: 180, endHz: 65, amplitude: 0.62, waveform: 'noise' } ] } ],
    [ 'eldenGreatRuneActivate', { attackMs: 12, releaseMs: 200, steps: [ { durationMs: 340, startHz: 230, endHz: 1860, amplitude: 0.35, waveform: 'sine' } ] } ],
    [ 'eldenAshOfWar', { attackMs: 2, releaseMs: 120, steps: [ { durationMs: 170, startHz: 850, endHz: 180, amplitude: 0.48, waveform: 'triangle' } ] } ],
    [ 'fantasyDragonRoar', { attackMs: 1, releaseMs: 210, steps: [ { durationMs: 320, startHz: 95, endHz: 42, amplitude: 0.82, waveform: 'noise' } ] } ],
    [ 'fantasyRelicHum', { attackMs: 18, releaseMs: 180, steps: [ { durationMs: 320, startHz: 210, endHz: 260, amplitude: 0.28, waveform: 'sine' } ] } ],
    [ 'fantasyPortalOpen', { attackMs: 10, releaseMs: 180, steps: [ { durationMs: 280, startHz: 180, endHz: 1280, amplitude: 0.4, waveform: 'triangle' } ] } ],
    [ 'fantasyHealChime', { attackMs: 6, releaseMs: 180, steps: [ { durationMs: 250, startHz: 540, endHz: 1440, amplitude: 0.26, waveform: 'triangle' } ] } ],
    [ 'fantasyBossStomp', { attackMs: 2, releaseMs: 150, steps: [ { durationMs: 220, startHz: 130, endHz: 48, amplitude: 0.72, waveform: 'noise' } ] } ],
    [ 'dndSwordSwing', { attackMs: 1, releaseMs: 80, steps: [ { durationMs: 130, startHz: 1120, endHz: 220, amplitude: 0.48, waveform: 'noise' } ] } ],
    [ 'dndShieldBlock', { attackMs: 2, releaseMs: 85, steps: [ { durationMs: 120, startHz: 620, endHz: 180, amplitude: 0.52, waveform: 'triangle' } ] } ],
    [ 'dndCrit', { attackMs: 4, releaseMs: 140, steps: [ { durationMs: 200, startHz: 760, endHz: 1720, amplitude: 0.38, waveform: 'triangle' } ] } ],
    [ 'dndDiceRoll', { attackMs: 1, releaseMs: 150, steps: [ { durationMs: 190, startHz: 960, endHz: 120, amplitude: 0.44, waveform: 'noise' } ] } ],
    [ 'dndSpellArcane', { attackMs: 8, releaseMs: 170, steps: [ { durationMs: 230, startHz: 200, endHz: 1640, amplitude: 0.34, waveform: 'sine' } ] } ],
    [ 'dndSpellDivine', { attackMs: 10, releaseMs: 180, steps: [ { durationMs: 240, startHz: 420, endHz: 1380, amplitude: 0.32, waveform: 'triangle' } ] } ],
    [ 'dndStealth', { attackMs: 4, releaseMs: 90, steps: [ { durationMs: 110, startHz: 240, endHz: 170, amplitude: 0.22, waveform: 'sine' } ] } ],
    [ 'dndTrapDisarm', { attackMs: 2, releaseMs: 110, steps: [ { durationMs: 170, startHz: 1280, endHz: 150, amplitude: 0.44, waveform: 'noise' } ] } ],
    [ 'dndCampfire', { attackMs: 2, releaseMs: 220, steps: [ { durationMs: 360, startHz: 120, endHz: 85, amplitude: 0.22, waveform: 'noise' } ] } ],
    [ 'dndDragonBreath', { attackMs: 2, releaseMs: 180, steps: [ { durationMs: 310, startHz: 380, endHz: 90, amplitude: 0.72, waveform: 'noise' } ] } ],
    [ 'MUSIC_ELDEN_RING_FIELD', { attackMs: 30, releaseMs: 220, steps: [
        { durationMs: 520, startHz: 146, endHz: 146, amplitude: 0.18, waveform: 'sine' },
        { durationMs: 520, startHz: 174, endHz: 174, amplitude: 0.16, waveform: 'triangle' },
        { durationMs: 520, startHz: 220, endHz: 220, amplitude: 0.16, waveform: 'sine' },
        { durationMs: 520, startHz: 174, endHz: 174, amplitude: 0.14, waveform: 'triangle' },
        { durationMs: 520, startHz: 146, endHz: 146, amplitude: 0.18, waveform: 'sine' },
    ] } ],
    [ 'MUSIC_ELDEN_RING_BOSS', { attackMs: 12, releaseMs: 200, steps: [
        { durationMs: 360, startHz: 98, endHz: 98, amplitude: 0.26, waveform: 'square' },
        { durationMs: 360, startHz: 98, endHz: 92, amplitude: 0.24, waveform: 'noise' },
        { durationMs: 360, startHz: 130, endHz: 130, amplitude: 0.24, waveform: 'square' },
        { durationMs: 360, startHz: 110, endHz: 110, amplitude: 0.25, waveform: 'noise' },
        { durationMs: 360, startHz: 146, endHz: 98, amplitude: 0.24, waveform: 'triangle' },
    ] } ],
    [ 'MUSIC_ELDEN_RING_LEGACY_DUNGEON', { attackMs: 18, releaseMs: 240, steps: [
        { durationMs: 520, startHz: 82, endHz: 76, amplitude: 0.2, waveform: 'sine' },
        { durationMs: 520, startHz: 98, endHz: 90, amplitude: 0.16, waveform: 'triangle' },
        { durationMs: 520, startHz: 110, endHz: 102, amplitude: 0.16, waveform: 'sine' },
    ] } ],
    [ 'MUSIC_ELDEN_RING_CATHEDRAL', { attackMs: 24, releaseMs: 260, steps: [
        { durationMs: 600, startHz: 196, endHz: 200, amplitude: 0.14, waveform: 'sine' },
        { durationMs: 600, startHz: 247, endHz: 250, amplitude: 0.14, waveform: 'triangle' },
        { durationMs: 600, startHz: 294, endHz: 300, amplitude: 0.12, waveform: 'sine' },
    ] } ],
    [ 'MUSIC_FANTASY_DUNGEON', { attackMs: 20, releaseMs: 220, steps: [
        { durationMs: 560, startHz: 82, endHz: 78, amplitude: 0.2, waveform: 'sine' },
        { durationMs: 560, startHz: 92, endHz: 90, amplitude: 0.16, waveform: 'triangle' },
        { durationMs: 560, startHz: 110, endHz: 106, amplitude: 0.14, waveform: 'sine' },
        { durationMs: 560, startHz: 92, endHz: 88, amplitude: 0.16, waveform: 'triangle' },
    ] } ],
    [ 'MUSIC_FANTASY_TAVERN', { attackMs: 25, releaseMs: 220, steps: [
        { durationMs: 420, startHz: 196, endHz: 196, amplitude: 0.18, waveform: 'triangle' },
        { durationMs: 420, startHz: 247, endHz: 247, amplitude: 0.16, waveform: 'triangle' },
        { durationMs: 420, startHz: 294, endHz: 294, amplitude: 0.14, waveform: 'sine' },
        { durationMs: 420, startHz: 247, endHz: 247, amplitude: 0.16, waveform: 'triangle' },
        { durationMs: 420, startHz: 220, endHz: 220, amplitude: 0.15, waveform: 'sine' },
    ] } ],
    [ 'MUSIC_DND5E_TAVERN', { attackMs: 22, releaseMs: 220, steps: [
        { durationMs: 420, startHz: 196, endHz: 196, amplitude: 0.18, waveform: 'triangle' },
        { durationMs: 420, startHz: 233, endHz: 233, amplitude: 0.16, waveform: 'triangle' },
        { durationMs: 420, startHz: 262, endHz: 262, amplitude: 0.14, waveform: 'sine' },
        { durationMs: 420, startHz: 294, endHz: 294, amplitude: 0.14, waveform: 'sine' },
    ] } ],
    [ 'MUSIC_DND5E_BATTLE', { attackMs: 10, releaseMs: 190, steps: [
        { durationMs: 360, startHz: 110, endHz: 106, amplitude: 0.26, waveform: 'square' },
        { durationMs: 360, startHz: 146, endHz: 140, amplitude: 0.24, waveform: 'noise' },
        { durationMs: 360, startHz: 165, endHz: 160, amplitude: 0.24, waveform: 'square' },
        { durationMs: 360, startHz: 130, endHz: 126, amplitude: 0.24, waveform: 'noise' },
    ] } ],
    [ 'MUSIC_DND5E_DUNGEON', { attackMs: 20, releaseMs: 220, steps: [
        { durationMs: 520, startHz: 87, endHz: 84, amplitude: 0.2, waveform: 'sine' },
        { durationMs: 520, startHz: 98, endHz: 94, amplitude: 0.17, waveform: 'triangle' },
        { durationMs: 520, startHz: 117, endHz: 112, amplitude: 0.14, waveform: 'sine' },
    ] } ],
    [ 'MUSIC_DND5E_BOSS', { attackMs: 8, releaseMs: 200, steps: [
        { durationMs: 340, startHz: 98, endHz: 92, amplitude: 0.3, waveform: 'square' },
        { durationMs: 340, startHz: 123, endHz: 116, amplitude: 0.28, waveform: 'noise' },
        { durationMs: 340, startHz: 147, endHz: 138, amplitude: 0.28, waveform: 'square' },
        { durationMs: 340, startHz: 110, endHz: 102, amplitude: 0.28, waveform: 'noise' },
    ] } ],
]);

const imageRecipes = new Map([
    [ 'IMG_ELDEN_SIGIL', { palette: [ '#090b15', '#d3b56a', '#f6e6a9' ], shape: 'sigil' } ],
    [ 'IMG_ELDEN_BOSS_EMBLEM', { palette: [ '#120b0b', '#7d1d1d', '#e2b66f' ], shape: 'boss' } ],
    [ 'IMG_ELDEN_RUNE_ICON', { palette: [ '#0b0d12', '#7db8ff', '#d0e8ff' ], shape: 'rune' } ],
    [ 'IMG_ELDEN_LEGACY_TILE', { palette: [ '#1c1b1a', '#555148', '#c5bca8' ], shape: 'tile' } ],
    [ 'IMG_DND_D20_ICON', { palette: [ '#160d08', '#a84b22', '#f7cf9e' ], shape: 'd20' } ],
    [ 'IMG_DND_SHIELD_ICON', { palette: [ '#101723', '#476a9f', '#e4eefc' ], shape: 'shield' } ],
    [ 'IMG_DND_SWORD_ICON', { palette: [ '#0f0f13', '#9fa9b8', '#f2f6ff' ], shape: 'sword' } ],
    [ 'IMG_DND_SPELLBOOK_ICON', { palette: [ '#130d1b', '#6b4f91', '#e4d8f9' ], shape: 'book' } ],
    [ 'IMG_FANTASY_PORTAL_ICON', { palette: [ '#071316', '#2a8b9f', '#8ef0ff' ], shape: 'portal' } ],
    [ 'IMG_FANTASY_HEAL_ICON', { palette: [ '#0e1a0d', '#3b9a45', '#b8ffc2' ], shape: 'heal' } ],
    [ 'IMG_FANTASY_BOSS_MARK', { palette: [ '#140707', '#ac2020', '#ffd0a0' ], shape: 'mark' } ],
    [ 'IMG_RPG_UI_PANEL', { palette: [ '#1a1510', '#6e573d', '#f0dcb8' ], shape: 'panel' } ],
    [ 'IMG_RPG_FOREST_TILE', { palette: [ '#10200e', '#3b6d36', '#97c26f' ], shape: 'forest' } ],
    [ 'IMG_RPG_DUNGEON_TILE', { palette: [ '#161616', '#484848', '#a8a8a8' ], shape: 'dungeon' } ],
    [ 'IMG_RPG_LAVA_TILE', { palette: [ '#231008', '#b83f12', '#ffb45a' ], shape: 'lava' } ],
    [ 'IMG_RPG_ICE_TILE', { palette: [ '#0c1a24', '#4f8fb5', '#d7f4ff' ], shape: 'ice' } ],
]);

function waveformSample(waveform, phase, randomSeed) {
    switch (waveform) {
        case 'sine': return Math.sin(phase);
        case 'square': return Math.sin(phase) >= 0 ? 1 : -1;
        case 'triangle': return 2 / Math.PI * Math.asin(Math.sin(phase));
        case 'noise': return Math.sin(randomSeed * 12.9898 + phase * 78.233) * 43758.5453 % 2 - 1;
        default: return 0;
    }
}

function createEnvelope(index, total, attack, release) {
    if (attack > 0 && index < attack) return index / attack;
    if (release > 0 && index > total - release) return Math.max(0, (total - index) / release);
    return 1;
}

function generateRecipeSamples(recipe) {
    const sampleValues = [];
    let phase = 0;
    let seed = 1;
    for (const step of recipe.steps) {
        const stepSamples = Math.max(1, Math.floor(step.durationMs / 1000 * SAMPLE_RATE));
        const attackSamples = Math.floor(recipe.attackMs / 1000 * SAMPLE_RATE);
        const releaseSamples = Math.floor(recipe.releaseMs / 1000 * SAMPLE_RATE);
        for (let i = 0; i < stepSamples; i++) {
            const t = stepSamples <= 1 ? 0 : i / (stepSamples - 1);
            const hz = step.startHz + (step.endHz - step.startHz) * t;
            phase += 2 * Math.PI * hz / SAMPLE_RATE;
            seed = seed * 16807 % 2147483647;
            const signal = waveformSample(step.waveform, phase, seed);
            const env = createEnvelope(i, stepSamples, attackSamples, releaseSamples);
            sampleValues.push(signal * step.amplitude * env);
        }
    }
    const int16 = new Int16Array(sampleValues.length);
    for (let i = 0; i < sampleValues.length; i++) {
        const sample = Math.max(-1, Math.min(1, sampleValues[i]));
        int16[i] = Math.round(sample * MAX_AMPLITUDE);
    }
    return int16;
}

function wavBytes(samples) {
    const dataBytes = samples.length * 2;
    const out = [];
    const pushAscii = (str) => { for (const c of str) out.push(c.charCodeAt(0)); };
    const pushLE = (value, bytes) => { for (let i = 0; i < bytes; i++) out.push(value >> 8 * i & 255); };
    pushAscii('RIFF');
    pushLE(36 + dataBytes, 4);
    pushAscii('WAVE');
    pushAscii('fmt ');
    pushLE(16, 4);
    pushLE(1, 2);
    pushLE(1, 2);
    pushLE(SAMPLE_RATE, 4);
    pushLE(SAMPLE_RATE * 2, 4);
    pushLE(2, 2);
    pushLE(16, 2);
    pushAscii('data');
    pushLE(dataBytes, 4);
    for (const sample of samples) out.push(sample & 255, sample >> 8 & 255);
    return Buffer.from(out);
}

function shapePath(shape) {
    switch (shape) {
        case 'sigil': return '<circle cx="64" cy="64" r="44" fill="none" stroke="var(--c2)" stroke-width="6"/><circle cx="64" cy="64" r="20" fill="none" stroke="var(--c3)" stroke-width="4"/><path d="M64 18 L74 46 L104 46 L80 62 L90 90 L64 74 L38 90 L48 62 L24 46 L54 46 Z" fill="none" stroke="var(--c3)" stroke-width="4"/>';
        case 'boss': return '<path d="M26 92 L42 28 L64 48 L86 28 L102 92 L80 80 L64 104 L48 80 Z" fill="var(--c2)" stroke="var(--c3)" stroke-width="4"/>';
        case 'rune': return '<path d="M64 16 L88 42 L64 66 L40 42 Z M64 66 L82 84 L64 112 L46 84 Z" fill="none" stroke="var(--c3)" stroke-width="6"/>';
        case 'tile': return '<rect x="12" y="12" width="104" height="104" fill="var(--c2)"/><path d="M12 40 H116 M12 68 H116 M12 96 H116 M40 12 V116 M68 12 V116 M96 12 V116" stroke="var(--c3)" stroke-width="3" opacity="0.55"/>';
        case 'd20': return '<polygon points="64,14 98,36 98,78 64,114 30,78 30,36" fill="var(--c2)" stroke="var(--c3)" stroke-width="4"/><path d="M64 14 V114 M30 36 L98 78 M98 36 L30 78" stroke="var(--c3)" stroke-width="3" opacity="0.7"/>';
        case 'shield': return '<path d="M64 16 L102 32 V60 C102 88 84 106 64 114 C44 106 26 88 26 60 V32 Z" fill="var(--c2)" stroke="var(--c3)" stroke-width="5"/>';
        case 'sword': return '<rect x="58" y="18" width="12" height="66" fill="var(--c3)"/><rect x="44" y="78" width="40" height="8" fill="var(--c2)"/><path d="M64 8 L72 18 H56 Z" fill="var(--c3)"/><rect x="58" y="86" width="12" height="24" fill="var(--c2)"/>';
        case 'book': return '<rect x="20" y="24" width="88" height="80" rx="6" fill="var(--c2)" stroke="var(--c3)" stroke-width="4"/><path d="M64 24 V104 M32 40 H52 M76 40 H96" stroke="var(--c3)" stroke-width="3"/>';
        case 'portal': return '<ellipse cx="64" cy="64" rx="38" ry="50" fill="none" stroke="var(--c2)" stroke-width="8"/><ellipse cx="64" cy="64" rx="22" ry="34" fill="none" stroke="var(--c3)" stroke-width="6"/>';
        case 'heal': return '<circle cx="64" cy="64" r="46" fill="var(--c2)"/><rect x="56" y="34" width="16" height="60" fill="var(--c3)"/><rect x="34" y="56" width="60" height="16" fill="var(--c3)"/>';
        case 'mark': return '<path d="M64 10 L78 48 L118 48 L86 72 L98 114 L64 88 L30 114 L42 72 L10 48 L50 48 Z" fill="var(--c2)" stroke="var(--c3)" stroke-width="4"/>';
        case 'panel': return '<rect x="8" y="8" width="112" height="112" rx="10" fill="var(--c2)" stroke="var(--c3)" stroke-width="4"/><path d="M18 24 H110 M18 96 H110" stroke="var(--c3)" stroke-width="3" opacity="0.55"/>';
        case 'forest': return '<rect x="0" y="0" width="128" height="128" fill="var(--c1)"/><circle cx="34" cy="70" r="20" fill="var(--c2)"/><circle cx="64" cy="58" r="24" fill="var(--c2)"/><circle cx="92" cy="74" r="18" fill="var(--c2)"/><rect x="58" y="78" width="12" height="36" fill="var(--c3)"/>';
        case 'dungeon': return '<rect x="0" y="0" width="128" height="128" fill="var(--c1)"/><path d="M0 32 H128 M0 64 H128 M0 96 H128 M32 0 V128 M64 0 V128 M96 0 V128" stroke="var(--c2)" stroke-width="3"/><circle cx="64" cy="64" r="6" fill="var(--c3)"/>';
        case 'lava': return '<rect x="0" y="0" width="128" height="128" fill="var(--c1)"/><path d="M0 90 C18 76, 34 104, 52 90 C70 74, 86 106, 104 90 C118 78, 124 92, 128 90 V128 H0 Z" fill="var(--c2)"/><path d="M0 104 C18 90, 34 118, 52 104 C70 90, 86 122, 104 104 C118 92, 124 108, 128 104 V128 H0 Z" fill="var(--c3)" opacity="0.8"/>';
        case 'ice': return '<rect x="0" y="0" width="128" height="128" fill="var(--c1)"/><path d="M20 20 L108 108 M108 20 L20 108 M64 8 V120 M8 64 H120" stroke="var(--c2)" stroke-width="4"/><circle cx="64" cy="64" r="10" fill="var(--c3)"/>';
        default: return '<circle cx="64" cy="64" r="40" fill="var(--c2)"/>';
    }
}

function toSvg({ palette, shape }) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<defs>
<style>:root{--c1:${palette[0]};--c2:${palette[1]};--c3:${palette[2]};}</style>
</defs>
<rect x="0" y="0" width="128" height="128" fill="var(--c1)"/>
${shapePath(shape)}
</svg>\n`;
}

const root = process.cwd();
const soundDir = path.join(root, 'public', 'res', 'sound', 'generated');
const imageDir = path.join(root, 'public', 'res', 'generated', 'images');
fs.mkdirSync(soundDir, { recursive: true });
fs.mkdirSync(imageDir, { recursive: true });

const audioManifest = {};
for (const [ key, recipe ] of audioRecipes) {
    const filename = `${key}.wav`;
    const fullPath = path.join(soundDir, filename);
    fs.writeFileSync(fullPath, wavBytes(generateRecipeSamples(recipe)));
    audioManifest[key] = `res/sound/generated/${filename}`;
}

const imageManifest = {};
for (const [ key, recipe ] of imageRecipes) {
    const filename = `${key}.svg`;
    const fullPath = path.join(imageDir, filename);
    fs.writeFileSync(fullPath, toSvg(recipe), 'utf8');
    imageManifest[key] = `res/generated/images/${filename}`;
}

fs.writeFileSync(path.join(soundDir, 'manifest.json'), JSON.stringify(audioManifest, null, 2) + '\n');
fs.writeFileSync(path.join(imageDir, 'manifest.json'), JSON.stringify(imageManifest, null, 2) + '\n');

console.log(`Generated ${audioRecipes.size} audio files in ${soundDir}`);
console.log(`Generated ${imageRecipes.size} image files in ${imageDir}`);
