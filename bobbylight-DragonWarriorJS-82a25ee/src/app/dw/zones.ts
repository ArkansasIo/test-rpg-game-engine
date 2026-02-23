// Data structure for zones, biomes, and sub-biomes
// This is a scalable, data-driven approach for 72+ zones, biomes, and subtypes

export interface SubBiome {
    name: string;
    type: string; // e.g. 'forest', 'swamp', etc.
    subTypes?: string[];
}

export interface Biome {
    name: string;
    class: string; // e.g. 'land', 'water', 'mountain', etc.
    subBiomes: SubBiome[];
}

export interface Zone {
    id: number;
    name: string;
    biome: Biome;
    regionType: string; // e.g. 'overworld', 'dungeon', etc.
    class: string; // e.g. 'starter', 'advanced', etc.
    subClass?: string;
    subTypes?: string[];
}

// Example: Add more entries as needed for 72+ zones
export const ZONES: Zone[] = [
    {
        id: 1,
        name: 'Greenfields',
        biome: {
            name: 'Plains',
            class: 'land',
            subBiomes: [
                { name: 'Rolling Hills', type: 'grassland' },
                { name: 'Wildflower Meadow', type: 'meadow', subTypes: ['flowers', 'bees'] }
            ]
        },
        regionType: 'overworld',
        class: 'starter',
        subClass: 'safe',
        subTypes: ['open', 'sunny']
    },
    {
        id: 2,
        name: 'Shadowmire',
        biome: {
            name: 'Swamp',
            class: 'land',
            subBiomes: [
                { name: 'Bog', type: 'wetland' },
                { name: 'Haunted Fen', type: 'marsh', subTypes: ['ghosts', 'fog'] }
            ]
        },
        regionType: 'overworld',
        class: 'advanced',
        subClass: 'dangerous',
        subTypes: ['dark', 'wet']
    }
    // ... Add up to 72+ zones here
];
