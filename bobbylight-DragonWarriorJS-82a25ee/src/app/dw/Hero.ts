import { getProperty, TiledObject } from 'gtp';
import { PartyMember } from './PartyMember';
import { Direction } from './Direction';

/**
 * The hero is the main party member.
 */
export class Hero extends PartyMember {

    // Optionally override or extend talent/level system for Hero
    // Example: custom talent tree or level progression
    // constructor(game: DwGame, args: PartyMemberArgs) {
    //     super(game, args);
    //     // this.talentTree = ...
    // }

    static stepInc = 0;

    /**
     * Overridden to check for warps and other interesting things we can
     * intersect on the map.
     */
    override handleIntersectedObject(obj: TiledObject) {
        if ('warp' === obj.type) {
            const newRow: number = parseInt(getProperty(obj, 'row'), 10);
            const newCol: number = parseInt(getProperty(obj, 'col'), 10);
            const newDir: number = Direction.fromString(getProperty(obj, 'dir', 'SOUTH'));
            this.game.loadMap(getProperty(obj, 'map'), newRow, newCol, newDir);
        } else if ('insideOutside' === obj.type) {
            this.game.setInsideOutside(getProperty(obj, 'inside') === 'true');
        }
    }
}
