import { DwGame } from './DwGame';
import { GENERATED_AUDIO_ASSET_PATHS } from './GeneratedAudioAssetPaths';
import { GENERATED_IMAGE_ASSET_PATHS } from './GeneratedImageAssetPaths';

export type RpgTheme = 'classic' | 'eldenRing' | 'dnd5e' | 'fantasy';
export type EncounterIntensity = 'low' | 'medium' | 'high' | 'boss';
export type CombatEvent = 'slash' | 'impact' | 'parry' | 'crit' | 'spellArcane' | 'spellDivine';

interface ThemeProfile {
    townMusic: string;
    dungeonMusic: string;
    battleMusic: string;
    bossMusic: string;
    combatSfx: Record<CombatEvent, string[]>;
}

const THEME_PROFILES = new Map<RpgTheme, ThemeProfile>([
    [ 'classic', {
        townMusic: 'MUSIC_TOWN',
        dungeonMusic: 'MUSIC_DUNGEON_FLOOR_1',
        battleMusic: 'MUSIC_BATTLE',
        bossMusic: 'MUSIC_BATTLE',
        combatSfx: {
            slash: [ 'attack', 'hit' ],
            impact: [ 'receiveDamage', 'bump' ],
            parry: [ 'missed1', 'missed2' ],
            crit: [ 'excellentMove' ],
            spellArcane: [ 'castSpell' ],
            spellDivine: [ 'castSpell' ],
        },
    } ],
    [ 'eldenRing', {
        townMusic: 'MUSIC_ELDEN_RING_CATHEDRAL',
        dungeonMusic: 'MUSIC_ELDEN_RING_LEGACY_DUNGEON',
        battleMusic: 'MUSIC_ELDEN_RING_FIELD',
        bossMusic: 'MUSIC_ELDEN_RING_BOSS',
        combatSfx: {
            slash: [ 'eldenBladeSlash', 'eldenAshOfWar' ],
            impact: [ 'eldenHeavyImpact', 'fantasyBossStomp' ],
            parry: [ 'eldenParry' ],
            crit: [ 'eldenGreatRuneActivate', 'excellentMove' ],
            spellArcane: [ 'eldenMagicBurst', 'eldenHolyBurst' ],
            spellDivine: [ 'eldenHolyBurst', 'fantasyHealChime' ],
        },
    } ],
    [ 'dnd5e', {
        townMusic: 'MUSIC_DND5E_TAVERN',
        dungeonMusic: 'MUSIC_DND5E_DUNGEON',
        battleMusic: 'MUSIC_DND5E_BATTLE',
        bossMusic: 'MUSIC_DND5E_BOSS',
        combatSfx: {
            slash: [ 'dndSwordSwing', 'attack' ],
            impact: [ 'dndShieldBlock', 'receiveDamage' ],
            parry: [ 'dndShieldBlock', 'missed2' ],
            crit: [ 'dndCrit', 'excellentMove' ],
            spellArcane: [ 'dndSpellArcane', 'eldenMagicBurst' ],
            spellDivine: [ 'dndSpellDivine', 'fantasyHealChime' ],
        },
    } ],
    [ 'fantasy', {
        townMusic: 'MUSIC_FANTASY_TAVERN',
        dungeonMusic: 'MUSIC_FANTASY_DUNGEON',
        battleMusic: 'MUSIC_DND5E_BATTLE',
        bossMusic: 'MUSIC_ELDEN_RING_BOSS',
        combatSfx: {
            slash: [ 'eldenBladeSlash', 'dndSwordSwing' ],
            impact: [ 'fantasyBossStomp', 'eldenHeavyImpact' ],
            parry: [ 'eldenParry', 'dndShieldBlock' ],
            crit: [ 'excellentMove', 'dndCrit' ],
            spellArcane: [ 'fantasyPortalOpen', 'dndSpellArcane' ],
            spellDivine: [ 'fantasyHealChime', 'dndSpellDivine' ],
        },
    } ],
]);

const safePick = (items: string[], seed: number): string => {
    const index = Math.abs(seed) % items.length;
    return items[index];
};

export const chooseThemeMusic = (
    theme: RpgTheme,
    intensity: EncounterIntensity,
): string => {
    const profile = THEME_PROFILES.get(theme) ?? THEME_PROFILES.get('classic');
    if (!profile) {
        return 'MUSIC_OVERWORLD';
    }
    switch (intensity) {
        case 'low':
            return profile.townMusic;
        case 'medium':
            return profile.dungeonMusic;
        case 'high':
            return profile.battleMusic;
        case 'boss':
            return profile.bossMusic;
    }
};

export const chooseCombatSfx = (
    theme: RpgTheme,
    event: CombatEvent,
    seed = 0,
): string => {
    const profile = THEME_PROFILES.get(theme) ?? THEME_PROFILES.get('classic');
    if (!profile) {
        return 'hit';
    }
    return safePick(profile.combatSfx[event], seed);
};

export const getExplorationSfxByTheme = (theme: RpgTheme): string[] => {
    switch (theme) {
        case 'eldenRing':
            return [ 'eldenRunePickup', 'eldenMountStep', 'fantasyRelicHum' ];
        case 'dnd5e':
            return [ 'dndDiceRoll', 'dndTrapDisarm', 'dndCampfire' ];
        case 'fantasy':
            return [ 'fantasyPortalOpen', 'fantasyDragonRoar', 'fantasyHealChime' ];
        default:
            return [ 'openChest', 'door', 'talk' ];
    }
};

export const registerGeneratedRpgAudioAssets = (game: DwGame): void => {
    GENERATED_AUDIO_ASSET_PATHS.forEach((assetPath: string, key: string) => {
        void game.assets.addSound(key, assetPath);
    });
};

export const registerGeneratedRpgImageAssets = (game: DwGame): void => {
    GENERATED_IMAGE_ASSET_PATHS.forEach((assetPath: string, key: string) => {
        game.assets.addImage(key, assetPath);
    });
};
