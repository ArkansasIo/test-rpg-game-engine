import { drawFantasyLine, drawFantasyPanel, drawPane, drawTabStrip } from './FantasyOverlayUI';
export class SkillsMenu {
    constructor(game, skills) {
        this.selectedSkill = 0;
        this.skillCooldowns = {};
        this._activatedSkillMsg = null;
        this.game = game;
        this.skills = skills;
    }
    render(ctx) {
        var _a, _b, _c, _d;
        ctx.save();
        const panel = drawFantasyPanel(ctx, 36, 54, this.game.getWidth() - 72, this.game.getHeight() - 104, 'Skills');
        drawTabStrip(ctx, panel.bodyX, panel.bodyY - 2, ['Active', 'Passive', 'Mastery'], 0);
        drawPane(ctx, panel.bodyX, panel.bodyY + 24, Math.floor(panel.bodyWidth * 0.56), panel.bodyHeight - 30, 'Spellbook');
        drawPane(ctx, panel.bodyX + Math.floor(panel.bodyWidth * 0.56) + 10, panel.bodyY + 24, Math.floor(panel.bodyWidth * 0.44) - 10, panel.bodyHeight - 30, 'Details');
        ctx.font = '15px Georgia';
        let y = panel.bodyY + 46;
        for (let i = 0; i < this.skills.length; i++) {
            const skill = this.skills[i];
            const cooldown = this.skillCooldowns[i] || 0;
            let skillText = `${skill.name} (${skill.level}) [${(_a = skill.type) !== null && _a !== void 0 ? _a : ''}]`;
            if (cooldown > Date.now()) {
                skillText += ' [Cooldown]';
            }
            drawFantasyLine(ctx, skillText, panel.bodyX, y, i === this.selectedSkill, cooldown > Date.now() ? 'muted' : 'normal');
            y += 22;
        }
        // Show description for selected skill
        const rightX = panel.bodyX + Math.floor(panel.bodyWidth * 0.56) + 20;
        if (this.skills[this.selectedSkill]) {
            ctx.font = '13px Georgia';
            drawFantasyLine(ctx, (_b = this.skills[this.selectedSkill].name) !== null && _b !== void 0 ? _b : '', rightX, panel.bodyY + 52, false, 'accent');
            drawFantasyLine(ctx, `Type: ${(_c = this.skills[this.selectedSkill].type) !== null && _c !== void 0 ? _c : 'Unknown'}`, rightX, panel.bodyY + 76, false, 'normal');
            drawFantasyLine(ctx, `Description: ${(_d = this.skills[this.selectedSkill].description) !== null && _d !== void 0 ? _d : 'No description.'}`, rightX, panel.bodyY + 100, false, 'muted');
        }
        // Show activation message if skill was activated
        if (this._activatedSkillMsg) {
            ctx.font = '13px Georgia';
            drawFantasyLine(ctx, this._activatedSkillMsg, rightX, panel.bodyY + panel.bodyHeight - 16, false, 'accent');
        }
        ctx.restore();
    }
    handleClick(x, y) {
        // Select skill based on click position
        let skillY = 100;
        for (let i = 0; i < this.skills.length; i++) {
            if (skillY - 16 <= y && skillY + 8 >= y) {
                this.selectedSkill = i;
                break;
            }
            skillY += 24;
        }
    }
    selectNextSkill() {
        this.selectedSkill = (this.selectedSkill + 1) % this.skills.length;
    }
    selectPrevSkill() {
        this.selectedSkill = (this.selectedSkill - 1 + this.skills.length) % this.skills.length;
    }
    activateSelectedSkill() {
        var _a;
        const skill = this.skills[this.selectedSkill];
        const cooldown = this.skillCooldowns[this.selectedSkill] || 0;
        if (skill) {
            if (cooldown > Date.now()) {
                this._activatedSkillMsg = `Skill ${skill.name} is on cooldown!`;
                setTimeout(() => { this._activatedSkillMsg = null; }, 1200);
                return;
            }
            // Example: just show a message, real logic would trigger skill effect
            this._activatedSkillMsg = `Activated skill: ${skill.name}!`;
            setTimeout(() => { this._activatedSkillMsg = null; }, 1200);
            // Set cooldown (example: 3 seconds)
            this.skillCooldowns[this.selectedSkill] = Date.now() + ((_a = skill.cooldownMs) !== null && _a !== void 0 ? _a : 3000);
        }
    }
}
//# sourceMappingURL=SkillsMenu.js.map