import { AbstractMapLogic } from './AbstractMapLogic';
const talks = {
    npc: (game) => {
        return [
            'I speak with... \\ddelays...',
            'Did you notice that?',
        ];
    },
};
/**
 * Logic for the overworld.
 */
export class Overworld extends AbstractMapLogic {
    constructor() {
        super(talks);
    }
}
//# sourceMappingURL=overworld.js.map