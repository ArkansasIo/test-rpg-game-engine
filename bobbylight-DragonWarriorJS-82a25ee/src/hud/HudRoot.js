import { ActionBar } from './ActionBar';
import { BagBar } from './BagBar';
import { BuffRow } from './BuffRow';
import { ChatBox } from './ChatBox';
import { Minimap } from './Minimap';
import { QuestTracker } from './QuestTracker';
import { UnitFrame } from './UnitFrame';
import { makeHudLayout } from '../ui/Layout';
import { Widget } from '../ui/Widget';
export class HudRoot extends Widget {
    constructor(width, height, font) {
        super({ x: 0, y: 0, w: width, h: height });
        const layout = makeHudLayout(width, height);
        this.chat = this.add(new ChatBox(layout.chat, font));
        this.actionBar = this.add(new ActionBar(layout.actionBar, layout.castBar, font));
        this.playerFrame = this.add(new UnitFrame(layout.playerFrame, font, 'HERO'));
        this.targetFrame = this.add(new UnitFrame(layout.targetFrame, font, 'SLIME'));
        this.targetFrame.hp = 9;
        this.targetFrame.maxHp = 12;
        this.targetFrame.mp = 0;
        this.targetFrame.maxMp = 0;
        this.minimap = this.add(new Minimap(layout.minimap));
        this.bagBar = this.add(new BagBar(layout.bagBar, font));
        this.questTracker = this.add(new QuestTracker(layout.questTracker, font));
        this.buffs = this.add(new BuffRow(layout.buffs, font));
    }
    update(dt, input) {
        if (input.keysPressed.has('enter')) {
            this.chat.push('SYSTEM: READY');
        }
        super.update(dt, input);
    }
}
//# sourceMappingURL=HudRoot.js.map