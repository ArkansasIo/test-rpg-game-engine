export class BattleSystem {
    startBattle(party, enemies) {
        return {
            party: party.map((member) => (Object.assign(Object.assign({}, member), { stats: Object.assign({}, member.stats) }))),
            enemies: enemies.map((enemy) => (Object.assign(Object.assign({}, enemy), { stats: Object.assign({}, enemy.stats) }))),
            turn: 1,
            log: ['A monster draws near!'],
            finished: false,
            winner: 'none',
        };
    }
    resolveCommand(state, command, rng = Math.random) {
        var _a, _b;
        if (state.finished) {
            return state;
        }
        switch (command.type) {
            case 'attack':
                this.resolveAttack(state, command, rng);
                break;
            case 'spell':
                state.log.push(`${command.actorId} casts ${(_a = command.spellId) !== null && _a !== void 0 ? _a : 'a spell'}.`);
                break;
            case 'item':
                state.log.push(`${command.actorId} uses ${(_b = command.itemId) !== null && _b !== void 0 ? _b : 'an item'}.`);
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
    resolveAttack(state, command, rng) {
        var _a;
        const attacker = state.party.find((member) => member.id === command.actorId);
        if (!attacker || attacker.stats.hp <= 0) {
            state.log.push(`${command.actorId} cannot act.`);
            return;
        }
        const target = (_a = state.enemies.find((enemy) => enemy.id === command.targetId)) !== null && _a !== void 0 ? _a : state.enemies.find((enemy) => enemy.stats.hp > 0);
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
    finishTurn(state) {
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
//# sourceMappingURL=BattleSystem.js.map