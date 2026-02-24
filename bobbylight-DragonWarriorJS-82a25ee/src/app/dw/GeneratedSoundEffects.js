const SAMPLE_RATE = 22050;
const MAX_AMPLITUDE = 32767;
const BASE_SOUND_RECIPES = new Map([
    ['stairs', { attackMs: 6, releaseMs: 60, steps: [{ durationMs: 120, startHz: 520, endHz: 790, amplitude: 0.42, waveform: 'triangle' }] }],
    ['run', { attackMs: 3, releaseMs: 70, steps: [{ durationMs: 90, startHz: 720, endHz: 300, amplitude: 0.48, waveform: 'square' }] }],
    ['menu', { attackMs: 2, releaseMs: 35, steps: [{ durationMs: 55, startHz: 640, endHz: 660, amplitude: 0.38, waveform: 'square' }] }],
    ['confirmation', { attackMs: 4, releaseMs: 55, steps: [{ durationMs: 65, startHz: 660, endHz: 900, amplitude: 0.4, waveform: 'triangle' }] }],
    ['hit', { attackMs: 1, releaseMs: 90, steps: [{ durationMs: 110, startHz: 330, endHz: 90, amplitude: 0.55, waveform: 'noise' }] }],
    ['excellentMove', { attackMs: 3, releaseMs: 90, steps: [{ durationMs: 150, startHz: 840, endHz: 1160, amplitude: 0.45, waveform: 'triangle' }] }],
    ['attack', { attackMs: 2, releaseMs: 85, steps: [{ durationMs: 120, startHz: 190, endHz: 75, amplitude: 0.58, waveform: 'square' }] }],
    ['receiveDamage', { attackMs: 1, releaseMs: 110, steps: [{ durationMs: 125, startHz: 280, endHz: 120, amplitude: 0.55, waveform: 'noise' }] }],
    ['prepareToAttack', { attackMs: 2, releaseMs: 70, steps: [{ durationMs: 95, startHz: 360, endHz: 540, amplitude: 0.42, waveform: 'triangle' }] }],
    ['missed1', { attackMs: 2, releaseMs: 65, steps: [{ durationMs: 95, startHz: 820, endHz: 360, amplitude: 0.38, waveform: 'square' }] }],
    ['missed2', { attackMs: 2, releaseMs: 80, steps: [{ durationMs: 110, startHz: 930, endHz: 280, amplitude: 0.4, waveform: 'square' }] }],
    ['bump', { attackMs: 1, releaseMs: 70, steps: [{ durationMs: 100, startHz: 220, endHz: 60, amplitude: 0.6, waveform: 'noise' }] }],
    ['castSpell', { attackMs: 4, releaseMs: 130, steps: [{ durationMs: 170, startHz: 360, endHz: 1220, amplitude: 0.36, waveform: 'sine' }] }],
    ['openChest', { attackMs: 5, releaseMs: 120, steps: [{ durationMs: 180, startHz: 520, endHz: 1020, amplitude: 0.36, waveform: 'triangle' }] }],
    ['door', { attackMs: 2, releaseMs: 100, steps: [{ durationMs: 115, startHz: 420, endHz: 150, amplitude: 0.48, waveform: 'noise' }] }],
    ['talk', { attackMs: 2, releaseMs: 18, steps: [{ durationMs: 28, startHz: 250, endHz: 280, amplitude: 0.3, waveform: 'square' }] }],
]);
const FANTASY_SOUND_RECIPES = new Map([
    ['eldenBladeSlash', { attackMs: 1, releaseMs: 85, steps: [{ durationMs: 145, startHz: 980, endHz: 260, amplitude: 0.52, waveform: 'noise' }] }],
    ['eldenHeavyImpact', { attackMs: 1, releaseMs: 130, steps: [{ durationMs: 180, startHz: 180, endHz: 38, amplitude: 0.75, waveform: 'noise' }] }],
    ['eldenParry', { attackMs: 2, releaseMs: 70, steps: [{ durationMs: 95, startHz: 1220, endHz: 760, amplitude: 0.5, waveform: 'triangle' }] }],
    ['eldenRunePickup', { attackMs: 8, releaseMs: 140, steps: [{ durationMs: 220, startHz: 320, endHz: 1520, amplitude: 0.34, waveform: 'sine' }] }],
    ['eldenMagicBurst', { attackMs: 3, releaseMs: 120, steps: [{ durationMs: 190, startHz: 260, endHz: 1320, amplitude: 0.44, waveform: 'sine' }] }],
    ['fantasyDragonRoar', { attackMs: 1, releaseMs: 210, steps: [{ durationMs: 320, startHz: 95, endHz: 42, amplitude: 0.82, waveform: 'noise' }] }],
    ['fantasyRelicHum', { attackMs: 18, releaseMs: 180, steps: [{ durationMs: 320, startHz: 210, endHz: 260, amplitude: 0.28, waveform: 'sine' }] }],
    ['fantasyPortalOpen', { attackMs: 10, releaseMs: 180, steps: [{ durationMs: 280, startHz: 180, endHz: 1280, amplitude: 0.4, waveform: 'triangle' }] }],
    ['fantasyHealChime', { attackMs: 6, releaseMs: 180, steps: [{ durationMs: 250, startHz: 540, endHz: 1440, amplitude: 0.26, waveform: 'triangle' }] }],
    ['fantasyBossStomp', { attackMs: 2, releaseMs: 150, steps: [{ durationMs: 220, startHz: 130, endHz: 48, amplitude: 0.72, waveform: 'noise' }] }],
]);
const GENERATED_MUSIC_RECIPES = new Map([
    ['MUSIC_ELDEN_RING_FIELD', { attackMs: 30, releaseMs: 220, steps: [
                { durationMs: 520, startHz: 146, endHz: 146, amplitude: 0.18, waveform: 'sine' },
                { durationMs: 520, startHz: 174, endHz: 174, amplitude: 0.16, waveform: 'triangle' },
                { durationMs: 520, startHz: 220, endHz: 220, amplitude: 0.16, waveform: 'sine' },
                { durationMs: 520, startHz: 174, endHz: 174, amplitude: 0.14, waveform: 'triangle' },
                { durationMs: 520, startHz: 146, endHz: 146, amplitude: 0.18, waveform: 'sine' },
            ] }],
    ['MUSIC_ELDEN_RING_BOSS', { attackMs: 12, releaseMs: 200, steps: [
                { durationMs: 360, startHz: 98, endHz: 98, amplitude: 0.26, waveform: 'square' },
                { durationMs: 360, startHz: 98, endHz: 92, amplitude: 0.24, waveform: 'noise' },
                { durationMs: 360, startHz: 130, endHz: 130, amplitude: 0.24, waveform: 'square' },
                { durationMs: 360, startHz: 110, endHz: 110, amplitude: 0.25, waveform: 'noise' },
                { durationMs: 360, startHz: 146, endHz: 98, amplitude: 0.24, waveform: 'triangle' },
            ] }],
    ['MUSIC_FANTASY_DUNGEON', { attackMs: 20, releaseMs: 220, steps: [
                { durationMs: 560, startHz: 82, endHz: 78, amplitude: 0.2, waveform: 'sine' },
                { durationMs: 560, startHz: 92, endHz: 90, amplitude: 0.16, waveform: 'triangle' },
                { durationMs: 560, startHz: 110, endHz: 106, amplitude: 0.14, waveform: 'sine' },
                { durationMs: 560, startHz: 92, endHz: 88, amplitude: 0.16, waveform: 'triangle' },
            ] }],
    ['MUSIC_FANTASY_TAVERN', { attackMs: 25, releaseMs: 220, steps: [
                { durationMs: 420, startHz: 196, endHz: 196, amplitude: 0.18, waveform: 'triangle' },
                { durationMs: 420, startHz: 247, endHz: 247, amplitude: 0.16, waveform: 'triangle' },
                { durationMs: 420, startHz: 294, endHz: 294, amplitude: 0.14, waveform: 'sine' },
                { durationMs: 420, startHz: 247, endHz: 247, amplitude: 0.16, waveform: 'triangle' },
                { durationMs: 420, startHz: 220, endHz: 220, amplitude: 0.15, waveform: 'sine' },
            ] }],
]);
const waveformSample = (waveform, phase, randomSeed) => {
    switch (waveform) {
        case 'sine':
            return Math.sin(phase);
        case 'square':
            return Math.sin(phase) >= 0 ? 1 : -1;
        case 'triangle':
            return 2 / Math.PI * Math.asin(Math.sin(phase));
        case 'noise':
            return Math.sin(randomSeed * 12.9898 + phase * 78.233) * 43758.5453 % 2 - 1;
    }
};
const toLittleEndian = (value, bytes) => {
    const output = [];
    for (let i = 0; i < bytes; i++) {
        output.push(value >> 8 * i & 255);
    }
    return output;
};
const makeWavDataUri = (samples) => {
    const dataBytes = samples.length * 2;
    const buffer = [];
    const pushAscii = (str) => {
        for (const char of str) {
            buffer.push(char.charCodeAt(0));
        }
    };
    pushAscii('RIFF');
    buffer.push(...toLittleEndian(36 + dataBytes, 4));
    pushAscii('WAVE');
    pushAscii('fmt ');
    buffer.push(...toLittleEndian(16, 4)); // PCM header size
    buffer.push(...toLittleEndian(1, 2)); // PCM format
    buffer.push(...toLittleEndian(1, 2)); // Mono
    buffer.push(...toLittleEndian(SAMPLE_RATE, 4));
    buffer.push(...toLittleEndian(SAMPLE_RATE * 2, 4)); // Byte rate
    buffer.push(...toLittleEndian(2, 2)); // Block align
    buffer.push(...toLittleEndian(16, 2)); // Bits per sample
    pushAscii('data');
    buffer.push(...toLittleEndian(dataBytes, 4));
    for (const sample of samples) {
        buffer.push(sample & 255, sample >> 8 & 255);
    }
    let binary = '';
    for (const value of buffer) {
        binary += String.fromCharCode(value);
    }
    return `data:audio/wav;base64,${btoa(binary)}`;
};
const createEnvelope = (index, total, attack, release) => {
    if (attack > 0 && index < attack) {
        return index / attack;
    }
    if (release > 0 && index > total - release) {
        return Math.max(0, (total - index) / release);
    }
    return 1;
};
const generateRecipeSamples = (recipe) => {
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
};
const createGeneratedAudioFromRecipes = (recipes) => {
    const output = new Map();
    recipes.forEach((recipe, key) => {
        output.set(key, makeWavDataUri(generateRecipeSamples(recipe)));
    });
    return output;
};
export const createGeneratedSoundEffects = () => {
    const output = createGeneratedAudioFromRecipes(BASE_SOUND_RECIPES);
    createGeneratedAudioFromRecipes(FANTASY_SOUND_RECIPES).forEach((uri, key) => {
        output.set(key, uri);
    });
    return output;
};
export const createGeneratedFantasyMusic = () => {
    return createGeneratedAudioFromRecipes(GENERATED_MUSIC_RECIPES);
};
//# sourceMappingURL=GeneratedSoundEffects.js.map