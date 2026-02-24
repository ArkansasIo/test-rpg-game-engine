import { getProperty } from 'gtp';
import { PartyMember } from './PartyMember';
import { Direction } from './Direction';
/**
 * The hero is the main party member.
 */
export class Hero extends PartyMember {
    constructor() {
        super(...arguments);
        this.questStep = 0;
        this.skills = [];
        // --- Detailed Stats ---
        this.stats = {
            hp: 0,
            maxHp: 0,
            mp: 0,
            maxMp: 0,
            strength: 0,
            agility: 0,
            defense: 0,
            luck: 0,
            stamina: 0,
            intelligence: 0,
            faith: 0,
            arcane: 0,
            critChance: 0,
            critDamage: 0,
            attackSpeed: 0,
            movementSpeed: 0,
            resistance: 0,
            poise: 0,
            equipLoad: 0,
        };
        // --- Attributes ---
        this.attributes = {
            class: 'Warrior',
            subClass: 'Knight',
            race: 'Human',
            gender: 'Male',
            origin: 'Limgrave',
            alignment: 'Neutral',
            background: '',
            title: '',
            faction: '',
        };
        // --- Buffs and Debuffs ---
        this.buffs = [];
        this.debuffs = [];
        // --- Other Detailed Info ---
        this.info = {
            biography: '',
            achievements: [],
            reputation: 0,
            fame: 0,
            karma: 0,
        };
    }
    // Set procedural asset as hero sprite
    setProceduralSprite(pngUrl) {
        this.proceduralSprite = pngUrl;
        // Optionally trigger redraw or update
    }
    /**
     * Overridden to check for warps and other interesting things we can
     * intersect on the map.
     */
    handleIntersectedObject(obj) {
        if ('warp' === obj.type) {
            const newRow = parseInt(getProperty(obj, 'row'), 10);
            const newCol = parseInt(getProperty(obj, 'col'), 10);
            const newDir = Direction.fromString(getProperty(obj, 'dir', 'SOUTH'));
            this.game.loadMap(getProperty(obj, 'map'), newRow, newCol, newDir);
        }
        else if ('insideOutside' === obj.type) {
            this.game.setInsideOutside(getProperty(obj, 'inside') === 'true');
        }
    }
}
// Optionally override or extend talent/level system for Hero
// Example: custom talent tree or level progression
// constructor(game: DwGame, args: PartyMemberArgs) {
//     super(game, args);
//     // this.talentTree = ...
// }
Hero.stepInc = 0;
//# sourceMappingURL=Hero.js.map