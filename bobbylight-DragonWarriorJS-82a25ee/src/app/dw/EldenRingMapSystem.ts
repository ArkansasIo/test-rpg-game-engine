// EldenRingMapSystem.ts
// Detailed map system for Elden Ring zones, features, and game logic

export interface MapFeature {
    name: string;
    type: 'SiteOfGrace' | 'Dungeon' | 'Boss' | 'Merchant' | 'NPC' | 'Treasure' | 'EnemyCamp' | 'Landmark' | 'BiomeTransition';
    zone: string;
    x: number;
    y: number;
    description?: string;
    icon?: string;
}

export interface EldenRingMap {
    zone: string;
    biome: string;
    tiles: Array<{ type: string; x: number; y: number }>;
    features: MapFeature[];
}

export function getZoneFeatures(zoneName: string, allFeatures: MapFeature[]): MapFeature[] {
    return allFeatures.filter(f => f.zone === zoneName);
}

export function getFeatureAtPosition(zone: EldenRingMap, x: number, y: number): MapFeature | undefined {
    return zone.features.find(f => f.x === x && f.y === y);
}

export function addFeatureToZone(zone: EldenRingMap, feature: MapFeature): void {
    zone.features.push(feature);
}

export function removeFeatureFromZone(zone: EldenRingMap, featureName: string): void {
    zone.features = zone.features.filter(f => f.name !== featureName);
}

export function getBiomeTransition(zone: EldenRingMap): MapFeature[] {
    return zone.features.filter(f => f.type === 'BiomeTransition');
}

export function getSitesOfGrace(zone: EldenRingMap): MapFeature[] {
    return zone.features.filter(f => f.type === 'SiteOfGrace');
}

export function getDungeons(zone: EldenRingMap): MapFeature[] {
    return zone.features.filter(f => f.type === 'Dungeon');
}

export function getBosses(zone: EldenRingMap): MapFeature[] {
    return zone.features.filter(f => f.type === 'Boss');
}

export function getLandmarks(zone: EldenRingMap): MapFeature[] {
    return zone.features.filter(f => f.type === 'Landmark');
}
