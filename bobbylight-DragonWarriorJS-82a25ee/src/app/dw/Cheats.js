import { Direction } from './Direction';
import { ChoiceBubble } from './ChoiceBubble';
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Cheats {
    static createCheatBubble(game) {
        const tileSize = game.getTileSize();
        const w = game.getWidth() - 4 * tileSize;
        const h = 9 * tileSize;
        const x = (game.getWidth() - w) / 2;
        const y = (game.getHeight() - h) / 2;
        const choices = [
            '9999 Gold',
            'Level Up',
            'Weapon Change',
            'Armor Change',
            'Shield Change',
            'Max HP/MP',
            'Min HP/MP',
        ];
        return new ChoiceBubble(game, x, y, w, h, choices, undefined, true);
    }
    static createWarpBubble(game) {
        const tileSize = game.getTileSize();
        const w = game.getWidth() - 4 * tileSize;
        const h = 7 * tileSize;
        const x = (game.getWidth() - w) / 2;
        const y = (game.getHeight() - h) / 2;
        const choices = [
            'Brecconary',
            'Tantegel (1st floor)',
            'Tantegel (throne room)',
            'Garinham',
            'Erdrick\'s Cave',
            'Far Reaches',
        ];
        return new ChoiceBubble(game, x, y, w, h, choices, undefined, true);
    }
    static warp(game, location) {
        switch (location) {
            case 'Brecconary':
                Cheats.warpTo(game, 'brecconary', 15, 2, 'Brecconary', Direction.EAST);
                break;
            case 'Tantegel (1st floor)':
                Cheats.warpTo(game, 'tantegelCastle', 15, 7, 'Tantegel Castle', Direction.WEST);
                break;
            case 'Tantegel (throne room)':
                Cheats.warpTo(game, 'tantegelCastleUpstairs', 11, 10, 'the King at Tantegel Castle', Direction.WEST);
                break;
            case 'Garinham':
                Cheats.warpTo(game, 'garinham', 14, 1, 'Garinham');
                break;
            case 'Erdrick\'s Cave':
                Cheats.warpTo(game, 'erdricksCave1', 1, 1, 'Erdrick\'s Cave');
                break;
            case 'Far Reaches':
                Cheats.warpTo(game, 'overworld', 46, 85, 'Overworld');
                break;
        }
    }
    static warpTo(game, mapName, row, col, desc, dir = Direction.SOUTH) {
        game.loadMap(mapName, row, col, dir);
        game.setStatusMessage(`Warping to ${desc}...`);
    }
}
//# sourceMappingURL=Cheats.js.map