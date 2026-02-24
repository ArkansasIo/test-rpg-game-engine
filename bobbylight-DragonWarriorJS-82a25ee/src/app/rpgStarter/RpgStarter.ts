import { BattleSystem, type BattleState } from '../../systems/BattleSystem';
import { DialogSystem } from '../../systems/DialogSystem';
import { EncounterSystem, type EncounterTable } from '../../systems/EncounterSystem';
import { RpgMapSystem } from '../../systems/RpgMapSystem';
import type { MonsterPack, PartyMember } from '../../types/RpgTypes';
import { createSampleMap } from './SampleMap';

export interface HeroPosition {
    x: number;
    y: number;
}

export interface MoveResult {
    moved: boolean;
    triggeredScriptId?: string;
    encounter?: MonsterPack;
}

export class RpgStarter {

    readonly map: RpgMapSystem;
    readonly encounters: EncounterSystem;
    readonly dialogs: DialogSystem;
    readonly battle: BattleSystem;
    readonly party: PartyMember[];
    hero: HeroPosition = { x: 2, y: 7 };

    public constructor(party: PartyMember[]) {
        this.party = party;
        this.map = createSampleMap();
        this.encounters = new EncounterSystem(this.createEncounterTables());
        this.dialogs = new DialogSystem([
            { id: 'door_locked', lines: [ 'The door is shut tight.' ] },
            { id: 'chest_closed', lines: [ 'A sturdy chest sits here.' ] },
            { id: 'chest_opened', lines: [ 'The chest is empty.' ] },
        ]);
        this.battle = new BattleSystem();
    }

    public move(dx: number, dy: number): MoveResult {

        const nextX = this.hero.x + dx;
        const nextY = this.hero.y + dy;
        if (!this.map.isWalkableAt(nextX, nextY)) {
            return { moved: false };
        }

        this.hero = { x: nextX, y: nextY };
        const tile = this.map.resolveTile(nextX, nextY);
        const encounter = this.encounters.roll(tile.kind);
        this.map.advanceTick();

        return {
            moved: true,
            triggeredScriptId: tile.scriptId,
            encounter: encounter ?? undefined,
        };
    }

    public interactFront(dx: number, dy: number): string[] {

        const tx = this.hero.x + dx;
        const ty = this.hero.y + dy;
        const tile = this.map.resolveTile(tx, ty);
        if (!tile.scriptId) {
            return [];
        }

        if (tile.scriptId === 'chest_closed') {
            this.map.setOverlay(tx, ty, {
                walkable: true,
                scriptId: 'chest_opened',
            }, this.map.getTick());
        }

        return this.dialogs.getLines(tile.scriptId);
    }

    public beginEncounter(pack: MonsterPack): BattleState {
        return this.battle.startBattle(this.party, pack.monsters);
    }

    private createEncounterTables(): EncounterTable[] {
        return [
            {
                tileKind: 'grass',
                chance: 0.08,
                entries: [
                    {
                        weight: 1,
                        pack: {
                            id: 'slime_pack',
                            monsters: [
                                {
                                    id: 'slime',
                                    name: 'Slime',
                                    xp: 1,
                                    gold: 1,
                                    stats: { hp: 4, maxHp: 4, mp: 0, maxMp: 0, str: 2, agi: 2, vit: 1, int: 1, luk: 1 },
                                },
                            ],
                        },
                    },
                ],
            },
            {
                tileKind: 'forest',
                chance: 0.2,
                entries: [
                    {
                        weight: 2,
                        pack: {
                            id: 'wolves',
                            monsters: [
                                {
                                    id: 'wolf_1',
                                    name: 'Wolf',
                                    xp: 3,
                                    gold: 2,
                                    stats: { hp: 7, maxHp: 7, mp: 0, maxMp: 0, str: 4, agi: 4, vit: 2, int: 1, luk: 1 },
                                },
                            ],
                        },
                    },
                ],
            },
        ];
    }
}
