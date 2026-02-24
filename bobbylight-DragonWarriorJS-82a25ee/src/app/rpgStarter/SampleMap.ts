import { RpgMapSystem } from '../../systems/RpgMapSystem';
import type { TileDefinition } from '../../types/RpgTypes';

const TILE: Record<string, TileDefinition> = {
    grass: { kind: 'grass', walkable: true, encounterWeight: 1 },
    forest: { kind: 'forest', walkable: true, encounterWeight: 3 },
    wall: { kind: 'wall', walkable: false, encounterWeight: 0 },
    water: { kind: 'water', walkable: false, encounterWeight: 0 },
    doorClosed: { kind: 'door', walkable: false, encounterWeight: 0, scriptId: 'door_locked' },
    chestClosed: { kind: 'chest', walkable: false, encounterWeight: 0, scriptId: 'chest_closed' },
    road: { kind: 'road', walkable: true, encounterWeight: 0 },
};

export function createSampleMap(): RpgMapSystem {

    const map = new RpgMapSystem(20, 15, TILE.grass, 50);

    for (let y = 0; y < map.height; y++) {
        for (let x = 0; x < map.width; x++) {
            if (x === 0 || y === 0 || x === map.width - 1 || y === map.height - 1) {
                map.setBaseTile(x, y, TILE.wall);
                continue;
            }

            if (x >= 12 && y >= 4 && y <= 10) {
                map.setBaseTile(x, y, TILE.water);
                continue;
            }

            if (x >= 3 && x <= 8 && y >= 8 && y <= 12) {
                map.setBaseTile(x, y, TILE.forest);
                continue;
            }

            map.setBaseTile(x, y, TILE.grass);
        }
    }

    for (let x = 1; x < map.width - 1; x++) {
        map.setBaseTile(x, 7, TILE.road);
    }

    map.setBaseTile(10, 7, TILE.doorClosed);
    map.setBaseTile(6, 10, TILE.chestClosed);
    return map;
}
