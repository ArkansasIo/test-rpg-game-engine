import { ChoiceBubble } from '@/app/dw/ChoiceBubble';
export class SpellBubble extends ChoiceBubble {
    constructor(game) {
        const tileSize = game.getTileSize();
        const x = 9 * tileSize;
        const y = 2 * tileSize;
        const inventorySize = game.hero.spells.length;
        const w = 7 * tileSize;
        const h = (inventorySize + 2) * tileSize;
        const spells = game.hero.spells;
        super(game, x, y, w, h, spells, (choice) => choice.name, true, 'SPELL');
    }
}
//# sourceMappingURL=SpellBubble.js.map