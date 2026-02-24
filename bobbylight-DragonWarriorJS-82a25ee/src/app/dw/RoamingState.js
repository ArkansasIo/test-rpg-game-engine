import { Delay, Keys } from 'gtp';
import { BaseState } from './BaseState';
import { CommandBubble } from './CommandBubble';
import { StatBubble } from './StatBubble';
import { TextBubble } from './TextBubble';
import { Conversation } from './Conversation';
import { StatusBubble } from './StatusBubble';
import { ItemBubble } from './ItemBubble';
import { Cheats } from './Cheats';
import { toRowAndColumn } from './LocationString';
import { getChestConversation } from './ChestConversations';
import { getSearchConversation } from './SearchConversations';
import { SpellBubble } from '@/app/dw/SpellBubble';
import { createGeneratedWorldMap, renderGeneratedWorldMapOverlay, } from './GeneratedWorldMapSystem';
export class RoamingState extends BaseState {
    // ...existing fields...
    showEquipmentMenu() {
        this.game.openEquipment();
        this.game.setStatusMessage('Equipment');
        this.setSubstate('ROAMING');
    }
    handleDefaultKeys() {
        super.handleDefaultKeys();
        const im = this.game.inputManager;
        // Settings menu: handle keyboard input
        if (this.game.activeMenu === 'settings' && this.game.settingsMenu) {
            if (im.up(true))
                this.game.settingsMenu.handleKey('ArrowUp');
            if (im.down(true))
                this.game.settingsMenu.handleKey('ArrowDown');
            if (im.left(true))
                this.game.settingsMenu.handleKey('ArrowLeft');
            if (im.right(true))
                this.game.settingsMenu.handleKey('ArrowRight');
            if (im.enter(true))
                this.game.settingsMenu.handleKey('Enter');
            if (this.game.cancelKeyPressed())
                this.game.settingsMenu.handleKey('Escape');
            return;
        }
        // Close any overlay menu quickly.
        if (this.game.activeMenu && this.game.cancelKeyPressed()) {
            this.game.closeMenu();
            this.game.setStatusMessage('Closed menu');
            return;
        }
        // OG-style in-game menu: open with Enter key
        if (!this.showWorldMap && im.enter(true)) {
            const { GameMenuState } = require('./GameMenuState');
            this.game.setState(new GameMenuState(this.game));
            return;
        }
        // Open Elden/WoW-style overlay menus from roaming.
        if (!this.showWorldMap) {
            if (im.isKeyDown(Keys.KEY_I, true)) {
                this.game.openInventory();
                this.game.setStatusMessage('Inventory');
                return;
            }
            if (im.isKeyDown(Keys.KEY_E, true)) {
                this.game.openEquipment();
                this.game.setStatusMessage('Equipment');
                return;
            }
            if (im.isKeyDown(Keys.KEY_K, true)) {
                this.game.openSkills();
                this.game.setStatusMessage('Skills');
                return;
            }
            if (im.isKeyDown(Keys.KEY_Q, true)) {
                this.game.openQuests();
                this.game.setStatusMessage('Quests');
                return;
            }
            if (im.isKeyDown(Keys.KEY_J, true)) {
                this.game.openMap();
                this.game.setStatusMessage('Map');
                return;
            }
            if (im.isKeyDown(Keys.KEY_0, true)) {
                this.game.openSettings();
                this.game.setStatusMessage('Settings');
                return;
            }
        }
        // Toggle minimap with 'M'
        if (im.isKeyDown(Keys.KEY_M, true)) {
            this.showMinimap = !this.showMinimap;
        }
        // Toggle generated world map with 'G'
        if (im.isKeyDown(Keys.KEY_G, true)) {
            this.showWorldMap = !this.showWorldMap;
        }
        // Open spell/attack menu with 'S'
        if (!this.showWorldMap && im.isKeyDown(Keys.KEY_S, true) && !this.spellBubble) {
            this.showSpellList();
        }
    }
    handleClick(x, y) {
        if (this.game.activeMenu === 'inventory' && this.game.inventoryMenu) {
            this.game.inventoryMenu.handleClick(x, y);
            return;
        }
        if (this.game.activeMenu === 'equipment' && this.game.equipmentMenu) {
            this.game.equipmentMenu.handleClick(x, y);
            return;
        }
        if (this.game.activeMenu === 'skills' && this.game.skillsMenu) {
            this.game.skillsMenu.handleClick(x, y);
            return;
        }
        if (this.game.activeMenu === 'quests' && this.game.questsMenu) {
            this.game.questsMenu.handleClick(x, y);
            return;
        }
        if (this.game.activeMenu === 'map' && this.game.mapMenu) {
            this.game.mapMenu.handleClick(x, y);
            return;
        }
        if (this.game.activeMenu === 'settings' && this.game.settingsMenu) {
            this.game.settingsMenu.handleClick(x, y);
            return;
        }
        this.game.menuBar.handleClick(x, y);
    }
    constructor(game) {
        super(game);
        this.showMinimap = true;
        this.showWorldMap = false;
        this.lastOverworldRow = 0;
        this.lastOverworldCol = 0;
        this.commandBubble = new CommandBubble(game);
        this.statBubble = new StatBubble(this.game);
        this.stationaryTimer = new Delay({ millis: 1000 });
        this.updateMethods = new Map();
        this.updateMethods.set('ROAMING', this.updateRoaming.bind(this));
        this.updateMethods.set('MENU', this.updateMenu.bind(this));
        this.updateMethods.set('TALKING', this.updateTalking.bind(this));
        this.updateMethods.set('OVERNIGHT', this.updateOvernight.bind(this));
        this.updateMethods.set('WARP_SELECTION', this.updateWarpSelection.bind(this));
        this.updateMethods.set('CHEAT_SELECTION', this.updateCheatSelection.bind(this));
        this.textBubble = new TextBubble(this.game);
        this.showTextBubble = false;
        this.substate = 'ROAMING'; // Can't call setState to appease tsc
        this.showStats = false;
        this.generatedWorldMap = createGeneratedWorldMap('elden-nine-kingdoms-earth-scale');
    }
    search() {
        this.showTextBubble = true;
        this.textBubble.setConversation(getSearchConversation(this));
        this.setSubstate('TALKING');
    }
    take() {
        this.showTextBubble = true;
        this.textBubble.setConversation(getChestConversation(this));
        this.setSubstate('TALKING');
    }
    takeStairs() {
        if (this.game.hero.possiblyHandleIntersectedObject()) {
            this.setSubstate('ROAMING');
        }
        else {
            this.showOneLineConversation(true, 'There are no stairs here.');
        }
    }
    update(delta) {
        const game = this.game;
        this.handleDefaultKeys();
        if (game.inputManager.isKeyDown(Keys.KEY_R, true)) {
            game.startRandomEncounter();
            return;
        }
        else if (game.inputManager.isKeyDown(Keys.KEY_O, true)) {
            this.setSubstate('OVERNIGHT');
        }
        game.hero.update(delta);
        RoamingState.totalTime += delta;
        if (RoamingState.totalTime >= 1000) {
            RoamingState.totalTime = 0;
        }
        this.updateMethods.get(this.substate).call(this, delta);
    }
    updateCheatSelection(delta) {
        var _a;
        // Do check here to appease tsc of cheatBubble being defined
        (_a = this.cheatBubble) !== null && _a !== void 0 ? _a : (this.cheatBubble = Cheats.createCheatBubble(this.game));
        this.cheatBubble.update(delta);
        if (this.cheatBubble.handleInput()) {
            const cheat = this.cheatBubble.getSelectedItem();
            this.cheatBubble = undefined;
            if (cheat) {
                switch (cheat) {
                    case '9999 Gold':
                        this.game.party.addGold(9999);
                        this.game.audio.playSound('openChest');
                        this.setSubstate('ROAMING');
                        break;
                    case 'Level Up':
                        this.game.audio.playSound('bump');
                        break;
                    case 'Weapon Change':
                        this.game.cycleWeapon();
                        this.setSubstate('ROAMING');
                        break;
                    case 'Armor Change':
                        this.game.cycleArmor();
                        this.setSubstate('ROAMING');
                        break;
                    case 'Shield Change':
                        this.game.cycleShield();
                        this.setSubstate('ROAMING');
                        break;
                    case 'Max HP/MP':
                        this.game.setHeroStats(255, 255, 255, 255);
                        this.game.audio.playSound('castSpell');
                        this.setSubstate('ROAMING');
                        break;
                    case 'Min HP/MP':
                        this.game.setHeroStats(1, 1, 1, 1);
                        this.game.audio.playSound('castSpell');
                        this.setSubstate('ROAMING');
                        break;
                    default:
                        this.game.audio.playSound('bump');
                        break;
                }
            }
            else {
                this.setSubstate('MENU');
            }
            delete this.cheatBubble;
        }
    }
    updateMenu(delta) {
        if (this.statBubble) {
            this.statBubble.update(delta);
        }
        if (this.statusBubble) {
            this.statusBubble.update(delta);
            if (this.game.anyKeyDown()) {
                delete this.statusBubble;
                return;
            }
        }
        let done;
        if (this.spellBubble) {
            this.spellBubble.update(delta);
            done = this.spellBubble.handleInput();
            if (done) {
                const selectedSpell = this.spellBubble.getSelectedItem();
                if (selectedSpell) {
                    const conversation = new Conversation(this.game, false);
                    if (selectedSpell.cost <= this.game.hero.mp) {
                        conversation.setSegments([
                            {
                                text: `\\w{hero.name} chanted the spell of ${selectedSpell.name}.`,
                                afterSound: 'castSpell',
                                afterAutoAdvanceDelay: 900,
                                afterAction: () => {
                                    // Stats are updated after the sound effect
                                    this.game.hero.mp -= selectedSpell.cost;
                                    const result = selectedSpell.cast(this.game.hero, undefined);
                                    return result.conversationSegments;
                                },
                            },
                        ]);
                        this.textBubble.setConversation(conversation);
                    }
                    else {
                        conversation.addSegment('Thy MP is too low.');
                    }
                    this.showConversation(conversation);
                }
                delete this.spellBubble;
            }
            return;
        }
        else if (this.itemBubble) {
            this.itemBubble.update(delta);
            done = this.itemBubble.handleInput();
            if (done) {
                let success = false;
                const selected = this.itemBubble.getSelectedItem();
                if (selected) {
                    success = this.itemBubble.handleEquipOrUse(selected, this);
                    if (success && 'name' in selected) {
                        this.game.getParty().getInventory().remove(selected.name);
                    }
                }
                else {
                    success = false;
                }
                if (success) {
                    if (this.substate === 'MENU') {
                        this.setSubstate('ROAMING');
                    }
                }
                delete this.itemBubble;
            }
            return;
        }
        this.commandBubble.update(delta);
        done = this.commandBubble.handleInput();
        if (done) {
            this.commandBubble.handleCommandChosen(this);
            return;
        }
    }
    updateRoaming(delta) {
        if (this.showStats) {
            this.statBubble.update(delta);
        }
        if (this.game.activeMenu) {
            // Pause movement while a top-level UI panel is open.
            return;
        }
        if (this.game.getMap().name === 'overworld') {
            this.lastOverworldRow = this.game.hero.mapRow;
            this.lastOverworldCol = this.game.hero.mapCol;
        }
        const hero = this.game.hero;
        const im = this.game.inputManager;
        if (this.showWorldMap) {
            if (this.game.cancelKeyPressed() || this.game.actionKeyPressed()) {
                this.showWorldMap = false;
            }
            return;
        }
        if (this.game.actionKeyPressed()) {
            this.game.setNpcsPaused(true);
            this.commandBubble.reset();
            this.game.audio.playSound('menu');
            this.setSubstate('MENU');
            this.showStats = true;
            return;
        }
        // Make sure we're not in BattleTransitionState
        if (!hero.isMoving() && this.game.state === this) {
            if (im.up()) {
                hero.tryToMoveUp();
                this.stationaryTimer.reset();
                this.statBubble.init();
                //this.yOffs = Math.max(this.yOffs-inc, 0);
            }
            else if (im.down()) {
                hero.tryToMoveDown();
                this.stationaryTimer.reset();
                this.statBubble.init();
                //this.yOffs = Math.min(this.yOffs+inc, maxY);
            }
            else if (im.left()) {
                hero.tryToMoveLeft();
                this.stationaryTimer.reset();
                this.statBubble.init();
                //this.xOffs = Math.max(this.xOffs-inc, 0);
            }
            else if (im.right()) {
                hero.tryToMoveRight();
                this.stationaryTimer.reset();
                this.statBubble.init();
                //this.xOffs = Math.min(this.xOffs+inc, maxX);
            }
        }
        this.showStats = this.stationaryTimer.update(delta);
        if (im.isKeyDown(Keys.KEY_SHIFT)) {
            if (im.isKeyDown(Keys.KEY_C, true)) {
                this.game.toggleShowCollisionLayer();
            }
            if (im.isKeyDown(Keys.KEY_T, true)) {
                this.game.toggleShowTerritoryLayer();
            }
        }
        this.game.getMap().npcs.forEach((npc) => {
            npc.update(delta);
        });
    }
    updateTalking(delta) {
        const done = this.textBubble.handleInput();
        if ( /*this._textBubble.currentTextDone() && */this.textBubble.isOvernight()) {
            this.setSubstate('OVERNIGHT');
            this.textBubble.clearOvernight();
        }
        else if (this.showTextBubble) {
            this.textBubble.update(delta);
        }
        if (done) {
            this.startRoaming();
            return;
        }
    }
    updateOvernight(delta) {
        if (this.overnightDelay) {
            this.overnightDelay.update(delta);
        }
        else {
            this.game.audio.playMusic('overnight', false);
            this.overnightDelay = new Delay({
                millis: [RoamingState.OVERNIGHT_DARK_TIME],
                callback: this.overnightOver.bind(this),
            });
        }
    }
    updateWarpSelection(delta) {
        var _a;
        // Do check here to appease tsc of warpBubble being defined
        (_a = this.warpBubble) !== null && _a !== void 0 ? _a : (this.warpBubble = Cheats.createWarpBubble(this.game));
        this.warpBubble.update(delta);
        if (this.warpBubble.handleInput()) {
            const warpTo = this.warpBubble.getSelectedItem();
            this.warpBubble = undefined;
            if (warpTo) {
                this.warpTo(warpTo); // TODO: Make me cleaner
                this.setSubstate('ROAMING');
            }
            else {
                this.setSubstate('MENU');
            }
            this.warpBubble = undefined;
        }
    }
    overnightOver() {
        this.game.audio.playMusic('MUSIC_TOWN');
        delete this.overnightDelay;
        this.setSubstate('TALKING');
        //         this._textBubble.nudgeConversation(); // User doesn't have to press a key
    }
    openDoor() {
        const door = this.game.getDoorHeroIsFacing();
        if (door) {
            const game = this.game;
            if (!game.party.getInventory().remove('Magic Key')) {
                this.showOneLineConversation(false, 'You do not have a key!'); // TODO: Verify text
                return false;
            }
            this.game.audio.playSound('door');
            const map = this.game.getMap();
            map.getLayer('tileLayer').setData(door.row, door.col, door.replacementTileIndex);
            const index = map.doors.indexOf(door);
            if (index > -1) {
                map.doors.splice(index, 1);
                map.getLayer('collisionLayer').setData(door.row, door.col, 0);
            }
            else { // Should never happen
                console.error(`Door not found in map.doors! - ${door.toString()}`);
            }
            this.setSubstate('ROAMING');
            return true;
        }
        this.showOneLineConversation(false, 'There is no door here.');
        return false;
    }
    possiblyRenderNpc(npc, ctx) {
        const row = npc.mapRow;
        const col = npc.mapCol;
        const underRoof = this.game.hasRoofTile(row, col);
        if (underRoof && this.game.inside || !underRoof && !this.game.inside) {
            npc.render(ctx);
        }
    }
    render(ctx) {
        if (this.game.getMap().propertiesByName.get('requiresTorch')) {
            this.game.clearScreen('#000000');
            ctx.save();
            const clipRadius = this.game.getUsingTorch() ? this.game.getTileSize() * 3 / 2 :
                this.game.getTileSize() / 2;
            const x0 = this.game.getWidth() / 2 - clipRadius;
            const y0 = this.game.getHeight() / 2 - clipRadius;
            ctx.beginPath();
            ctx.rect(x0, y0, 2 * clipRadius, 2 * clipRadius);
            ctx.clip();
        }
        else if (this.game.inside) {
            this.game.clearScreen('#000000');
        }
        this.game.drawMap(ctx);
        // TODO: Be more efficient here
        this.game.getMap().chests.forEach((chest) => {
            const { row, col } = toRowAndColumn(chest.location);
            let x = col * this.game.getTileSize();
            x -= this.game.getMapXOffs();
            let y = row * this.game.getTileSize();
            y -= this.game.getMapYOffs();
            this.game.getMap().drawTile(ctx, x, y, 5, {});
        });
        this.game.hero.render(ctx);
        // Draw minimap in top-left corner
        if (this.showMinimap) {
            this.renderMinimap(ctx);
        }
        if (this.showWorldMap) {
            this.renderGeneratedWorldMap(ctx);
        }
        this.game.getMap().npcs.forEach((npc) => {
            this.possiblyRenderNpc(npc, ctx);
        });
        if (this.game.getMap().propertiesByName.get('requiresTorch')) {
            ctx.restore();
        }
        if (this.substate !== 'ROAMING') {
            this.commandBubble.paint(ctx);
        }
        if (this.showTextBubble) {
            this.textBubble.paint(ctx);
        }
        if (this.substate !== 'ROAMING' || this.showStats) {
            this.statBubble.paint(ctx);
        }
        if (this.statusBubble) {
            this.statusBubble.paint(ctx);
        }
        if (this.spellBubble) {
            this.spellBubble.paint(ctx);
        }
        if (this.itemBubble) {
            this.itemBubble.paint(ctx);
        }
        if (this.warpBubble) {
            this.warpBubble.paint(ctx);
        }
        if (this.cheatBubble) {
            this.cheatBubble.paint(ctx);
        }
        if (this.overnightDelay) {
            ctx.save();
            const overnightRemaining = this.overnightDelay.getRemaining();
            let alpha;
            const fadeInTime = RoamingState.OVERNIGHT_FADE_TIME;
            if (overnightRemaining > RoamingState.OVERNIGHT_DARK_TIME - fadeInTime) {
                alpha = (RoamingState.OVERNIGHT_DARK_TIME - overnightRemaining) / fadeInTime;
                ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
            }
            else if (overnightRemaining < fadeInTime) {
                alpha = overnightRemaining / fadeInTime;
                ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
            }
            else {
                ctx.fillStyle = 'rgba(0, 0, 0, 1)';
            }
            ctx.fillRect(0, 0, this.game.getWidth(), this.game.getHeight());
            ctx.restore();
        }
    }
    renderGeneratedWorldMap(ctx) {
        var _a, _b;
        const overworld = this.game.maps['overworld.json'];
        const rows = (_a = overworld === null || overworld === void 0 ? void 0 : overworld.height) !== null && _a !== void 0 ? _a : 1;
        const cols = (_b = overworld === null || overworld === void 0 ? void 0 : overworld.width) !== null && _b !== void 0 ? _b : 1;
        const heroWorldRow = this.lastOverworldRow / Math.max(1, rows - 1);
        const heroWorldCol = this.lastOverworldCol / Math.max(1, cols - 1);
        renderGeneratedWorldMapOverlay(ctx, this.generatedWorldMap, Math.max(0, Math.min(1, heroWorldCol)) * (this.generatedWorldMap.cols - 1), Math.max(0, Math.min(1, heroWorldRow)) * (this.generatedWorldMap.rows - 1), this.game.getMap().name);
    }
    // Simple minimap: shows map layout and hero position
    renderMinimap(ctx) {
        const map = this.game.getMap();
        const miniTile = 3; // Minimap tile size in px
        const rows = map.height;
        const cols = map.width;
        const x0 = 10;
        const y0 = 10;
        // Draw map tiles (just as blocks)
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const tile = map.getLayer('tileLayer').getData(r, c);
                ctx.fillStyle = tile ? '#444' : '#222';
                ctx.fillRect(x0 + c * miniTile, y0 + r * miniTile, miniTile, miniTile);
            }
        }
        // Draw hero
        ctx.fillStyle = 'yellow';
        ctx.fillRect(x0 + this.game.hero.mapCol * miniTile, y0 + this.game.hero.mapRow * miniTile, miniTile, miniTile);
        // Optionally: draw NPCs, chests, etc.
    }
    setSubstate(substate) {
        const prevSubstate = this.substate;
        this.substate = substate;
        if (substate === 'MENU' && prevSubstate === 'ROAMING') {
            this.commandBubble.init();
        }
        else if (substate === 'TALKING' && prevSubstate !== 'OVERNIGHT') {
            this.textBubble.init();
        }
    }
    showCheatBubble() {
        this.setSubstate('CHEAT_SELECTION');
    }
    showInventory() {
        this.itemBubble = new ItemBubble(this.game);
    }
    showNoSpellsMessage() {
        this.showOneLineConversation(false, 'You have not learned any spells yet!');
    }
    /**
     * Displays one or more static lines of text in the conversation bubble.
     *
     * @param voice Whether to play the "talking" sound effect.
     * @param text The text to display.
     */
    showOneLineConversation(voice, ...text) {
        const conversation = new Conversation(this.game, voice);
        text.forEach((line) => {
            conversation.addSegment(line);
        });
        this.showConversation(conversation);
    }
    showConversation(conversation) {
        this.showTextBubble = true;
        this.textBubble.setConversation(conversation);
        this.setSubstate('TALKING');
    }
    showSpellList() {
        const hero = this.game.hero;
        if (!hero.spells.length) {
            this.showNoSpellsMessage();
            return;
        }
        this.spellBubble = new SpellBubble(this.game);
    }
    showStatus() {
        this.statusBubble = new StatusBubble(this.game);
    }
    showWarpBubble() {
        this.setSubstate('WARP_SELECTION');
    }
    startRoaming() {
        this.game.setNpcsPaused(false);
        this.showTextBubble = false;
        this.setSubstate('ROAMING');
    }
    talkToNpc() {
        const logic = this.game.getMapLogic();
        if (!logic) {
            console.log('Error: No map logic found for this map!  Cannot talk to NPCs!');
            return;
        }
        const npc = this.game.getNpcHeroIsFacing();
        const conversation = new Conversation(this.game, true);
        if (npc) {
            const hero = this.game.hero;
            //var newNpcDir = this.getHero().direction.opposite();
            const newNpcDir = (hero.direction + 2) % 4;
            npc.direction = newNpcDir;
            conversation.setSegments(logic.npcText(npc, this.game));
        }
        else {
            conversation.addSegment('There is no one there.');
        }
        this.showTextBubble = true;
        this.textBubble.setConversation(conversation);
        this.setSubstate('TALKING');
    }
    warpTo(location) {
        this.setSubstate('ROAMING');
        Cheats.warp(this.game, location);
    }
}
RoamingState.OVERNIGHT_DARK_TIME = 2500;
RoamingState.OVERNIGHT_FADE_TIME = 500;
RoamingState.totalTime = 0;
//# sourceMappingURL=RoamingState.js.map