// Data structure for zones, biomes, and sub-biomes
// This is a scalable, data-driven approach for 72+ zones, biomes, and subtypes
import { eldenZones } from './eldenRingContent';
// Example: Add more entries as needed for 72+ zones
export const ZONES = [
    {
        id: 1,
        name: 'Greenfields',
        biome: {
            name: 'Plains',
            class: 'land',
            subBiomes: [
                { name: 'Rolling Hills', type: 'grassland' },
                { name: 'Wildflower Meadow', type: 'meadow', subTypes: ['flowers', 'bees'] },
            ],
        },
        regionType: 'overworld',
        class: 'starter',
        subClass: 'safe',
        subTypes: ['open', 'sunny'],
    },
    {
        id: 2,
        name: 'Shadowmire',
        biome: {
            name: 'Swamp',
            class: 'land',
            subBiomes: [
                { name: 'Bog', type: 'wetland' },
                { name: 'Haunted Fen', type: 'marsh', subTypes: ['ghosts', 'fog'] },
            ],
        },
        regionType: 'overworld',
        class: 'advanced',
        subClass: 'dangerous',
        subTypes: ['dark', 'wet'],
    },
    // ... Add up to 72+ zones here
];
export const ELDEN_ZONES = eldenZones.map((zone) => {
    return {
        id: 10000 + zone.id,
        name: zone.name,
        biome: {
            name: zone.biome,
            class: zone.zoneClass,
            subBiomes: [
                { name: `${zone.name} Subregion`, type: zone.biome },
            ],
        },
        regionType: zone.source,
        class: zone.zoneClass,
        subClass: zone.source,
        subTypes: [zone.biome],
    };
});
//# sourceMappingURL=zones.js.map