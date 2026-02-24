import type { Rect } from './Widget';

export type HudLayoutRects = {
    chat: Rect;
    actionBar: Rect;
    castBar: Rect;
    playerFrame: Rect;
    targetFrame: Rect;
    minimap: Rect;
    bagBar: Rect;
    questTracker: Rect;
    buffs: Rect;
};

export function makeHudLayout(width: number, height: number): HudLayoutRects {
    const chat: Rect = { x: 4, y: height - 80, w: 120, h: 76 };
    const actionBar: Rect = { x: Math.floor(width / 2) - 94, y: height - 36, w: 188, h: 32 };
    const castBar: Rect = { x: actionBar.x + 28, y: actionBar.y - 8, w: 132, h: 6 };
    const playerFrame: Rect = { x: 4, y: chat.y - 28, w: 120, h: 26 };
    const targetFrame: Rect = { x: width - 124, y: chat.y - 28, w: 120, h: 26 };
    const minimap: Rect = { x: width - 68, y: 4, w: 64, h: 64 };
    const bagBar: Rect = { x: width - 84, y: height - 36, w: 80, h: 14 };
    const questTracker: Rect = { x: width - 84, y: 72, w: 80, h: 80 };
    const buffs: Rect = { x: minimap.x - 92, y: 4, w: 88, h: 12 };

    return { chat, actionBar, castBar, playerFrame, targetFrame, minimap, bagBar, questTracker, buffs };
}
