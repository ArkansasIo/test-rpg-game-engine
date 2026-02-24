// SkillsMenu.ts
// RPG Skills menu system
import { Game } from './DwGame';
import { drawFantasyLine, drawFantasyPanel, drawPane, drawTabStrip } from './FantasyOverlayUI';

export class SkillsMenu {
    private game: Game;
    private skills: any[];
    private selectedSkill: number = 0;
    private skillCooldowns: Record<number, number> = {};

    constructor(game: Game, skills: any[]) {
        this.game = game;
        this.skills = skills;
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        const panel = drawFantasyPanel(ctx, 36, 54, this.game.getWidth() - 72, this.game.getHeight() - 104, 'Skills');
        drawTabStrip(ctx, panel.bodyX, panel.bodyY - 2, [ 'Active', 'Passive', 'Mastery' ], 0);
        drawPane(ctx, panel.bodyX, panel.bodyY + 24, Math.floor(panel.bodyWidth * 0.56), panel.bodyHeight - 30, 'Spellbook');
        drawPane(ctx, panel.bodyX + Math.floor(panel.bodyWidth * 0.56) + 10, panel.bodyY + 24, Math.floor(panel.bodyWidth * 0.44) - 10, panel.bodyHeight - 30, 'Details');
        ctx.font = '15px Georgia';
        let y = panel.bodyY + 46;
        for (let i = 0; i < this.skills.length; i++) {
            const skill = this.skills[i];
            const cooldown = this.skillCooldowns[i] || 0;
            let skillText = `${skill.name} (${skill.level}) [${skill.type ?? ''}]`;
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
            drawFantasyLine(ctx, this.skills[this.selectedSkill].name ?? '', rightX, panel.bodyY + 52, false, 'accent');
            drawFantasyLine(ctx, `Type: ${this.skills[this.selectedSkill].type ?? 'Unknown'}`, rightX, panel.bodyY + 76, false, 'normal');
            drawFantasyLine(ctx, `Description: ${this.skills[this.selectedSkill].description ?? 'No description.'}`, rightX, panel.bodyY + 100, false, 'muted');
        }
        // Show activation message if skill was activated
        if (this._activatedSkillMsg) {
            ctx.font = '13px Georgia';
            drawFantasyLine(ctx, this._activatedSkillMsg, rightX, panel.bodyY + panel.bodyHeight - 16, false, 'accent');
        }
        ctx.restore();
    }

    handleClick(x: number, y: number) {
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
    _activatedSkillMsg: string | null = null;
    activateSelectedSkill() {
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
            this.skillCooldowns[this.selectedSkill] = Date.now() + (skill.cooldownMs ?? 3000);
        }
    }
}
