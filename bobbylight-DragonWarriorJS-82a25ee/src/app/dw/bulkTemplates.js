// Template for bulk generation of zones, monsters, weapons, armor, and items
// Use this as a script or reference for expanding your data
// Removed unused imports
// Example: Generate 72 zones with placeholder data
export function generateZones(count) {
    return Array.from({ length: count }, (unusedValue, i) => ({
        id: i + 1,
        name: `Zone ${i + 1}`,
        biome: {
            name: `Biome ${i % 10 + 1}`,
            class: 'land',
            subBiomes: [
                { name: `SubBiome ${i % 5 + 1}`, type: 'generic' },
            ],
        },
        regionType: 'overworld',
        class: 'starter',
        subClass: 'safe',
        subTypes: ['open'],
    }));
}
// Example: Generate 350 monsters with placeholder data
export function generateMonsters(count) {
    return Array.from({ length: count }, (unusedValue, i) => ({
        id: i + 1,
        name: `Monster ${i + 1}`,
        class: 'beast',
        zoneIds: [i % 72 + 1],
        level: i % 50 + 1,
        hp: 10 + i,
        attack: 2 + i % 10,
        defense: 1 + i % 8,
    }));
}
// Similar functions can be made for weapons, armor, and items
// Usage example (in a script or dev tool):
// const zones = generateZones(72);
// const monsters = generateMonsters(350);
//# sourceMappingURL=bulkTemplates.js.map