/* eslint-disable @typescript-eslint/naming-convention */
// RPG Core Data Structures

export type PrimaryStat = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA' | 'LUK';

export interface Stats {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
  LUK: number;
  [key: string]: number;
}

export interface StatGrowth {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
  LUK: number;
  [key: string]: number;
}

export interface StatModifiers {
  stat: PrimaryStat;
  value: number;
  type: 'flat' | 'percent' | 'mult';
}

export interface EquipmentSet {
  weapon?: ItemInstance;
  helmet?: ItemInstance;
  chest?: ItemInstance;
  gloves?: ItemInstance;
  boots?: ItemInstance;
  ring1?: ItemInstance;
  ring2?: ItemInstance;
  amulet?: ItemInstance;
  offhand?: ItemInstance;
}

export interface SkillSet {
  skills: AbilityInstance[];
}

export interface Inventory {
  items: ItemInstance[];
}

export interface Character {
  id: string;
  name: string;
  level: number;
  xp: number;
  stats: Stats;
  equipment: EquipmentSet;
  skills: SkillSet;
  inventory: Inventory;
  classId: string;
  subclassId: string;
}

export interface Enemy {
  id: string;
  type: string;
  level: number;
  aiState: string;
  lootTable: LootTable;
}

export interface ClassDef {
  id: string;
  name: string;
  baseStats: Stats;
  growth: StatGrowth;
  allowedWeapons: string[];
  allowedArmor: string[];
  subclasses: SubclassDef[];
}

export interface SubclassDef {
  id: string;
  name: string;
  passiveBonuses: StatModifiers[];
  skillList: AbilityDef[];
  mechanicTags: string[];
}

export interface AbilityDef {
  id: string;
  name: string;
  type: string;
  targeting: string;
  cost: number;
  cooldown: number;
  coefficient: number;
  flatBonus: number;
  tags: string[];
  effects: EffectDef[];
}

export interface AbilityInstance {
  def: AbilityDef;
  cooldownRemaining: number;
  rank: number;
}

export interface ItemDef {
  id: string;
  name: string;
  slot: string;
  baseStats: Stats;
  affixPools: string[];
  rarity: string;
  setId?: string;
}

export interface ItemInstance {
  def: ItemDef;
  rolledAffixes: StatModifiers[];
  durability: number;
}

export interface EffectDef {
  id: string;
  name: string;
  duration: number;
  stacks: number;
  tickRate: number;
  statMods: StatModifiers[];
  triggers: string[];
}

export interface LootTable {
  entries: LootEntry[];
}

export interface LootEntry {
  itemId: string;
  dropChance: number;
}

export interface CurveDef {
  id: string;
  values: number[];
}
