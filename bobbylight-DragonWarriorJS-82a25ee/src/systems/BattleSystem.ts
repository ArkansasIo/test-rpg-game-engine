import type { BattleCommand, Monster, PartyMember } from '../types/RpgTypes';

export interface BattleState {
    party: PartyMember[];
    enemies: Monster[];
    turn: number;
    log: string[];
    finished: boolean;
    winner: 'party' | 'enemies' | 'none';
}

export class BattleSystem {

    public startBattle(party: PartyMember[], enemies: Monster[]): BattleState {
        return {
            party: party.map((member) => ({
                ...member,
                stats: { ...member.stats },
            })),
            enemies: enemies.map((enemy) => ({
                ...enemy,
                stats: { ...enemy.stats },
            })),
            turn: 1,
            log: [ 'A monster draws near!' ],
            finished: false,
            winner: 'none',
        };
    }

    public resolveCommand(state: BattleState, command: BattleCommand, rng: () => number = Math.random): BattleState {

        if (state.finished) {
            return state;
        }

        switch (command.type) {
            case 'attack':
                this.resolveAttack(state, command, rng);
                break;
            case 'spell':
                state.log.push(`${command.actorId} casts ${command.spellId ?? 'a spell'}.`);
                break;
            case 'item':
                state.log.push(`${command.actorId} uses ${command.itemId ?? 'an item'}.`);
                break;
            case 'run': {
                const escaped = rng() < 0.5;
                state.log.push(escaped ? 'You escaped successfully.' : 'Cannot escape!');
                if (escaped) {
                    state.finished = true;
                    state.winner = 'none';
                }
                break;
            }
            default:
                state.log.push('Nothing happens.');
                break;
        }

        this.finishTurn(state);
        return state;
    }

    private resolveAttack(state: BattleState, command: BattleCommand, rng: () => number): void {

        const attacker = state.party.find((member) => member.id === command.actorId);
        if (!attacker || attacker.stats.hp <= 0) {
            state.log.push(`${command.actorId} cannot act.`);
            return;
        }

        const target = state.enemies.find((enemy) => enemy.id === command.targetId) ??
            state.enemies.find((enemy) => enemy.stats.hp > 0);
        if (!target) {
            state.log.push('No valid target.');
            return;
        }

        const base = Math.max(1, attacker.stats.str - Math.floor(target.stats.vit / 2));
        const swing = Math.floor(rng() * 4);
        const damage = Math.max(1, base + swing);

        target.stats.hp = Math.max(0, target.stats.hp - damage);
        state.log.push(`${attacker.name} attacks ${target.name} for ${damage} damage.`);
        if (target.stats.hp === 0) {
            state.log.push(`${target.name} is defeated.`);
        }
    }

    private finishTurn(state: BattleState): void {

        const allEnemiesDown = state.enemies.every((enemy) => enemy.stats.hp <= 0);
        const allPartyDown = state.party.every((member) => member.stats.hp <= 0);

        if (allEnemiesDown) {
            state.finished = true;
            state.winner = 'party';
            state.log.push('Victory!');
            return;
        }

        if (allPartyDown) {
            state.finished = true;
            state.winner = 'enemies';
            state.log.push('Thou hast died.');
            return;
        }

        state.turn++;
    }
}
