import { FadeOutInState, Game, getProperty, Keys, Utils, } from 'gtp';
import { createNewAdventureLog, loadAdventureLog, saveAdventureLog } from './AdventureLog';
import { Hero } from './Hero';
import { Npc } from './Npc';
import { getItemByName, HERB } from './Item';
import { Direction } from './Direction';
import { getNpcType } from './NpcType';
import { Door } from './Door';
import { Party } from './Party';
import { MapChangeState } from './MapChangeState';
import { RoamingState } from './RoamingState';
import { DwMap } from './DwMap';
import { BattleState } from './BattleState';
import { BattleTransitionState } from './BattleTransitionState';
import { toLocationString } from './LocationString';
import { Brecconary } from './mapLogic/brecconary';
import { ErdricksCave1 } from './mapLogic/erdricksCave1';
import { ErdricksCave2 } from './mapLogic/erdricksCave2';
import { Garinham } from './mapLogic/garinham';
import { Overworld } from './mapLogic/overworld';
import { TantegelCastle } from './mapLogic/tantegelCastle';
import { MenuBar } from './MenuBar';
import { InventoryMenu } from './InventoryMenu';
import { EquipmentMenu } from './EquipmentMenu';
import { SkillsMenu } from './SkillsMenu';
import { QuestsMenu } from './QuestsMenu';
import { MapMenu } from './MapMenu';
import { SettingsMenu } from './SettingsMenu';
import { drawFantasyBackdrop } from './FantasyOverlayUI';
import { resolveSoundCandidates } from './Sounds';
export { Game };
export class DwGame extends Game {
    /**
     * Public setter for adventure log (for use by CharacterCreationState)
     */
    setAdventureLog(log) {
        this.adventureLog = log;
    }
    constructor(args) {
        super(args);
        this.activeMenu = null;
        this.runeQuests = [];
        this.talismans = [];
        this.bossFights = [];
        this.maps = {};
        this.npcs = [];
        this.adventureLog = createNewAdventureLog();
        this.bumpSoundDelay = 0;
        this.mapLogics = new Map();
        this.randomEncounters = true;
        this.torch = false;
        this.inside = false;
        this.npcsPaused = false;
        this.cameraDx = 0;
        this.cameraDy = 0;
        this.audioRoutingInstalled = false;
        this.sfxLastPlayedAt = new Map();
        this.sfxThrottleMs = new Map([
            ['talk', 55],
            ['menu', 70],
            ['bump', 120],
            ['stairs', 160],
        ]);
        // Create and initialize party
        this.hero = new Hero(this, { name: 'Erdrick' });
        this.party = new Party(this);
        this.party.addMember(this.hero);
        this.menuBar = new MenuBar(this);
        // Example: initialize rune quests
        this.runeQuests = [
            { name: 'Elden Ring Fragment', questStep: 1, description: 'Find the first fragment.' },
            { name: 'Erdtree Seal', questStep: 2, description: 'Obtain the sacred seal.' }
        ];
        // Example: initialize talismans
        this.talismans = [];
        // Example: initialize boss fights
        this.bossFights = [
            { name: 'Margit, the Fell Omen', hp: 1200, attack: 80, defense: 40, reward: 'Talisman Pouch' }
        ];
    }
    openInventory() {
        this.inventoryMenu = new InventoryMenu(this, this.party.getInventory().getItems());
        this.activeMenu = 'inventory';
    }
    openEquipment() {
        this.equipmentMenu = new EquipmentMenu(this, {
            weapon: this.hero.weapon,
            armor: this.hero.armor,
            shield: this.hero.shield
        });
        this.activeMenu = 'equipment';
    }
    openSkills() {
        var _a;
        this.skillsMenu = new SkillsMenu(this, (_a = this.hero.skills) !== null && _a !== void 0 ? _a : []);
        this.activeMenu = 'skills';
    }
    openQuests() {
        // Show rune/key item quests
        this.questsMenu = new QuestsMenu(this, this.runeQuests.map(q => ({ name: q.name, status: this.hero.questStep >= q.questStep ? 'Complete' : 'Incomplete', description: q.description })), (idx) => {
            // Advance quest logic
            const quest = this.runeQuests[idx];
            if (quest && this.hero.questStep < quest.questStep) {
                this.hero.questStep = quest.questStep;
                this.setStatusMessage(`Advanced quest: ${quest.name}`);
            }
        });
        this.activeMenu = 'quests';
    }
    openMap() {
        this.mapMenu = new MapMenu(this, this.getMap());
        this.activeMenu = 'map';
    }
    openSettings() {
        this.settingsMenu = new SettingsMenu(this);
        this.activeMenu = 'settings';
    }
    closeMenu() {
        this.activeMenu = null;
    }
    start() {
        super.start();
        this.installAudioRouting();
        this.npcs = [];
        this.bumpSoundDelay = 0;
        this.setCameraOffset(0, 0);
        this.inside = false;
        this.randomEncounters = true;
        this.torch = false;
        this.menuBar = new MenuBar(this);
        this.activeMenu = null;
        this.mapLogics.set('Brecconary', new Brecconary());
        this.mapLogics.set('erdricksCave1', new ErdricksCave1());
        this.mapLogics.set('erdricksCave2', new ErdricksCave2());
        this.mapLogics.set('Garinham', new Garinham());
        this.mapLogics.set('Overworld', new Overworld());
        this.mapLogics.set('TantegelCastle', new TantegelCastle());
        // Removed duplicate menu methods
        // openInventory, openEquipment, openSkills, openQuests, openMap, openSettings, closeMenu
        // These methods should be defined outside of the start method
        // Ensure they are defined in the class scope
        // Example: this.openInventory = function() { ... }
        // Example: this.openEquipment = function() { ... }
        // Example: this.openSkills = function() { ... }
        // Example: this.openQuests = function() { ... }
        // Example: this.openMap = function() { ... }
        // Example: this.openSettings = function() { ... }
        // Example: this.closeMenu = function() { ... }
    }
    installAudioRouting() {
        if (this.audioRoutingInstalled) {
            return;
        }
        this.audioRoutingInstalled = true;
        const audioObj = this.audio;
        const rawPlaySound = audioObj.playSound.bind(this.audio);
        const rawPlayMusic = audioObj.playMusic.bind(this.audio);
        const rawFadeOutMusic = audioObj.fadeOutMusic.bind(this.audio);
        audioObj.playSound = ((requestedId, ...args) => {
            var _a, _b, _c;
            const candidates = resolveSoundCandidates(requestedId);
            const canonical = (_a = candidates[0]) !== null && _a !== void 0 ? _a : requestedId;
            const now = Date.now();
            const throttleMs = (_b = this.sfxThrottleMs.get(canonical)) !== null && _b !== void 0 ? _b : 0;
            const lastPlayed = (_c = this.sfxLastPlayedAt.get(canonical)) !== null && _c !== void 0 ? _c : 0;
            if (throttleMs > 0 && now - lastPlayed < throttleMs) {
                return;
            }
            for (const candidate of candidates) {
                try {
                    const result = rawPlaySound(candidate, ...args);
                    this.sfxLastPlayedAt.set(canonical, now);
                    return result;
                }
                catch (err) {
                    // Try next candidate fallback.
                }
            }
            return undefined;
        });
        audioObj.playMusic = ((requestedId, ...args) => {
            if (!requestedId) {
                return rawPlayMusic(requestedId, ...args);
            }
            const candidates = resolveSoundCandidates(requestedId);
            for (const candidate of candidates) {
                try {
                    return rawPlayMusic(candidate, ...args);
                }
                catch (err) {
                    // Try next candidate fallback.
                }
            }
            return rawPlayMusic(requestedId, ...args);
        });
        audioObj.fadeOutMusic = ((requestedId, ...args) => {
            if (!requestedId) {
                return rawFadeOutMusic(requestedId, ...args);
            }
            const candidates = resolveSoundCandidates(requestedId);
            for (const candidate of candidates) {
                try {
                    return rawFadeOutMusic(candidate, ...args);
                }
                catch (err) {
                    // Try next candidate fallback.
                }
            }
            return rawFadeOutMusic(requestedId, ...args);
        });
    }
    actionKeyPressed() {
        return this.inputManager.isKeyDown(Keys.KEY_Z, true) || this.inputManager.enter(true);
    }
    anyKeyDown(clear = true) {
        const im = this.inputManager;
        return im.isKeyDown(Keys.KEY_Z, clear) || im.isKeyDown(Keys.KEY_X, clear) ||
            im.enter(clear);
    }
    cancelKeyPressed() {
        return this.inputManager.isKeyDown(Keys.KEY_X, true);
    }
    continueGame(id) {
        this.loadAdventureLog(id);
        this.transitionToGame();
    }
    cycleArmor() {
        var _a;
        if ((_a = this.hero) === null || _a === void 0 ? void 0 : _a.armor) {
            const curArmor = this.hero.armor.name;
            const armorArray = this.assets.get('armorArray');
            let i;
            for (i = 0; i < armorArray.length; i++) {
                if (curArmor === armorArray[i].name) {
                    break;
                }
            }
            i = (i + 1) % armorArray.length;
            this.hero.armor = armorArray[i];
            this.setStatusMessage('Armor changed to: ' + this.hero.armor.name);
        }
    }
    cycleShield() {
        var _a;
        if ((_a = this.hero) === null || _a === void 0 ? void 0 : _a.shield) {
            const curShield = this.hero.shield.name;
            const shieldArray = this.assets.get('shieldArray');
            let i;
            for (i = 0; i < shieldArray.length; i++) {
                if (curShield === shieldArray[i].name) {
                    break;
                }
            }
            i = (i + 1) % shieldArray.length;
            this.hero.shield = shieldArray[i];
            this.setStatusMessage(`Shield changed to: ${this.hero.shield.name}`);
        }
    }
    cycleWeapon() {
        var _a;
        if ((_a = this.hero) === null || _a === void 0 ? void 0 : _a.weapon) {
            const curWeapon = this.hero.weapon.name;
            const weaponArray = this.assets.get('weaponsArray');
            let i;
            for (i = 0; i < weaponArray.length; i++) {
                if (curWeapon === weaponArray[i].name) {
                    break;
                }
            }
            i = (i + 1) % weaponArray.length;
            this.hero.weapon = weaponArray[i];
            this.setStatusMessage('Weapon changed to: ' + this.hero.weapon.name);
        }
    }
    drawArrow(x, y) {
        this.drawString('\u007f', x, y); // DEL, but we use for our arrow
    }
    drawDownArrow(x, y) {
        this.drawString('\\', x, y); // '\' char replaced by down arrow
    }
    drawMap(ctx) {
        const hero = this.hero;
        const centerCol = hero.mapCol;
        const centerRow = hero.mapRow;
        const dx = hero.xOffs + this.cameraDx;
        const dy = hero.yOffs + this.cameraDy;
        //         if (this._drawMapCount === 10) {
        //            this.timer.start('drawMap');
        //         }
        this.getMap().draw(ctx, centerRow, centerCol, dx, dy);
        //         if (this._drawMapCount === 10) {
        //            this.timer.endAndLog('drawMap');
        //            this._drawMapCount = 0;
        //         }
    }
    drawString(text, x, y) {
        const textStr = typeof text === 'number' ? text.toString() : text;
        this.getFont().drawString(this.getRenderingContext(), textStr, x, y);
    }
    getAdventureLog() {
        return this.adventureLog;
    }
    getEnemy(name) {
        const enemyDatas = this.assets.get('enemies');
        return enemyDatas[name];
    }
    getFont() {
        return this.assets.get('font');
    }
    getMap() {
        if (!this.map) { // This is a logic error
            throw new Error('No map loaded!');
        }
        return this.map;
    }
    getMapLogic() {
        let logicFile = this.getMap().getProperty('logicFile');
        logicFile = logicFile.charAt(0).toUpperCase() + logicFile.substring(1);
        console.log(logicFile);
        return this.mapLogics.get(logicFile);
    }
    getMapXOffs() {
        const hero = this.hero;
        const centerCol = hero.mapCol;
        const dx = hero.xOffs;
        const tileSize = this.getTileSize();
        const xOffs = centerCol * tileSize + tileSize / 2 + dx - this.getWidth() / 2;
        return xOffs;
    }
    getMapYOffs() {
        const hero = this.hero;
        const centerRow = hero.mapRow;
        const dy = hero.yOffs;
        const tileSize = this.getTileSize();
        const yOffs = centerRow * tileSize + tileSize / 2 + dy - this.getHeight() / 2;
        return yOffs;
    }
    getParty() {
        return this.party;
    }
    /**
     * Returns whether the tile at a given location has a "roof" layer tile.
     */
    hasRoofTile(row, col) {
        const roofLayer = this.getMap().getLayerIfExists('tileLayer2');
        return roofLayer ? roofLayer.getData(row, col) > 0 : false;
    }
    initHeroFromAdventureLog() {
        const hero = this.hero;
        const log = this.adventureLog.hero;
        hero.hp = log.hp;
        hero.maxHp = log.maxHp;
        hero.mp = log.mp;
        hero.maxMp = log.maxMp;
        hero.level = log.level;
        hero.exp = log.exp;
        hero.strength = log.strength;
        hero.agility = log.agility;
        const weaponMap = this.assets.get('weapons');
        hero.weapon = weaponMap[log.sword];
        const armorMap = this.assets.get('armor');
        hero.armor = armorMap[log.armor];
        const shieldMap = this.assets.get('shields');
        hero.shield = shieldMap[log.shield];
    }
    initPartyFromAdventureLog() {
        const party = this.party;
        party.gold = this.adventureLog.party.gold;
        party.getInventory().clear();
        for (const itemName of this.adventureLog.party.inventory) {
            const item = getItemByName(itemName);
            if (item) {
                party.addInventoryItem(item);
            }
        }
    }
    /**
     * Starts loading a new map.  Fades out of the old one and into the new one.
     */
    loadMap(mapName, newRow, newCol, dir) {
        this.audio.playSound('stairs');
        const updatePlayer = () => {
            this.hero.setMapLocation(-1, -1); // Free the location he was in the map
            this.setMap(mapName + '.json');
            this.hero.setMapLocation(newRow, newCol);
            this.hero.direction = dir !== null && dir !== void 0 ? dir : Direction.SOUTH;
            this.inputManager.clearKeyStates(); // Prevent keydown from being read in the next screen
        };
        this.setState(new /*FadeOutInState*/ MapChangeState(this.state, this.state, updatePlayer));
    }
    resetMap(map) {
        map.npcs.forEach((npc) => {
            npc.reset();
        });
    }
    setMap(assetName) {
        const prevMap = this.map;
        console.log('Setting map to: ' + assetName);
        this.map = this.maps[assetName];
        this.resetMap(this.map);
        if (prevMap && prevMap.getProperty('requiresTorch', false) !==
            this.getMap().getProperty('requiresTorch', false)) {
            // You blow your torch out leaving a dungeon, but it stays lit
            // when going into another map in the same dungeon that is also dark
            this.setUsingTorch(false);
        }
        const newMusic = this.map.getProperty('music');
        if (newMusic !== this.audio.getCurrentMusic()) {
            this.audio.fadeOutMusic(newMusic);
        }
    }
    initLoadedMap(asset) {
        const data = this.assets.get(asset);
        const imagePathModifier = (imagePath) => {
            return imagePath.replace('../', 'res/');
        };
        const mapName = asset.substring(0, asset.indexOf('.')); // Remove trailing '.json'
        const map = new DwMap(mapName, data, {
            imagePathModifier: imagePathModifier,
            screenWidth: this.getWidth(),
            screenHeight: this.getHeight(),
            assets: this.assets,
        });
        map.setScale(this.scale);
        this.adjustGameMap(map);
        this.maps[asset] = map;
        return map;
    }
    loadAdventureLog(id) {
        this.adventureLog = loadAdventureLog(id);
        this.initHeroFromAdventureLog();
        this.initPartyFromAdventureLog();
    }
    saveAdventureLog() {
        var _a, _b, _c, _d, _e, _f;
        const log = this.adventureLog;
        const hero = this.hero;
        log.hero.hp = hero.hp;
        log.hero.maxHp = hero.maxHp;
        log.hero.mp = hero.mp;
        log.hero.maxMp = hero.maxMp;
        log.hero.level = hero.level;
        log.hero.exp = hero.exp;
        log.hero.strength = hero.strength;
        log.hero.agility = hero.agility;
        log.hero.sword = (_b = (_a = hero.weapon) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : log.hero.sword;
        log.hero.armor = (_d = (_c = hero.armor) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : log.hero.armor;
        log.hero.shield = (_f = (_e = hero.shield) === null || _e === void 0 ? void 0 : _e.name) !== null && _f !== void 0 ? _f : log.hero.shield;
        if (this.map) {
            log.hero.map = this.map.name;
            log.hero.row = hero.mapRow;
            log.hero.col = hero.mapCol;
            log.hero.direction = hero.direction;
        }
        log.party.gold = this.party.gold;
        log.party.inventory = this.party.getInventory().getItems().map((item) => item.name);
        saveAdventureLog(log);
    }
    adjustGameMap(map) {
        // Hide layers that shouldn't be shown. These could be marked as hidden in Tiled, but
        // it's useful to see their data while in the editor.
        for (let i = 0; i < map.getLayerCount(); i++) {
            const layer = map.getLayerByIndex(i);
            if (layer.name !== 'tileLayer') {
                layer.visible = false;
            }
        }
        map.npcs.length = 0;
        map.doors.length = 0;
        map.talkAcrosses.clear();
        map.chests.clear();
        const npcLayer = map.layersByName.get('npcLayer');
        if (npcLayer === null || npcLayer === void 0 ? void 0 : npcLayer.isObjectGroup()) {
            for (const obj of npcLayer.objects) {
                let chest;
                switch (obj.type) {
                    case 'npc':
                        map.npcs.push(this.parseNpc(obj));
                        break;
                    case 'door':
                        map.doors.push(this.parseDoor(obj));
                        break;
                    case 'talkAcross':
                        map.talkAcrosses.set(this.parseTalkAcrossKey(obj), true);
                        break;
                    case 'chest':
                        chest = this.parseChestContents(obj);
                        map.chests.set(chest.location, chest);
                        break;
                    default:
                        console.error(`Unhandled npcLayer object type in tiled map: ${obj.type}`);
                        break;
                }
            }
            map.removeLayer('npcLayer');
        }
        map.npcs.forEach((npc) => {
            map.getLayer('collisionLayer').setData(npc.mapRow, npc.mapCol, 1);
        });
        const hiddenItemLayer = map.layersByName.get('hiddenItemLayer');
        if (hiddenItemLayer === null || hiddenItemLayer === void 0 ? void 0 : hiddenItemLayer.isObjectGroup()) {
            for (const obj of hiddenItemLayer.objects) {
                let hiddenItem;
                switch (obj.type) {
                    case 'item':
                        hiddenItem = this.parseHiddenItem(obj);
                        map.hiddenItems.set(hiddenItem.location, hiddenItem);
                        break;
                    default:
                        console.error(`Unhandled hiddenItem object type in tiled map: ${obj.type}`);
                }
            }
        }
        // Don't need to set collision as it is already set in the map.
        // Should we require that?
        //         // Hide layers we aren't interested in seeing.
        //         map.getLayer('collisionLayer').setVisible(collisionLayerVisible);
        //         Layer layer = map.getLayer('enemyTerritoryLayer');
        //         if (layer!=null) {
        //            layer.setVisible(enemyTerritoryLayerVisible);
        //         }
    }
    parseChestContents(chest) {
        const id = chest.name;
        let value;
        const contentType = getProperty(chest, 'contentType');
        switch (contentType) {
            case 'gold':
                value = getProperty(chest, 'contents');
                break;
            default:
                console.error(`Invalid contentType for chest ${chest.name}: ${contentType}`);
                value = 1;
                break;
        }
        const tileSize = this.getTileSize();
        const row = chest.y / tileSize;
        const col = chest.x / tileSize;
        return {
            id,
            contentType,
            contents: value,
            location: toLocationString(row, col),
        };
    }
    parseDoor(obj) {
        const name = obj.name;
        const replacementTileIndex = parseInt(getProperty(obj, 'replacementTileIndex'), 10);
        const tileSize = this.getTileSize();
        const row = obj.y / tileSize;
        const col = obj.x / tileSize;
        return new Door(name, row, col, replacementTileIndex);
    }
    parseHiddenItem(hiddenItem) {
        const id = hiddenItem.name;
        let value;
        const itemType = getProperty(hiddenItem, 'item');
        switch (itemType) {
            case 'herb':
                value = HERB;
                break;
            default:
                console.error(`Invalid itemType for hiddenItem ${hiddenItem.name}: ${itemType}`);
                value = HERB;
                break;
        }
        const tileSize = this.getTileSize();
        const row = hiddenItem.y / tileSize;
        const col = hiddenItem.x / tileSize;
        return {
            id,
            // Must be a string before this to handle typos/bugs in the map file not specifying a valid type
            contentType: itemType,
            contents: value,
            location: toLocationString(row, col),
        };
    }
    parseNpc(obj) {
        const name = obj.name;
        let type;
        if (obj.propertiesByName.has('type')) {
            type = getNpcType(getProperty(obj, 'type'));
        }
        const tileSize = this.getTileSize();
        const row = obj.y / tileSize;
        const col = obj.x / tileSize;
        const tempDir = getProperty(obj, 'dir', 'SOUTH');
        let dir = Direction.fromString(tempDir); // || Direction.SOUTH;
        if (typeof dir === 'undefined') {
            dir = Direction.SOUTH;
        }
        const wanderStr = getProperty(obj, 'wanders', 'true');
        const wanders = wanderStr === 'true';
        const range = this.parseRange(getProperty(obj, 'range', ''));
        return new Npc(this, {
            name, type, direction: dir,
            range, wanders, mapRow: row, mapCol: col,
        });
    }
    parseRange(rangeStr) {
        let range;
        if (rangeStr) {
            const temp = rangeStr.split(/,\s*/);
            if (temp.length !== 4) {
                throw new Error(`Invalid range string: ${rangeStr}`);
            }
            range = {
                minCol: parseInt(temp[0], 10),
                minRow: parseInt(temp[1], 10),
                maxCol: parseInt(temp[2], 10),
                maxRow: parseInt(temp[3], 10),
            };
        }
        return range;
    }
    parseTalkAcrossKey(obj) {
        const tileSize = this.getTileSize();
        const row = obj.y / tileSize;
        const col = obj.x / tileSize;
        return toLocationString(row, col);
    }
    setCameraOffset(dx, dy) {
        this.cameraDx = dx;
        this.cameraDy = dy;
    }
    startNewGame() {
        this.loadAdventureLog();
        this.transitionToGame();
    }
    transitionToGame() {
        const log = this.adventureLog;
        const transitionLogic = () => {
            this.setMap(log.hero.map + '.json');
            this.hero.setMapLocation(log.hero.row, log.hero.col);
            this.hero.direction = log.hero.direction;
        };
        this.setState(new FadeOutInState(this.state, new RoamingState(this), transitionLogic));
    }
    setInsideOutside(inside) {
        this.inside = inside;
        this.getMap().getLayer('tileLayer').visible = !this.inside;
        this.getMap().getLayer('tileLayer2').visible = this.inside;
    }
    getDoorHeroIsFacing() {
        let row = this.hero.mapRow;
        let col = this.hero.mapCol;
        switch (this.hero.direction) {
            case Direction.NORTH:
                row--;
                break;
            case Direction.SOUTH:
                row++;
                break;
            case Direction.EAST:
                col++;
                break;
            case Direction.WEST:
                col--;
                break;
        }
        console.log(`Checking for door at: ${row}, ${col}`);
        return this.getMap().doors.find((door) => door.isAt(row, col));
    }
    getNpcHeroIsFacing() {
        let row = this.hero.mapRow;
        let col = this.hero.mapCol;
        do {
            switch (this.hero.direction) {
                case Direction.NORTH:
                    row--;
                    break;
                case Direction.SOUTH:
                    row++;
                    break;
                case Direction.EAST:
                    col++;
                    break;
                case Direction.WEST:
                    col--;
                    break;
            }
        } while (this.getShouldTalkAcross(row, col));
        return this.getMap().npcs.find((npc) => npc.isAt(row, col));
    }
    getShouldTalkAcross(row, col) {
        return !!this.getMap().talkAcrosses.get(toLocationString(row, col));
    }
    getUsingTorch() {
        return this.torch;
    }
    getWeapon(weapon) {
        const weaponMap = this.assets.get('weapons');
        return weaponMap[weapon];
    }
    getArmor(armor) {
        const armorMap = this.assets.get('armor');
        return armorMap[armor];
    }
    getCheatsEnabled() {
        return true;
    }
    getShield(shield) {
        const shieldMap = this.assets.get('shields');
        return shieldMap[shield];
    }
    getTileSize() {
        return 16 * this.scale;
    }
    getCollisionLayer() {
        return this.getMap().getLayer('collisionLayer');
    }
    bump() {
        if (this.playTime > this.bumpSoundDelay) {
            this.audio.playSound('bump');
            this.bumpSoundDelay = this.playTime + 300;
        }
    }
    removeChest(chest) {
        this.adventureLog.mapStates[this.getMap().name].openedChests.push(chest.id);
        this.getMap().removeChest(chest);
    }
    removeHiddenItem(hiddenItem) {
        this.adventureLog.mapStates[this.getMap().name].obtainedHiddenItems.push(hiddenItem.id);
        this.getMap().removeHiddenItem(hiddenItem);
    }
    renderStatusMessageImpl(ctx, message, color) {
        const x = 6;
        const y = this.canvas.height - 24;
        const menuOpen = this.activeMenu !== null;
        if (menuOpen) {
            drawFantasyBackdrop(ctx, this.canvas.width, this.canvas.height);
        }
        this.menuBar.render(ctx);
        const font = this.getFont();
        const w = font.stringWidth(message) + 8;
        const h = font.cellH + 8;
        ctx.fillStyle = 'rgba(7, 10, 16, 0.85)';
        ctx.fillRect(x - 4, y - 5, w, h);
        ctx.strokeStyle = '#b7934f';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 4, y - 5, w, h);
        this.drawString(message, x, y);
        // Render active menu if open
        if (this.activeMenu === 'inventory' && this.inventoryMenu) {
            this.inventoryMenu.render(ctx);
        }
        else if (this.activeMenu === 'equipment' && this.equipmentMenu) {
            this.equipmentMenu.render(ctx);
        }
        else if (this.activeMenu === 'skills' && this.skillsMenu) {
            this.skillsMenu.render(ctx);
        }
        else if (this.activeMenu === 'quests' && this.questsMenu) {
            this.questsMenu.render(ctx);
        }
        else if (this.activeMenu === 'map' && this.mapMenu) {
            this.mapMenu.render(ctx);
        }
        else if (this.activeMenu === 'settings' && this.settingsMenu) {
            this.settingsMenu.render(ctx);
        }
    }
    setHeroStats(hp, maxHp, mp, maxMp) {
        if (hp !== null) { // null => keep the same
            this.hero.hp = hp;
        }
        if (maxHp != null) { // null => keep the same
            this.hero.maxHp = maxHp;
        }
        if (typeof mp !== 'undefined') {
            this.hero.mp = mp;
        }
        if (typeof maxMp !== 'undefined') {
            this.hero.maxMp = maxMp;
        }
        this.setStatusMessage(`Hero stats now: ${this.hero.hp}/${this.hero.maxHp}, ${this.hero.mp}/${this.hero.maxMp}`);
    }
    setNpcsPaused(paused) {
        this.npcsPaused = paused;
    }
    setUsingTorch(usingTorch) {
        this.torch = usingTorch;
        this.setStatusMessage(`Using torch: ${usingTorch}`);
        return true;
    }
    stringHeight() {
        const font = this.assets.get('font'); // Need as 2 lines to appease linter
        return font.cellH; //charHeight();
    }
    stringWidth(str) {
        const font = this.assets.get('font'); // Need as 2 lines to appease linter
        return str ? str.length * font.cellW : 0;
    }
    startRandomEncounter() {
        if (this.randomEncounters) {
            const enemyTerritoryLayer = this.getMap().layersByName.get('enemyTerritoryLayer');
            if (enemyTerritoryLayer) {
                let territory = enemyTerritoryLayer.getData(this.hero.mapRow, this.hero.mapCol);
                if (territory > 0) {
                    // Enemy territory index is offset by the Tiled tileset's firstgid
                    // TODO: Remove call to private method
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                    territory = territory - this.map.getTilesetForGid(territory).firstgid;
                    if (territory >= 0) {
                        const territories = this.assets.get('enemyTerritories');
                        const possibleEnemies = territories[territory];
                        const enemyName = possibleEnemies[Utils.randomInt(0, possibleEnemies.length)];
                        this.setState(new BattleTransitionState(this, this.state, new BattleState(this, enemyName)));
                        return true;
                    }
                }
            }
        }
        return false;
    }
    toggleMuted() {
        const muted = this.audio.toggleMuted();
        this.setStatusMessage(muted ? 'Audio muted' : 'Audio enabled');
        return muted;
    }
    toggleRandomEncounters() {
        this.randomEncounters = !this.randomEncounters;
        this.setStatusMessage('Random encounters ' +
            (this.randomEncounters ? 'enabled' : 'disabled'));
    }
    toggleShowCollisionLayer() {
        const layer = this.getCollisionLayer();
        layer.visible = !layer.visible;
        this.setStatusMessage(layer.visible ?
            'Collision layer showing' : 'Collision layer hidden');
    }
    toggleShowTerritoryLayer() {
        const layer = this.getMap().getLayer('enemyTerritoryLayer');
        layer.visible = !layer.visible;
        this.setStatusMessage(layer.visible ?
            'Territory layer showing' : 'Territory layer hidden');
    }
    update() {
        super.update();
        // Open Inventory with 'I' key
        if (!this.activeMenu && this.inputManager.isKeyDown(Keys.KEY_I, true)) {
            this.openInventory();
            this.setStatusMessage('Opened Inventory');
            return;
        }
        if (this.activeMenu && this.cancelKeyPressed()) {
            this.closeMenu();
            this.setStatusMessage('Closed menu');
            return;
        }
        // Keyboard navigation for skills menu
        if (this.activeMenu === 'skills' && this.skillsMenu) {
            if (this.inputManager.up(true)) {
                this.skillsMenu.selectPrevSkill();
            }
            if (this.inputManager.down(true)) {
                this.skillsMenu.selectNextSkill();
            }
            if (this.inputManager.enter(true)) {
                this.skillsMenu.activateSelectedSkill();
            }
        }
        else if (this.activeMenu === 'quests' && this.questsMenu) {
            if (this.inputManager.up(true)) {
                this.questsMenu.selectPrevQuest();
            }
            if (this.inputManager.down(true)) {
                this.questsMenu.selectNextQuest();
            }
            if (this.inputManager.enter(true)) {
                this.questsMenu.activateSelectedQuest();
            }
        }
        else if (this.activeMenu === 'map' && this.mapMenu) {
            if (this.inputManager.up(true)) {
                this.mapMenu.selectPrevZone();
            }
            if (this.inputManager.down(true)) {
                this.mapMenu.selectNextZone();
            }
        }
        // Movement and other button fixes can be added here as needed
    }
}
//# sourceMappingURL=DwGame.js.map