import { Bubble } from './Bubble';
export class StatusBubble extends Bubble {
    constructor(game) {
        const scale = game.scale;
        const tileSize = game.getTileSize();
        const w = 172 * scale;
        const x = game.getWidth() - tileSize - w;
        const y = tileSize * 3;
        const h = game.getHeight() - y - tileSize;
        super(game, undefined, x, y, w, h);
        this.selection = 0;
    }
    calculateX2Offs(val) {
        if (typeof val === 'number') {
            val = val.toString();
        }
        return this.game.stringWidth(val);
    }
    /**
     * This bubble is a little more space-constrained so its
     * x-margin is smaller.
     */
    getXMargin() {
        const scale = this.game.scale;
        // Inset + border width + inner spacing
        return (1 + 2 + 2) * scale;
    }
    handleInput() {
    }
    paintContent(ctx, x, y) {
        const SCALE = this.game.scale;
        const x2 = this.x + this.w - this.getXMargin();
        let y0 = y;
        const Y_INC = this.game.stringHeight() + 7 * SCALE;
        const hero = this.game.hero;
        this.game.drawString('NAME:', x, y0);
        let xOffs = this.calculateX2Offs(hero.name);
        this.game.drawString(hero.name, x2 - xOffs, y0);
        y0 += Y_INC;
        this.game.drawString('STRENGTH:', x, y0);
        xOffs = this.calculateX2Offs(hero.strength);
        this.game.drawString(hero.strength, x2 - xOffs, y0);
        y0 += Y_INC;
        this.game.drawString('AGILITY:', x, y0);
        xOffs = this.calculateX2Offs(hero.agility);
        this.game.drawString(hero.agility, x2 - xOffs, y0);
        y0 += Y_INC;
        const attackPower = hero.getStrength();
        this.game.drawString('ATTACK POWER:', x, y0);
        xOffs = this.calculateX2Offs(attackPower);
        this.game.drawString(attackPower, x2 - xOffs, y0);
        y0 += Y_INC;
        const defensePower = hero.getDefense();
        this.game.drawString('DEFENSE POWER:', x, y0);
        xOffs = this.calculateX2Offs(defensePower);
        this.game.drawString(defensePower, x2 - xOffs, y0);
        y0 += Y_INC;
        const weaponName = hero.weapon ? hero.weapon.displayName : '';
        this.game.drawString('WEAPON:', x, y0);
        xOffs = this.calculateX2Offs(weaponName);
        this.game.drawString(weaponName, x2 - xOffs, y0);
        y0 += Y_INC;
        const armorName = hero.armor ? hero.armor.displayName : '';
        this.game.drawString('ARMOR:', x, y0);
        xOffs = this.calculateX2Offs(armorName);
        this.game.drawString(armorName, x2 - xOffs, y0);
        y0 += Y_INC;
        const shieldName = hero.shield ? hero.shield.displayName : '';
        this.game.drawString('SHIELD:', x, y0);
        xOffs = this.calculateX2Offs(shieldName);
        this.game.drawString(shieldName, x2 - xOffs, y0);
        y0 += Y_INC;
    }
}
//# sourceMappingURL=StatusBubble.js.map