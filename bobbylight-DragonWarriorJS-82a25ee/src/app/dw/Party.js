import { Inventory } from './Inventory';
export class Party {
    constructor(game) {
        this.quests = [];
        this.members = [];
        this.inventory = new Inventory();
        this.gold = 0;
    }
    /**
     * Modifies the player's gold amount, and plays the appropriate sound effect.
     */
    addGold(amt) {
        this.gold = Math.min(Math.max(0, this.gold + amt), 9999);
        //game.audio.playSound('gold');
    }
    /**
     * Adds an item to the party's inventory.
     */
    addInventoryItem(item) {
        if (!this.isInventoryFull()) {
            this.inventory.push(item);
            return true;
        }
        return false;
    }
    /**
     * Adds a member to the party.
     *
     * @param member The new party member.
     * @see #getMember(name)
     */
    addMember(member) {
        this.members.push(member);
    }
    /**
     * Returns the person in the "lead" of the party; that is, the person
     * physically in the front of the marching line.
     *
     * @return The party member in the lead.
     */
    getLeader() {
        return this.members[0];
    }
    /**
     * Returns the party's inventory.
     *
     * @return The party's inventory.  This may be empty but will never
     *         be <code>null</code>.
     * @see #addInventoryItem(Item)
     */
    getInventory() {
        return this.inventory;
    }
    /**
     * Returns a member of the party.
     *
     * @param name The name of the party member.
     * @return The party member, or <code>undefined</code> if there
     *         is no party member by that name.
     */
    getMember(name) {
        return this.members.find((member) => name === member.name);
    }
    /**
     * Returns all party members.
     *
     * @return The array of party members.
     * @see #getMember(name)
     */
    getMembers() {
        return this.members;
    }
    /**
     * Returns whether the inventory is full.
     *
     * @return Whether the inventory is full.
     * @see #getInventory()
     */
    isInventoryFull() {
        return this.inventory.getSize() >= Party.INVENTORY_MAX_SIZE;
    }
    /**
     * Replenishes the HP and MP of all party members.
     */
    replenishHealthAndMagic() {
        this.members.forEach((partyMember) => {
            partyMember.replenishHealthAndMagic();
        });
    }
}
Party.INVENTORY_MAX_SIZE = 20;
//# sourceMappingURL=Party.js.map