import { AbstractMapLogic } from './AbstractMapLogic';
const talks = {
    merchant1: (game) => {
        return {
            conversationType: 'merchant',
            choices: ['bambooPole', 'club', 'copperSword'],
            introText: 'We deal in weapons and armor.\nDost thou wish to buy anything today?',
        };
    },
};
/**
 * Logic for Garinham.
 */
export class Garinham extends AbstractMapLogic {
    constructor() {
        super(talks);
    }
}
//# sourceMappingURL=garinham.js.map