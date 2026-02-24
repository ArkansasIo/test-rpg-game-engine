import type { MonsterPack, TileKind } from '../types/RpgTypes';

export interface EncounterEntry {
    pack: MonsterPack;
    weight: number;
}

export interface EncounterTable {
    tileKind: TileKind;
    chance: number;
    entries: EncounterEntry[];
}

export class EncounterSystem {

    private readonly tablesByTile: Map<TileKind, EncounterTable>;

    public constructor(tables: EncounterTable[]) {
        this.tablesByTile = new Map(tables.map((table) => [ table.tileKind, table ]));
    }

    public roll(tileKind: TileKind, rng: () => number = Math.random): MonsterPack | null {

        const table = this.tablesByTile.get(tileKind);
        if (!table) {
            return null;
        }

        if (rng() >= table.chance) {
            return null;
        }

        const totalWeight = table.entries.reduce((sum, entry) => sum + entry.weight, 0);
        if (totalWeight <= 0) {
            return null;
        }

        let roll = rng() * totalWeight;
        for (const entry of table.entries) {
            roll -= entry.weight;
            if (roll <= 0) {
                return entry.pack;
            }
        }

        return table.entries[table.entries.length - 1]?.pack ?? null;
    }
}
