import { getProperty, TiledObject } from 'gtp';
import { PartyMember } from './PartyMember';
import { Direction } from './Direction';

/**
 * The hero is the main party member.
 */
export class Hero extends PartyMember {
    questStep: number = 0;
    skills: any[] = [];

    // --- Detailed Stats ---
    stats: {
        hp: number;
        maxHp: number;
        mp: number;
        maxMp: number;
        strength: number;
        agility: number;
        defense: number;
        luck: number;
        stamina: number;
        intelligence: number;
        faith: number;
        arcane: number;
        // Sub-stats
        critChance: number;
        critDamage: number;
        attackSpeed: number;
        movementSpeed: number;
        resistance: number;
        poise: number;
        equipLoad: number;
        // More as needed
    } = {
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
        equipLoad: 0
    };

    // --- Attributes ---
    attributes: {
        class: string;
        subClass: string;
        race: string;
        gender: string;
        origin: string;
        alignment: string;
        // Sub-attributes
        background: string;
        title: string;
        faction: string;
        // More as needed
    } = {
        class: 'Warrior',
        subClass: 'Knight',
        race: 'Human',
        gender: 'Male',
        origin: 'Limgrave',
        alignment: 'Neutral',
        background: '',
        title: '',
        faction: ''
    };

    // --- Buffs and Debuffs ---
    buffs: Array<{ name: string; effect: string; duration: number }> = [];
    debuffs: Array<{ name: string; effect: string; duration: number }> = [];

    // --- Other Detailed Info ---
    info: {
        biography: string;
        achievements: string[];
        reputation: number;
        fame: number;
        karma: number;
        // More as needed
    } = {
        biography: '',
        achievements: [],
        reputation: 0,
        fame: 0,
        karma: 0
    };

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
