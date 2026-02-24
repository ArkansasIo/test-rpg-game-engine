export function makeHudLayout(width, height) {
    const chat = { x: 4, y: height - 80, w: 120, h: 76 };
    const actionBar = { x: Math.floor(width / 2) - 94, y: height - 36, w: 188, h: 32 };
    const castBar = { x: actionBar.x + 28, y: actionBar.y - 8, w: 132, h: 6 };
    const playerFrame = { x: 4, y: chat.y - 28, w: 120, h: 26 };
    const targetFrame = { x: width - 124, y: chat.y - 28, w: 120, h: 26 };
    const minimap = { x: width - 68, y: 4, w: 64, h: 64 };
    const bagBar = { x: width - 84, y: height - 36, w: 80, h: 14 };
    const questTracker = { x: width - 84, y: 72, w: 80, h: 80 };
    const buffs = { x: minimap.x - 92, y: 4, w: 88, h: 12 };
    return { chat, actionBar, castBar, playerFrame, targetFrame, minimap, bagBar, questTracker, buffs };
}
//# sourceMappingURL=Layout.js.map