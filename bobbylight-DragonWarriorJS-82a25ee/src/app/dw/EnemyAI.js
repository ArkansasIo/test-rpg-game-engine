import { Utils } from 'gtp';
const aiMap = {};
aiMap.attackOnly = (hero, enemy) => {
    return { type: 'physical', damage: enemy.computePhysicalAttackDamage(hero) };
};
aiMap.halfHurtHalfAttack = (hero, enemy) => {
    const useHurt = Utils.randomInt(0, 2) === 0;
    if (useHurt) {
        return { type: 'magic', spellName: 'HURT', damage: enemy.computeHurtSpellDamage(hero) };
    }
    return { type: 'physical', damage: enemy.computePhysicalAttackDamage(hero) };
};
export const getEnemyAi = (id) => {
    if (aiMap[id]) {
        return aiMap[id];
    }
    console.error('Unknown EnemyAI: ' + id + '. Falling back on attackOnly');
    return aiMap.attackOnly;
};
//# sourceMappingURL=EnemyAI.js.map