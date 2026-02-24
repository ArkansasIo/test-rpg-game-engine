export type TileKind = 'grass' | 'forest' | 'wall' | 'water' | 'door' | 'chest' | 'swamp' | 'road';

export interface TileDefinition {
    kind: TileKind;
    walkable: boolean;
    encounterWeight: number;
    scriptId?: string;
}

export interface TileOverlay {
    walkable?: boolean;
    kind?: TileKind;
    scriptId?: string;
}

export interface CharacterStats {
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
    str: number;
    agi: number;
    vit: number;
    int: number;
    luk: number;
}

export interface PartyMember {
    id: string;
    name: string;
    level: number;
    stats: CharacterStats;
}

export interface Monster {
    id: string;
    name: string;
    stats: CharacterStats;
    xp: number;
    gold: number;
}

export interface MonsterPack {
    id: string;
    monsters: Monster[];
}

export type BattleCommandType = 'attack' | 'spell' | 'item' | 'run';

export interface BattleCommand {
    actorId: string;
    type: BattleCommandType;
    targetId?: string;
    spellId?: string;
    itemId?: string;
}

export interface DialogScript {
    id: string;
    lines: string[];
}
