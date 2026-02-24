// eldenRingMapData.ts
// Imports and exports all Elden Ring map JSON data for use in game logic

import zones from '../../public/res/maps/eldenRing/zones.json';
import dungeons from '../../public/res/maps/eldenRing/dungeons.json';
import biomes from '../../public/res/maps/eldenRing/biomes.json';
import tileTypes from '../../public/res/maps/eldenRing/tileTypes.json';
import zoneTiles from '../../public/res/maps/eldenRing/zoneTiles.json';

export const eldenRingMapData = {
  zones: zones.zones,
  dungeons: dungeons.dungeons,
  biomes: biomes.biomes,
  tileTypes: tileTypes.tileTypes,
  zoneTiles: zoneTiles.zoneTiles
};
