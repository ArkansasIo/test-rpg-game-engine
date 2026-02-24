export const CORE_AUDIO_ASSETS = [
    { id: 'MUSIC_TITLE_SCREEN', path: 'res/sound/01 Dragon Quest 1 - Intro ~ Overture (22khz mono).ogg' },
    { id: 'MUSIC_TANTEGEL', path: 'res/sound/02 Dragon Quest 1 - Tantegel Castle (22khz mono).ogg' },
    { id: 'MUSIC_TANTEGEL_LOWER', path: 'res/sound/03 Dragon Quest 1 - Tantegel Castle (Lower) (22khz mono).ogg' },
    { id: 'MUSIC_TOWN', path: 'res/sound/04 Dragon Quest 1 - Peaceful Village (22khz mono).ogg' },
    { id: 'MUSIC_OVERWORLD', path: 'res/sound/05 Dragon Quest 1 - Kingdom of Alefgard (22khz mono).ogg' },
    { id: 'MUSIC_BATTLE', path: 'res/sound/14 Dragon Quest 1 - A Monster Draws Near (16khz mono).ogg', startSeconds: 2.32 },
    { id: 'MUSIC_DUNGEON_FLOOR_1', path: 'res/sound/06 Dragon Quest 1 - Dark Dungeon - Floor 1 (22khz mono).ogg' },
    { id: 'dead', path: 'res/sound/20 Dragon Quest 1 - Thou Hast Died (22khz mono).ogg' },
    { id: 'overnight', path: 'res/sound/21 Dragon Quest 1 - Special Item (22khz mono).ogg' },
    { id: 'victory', path: 'res/sound/25 Dragon Quest 1 - Victory (22khz mono).ogg', loop: false },
    { id: 'hit', path: 'res/sound/34 Dragon Quest 1 - Hit (22khz mono).wav' },
    { id: 'confirmation', path: 'res/sound/33 Dragon Quest 1 - Confirmation (22khz mono).wav' },
    { id: 'menu', path: 'res/sound/32 Dragon Quest 1 - Menu Button (22khz mono).wav' },
    { id: 'stairs', path: 'res/sound/30 Dragon Quest 1 - Stairs Down (22khz mono).wav' },
    { id: 'attack', path: 'res/sound/36 Dragon Quest 1 - Attack (22khz mono).ogg' },
    { id: 'excellentMove', path: 'res/sound/35 Dragon Quest 1 - Excellent Move (22khz mono).wav' },
    { id: 'prepareToAttack', path: 'res/sound/39 Dragon Quest 1 - Prepare to Attack (22khz mono).wav' },
    { id: 'missed1', path: 'res/sound/40 Dragon Quest 1 - Missed! (22khz mono).wav' },
    { id: 'missed2', path: 'res/sound/41 Dragon Quest 1 - Missed! (2) (22khz mono).wav' },
    { id: 'openChest', path: 'res/sound/44 Dragon Quest 1 - Open Treasure (22khz mono).ogg' },
    { id: 'castSpell', path: 'res/sound/43 Dragon Quest 1 - Cast A Spell (22khz mono).ogg' },
    { id: 'bump', path: 'res/sound/42 Dragon Quest 1 - Bumping into Walls (22khz mono).wav' },
    { id: 'door', path: 'res/sound/45 Dragon Quest 1 - Open Door (22khz mono).ogg' },
    { id: 'receiveDamage', path: 'res/sound/37 Dragon Quest 1 - Receive Damage (22khz mono).wav' },
    { id: 'talk', path: 'res/sound/Dragon Warrior [Dragon Quest] SFX (1).wav' },
    { id: 'run', path: 'res/sound/41 Dragon Quest 1 - Missed! (2) (22khz mono).wav' },
];
const SOUND_ALIASES = new Map([
    ['titleMusic', 'MUSIC_TITLE_SCREEN'],
    ['tantegelMusic', 'MUSIC_TANTEGEL'],
    ['tantegelLowerMusic', 'MUSIC_TANTEGEL_LOWER'],
    ['overworldMusic', 'MUSIC_OVERWORLD'],
    ['battleMusic', 'MUSIC_BATTLE'],
    ['villageMusic', 'MUSIC_TOWN'],
    ['dungeonFloor1', 'MUSIC_DUNGEON_FLOOR_1'],
    ['eldenRingFieldMusic', 'MUSIC_ELDEN_RING_FIELD'],
    ['eldenRingBossMusic', 'MUSIC_ELDEN_RING_BOSS'],
    ['eldenRingLegacyDungeonMusic', 'MUSIC_ELDEN_RING_LEGACY_DUNGEON'],
    ['eldenRingCathedralMusic', 'MUSIC_ELDEN_RING_CATHEDRAL'],
    ['fantasyDungeonMusic', 'MUSIC_FANTASY_DUNGEON'],
    ['fantasyTavernMusic', 'MUSIC_FANTASY_TAVERN'],
    ['dnd5eTavernMusic', 'MUSIC_DND5E_TAVERN'],
    ['dnd5eBattleMusic', 'MUSIC_DND5E_BATTLE'],
    ['dnd5eDungeonMusic', 'MUSIC_DND5E_DUNGEON'],
    ['dnd5eBossMusic', 'MUSIC_DND5E_BOSS'],
]);
const SOUND_FALLBACKS = new Map([
    ['confirmation', ['menu']],
    ['run', ['missed2', 'menu']],
    ['receiveDamage', ['hit', 'bump']],
    ['castSpell', ['confirmation', 'menu']],
    ['openChest', ['confirmation']],
]);
export const registerCoreAudioAssets = (game) => {
    for (const asset of CORE_AUDIO_ASSETS) {
        void game.assets.addSound(asset.id, asset.path, asset.startSeconds, asset.loop);
    }
};
export const resolveSoundCandidates = (requestedId) => {
    var _a, _b;
    if (!requestedId) {
        return [];
    }
    const canonical = (_a = SOUND_ALIASES.get(requestedId)) !== null && _a !== void 0 ? _a : requestedId;
    const fallbacks = (_b = SOUND_FALLBACKS.get(canonical)) !== null && _b !== void 0 ? _b : [];
    return [canonical, ...fallbacks];
};
//# sourceMappingURL=Sounds.js.map