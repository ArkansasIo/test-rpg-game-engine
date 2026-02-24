// Game settings and options structure
export const DEFAULT_GAME_SETTINGS = {
    musicVolume: 0.8,
    sfxVolume: 0.8,
    fullscreen: true,
    difficulty: 'Normal',
    textSpeed: 'Normal',
    showHints: true,
    enableCheats: false,
    language: 'en',
};
export const GAME_SETTINGS_OPTIONS = [
    { key: 'musicVolume', label: 'Music Volume', type: 'number', value: 0.8, min: 0, max: 1, step: 0.05 },
    { key: 'sfxVolume', label: 'SFX Volume', type: 'number', value: 0.8, min: 0, max: 1, step: 0.05 },
    { key: 'fullscreen', label: 'Fullscreen', type: 'boolean', value: true },
    { key: 'difficulty', label: 'Difficulty', type: 'select', value: 'Normal', options: ['Easy', 'Normal', 'Hard'] },
    { key: 'textSpeed', label: 'Text Speed', type: 'select', value: 'Normal', options: ['Slow', 'Normal', 'Fast'] },
    { key: 'showHints', label: 'Show Hints', type: 'boolean', value: true },
    { key: 'enableCheats', label: 'Enable Cheats', type: 'boolean', value: false },
    { key: 'language', label: 'Language', type: 'select', value: 'en', options: ['en', 'es', 'fr', 'de', 'jp'] },
];
//# sourceMappingURL=gameSettings.js.map