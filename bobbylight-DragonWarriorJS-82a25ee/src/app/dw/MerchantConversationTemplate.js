import { Conversation } from './Conversation';
export const merchantConversationTemplate = (game, conversation, segmentArgs) => {
    var _a;
    return [
        {
            clear: false,
            text: (_a = segmentArgs.introText) !== null && _a !== void 0 ? _a : 'Welcome! Would you like to see our wares?',
            choices: [
                { text: 'Yes', next: Conversation.CHOICES_SEGMENT },
                { text: 'No', next: Conversation.BID_FAREWELL_SEGMENT },
            ],
        },
        {
            id: Conversation.CHOICES_SEGMENT, // This ID is special and required
            text: 'What dost thou wish to buy?',
            shopping: {
                choices: segmentArgs.choices,
            },
        },
        {
            id: Conversation.CONFIRM_SEGMENT,
            text: 'The \\w{item.name}? That will be \\w{item.baseCost} gold. Is that okay?',
            choices: [
                { text: 'Yes', next: Conversation.PURCHASE_SEGMENT },
                { text: 'No', next: Conversation.DECLINED_PURCHASE_SEGMENT },
            ],
        },
        {
            id: Conversation.PURCHASE_SEGMENT,
            action: () => {
                if (conversation.item) {
                    game.party.addInventoryItem(conversation.item);
                    game.party.gold -= conversation.item.baseCost;
                }
                else {
                    throw new Error('No item specified in conversation!');
                }
            },
            text: 'I thank thee!',
            next: Conversation.SOMETHING_ELSE_SEGMENT,
        },
        {
            id: Conversation.NOT_ENOUGH_SEGMENT,
            text: "I'm afraid you do not have enough gold!",
        },
        {
            id: Conversation.SOMETHING_ELSE_SEGMENT,
            text: 'Would you like to buy something else?',
            choices: [
                { text: 'Yes', next: Conversation.CHOICES_SEGMENT },
                { text: 'No', next: Conversation.BID_FAREWELL_SEGMENT },
            ],
        },
        {
            id: Conversation.DECLINED_PURCHASE_SEGMENT,
            text: "I'm sorry to hear that.",
            next: Conversation.SOMETHING_ELSE_SEGMENT,
        },
        {
            id: Conversation.BID_FAREWELL_SEGMENT,
            text: 'Please, come again.',
        },
    ];
};
//# sourceMappingURL=MerchantConversationTemplate.js.map