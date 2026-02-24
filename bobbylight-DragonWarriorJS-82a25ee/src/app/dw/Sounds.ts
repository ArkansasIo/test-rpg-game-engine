export type Sounds =
    'MUSIC_TITLE_SCREEN' |
    'MUSIC_TANTEGEL' |
    'MUSIC_TANTEGEL_LOWER' |
    'MUSIC_OVERWORLD' |
    'MUSIC_BATTLE' |
    'MUSIC_TOWN' |
    'MUSIC_DUNGEON_FLOOR_1' |
    'MUSIC_ELDEN_RING_FIELD' |
    'MUSIC_ELDEN_RING_BOSS' |
    'MUSIC_ELDEN_RING_LEGACY_DUNGEON' |
    'MUSIC_ELDEN_RING_CATHEDRAL' |
    'MUSIC_FANTASY_DUNGEON' |
    'MUSIC_FANTASY_TAVERN' |
    'MUSIC_DND5E_TAVERN' |
    'MUSIC_DND5E_BATTLE' |
    'MUSIC_DND5E_DUNGEON' |
    'MUSIC_DND5E_BOSS'
;

const SOUND_MAP = new Map<Sounds, string>([
    [ 'MUSIC_TITLE_SCREEN', 'titleMusic' ],
    [ 'MUSIC_TANTEGEL', 'tantegelMusic' ],
    [ 'MUSIC_TANTEGEL_LOWER', 'tantegelLowerMusic' ],
    [ 'MUSIC_OVERWORLD', 'overworldMusic' ],
    [ 'MUSIC_BATTLE', 'battleMusic' ],
    [ 'MUSIC_TOWN', 'villageMusic' ],
    [ 'MUSIC_DUNGEON_FLOOR_1', 'dungeonFloor1' ],
    [ 'MUSIC_ELDEN_RING_FIELD', 'eldenRingFieldMusic' ],
    [ 'MUSIC_ELDEN_RING_BOSS', 'eldenRingBossMusic' ],
    [ 'MUSIC_ELDEN_RING_LEGACY_DUNGEON', 'eldenRingLegacyDungeonMusic' ],
    [ 'MUSIC_ELDEN_RING_CATHEDRAL', 'eldenRingCathedralMusic' ],
    [ 'MUSIC_FANTASY_DUNGEON', 'fantasyDungeonMusic' ],
    [ 'MUSIC_FANTASY_TAVERN', 'fantasyTavernMusic' ],
    [ 'MUSIC_DND5E_TAVERN', 'dnd5eTavernMusic' ],
    [ 'MUSIC_DND5E_BATTLE', 'dnd5eBattleMusic' ],
    [ 'MUSIC_DND5E_DUNGEON', 'dnd5eDungeonMusic' ],
    [ 'MUSIC_DND5E_BOSS', 'dnd5eBossMusic' ],
]);

export const getSound = (sound: Sounds): string | undefined => {
    return SOUND_MAP.get(sound);
};
