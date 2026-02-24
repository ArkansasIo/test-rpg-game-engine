export function startBossFight(boss, playerStats) {
    let playerHP = playerStats.HP || 100;
    let bossHP = boss.hp;
    while (playerHP > 0 && bossHP > 0) {
        bossHP -= Math.max((playerStats.attack || 10) - boss.defense, 1);
        if (bossHP <= 0)
            break;
        playerHP -= Math.max(boss.attack - (playerStats.defense || 5), 1);
    }
    return playerHP > 0 ? `Victory! Reward: ${boss.reward}` : 'Defeat! Try again.';
}
//# sourceMappingURL=BossFightLogic.js.map