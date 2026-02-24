// RuneQuestLogic.ts
// Elden Ring-style rune/key item quest logic
export interface RuneKeyItem {
    name: string;
    questStep: number;
    description: string;
}

export function advanceQuest(item: RuneKeyItem, currentStep: number): number {
    if (item.questStep === currentStep + 1) {
        return item.questStep;
    }
    return currentStep;
}

export function isQuestComplete(item: RuneKeyItem, currentStep: number): boolean {
    return item.questStep <= currentStep;
}
