
import { Character, calculateAttackBonus } from './Character';
import { PartyMember } from './PartyMember';
import { Enemy } from './Enemy';
import { SPELLS, Spell } from './spells';

export interface CombatAction {
    type: 'Attack' | 'CastSpell' | 'UseSkill' | 'Defend' | 'Item' | 'Run' | 'BonusAction' | 'Reaction';
    actor: Character;
    target?: Character;
    skill?: string;
    spell?: string;
    damage?: number;
    result?: string;
    statusEffectsApplied?: string[];
    buffsApplied?: string[];
    debuffsApplied?: string[];
    itemUsed?: string;
    success?: boolean;
}

export interface Combatant {
    entity: PartyMember | Enemy;
    isPlayer: boolean;
    initiative: number;
    acted: boolean;
}

export interface BattleStateContext {
    party: PartyMember[];
    enemies: Enemy[];
    turnOrder: Combatant[];
    currentTurn: number;
    round: number;
    log: CombatAction[];
}

export function rollD20(): number {
    return Math.floor(Math.random() * 20) + 1;
}

export function rollInitiative(entity: PartyMember | Enemy): number {
    // D20 + AGI/DEX mod
    const agi = (entity as any).agility ?? 0;
    return rollD20() + Math.floor((agi - 10) / 2);
}

export function determineTurnOrder(party: PartyMember[], enemies: Enemy[]): Combatant[] {
    const combatants: Combatant[] = [
        ...party.map(p => ({ entity: p, isPlayer: true, initiative: rollInitiative(p), acted: false })),
        ...enemies.map(e => ({ entity: e, isPlayer: false, initiative: rollInitiative(e), acted: false })),
    ];
    combatants.sort((a, b) => b.initiative - a.initiative);
    return combatants;
}

export function startBattle(party: PartyMember[], enemies: Enemy[]): BattleStateContext {
    return {
        party,
        enemies,
        turnOrder: determineTurnOrder(party, enemies),
        currentTurn: 0,
        round: 1,
        log: [],
    };
}

export function nextTurn(ctx: BattleStateContext): void {
    ctx.currentTurn++;
    if (ctx.currentTurn >= ctx.turnOrder.length) {
        ctx.currentTurn = 0;
        ctx.round++;
        ctx.turnOrder.forEach(c => (c.acted = false));
    }
}

export function resolveAttack(attacker: Character, defender: Character, isProficient: boolean): CombatAction {
    const attackMod = attacker.modifiers?.[attacker.class.primaryAbilities[0]] ?? 0;
    const proficiency = attacker.proficiencyBonus ?? 0;
    const attackBonus = calculateAttackBonus(attackMod, proficiency, isProficient);
    const roll = rollD20();
    const total = roll + attackBonus;
    const crit = roll === 20;
    const miss = roll === 1;
    const ac = defender.armorClass ?? 10;
    let result: string;
    let damage = 0;
    let statusEffectsApplied: string[] = [];
    if (miss) {
        result = 'Miss';
    } else if (total >= ac) {
        damage = crit ? (attacker.class.hitDice.length * 2) : attacker.class.hitDice.length;
        result = crit ? 'Critical Hit' : 'Hit';
        // Example: 10% chance to apply a status effect on hit
        if (Math.random() < 0.1) {
            statusEffectsApplied.push('Stunned');
            applyStatusEffect(defender, 'Stunned');
        }
    } else {
        result = 'Miss';
    }
    return {
        type: 'Attack',
        actor: attacker,
        target: defender,
        damage,
        result,
        statusEffectsApplied,
    };
}

export function resolveSpell(attacker: Character, defender: Character, spellName: string, spellDC: number): CombatAction {
    const spell = SPELLS.find(s => s.name === spellName);
    const roll = rollD20();
    const saveMod = defender.modifiers?.[attacker.class.spellcastingAbility ?? 'INT'] ?? 0;
    const saveTotal = roll + saveMod;
    let result: string;
    let damage = 0;
    let statusEffectsApplied: string[] = [];
    if (saveTotal < spellDC) {
        damage = spell?.basePower ?? 10;
        result = 'Spell Hit';
        if (spell?.effects) {
            for (const eff of spell.effects) {
                applyStatusEffect(defender, eff);
                statusEffectsApplied.push(eff);
            }
        }
    } else {
        result = 'Resisted';
    }
    return {
        type: 'CastSpell',
        actor: attacker,
        target: defender,
        spell: spellName,
        damage,
        result,
        statusEffectsApplied,
    };
}

export function resolveSkill(attacker: Character, defender: Character, skillName: string): CombatAction {
    // Placeholder: skills could have custom logic, for now treat as attack with bonus
    let damage = (attacker.modifiers?.STR ?? 0) + 5;
    let result = 'Skill Hit';
    let statusEffectsApplied: string[] = [];
    // Example: skills can apply debuffs
    if (Math.random() < 0.2) {
        statusEffectsApplied.push('Weakened');
        applyStatusEffect(defender, 'Weakened');
    }
    return {
        type: 'UseSkill',
        actor: attacker,
        target: defender,
        skill: skillName,
        damage,
        result,
        statusEffectsApplied,
    };
}

export function resolveDefend(actor: Character): CombatAction {
    // Defend action: reduce damage taken next turn
    applyStatusEffect(actor, 'Defending');
    return {
        type: 'Defend',
        actor,
        result: 'Defending',
        statusEffectsApplied: ['Defending'],
    };
}

export function resolveItem(actor: Character, itemName: string, target?: Character): CombatAction {
    // Example: healing potion
    let result = '';
    let success = false;
    if (itemName === 'Healing Potion' && target) {
        target.currentHP = Math.min(target.maxHP, (target.currentHP ?? 0) + 30);
        result = 'Healed 30 HP';
        success = true;
    } else {
        result = 'Item had no effect';
    }
    return {
        type: 'Item',
        actor,
        target,
        itemUsed: itemName,
        result,
        success,
    };
}

export function resolveRun(actor: Character): CombatAction {
    // 50% chance to escape
    const success = Math.random() < 0.5;
    return {
        type: 'Run',
        actor,
        result: success ? 'Escaped!' : 'Could not escape!',
        success,
    };
}

export function applyStatusEffect(target: Character, effect: string) {
    if (!target.statusEffects) target.statusEffects = [];
    if (!target.statusEffects.includes(effect)) {
        target.statusEffects.push(effect);
    }
}

export function removeStatusEffect(target: Character, effect: string) {
    if (!target.statusEffects) return;
    target.statusEffects = target.statusEffects.filter(e => e !== effect);
}

// Buffs and debuffs (expand as needed)
export function applyBuff(target: Character, buff: string) {
    if (!target.buffs) target.buffs = [];
    if (!target.buffs.includes(buff)) target.buffs.push(buff);
}

export function removeBuff(target: Character, buff: string) {
    if (!target.buffs) return;
    target.buffs = target.buffs.filter(b => b !== buff);
}

export function applyDebuff(target: Character, debuff: string) {
    if (!target.debuffs) target.debuffs = [];
    if (!target.debuffs.includes(debuff)) target.debuffs.push(debuff);
}

export function removeDebuff(target: Character, debuff: string) {
    if (!target.debuffs) return;
    target.debuffs = target.debuffs.filter(d => d !== debuff);
}
