export function advanceQuest(item, currentStep) {
    if (item.questStep === currentStep + 1) {
        return item.questStep;
    }
    return currentStep;
}
export function isQuestComplete(item, currentStep) {
    return item.questStep <= currentStep;
}
//# sourceMappingURL=RuneQuestLogic.js.map