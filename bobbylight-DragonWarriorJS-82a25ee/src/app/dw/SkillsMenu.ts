// SkillsMenu.ts
// RPG Skills menu system
import { Game } from './DwGame';

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
        ctx.font = '15px monospace';
        ctx.fillStyle = '#333';
        ctx.fillRect(40, 40, this.game.getWidth() - 80, this.game.getHeight() - 80);
        ctx.fillStyle = '#fff';
        ctx.fillText('Skills', 60, 70);
        let y = 100;
        for (let i = 0; i < this.skills.length; i++) {
            const skill = this.skills[i];
            const cooldown = this.skillCooldowns[i] || 0;
            if (i === this.selectedSkill) {
                ctx.fillStyle = '#44f';
                ctx.fillRect(55, y - 16, 320, 22);
                ctx.fillStyle = '#fff';
            }
            let skillText = `${skill.name} (${skill.level}) [${skill.type ?? ''}]`;
            if (cooldown > Date.now()) {
                skillText += ' [Cooldown]';
            }
            ctx.fillText(skillText, 60, y);
            y += 24;
        }
        // Show description for selected skill
        if (this.skills[this.selectedSkill]) {
            ctx.font = '13px monospace';
            ctx.fillStyle = '#fff';
            ctx.fillText(`Description: ${this.skills[this.selectedSkill].description ?? 'No description.'}`, 60, y + 10);
        }
        // Show activation message if skill was activated
        if (this._activatedSkillMsg) {
            ctx.font = '13px monospace';
            ctx.fillStyle = '#0f0';
            ctx.fillText(this._activatedSkillMsg, 60, y + 40);
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
