import { Utils } from 'gtp';
export class Item {
    constructor(name, args) {
        this.name = name;
        this.displayName = name;
        this.baseCost = args.baseCost || 0;
        this.useFunc = args.use;
    }
    use(state) {
        return this.useFunc(state);
    }
    toString() {
        return '[Item: ' +
            'name=' + this.name +
            ']';
    }
}
export const HERB = new Item('Herb', {
    baseCost: 24,
    use: (state) => {
        const hpRecovered = Utils.randomInt(23, 31);
        state.showOneLineConversation(false, '\\w{hero.name} used the Herb.');
        state.game.hero.incHp(hpRecovered);
        return true;
    },
});
export const KEY = new Item('Magic Key', {
    baseCost: 53, // TODO: and 83 depending on where you buy!
    use: (state) => {
        return state.openDoor();
    },
});
export const TORCH = new Item('Torch', {
    baseCost: 8,
    use: (state) => {
        if (state.game.getMap().getProperty('requiresTorch', false)) {
            return state.game.setUsingTorch(true);
        }
        state.showOneLineConversation(false, 'A torch can be used only in dark places.');
        return false;
    },
});
const ITEMS = [HERB, KEY, TORCH];
export const getItemByName = (name) => {
    return ITEMS.find((item) => name === item.name);
};
//# sourceMappingURL=Item.js.map