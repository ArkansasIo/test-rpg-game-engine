import { Utils } from 'gtp';
import { Hero } from '@/app/dw/Hero';
const healSpell = {
    name: 'HEAL',
    cost: 4,
    cast(caster, target) {
        const healAmount = Utils.randomInt(10, 18);
        caster.hp = Math.min(caster.hp + healAmount, caster.maxHp);
        return {};
    },
};
const hurtSpell = {
    name: 'HURT',
    cost: 2,
    cast(caster, target) {
        var _a, _b;
        // Player casts Hurt outside of battle
        if (!target) {
            return {
                conversationSegments: [
                    {
                        text: 'But nothing happened.',
                    },
                ],
            };
        }
        let damage = 0;
        let targetDescription = 'Thy';
        if (target instanceof Hero) {
            let min;
            let max;
            if (((_a = target.armor) === null || _a === void 0 ? void 0 : _a.name) === 'magicArmor' || ((_b = target.armor) === null || _b === void 0 ? void 0 : _b.name) === 'erdricksArmor') {
                min = 2;
                max = 6;
            }
            else {
                min = 3;
                max = 10;
            }
            damage = Utils.randomInt(min, max + 1);
        }
        else {
            damage = Utils.randomInt(5, 13);
            targetDescription = `The ${target.name}'s`;
        }
        target.takeDamage(damage);
        return {
            conversationSegments: [
                {
                    text: `${targetDescription} Hit Points have been reduced by ${damage}.`,
                },
            ],
        };
    },
};
export { healSpell, hurtSpell };
//# sourceMappingURL=Spell.js.map