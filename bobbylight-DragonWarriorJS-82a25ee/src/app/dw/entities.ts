// Extensible interfaces for monsters, weapons, armor, and items

export type MonsterClass = 'beast' | 'undead' | 'dragon' | 'elemental' | 'humanoid' | 'construct' | 'demon' | 'spirit' | 'giant' | 'insect' | 'plant' | 'slime' | 'other';

export interface Monster {
    id: number;
    name: string;
    class: MonsterClass;
    subClass?: string;
    type?: string;
    subTypes?: string[];
    zoneIds: number[]; // Zones where this monster appears
    level: number;
    hp: number;
    attack: number;
    defense: number;
    abilities?: string[];
    drops?: number[]; // Item IDs
}

export type WeaponType = 'sword' | 'axe' | 'bow' | 'staff' | 'dagger' | 'mace' | 'spear' | 'whip' | 'other';

export interface Weapon {
    id: number;
    name: string;
    type: WeaponType;
    class: string;
    subClass?: string;
    attack: number;
    special?: string;
    rarity?: string;
}

export type ArmorType = 'helmet' | 'chest' | 'shield' | 'boots' | 'gloves' | 'cloak' | 'ring' | 'amulet' | 'other';

export interface Armor {
    id: number;
    name: string;
    type: ArmorType;
    class: string;
    subClass?: string;
    defense: number;
    special?: string;
    rarity?: string;
}

export type ItemType = 'consumable' | 'quest' | 'material' | 'key' | 'other';

export interface Item {
    id: number;
    name: string;
    type: ItemType;
    class: string;
    subClass?: string;
    effect?: string;
    value?: number;
    rarity?: string;
}

// --- Talent Tree and Level System ---

export interface TalentNode {
    id: string;
    name: string;
    description: string;
    maxRank: number;
    currentRank: number;
    prerequisites?: string[];
    children?: string[];
    icon?: string;
}

export interface TalentTree {
    id: string;
    name: string;
    nodes: Record<string, TalentNode>;
}

export interface LevelProgression {
    level: number;
    expRequired: number;
    statGains: Partial<Record<'hp' | 'mp' | 'strength' | 'agility', number>>;
}
