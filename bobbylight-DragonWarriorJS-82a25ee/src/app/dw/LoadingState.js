import { BitmapFont, FadeOutInState, ImageAtlas, Utils } from 'gtp';
import { BaseState } from './BaseState';
import { Weapon } from './Weapon';
import { Armor } from './Armor';
import { Shield } from './Shield';
import { GameStudioAdvertState } from './GameStudioAdvertState';
import { registerGeneratedRpgAudioAssets, registerGeneratedRpgImageAssets } from './ProceduralRpgAssetSystem';
import { registerCoreAudioAssets } from './Sounds';
export class LoadingState extends BaseState {
    constructor(game) {
        super(game);
        this.assetsLoaded = false;
    }
    static createArmorArray(armors) {
        const armorArray = [];
        for (const armorName in armors) {
            if (Object.prototype.hasOwnProperty.call(armors, armorName)) {
                armorArray.push(armors[armorName]);
            }
        }
        armorArray.sort((a, b) => {
            return a.defense - b.defense;
        });
        return armorArray;
    }
    static createArmorMap(armors) {
        const map = {};
        for (const armorName in armors) {
            if (Object.prototype.hasOwnProperty.call(armors, armorName)) {
                map[armorName] = new Armor(armorName, armors[armorName]);
            }
        }
        return map;
    }
    static createShieldArray(shields) {
        const shieldArray = [];
        for (const shieldName in shields) {
            if (Object.prototype.hasOwnProperty.call(shields, shieldName)) {
                shieldArray.push(shields[shieldName]);
            }
        }
        shieldArray.sort((a, b) => {
            return a.defense - b.defense;
        });
        return shieldArray;
    }
    static createShieldMap(shields) {
        const map = {};
        for (const shieldName in shields) {
            if (Object.prototype.hasOwnProperty.call(shields, shieldName)) {
                map[shieldName] = new Shield(shieldName, shields[shieldName]);
            }
        }
        return map;
    }
    static createWeaponsArray(weapons) {
        const weaponArray = [];
        for (const weaponName in weapons) {
            if (Object.prototype.hasOwnProperty.call(weapons, weaponName)) {
                weaponArray.push(weapons[weaponName]);
            }
        }
        weaponArray.sort((a, b) => {
            return a.power - b.power;
        });
        return weaponArray;
    }
    static createWeaponsMap(weapons) {
        const map = {};
        for (const weaponName in weapons) {
            if (Object.prototype.hasOwnProperty.call(weapons, weaponName)) {
                map[weaponName] = new Weapon(weaponName, weapons[weaponName]);
            }
        }
        return map;
    }
    update(delta) {
        this.handleDefaultKeys();
        if (!this.assetsLoaded) {
            console.log('LoadingState: assets not loaded, initializing asset loading...');
            this.assetsLoaded = true;
            const game = this.game;
            console.log('LoadingState: adding assets...');
            game.assets.addImage('title', 'res/title.png');
            game.assets.addSpriteSheet('hero', 'res/hero.png', 16, 16, 1, 1, true);
            game.assets.addSpriteSheet('npcs', 'res/npcs.png', 16, 16, 1, 1, true);
            game.assets.addImage('battleBG', 'res/battle_backgrounds.png');
            game.assets.addImage('font', 'res/font_8x9.png');
            void game.assets.addJson('enemies', 'res/enemies.json');
            void game.assets.addJson('enemyTerritories', 'res/enemyTerritories.json');
            game.assets.addCanvas('enemiesImage', 'res/monsters.png');
            void game.assets.addJson('enemyAtlas', 'res/enemyAtlas.json');
            void game.assets.addJson('tileset_tiles.json', 'res/maps/tileset_tiles.json');
            void game.assets.addJson('enemy_territory_tiles.json', 'res/maps/enemy_territory_tiles.json');
            void game.assets.addJson('collision_tiles.json', 'res/maps/collision_tiles.json');
            void game.assets.addJson('overworld.json', 'res/maps/overworld.json');
            void game.assets.addJson('equipment', 'res/equipment.json');
            void game.assets.addJson('brecconary.json', 'res/maps/brecconary.json');
            void game.assets.addJson('tantegelCastle.json', 'res/maps/tantegelCastle.json');
            void game.assets.addJson('tantegelCastleUpstairs.json', 'res/maps/tantegelCastleUpstairs.json');
            void game.assets.addJson('erdricksCave1.json', 'res/maps/erdricksCave1.json');
            void game.assets.addJson('erdricksCave2.json', 'res/maps/erdricksCave2.json');
            void game.assets.addJson('garinham.json', 'res/maps/garinham.json');
            registerCoreAudioAssets(game);
            registerGeneratedRpgAudioAssets(game);
            registerGeneratedRpgImageAssets(game);
            game.assets.onLoad(() => {
                // TODO: This could be done much, much more cleanly
                const enemyJson = game.assets.get('enemyAtlas');
                const atlas = new ImageAtlas(game.assets.get('enemiesImage'), enemyJson);
                // delete game.assets.get('monsters');
                const images = atlas.parse(game.scale);
                for (const id in images) {
                    if (Object.prototype.hasOwnProperty.call(images, id)) {
                        game.assets.set(id, images[id]);
                    }
                }
                const equipment = game.assets.get('equipment');
                const weaponsMap = LoadingState.createWeaponsMap(equipment.weapons);
                game.assets.set('weapons', weaponsMap);
                game.assets.set('weaponsArray', LoadingState.createWeaponsArray(weaponsMap));
                const armorMap = LoadingState.createArmorMap(equipment.armor);
                game.assets.set('armor', armorMap);
                game.assets.set('armorArray', LoadingState.createArmorArray(armorMap));
                const shieldMap = LoadingState.createShieldMap(equipment.shields);
                game.assets.set('shields', shieldMap);
                game.assets.set('shieldArray', LoadingState.createShieldArray(shieldMap));
                const font = game.assets.get('font');
                game.assets.set('font', new BitmapFont(font, 8, 9, 1, 1, game.scale));
                game.assets.addTmxMap(game.initLoadedMap('overworld.json'));
                game.assets.addTmxMap(game.initLoadedMap('brecconary.json'));
                game.assets.addTmxMap(game.initLoadedMap('tantegelCastle.json'));
                game.assets.addTmxMap(game.initLoadedMap('tantegelCastleUpstairs.json'));
                game.assets.addTmxMap(game.initLoadedMap('erdricksCave1.json'));
                game.assets.addTmxMap(game.initLoadedMap('erdricksCave2.json'));
                game.assets.addTmxMap(game.initLoadedMap('garinham.json'));
                game.assets.onLoad(() => {
                    const skipTitle = Utils.getRequestParam('skipTitle');
                    if (skipTitle !== null) { // Allow empty strings
                        game.startNewGame();
                    }
                    else {
                        game.setState(new FadeOutInState(this, new GameStudioAdvertState(this.game)));
                    }
                });
            });
        }
    }
    render(ctx) {
        const game = this.game;
        game.clearScreen('rgb(30, 30, 60)');
        // RPG loading flavor
        const loadingTexts = [
            'Preparing your adventure...',
            'Sharpening swords and polishing armor...',
            'Gathering heroes at the tavern...',
            'Rolling dice for luck...',
            'Enchanting spells and potions...',
            'Loading epic quests...',
        ];
        // Animate loading dots
        const time = Date.now();
        const dots = '.'.repeat(Math.floor(time / 400) % 4 + 1);
        const textIndex = Math.floor(time / 2000) % loadingTexts.length;
        const str = loadingTexts[textIndex] + dots;
        ctx.font = 'bold 28px Serif';
        const textMetrics = ctx.measureText(str);
        this.textX = (game.getWidth() - textMetrics.width) / 2;
        const fontDescentGuess = 8;
        this.textY = (game.getHeight() - fontDescentGuess) / 2;
        ctx.fillStyle = 'rgb(255, 255, 210)';
        ctx.fillText(str, this.textX, this.textY);
        // Optionally, show a pixel-art hero sprite after that asset is ready.
        try {
            const heroSheet = game.assets.get('hero');
            const x = (game.getWidth() - 48) / 2;
            const y = this.textY + 40;
            heroSheet.drawSprite(ctx, x, y, 0, 0);
        }
        catch (e) {
            // Hero sprite is not loaded yet; keep showing text-only loading UI.
        }
        // Add RPG border or frame (simple decorative corners)
        ctx.strokeStyle = 'gold';
        ctx.lineWidth = 4;
        ctx.strokeRect(32, 32, game.getWidth() - 64, game.getHeight() - 64);
    }
}
//# sourceMappingURL=LoadingState.js.map