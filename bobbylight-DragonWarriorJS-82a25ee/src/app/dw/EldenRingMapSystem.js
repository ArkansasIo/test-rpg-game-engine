// EldenRingMapSystem.ts
// Detailed map system for Elden Ring zones, features, and game logic
export function getZoneFeatures(zoneName, allFeatures) {
    return allFeatures.filter(f => f.zone === zoneName);
}
export function getFeatureAtPosition(zone, x, y) {
    return zone.features.find(f => f.x === x && f.y === y);
}
export function addFeatureToZone(zone, feature) {
    zone.features.push(feature);
}
export function removeFeatureFromZone(zone, featureName) {
    zone.features = zone.features.filter(f => f.name !== featureName);
}
export function getBiomeTransition(zone) {
    return zone.features.filter(f => f.type === 'BiomeTransition');
}
export function getSitesOfGrace(zone) {
    return zone.features.filter(f => f.type === 'SiteOfGrace');
}
export function getDungeons(zone) {
    return zone.features.filter(f => f.type === 'Dungeon');
}
export function getBosses(zone) {
    return zone.features.filter(f => f.type === 'Boss');
}
export function getLandmarks(zone) {
    return zone.features.filter(f => f.type === 'Landmark');
}
//# sourceMappingURL=EldenRingMapSystem.js.map