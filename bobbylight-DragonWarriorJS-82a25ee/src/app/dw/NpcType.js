/**
 * A mapping of NPC type to the row in the sprite sheet containing their graphics.
 */
const npcSpriteRows = {
    SOLDIER_GRAY: 0,
    SOLDIER_RED: 1,
    MAN_BLUE: 2,
    WOMAN_BLUE: 3,
    MERCHANT_GREEN: 4,
    OLD_MAN_GRAY: 5,
    KING: 6,
};
/**
 * Returns the row in the NPC sprite sheet containing an NPC type's graphics.
 */
export const getNpcSpriteRow = (type) => npcSpriteRows[type];
const npcTypeSet = new Set(Object.keys(npcSpriteRows));
/**
 * Returns the NPC type for a specified string. If this value is unknown, a default
 * value is returned.
 */
export const getNpcType = (type) => {
    const upper = type.toUpperCase();
    return npcTypeSet.has(upper) ? upper : 'MERCHANT_GREEN';
};
//# sourceMappingURL=NpcType.js.map