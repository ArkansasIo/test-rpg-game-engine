/**
 * The group of one or more members in the player's party.
 */
import { DwGame } from './DwGame';
import { PartyMember } from './PartyMember';
import { Inventory } from './Inventory';
import { Item } from './Item';

    /**
     * Quest log: list of all active and completed quests.
     */
    quests: Quest[] = [];
// Quest and Objective system
export type QuestStatus = 'Active' | 'Complete' | 'Failed';

export interface QuestObjective {
    description: string;
    completed: boolean;
}

export interface Quest {
    id: string;
    name: string;
    description: string;
    status: QuestStatus;
    objectives: QuestObjective[];
    rewards?: { xp?: number; gold?: number; items?: string[] };
}

export function createQuest(id: string, name: string, description: string, objectives: string[]): Quest {
    return {
        id,
        name,
        description,
        status: 'Active',
        objectives: objectives.map(desc => ({ description: desc, completed: false })),
    };
}

export function addQuest(party: Party, quest: Quest) {
    if (!party.quests.find(q => q.id === quest.id)) {
        party.quests.push(quest);
    }
}

export function completeObjective(quest: Quest, objectiveIdx: number) {
    if (quest.objectives[objectiveIdx]) {
        quest.objectives[objectiveIdx].completed = true;
        // If all objectives complete, mark quest complete
        if (quest.objectives.every(obj => obj.completed)) {
            quest.status = 'Complete';
        }
    }
}

export function isQuestComplete(quest: Quest): boolean {
    return quest.status === 'Complete';
}

export function getActiveQuests(party: Party): Quest[] {
    return party.quests.filter(q => q.status === 'Active');
}

export function getCompletedQuests(party: Party): Quest[] {
    return party.quests.filter(q => q.status === 'Complete');
}

    static readonly INVENTORY_MAX_SIZE: number = 20;

    private readonly members: PartyMember[];
    private readonly inventory: Inventory;
    gold: number;

    constructor(game: DwGame) {
        this.members = [];
        this.inventory = new Inventory();
        this.gold = 0;
    }
    /**
     * Quest log: list of all active and completed quests.
     */
    quests: Quest[] = [];

    /**
     * Add a quest to the party's quest log if not already present.
     */
    addQuest(quest: Quest) {
        if (!this.quests.find(q => q.id === quest.id)) {
            this.quests.push(quest);
        }
    }

    /**
     * Mark an objective as complete for a quest by id and objective index.
     */
    completeObjective(questId: string, objectiveIdx: number) {
        const quest = this.quests.find(q => q.id === questId);
        if (quest && quest.objectives[objectiveIdx]) {
            quest.objectives[objectiveIdx].completed = true;
            if (quest.objectives.every(obj => obj.completed)) {
                quest.status = 'Complete';
            }
        }
    }

    /**
     * Get all active quests.
     */
    getActiveQuests(): Quest[] {
        return this.quests.filter(q => q.status === 'Active');
    }

    /**
     * Get all completed quests.
     */
    getCompletedQuests(): Quest[] {
        return this.quests.filter(q => q.status === 'Complete');
    }
    addGold(amt: number) {
        this.gold = Math.min(Math.max(0, this.gold + amt), 9999);
        //game.audio.playSound('gold');
    }

    /**
     * Adds an item to the party's inventory.
     */
    addInventoryItem(item: Item) {
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

    /**
     * Adds a member to the party if not already present (by name).
     */
    addMember(member: PartyMember) {
        if (!this.members.find(m => m.name === member.name)) {
            this.members.push(member);
        }
    }

    /**
     * Removes a member from the party by name.
     */
    removeMember(name: string) {
        const idx = this.members.findIndex(m => m.name === name);
        if (idx !== -1) {
            this.members.splice(idx, 1);
        }
    }

    /**
     * Swaps two members in the party by index.
     */
    swapMembers(idx1: number, idx2: number) {
        if (idx1 >= 0 && idx2 >= 0 && idx1 < this.members.length && idx2 < this.members.length) {
            [this.members[idx1], this.members[idx2]] = [this.members[idx2], this.members[idx1]];
        }
    }

    /**
     * Sets the party leader by index (moves to front).
     */
    setLeader(idx: number) {
        if (idx > 0 && idx < this.members.length) {
            const [leader] = this.members.splice(idx, 1);
            this.members.unshift(leader);
        }
    }

    /**
     * Reorders the party to a new order (array of indices).
     */
    reorder(newOrder: number[]) {
        if (newOrder.length !== this.members.length) return;
        this.members = newOrder.map(i => this.members[i]);
    }

    /**
     * Returns the current party formation (array of member names).
     */
    getFormation(): string[] {
        return this.members.map(m => m.name);
    }

    /**
     * Returns the person in the "lead" of the party; that is, the person
     * physically in the front of the marching line.
     *
     * @return The party member in the lead.
     */
    getLeader(): PartyMember {
        return this.members[0];
    }

    /**
     * Returns the party's inventory.
     *
     * @return The party's inventory.  This may be empty but will never
     *         be <code>null</code>.
     * @see #addInventoryItem(Item)
     */
    getInventory(): Inventory {
        return this.inventory;
    }

    /**
     * Returns a member of the party.
     *
     * @param name The name of the party member.
     * @return The party member, or <code>undefined</code> if there
     *         is no party member by that name.
     */
    getMember(name: string): PartyMember | undefined {
        return this.members.find((member) => name === member.name);
    }

    /**
     * Returns all party members.
     *
     * @return The array of party members.
     * @see #getMember(name)
     */
    getMembers(): PartyMember[] {
        return this.members;
    }

    /**
     * Returns whether the inventory is full.
     *
     * @return Whether the inventory is full.
     * @see #getInventory()
     */
    isInventoryFull(): boolean {
        return this.inventory.getSize() >= Party.INVENTORY_MAX_SIZE;
    }

    /**
     * Replenishes the HP and MP of all party members.
     */
    replenishHealthAndMagic() {
        this.members.forEach((partyMember: PartyMember) => {
            partyMember.replenishHealthAndMagic();
        });
    }

}
