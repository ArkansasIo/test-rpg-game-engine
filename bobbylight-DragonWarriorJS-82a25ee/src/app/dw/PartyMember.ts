import { SpriteSheet, TiledLayer, TiledObject, Utils } from 'gtp';
import { RoamingEntity,RoamingEntityArgs } from './RoamingEntity';
import { Hero } from './Hero';
import { Direction } from './Direction';
import { Shield } from './Shield';
import { Weapon } from './Weapon';
import { Armor } from './Armor';
import { Enemy } from './Enemy';
import { DwGame } from './DwGame';
import { Spell } from '@/app/dw/Spell';

export interface PartyMemberArgs extends RoamingEntityArgs {
    hp?: number;
    maxHp?: number;
    mp?: number;
    maxMp?: number;
}

export class PartyMember extends RoamingEntity {

    /**
     * Equip a weapon, returning the previously equipped weapon (if any).
     */
    equipWeapon(weapon: Weapon): Weapon | undefined {
        const prev = this.weapon;
        this.weapon = weapon;
        this.onEquipmentChanged();
        return prev;
    }

    /**
     * Unequip the current weapon, returning it (if any).
     */
    unequipWeapon(): Weapon | undefined {
        const prev = this.weapon;
        this.weapon = undefined;
        this.onEquipmentChanged();
        return prev;
    }

    /**
     * Equip armor, returning the previously equipped armor (if any).
     */
    equipArmor(armor: Armor): Armor | undefined {
        const prev = this.armor;
        this.armor = armor;
        this.onEquipmentChanged();
        return prev;
    }

    /**
     * Unequip the current armor, returning it (if any).
     */
    unequipArmor(): Armor | undefined {
        const prev = this.armor;
        this.armor = undefined;
        this.onEquipmentChanged();
        return prev;
    }

    /**
     * Equip a shield, returning the previously equipped shield (if any).
     */
    equipShield(shield: Shield): Shield | undefined {
        const prev = this.shield;
        this.shield = shield;
        this.onEquipmentChanged();
        return prev;
    }

    /**
     * Unequip the current shield, returning it (if any).
     */
    unequipShield(): Shield | undefined {
        const prev = this.shield;
        this.shield = undefined;
        this.onEquipmentChanged();
        return prev;
    }
    /**
     * Called after any equipment change to update stats/UI if needed.
     */
    onEquipmentChanged() {
        // Placeholder for stat recalculation, UI update, etc.
        // In this game, stats are derived live from equipment, so this is a hook for future use.
        // Could trigger UI refresh, recalculate derived stats, etc.
    }

    hp = 0;
    maxHp = 0;
    mp = 0;
    maxMp = 0;
    level = 1;
    exp = 0;
    strength = 0;
    agility = 0;
    weapon?: Weapon;
    armor?: Armor;
    shield?: Shield;
    readonly spells: Spell[] = [];

    // --- Talent Tree and Level System ---
    talentPoints = 0;
    talentTree?: import('./entities').TalentTree;
    talents: Record<string, number> = {};
    levelProgression: import('./entities').LevelProgression[] = [];
    maxLevel = 150;

    constructor(game: DwGame, args: PartyMemberArgs) {

        super(game, args);
        this.level = 1;
        this.exp = 12345;

        // Example: initialize level progression (should be loaded from data)
        this.levelProgression = Array.from({ length: this.maxLevel }, (unusedValue, i) => ({
            level: i + 1,
            expRequired: 100 + i * 50,
            statGains: {
                hp: 5 + Math.floor(i / 2),
                mp: i % 2 === 0 ? 2 : 1,
                strength: 1 + Math.floor(i / 5),
                agility: 1 + Math.floor(i / 7),
            },
        }));

        // Example: initialize empty talent tree (should be loaded from data)
        this.talentTree = {
            id: 'default',
            name: 'Default Talent Tree',
            nodes: {},
        };
    }

    /**
     * Gain experience and handle level up, rewards, and notifications.
     */
    gainExp(amount: number) {
        this.exp += amount;
        let leveledUp = false;
        while (this.level < this.maxLevel && this.exp >= this.levelProgression[this.level - 1].expRequired) {
            this.levelUp();
            leveledUp = true;
        }
        if (leveledUp) {
            this.onLevelUp();
        }
    }

    /**
     * Called after a level up for rewards, new skills, etc.
     */
    onLevelUp() {
        // Example: grant new skill or spell every 5 levels
        if (this.level % 5 === 0) {
            // this.learnSkillOrSpell();
            this.game.setStatusMessage(`${this.name} learned a new skill!`);
        }
        // TODO: Add more hooks for rewards, UI, etc.
    }

    /**
     * Share experience with the whole party (call from battle/quest logic).
     */
    static shareExp(party: PartyMember[], amount: number) {
        const share = Math.floor(amount / party.length);
        for (const member of party) {
            member.gainExp(share);
        }
    }

    levelUp() {
        if (this.level >= this.maxLevel) return;
        this.level++;
        const gains = this.levelProgression[this.level - 1].statGains;
        if (gains.hp) this.maxHp += gains.hp;
        if (gains.mp) this.maxMp += gains.mp;
        if (gains.strength) this.strength += gains.strength;
        if (gains.agility) this.agility += gains.agility;
        this.hp = this.maxHp;
        this.mp = this.maxMp;
        this.talentPoints++;

        const heroName = this.name.length > 0 ? this.name : 'Hero';
        this.game.setStatusMessage(`${heroName} reached level ${this.level}!`);
    }

    learnTalent(nodeId: string) {
        if (!this.talentTree) return false;
        const node = this.talentTree.nodes[nodeId];
        if (!node) return false;
        if (this.talentPoints <= 0) return false;
        if (this.talents[nodeId] === node.maxRank) return false;
        // Prerequisite check (simple)
        if (node.prerequisites && !node.prerequisites.every((pid) => (this.talents[pid] ?? 0) === (this.talentTree!.nodes[pid]?.maxRank ?? 0))) return false;
        this.talents[nodeId] = (this.talents[nodeId] ?? 0) + 1;
        this.talentPoints--;
        // TODO: Apply talent effects
        return true;
    }

    computePhysicalAttackDamage(enemy: Enemy) {

        const strength: number = this.getStrength();
        let min: number;
        let max: number;

        if (/*!enemy.cannotBeExcellentMoved &&*/ PartyMember.getPerformExcellentMove()) {
            min = Math.floor(strength / 2);
            max = this.strength;
        } else {
            const temp: number = strength - enemy.agility / 2;
            min = Math.floor(temp / 4);
            max = Math.floor(temp / 2);
        }

        let damage: number = Utils.randomInt(min, max + 1);
        if (damage < 1) {
            damage = Utils.randomInt(0, 2) === 0 ? 1 : 0;
        }
        return damage;
    }

    getDefense() {
        let defense: number = Math.floor(this.agility / 2);
        if (this.armor) {
            defense += this.armor.defense;
        }
        if (this.shield) {
            defense += this.shield.defense;
        }
        return defense;
    }

    private static getPerformExcellentMove(): boolean {
        return Utils.randomInt(0, 32) === 0;
    }

    getStrength(): number {
        return this.strength + (this.weapon ? this.weapon.power : 0);
    }

    /**
     * Called when this entity intersects an object on the map.  The default
     * implementation does nothing; subclasses can override.
     */
    handleIntersectedObject(obj: TiledObject) {
        // Do nothing
    }

    update(delta: number) {

        this.stepTick += delta;
        if (this.stepTick >= 600) {
            this.stepTick -= 600;
            Hero.stepInc = 0;
        } else if (this.stepTick >= 300) {
            Hero.stepInc = 1;
        }

        this.handleIsMovingInUpdate();

    }

    render(ctx: CanvasRenderingContext2D) {

        const tileSize: number = this.game.getTileSize();

        const ssRow = 0;
        let ssCol = 0;
        switch (this.direction) {
            case Direction.NORTH:
                ssCol = 4;
                break;
            case Direction.SOUTH:
                //ssCol = 0;
                break;
            case Direction.EAST:
                ssCol = 6;
                break;
            case Direction.WEST:
                ssCol = 2;
                break;
        }
        ssCol += Hero.stepInc;

        const x: number = (this.game.canvas.width - tileSize) / 2;
        const y: number = (this.game.canvas.height - tileSize) / 2;
        const spriteSheet: SpriteSheet = this.game.assets.get('hero');
        spriteSheet.drawSprite(ctx, x, y, ssRow, ssCol);

    }

    override handlePostMove() {
        // If we didn't e.g. move to another map, see if we should fight a monster
        if (!this.possiblyHandleIntersectedObject()) {
            this.possiblyStartRandomEncounter();
        }
    }

    /**
     * Adds HP to this entity's total, making sure to not exceed its maximum
     * HP value.  The inverse of this method is <code>takeDamage</code>.
     *
     * @param amount The amount of HP to add.
     * @return Whether this entity is dead (has 0 HP).  This will
     *         only be possible if you pass a negative value to this method.
     * @see takeDamage
     */
    incHp(amount: number) {
        this.hp = Math.min(this.hp + amount, this.maxHp);
        this.hp = Math.max(0, this.hp);
        return this.isDead();
    }

    isDead(): boolean {
        return this.hp <= 0;
    }

    /**
     * Verifies whether the party member is intersecting an object in the Tiled
     * map, and if so, handles that intersection.
     *
     * @return Whether an object was intersected.
     */
    possiblyHandleIntersectedObject(): boolean {

        // See if we're supposed to warp to another map
        const warpLayer: TiledLayer = this.game.getMap().getLayer('warpLayer');
        const tileSize: number = this.game.getTileSize();
        const x: number = this.mapCol * tileSize;
        const y: number = this.mapRow * tileSize;

        const obj: TiledObject | undefined = warpLayer.getObjectIntersecting(x, y, tileSize, tileSize);
        if (obj) {
            this.handleIntersectedObject(obj);
            return true;
        }

        return false;
    }

    private possiblyStartRandomEncounter() {
        if (this.game.randomInt(20) === 0) {
            this.game.startRandomEncounter();
        }
    }

    /**
     * Replenishes the HP and MP of this party member.
     */
    replenishHealthAndMagic() {
        this.hp = this.maxHp;
        this.mp = this.maxMp;
    }

    /**
     * Subtracts HP from this entity's current amount.  This is the inverse
     * of <code>incHp</code>.
     *
     * @param amount The amount of hit points to deduct.
     * @return Whether this entity is dead (has 0 HP).
     * @see incHp
     */
    takeDamage(amount: number) {
        this.incHp(-amount);
    }
}
