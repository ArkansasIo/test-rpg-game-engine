// --- UI Hook: Add a button to open the archetype asset gallery ---
export function addArchetypeGalleryButton() {
    if (document.getElementById('archetype-gallery-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'archetype-gallery-btn';
    btn.textContent = 'Show Archetype Assets';
    btn.style.position = 'fixed';
    btn.style.top = '80px';
    btn.style.right = '20px';
    btn.style.zIndex = '9999';
    btn.style.background = '#444';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.padding = '10px 18px';
    btn.style.borderRadius = '8px';
    btn.style.fontWeight = 'bold';
    btn.style.cursor = 'pointer';
    btn.onclick = () => showArchetypeAssetsUI(32);
    document.body.appendChild(btn);
}

// Call this function from your main game UI setup to enable the gallery button:
// addArchetypeGalleryButton();
// --- EXTENSIBLE ARCHETYPE-BASED RPG GENERATOR ---
export interface Archetype {
    key: string;
    theme: 'elden' | 'dnd5e' | 'mix';
    category: 'monster' | 'humanoid' | 'boss' | 'weapon' | 'armor' | 'item' | 'zone';
    tags: string[];
    sprite: (size: number) => HTMLCanvasElement;
    loot?: string[];
    dndKind?: string;
    dndType?: string;
}

// Example archetypes (expand as needed)
export const ARCHETYPES: Archetype[] = [
    {
        key: 'dnd_goblin_skirmisher',
        theme: 'dnd5e',
        category: 'monster',
        tags: ['goblin', 'fast'],
        sprite: (size) => ProceduralAssetGenerator.generateEnemySprite('classic', size),
        loot: ['Copper Coins', 'Crude Dagger', 'Goblin Trinket'],
        dndKind: 'skirmisher',
        dndType: 'humanoid',
    },
    {
        key: 'dnd_skeleton_warrior',
        theme: 'dnd5e',
        category: 'monster',
        tags: ['undead', 'melee'],
        sprite: (size) => ProceduralAssetGenerator.generateEnemySprite('dark', size),
        loot: ['Bone Shard', 'Rusty Sword', 'Old Sigil'],
        dndKind: 'brute',
        dndType: 'undead',
    },
    {
        key: 'dnd_dragon_whelp',
        theme: 'dnd5e',
        category: 'monster',
        tags: ['dragon', 'flying'],
        sprite: (size) => ProceduralAssetGenerator.generateEnemySprite('classic', size),
        loot: ['Scale Fragment', 'Claw Tip', 'Smoldering Ember'],
        dndKind: 'brute',
        dndType: 'dragon',
    },
    {
        key: 'elden_tarnished_wanderer',
        theme: 'elden',
        category: 'humanoid',
        tags: ['tarnished', 'melee'],
        sprite: (size) => ProceduralAssetGenerator.generateEnemySprite('dark', size),
        loot: ["Traveler's Wrap", 'Dull Rune Shard', 'Ration'],
        dndKind: 'skirmisher',
        dndType: 'humanoid',
    },
    {
        key: 'elden_rot_wretch',
        theme: 'elden',
        category: 'monster',
        tags: ['rot', 'ambush'],
        sprite: (size) => ProceduralAssetGenerator.generateEnemySprite('dark', size),
        loot: ['Rot Sap', 'Blighted Cloth', 'Rusted Rune Shard'],
        dndKind: 'brute',
        dndType: 'undead',
    },
    {
        key: 'dnd_longsword',
        theme: 'dnd5e',
        category: 'weapon',
        tags: ['weapon', 'longsword'],
        sprite: (size) => ProceduralAssetGenerator.generateWeaponSprite('metal', size),
        loot: [],
    },
    {
        key: 'elden_gilded_shield',
        theme: 'elden',
        category: 'armor',
        tags: ['armor', 'shield', 'gilded'],
        sprite: (size) => ProceduralAssetGenerator.generateArmorSprite('heavy', size),
        loot: [],
    },
    {
        key: 'dnd_potion',
        theme: 'dnd5e',
        category: 'item',
        tags: ['item', 'healing'],
        sprite: (size) => ProceduralAssetGenerator.generateItemSprite('potion', size),
        loot: [],
    },
    {
        key: 'elden_site_of_grace',
        theme: 'elden',
        category: 'zone',
        tags: ['checkpoint', 'safe_zone'],
        sprite: (size) => ProceduralAssetGenerator.generateItemSprite('potion', size),
        loot: [],
    },
];
// UI: Show all archetype assets
export function showArchetypeAssetsUI(size: number = 16) {
    const assets = batchGenerateArchetypeAssets(size);
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '120px';
    container.style.right = '20px';
    container.style.background = '#222';
    container.style.color = '#fff';
    container.style.padding = '16px';
    container.style.borderRadius = '8px';
    container.style.zIndex = '9999';
    container.innerHTML = `<h3>Archetype Assets</h3>`;
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    grid.style.gap = '16px';
    assets.forEach(asset => {
        const assetDiv = document.createElement('div');
        assetDiv.style.background = '#333';
        assetDiv.style.padding = '8px';
        assetDiv.style.borderRadius = '6px';
        assetDiv.style.textAlign = 'center';
        const img = document.createElement('img');
        img.src = asset.spriteUrl || '';
        img.width = 48;
        img.height = 48;
        assetDiv.appendChild(img);
        const label = document.createElement('div');
        label.textContent = `${asset.key} [${asset.category}]`;
        label.style.fontSize = '12px';
        label.style.marginTop = '4px';
        assetDiv.appendChild(label);
        const statsDiv = document.createElement('div');
        statsDiv.style.fontSize = '11px';
        statsDiv.style.marginTop = '4px';
        statsDiv.textContent = Object.entries(asset.stats).map(([k, v]) => `${k}: ${v}`).join(' | ');
        assetDiv.appendChild(statsDiv);
        // Click to inspect
        img.addEventListener('click', () => {
            alert(`Key: ${asset.key}\nCategory: ${asset.category}\nTheme: ${asset.theme}\nTags: ${asset.tags.join(', ')}\nStats: ${JSON.stringify(asset.stats)}\nLoot: ${asset.loot.join(', ')}`);
        });
        grid.appendChild(assetDiv);
    });
    container.appendChild(grid);
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.marginTop = '12px';
    closeBtn.onclick = () => container.remove();
    container.appendChild(closeBtn);
    document.body.appendChild(container);
}

// Generate statblock (D&D 5e style)
function generateDnd5eStatblock(kind: string): Record<string, number> {
    const base: Record<string, number> = {
        str: 12, dex: 12, con: 12, int: 12, wis: 12, cha: 12
    };
    if (kind === 'brute') base.str = 16;
    if (kind === 'skirmisher') base.dex = 16;
    if (kind === 'caster') base.int = 16;
    // Add random drift
    Object.keys(base).forEach(k => {
        base[k] += Math.floor(Math.random() * 5) - 2;
        base[k] = Math.max(3, Math.min(20, base[k]));
    });
    return base;
}

// Generate loot
function generateLoot(lootPool: string[]): string[] {
    const drops: string[] = [];
    for (let i = 0; i < Math.ceil(Math.random() * 2); i++) {
        drops.push(lootPool[Math.floor(Math.random() * lootPool.length)]);
    }
    return drops;
}

// Generate a procedural RPG asset from an archetype
export function generateArchetypeAsset(archetype: Archetype, size: number = 16) {
    const statblock = generateDnd5eStatblock(archetype.dndKind || 'balanced');
    const loot = archetype.loot ? generateLoot(archetype.loot) : [];
    const sprite = archetype.sprite(size);
    const spriteUrl = ProceduralAssetGenerator.exportCanvasAsPng(sprite);
    return {
        key: archetype.key,
        theme: archetype.theme,
        category: archetype.category,
        tags: archetype.tags,
        stats: statblock,
        loot,
        spriteUrl,
    };
}

// Batch generate assets from all archetypes
export function batchGenerateArchetypeAssets(size: number = 16) {
    return ARCHETYPES.map(a => generateArchetypeAsset(a, size));
}
import { DwGame } from './DwGame';
import { GENERATED_AUDIO_ASSET_PATHS } from './GeneratedAudioAssetPaths';
import { GENERATED_IMAGE_ASSET_PATHS } from './GeneratedImageAssetPaths';
import { GENERATED_CHARACTER_PORTRAIT_PATHS } from './GeneratedCharacterPortraitPaths';

export type RpgTheme = 'classic' | 'eldenRing' | 'dnd5e' | 'fantasy';
export type EncounterIntensity = 'low' | 'medium' | 'high' | 'boss';
export type CombatEvent = 'slash' | 'impact' | 'parry' | 'crit' | 'spellArcane' | 'spellDivine';

export interface ProceduralAssetGenState {
    assetType: string;
    theme: string;
    size: number;
    color: string;
    shape: string;
    outline: boolean;
    gradient: boolean;
    randomize: boolean;
    scale: number;
}

interface ThemeProfile {
    townMusic: string;
    dungeonMusic: string;
    battleMusic: string;
    bossMusic: string;
    combatSfx: Record<CombatEvent, string[]>;
}

const THEME_PROFILES = new Map<RpgTheme, ThemeProfile>([
    [ 'classic', {
        townMusic: 'MUSIC_TOWN',
        dungeonMusic: 'MUSIC_DUNGEON_FLOOR_1',
        battleMusic: 'MUSIC_BATTLE',
        bossMusic: 'MUSIC_BATTLE',
        combatSfx: {
            slash: [ 'attack', 'hit' ],
            impact: [ 'receiveDamage', 'bump' ],
            parry: [ 'missed1', 'missed2' ],
            crit: [ 'excellentMove' ],
            spellArcane: [ 'castSpell' ],
            spellDivine: [ 'castSpell' ],
        },
    } ],
    [ 'eldenRing', {
        townMusic: 'MUSIC_ELDEN_RING_CATHEDRAL',
        dungeonMusic: 'MUSIC_ELDEN_RING_LEGACY_DUNGEON',
        battleMusic: 'MUSIC_ELDEN_RING_FIELD',
        bossMusic: 'MUSIC_ELDEN_RING_BOSS',
        combatSfx: {
            slash: [ 'eldenBladeSlash', 'eldenAshOfWar' ],
            impact: [ 'eldenHeavyImpact', 'fantasyBossStomp' ],
            parry: [ 'eldenParry' ],
            crit: [ 'eldenGreatRuneActivate', 'excellentMove' ],
            spellArcane: [ 'eldenMagicBurst', 'eldenHolyBurst' ],
            spellDivine: [ 'eldenHolyBurst', 'fantasyHealChime' ],
        },
    } ],
    [ 'dnd5e', {
        townMusic: 'MUSIC_DND5E_TAVERN',
        dungeonMusic: 'MUSIC_DND5E_DUNGEON',
        battleMusic: 'MUSIC_DND5E_BATTLE',
        bossMusic: 'MUSIC_DND5E_BOSS',
        combatSfx: {
            slash: [ 'dndSwordSwing', 'attack' ],
            impact: [ 'dndShieldBlock', 'receiveDamage' ],
            parry: [ 'dndShieldBlock', 'missed2' ],
            crit: [ 'dndCrit', 'excellentMove' ],
            spellArcane: [ 'dndSpellArcane', 'eldenMagicBurst' ],
            spellDivine: [ 'dndSpellDivine', 'fantasyHealChime' ],
        },
    } ],
    [ 'fantasy', {
        townMusic: 'MUSIC_FANTASY_TAVERN',
        dungeonMusic: 'MUSIC_FANTASY_DUNGEON',
        battleMusic: 'MUSIC_DND5E_BATTLE',
        bossMusic: 'MUSIC_ELDEN_RING_BOSS',
        combatSfx: {
            slash: [ 'eldenBladeSlash', 'dndSwordSwing' ],
            impact: [ 'fantasyBossStomp', 'eldenHeavyImpact' ],
            parry: [ 'eldenParry', 'dndShieldBlock' ],
            crit: [ 'excellentMove', 'dndCrit' ],
            spellArcane: [ 'fantasyPortalOpen', 'dndSpellArcane' ],
            spellDivine: [ 'fantasyHealChime', 'dndSpellDivine' ],
        },
    } ],
]);

const safePick = (items: string[], seed: number): string => {
    const index = Math.abs(seed) % items.length;
    return items[index];
};

export const chooseThemeMusic = (theme: RpgTheme, intensity: EncounterIntensity): string => {
    const profile = THEME_PROFILES.get(theme) ?? THEME_PROFILES.get('classic');
    if (!profile) {
        return 'MUSIC_OVERWORLD';
    }
    switch (intensity) {
        case 'low':
            return profile.townMusic;
        case 'medium':
            return profile.dungeonMusic;
        case 'high':
            return profile.battleMusic;
        case 'boss':
            return profile.bossMusic;
    }
};

export const chooseCombatSfx = (theme: RpgTheme, event: CombatEvent, seed = 0): string => {
    const profile = THEME_PROFILES.get(theme) ?? THEME_PROFILES.get('classic');
    if (!profile) {
        return 'hit';
    }
    return safePick(profile.combatSfx[event], seed);
};

export const getExplorationSfxByTheme = (theme: RpgTheme): string[] => {
    switch (theme) {
        case 'eldenRing':
            return [ 'eldenRunePickup', 'eldenMountStep', 'fantasyRelicHum' ];
        case 'dnd5e':
            return [ 'dndDiceRoll', 'dndTrapDisarm', 'dndCampfire' ];
        case 'fantasy':
            return [ 'fantasyPortalOpen', 'fantasyDragonRoar', 'fantasyHealChime' ];
        default:
            return [ 'openChest', 'door', 'talk' ];
    }
};

export const registerGeneratedRpgAudioAssets = (game: DwGame): void => {
    GENERATED_AUDIO_ASSET_PATHS.forEach((assetPath: string, key: string) => {
        void game.assets.addSound(key, assetPath);
    });
};

export const registerGeneratedRpgImageAssets = (game: DwGame): void => {
    GENERATED_IMAGE_ASSET_PATHS.forEach((assetPath: string, key: string) => {
        game.assets.addImage(key, assetPath);
    });
    GENERATED_CHARACTER_PORTRAIT_PATHS.forEach((assetPath: string, key: string) => {
        game.assets.addImage(key, assetPath);
    });
};

export class ProceduralAssetGenerator {
    static saveAssetToLocalStorage(key: string, pngUrl: string, state: ProceduralAssetGenState) {
        const assetData = { pngUrl, state };
        const assets = JSON.parse(localStorage.getItem('proceduralAssets') || '{}') as Record<string, unknown>;
        assets[key] = assetData;
        localStorage.setItem('proceduralAssets', JSON.stringify(assets));
    }

    static generateCustomSprite(state: ProceduralAssetGenState, assetType: string): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.width = state.size;
        canvas.height = state.size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return canvas;
        }

        if (state.gradient) {
            const grad = ctx.createLinearGradient(0, 0, state.size, state.size);
            grad.addColorStop(0, state.color);
            grad.addColorStop(1, state.theme === 'dark' ? '#1f1f1f' : '#ffffff');
            ctx.fillStyle = grad;
        } else {
            ctx.fillStyle = state.theme === 'dark' ? '#1f1f1f' : state.color;
        }
        ctx.fillRect(0, 0, state.size, state.size);

        let offset = 0;
        let shapeSize = state.size / 2;
        if (state.randomize) {
            offset = Math.floor(Math.random() * (state.size / 4));
            shapeSize = state.size / 2 + Math.floor(Math.random() * (state.size / 4));
        }

        ctx.fillStyle = state.color;
        switch (state.shape) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(state.size / 2 + offset, state.size / 2 + offset, shapeSize / 2, 0, 2 * Math.PI);
                ctx.fill();
                break;
            case 'diamond':
                ctx.save();
                ctx.translate(state.size / 2 + offset, state.size / 2 + offset);
                ctx.rotate(Math.PI / 4);
                ctx.fillRect(-shapeSize / 2, -shapeSize / 2, shapeSize, shapeSize);
                ctx.restore();
                break;
            default:
                ctx.fillRect(state.size / 4 + offset, state.size / 4 + offset, shapeSize, shapeSize);
        }

        if (state.outline) {
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(1, 1, state.size - 2, state.size - 2);
        }

        if (assetType === 'weapon') {
            ctx.strokeStyle = '#ffde88';
            ctx.beginPath();
            ctx.moveTo(state.size / 2, state.size / 5);
            ctx.lineTo(state.size / 2, state.size * 4 / 5);
            ctx.stroke();
        }
        return canvas;
    }

    static generateEnemySprite(theme: string, size = 16): HTMLCanvasElement {
        return this.generateCustomSprite({
            assetType: 'enemy',
            theme,
            size,
            color: theme === 'dark' ? '#aa3333' : '#4477ff',
            shape: 'square',
            outline: true,
            gradient: false,
            randomize: true,
            scale: 2,
        }, 'enemy');
    }

    static generateWeaponSprite(theme: string, size = 16): HTMLCanvasElement {
        return this.generateCustomSprite({
            assetType: 'weapon',
            theme,
            size,
            color: theme === 'metal' ? '#9aa0aa' : '#ffcc66',
            shape: 'diamond',
            outline: true,
            gradient: true,
            randomize: false,
            scale: 2,
        }, 'weapon');
    }

    static generateBossSprite(theme: string, size = 16): HTMLCanvasElement {
        return this.generateCustomSprite({
            assetType: 'boss',
            theme,
            size,
            color: theme === 'boss' ? '#9c1a1a' : '#3d9c3d',
            shape: 'circle',
            outline: true,
            gradient: true,
            randomize: true,
            scale: 2,
        }, 'boss');
    }

    static generateArmorSprite(theme: string, size = 16): HTMLCanvasElement {
        return this.generateCustomSprite({
            assetType: 'armor',
            theme,
            size,
            color: theme === 'heavy' ? '#666' : '#bfc6d0',
            shape: 'square',
            outline: true,
            gradient: false,
            randomize: false,
            scale: 2,
        }, 'armor');
    }

    static generateItemSprite(theme: string, size = 16): HTMLCanvasElement {
        return this.generateCustomSprite({
            assetType: 'item',
            theme,
            size,
            color: theme === 'potion' ? '#2ac8cc' : '#f0a040',
            shape: 'circle',
            outline: true,
            gradient: true,
            randomize: false,
            scale: 2,
        }, 'item');
    }

    static exportCanvasAsPng(canvas: HTMLCanvasElement): string {
        return canvas.toDataURL('image/png');
    }
}

export function useProceduralAssetInGame(assetKey: string, assetData: { pngUrl?: string }, game: { hero?: { sprite?: string } }) {
    if (game?.hero && assetData?.pngUrl) {
        game.hero.sprite = assetData.pngUrl;
    }
}

export function showProceduralAssetGalleryUI(onSelect?: (assetKey: string, assetData: unknown) => void) {
    const assets = JSON.parse(localStorage.getItem('proceduralAssets') || '{}') as Record<string, unknown>;
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '60px';
    container.style.right = '20px';
    container.style.background = '#222';
    container.style.color = '#fff';
    container.style.padding = '16px';
    container.style.borderRadius = '8px';
    container.style.zIndex = '9999';
    container.innerHTML = '<h3>Saved Procedural Assets</h3>';

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
    grid.style.gap = '12px';
    Object.entries(assets).forEach(([key, data]) => {
        const item = document.createElement('button');
        item.textContent = key;
        item.onclick = () => {
            if (onSelect) {
                onSelect(key, data);
            }
            container.remove();
        };
        grid.appendChild(item);
    });

    container.appendChild(grid);
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.marginTop = '12px';
    closeBtn.onclick = () => container.remove();
    container.appendChild(closeBtn);
    document.body.appendChild(container);
}

export function showBatchRpgAssetsUI(count = 10) {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '100px';
    container.style.right = '20px';
    container.style.background = '#222';
    container.style.color = '#fff';
    container.style.padding = '16px';
    container.style.borderRadius = '8px';
    container.style.zIndex = '9999';
    container.innerHTML = `<h3>Batch Generated RPG Assets (${count})</h3>`;
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.onclick = () => container.remove();
    container.appendChild(closeBtn);
    document.body.appendChild(container);
}

export function showProceduralAssetGeneratorUI() {
    const state: ProceduralAssetGenState = {
        assetType: 'enemy',
        theme: 'classic',
        size: 16,
        color: '#ffffff',
        shape: 'square',
        outline: true,
        gradient: false,
        randomize: true,
        scale: 2,
    };
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.background = '#222';
    container.style.color = '#fff';
    container.style.padding = '16px';
    container.style.borderRadius = '8px';
    container.style.zIndex = '9999';
    container.innerHTML = `
        <h3>Procedural Asset Generator</h3>
        <select id="assetType">
            <option value="enemy">Enemy</option>
            <option value="boss">Boss</option>
            <option value="weapon">Weapon</option>
            <option value="armor">Armor</option>
            <option value="item">Item</option>
        </select>
        <button id="generateBtn">Generate</button>
        <div id="assetPreview" style="margin-top:12px;"></div>
        <button id="closeAssetGenUI" style="margin-top:8px;">Close</button>
    `;
    document.body.appendChild(container);

    container.querySelector('#generateBtn')?.addEventListener('click', () => {
        state.assetType = (container.querySelector('#assetType') as HTMLSelectElement).value;
        let canvas: HTMLCanvasElement;
        switch (state.assetType) {
            case 'boss':
                canvas = ProceduralAssetGenerator.generateBossSprite(state.theme, state.size);
                break;
            case 'weapon':
                canvas = ProceduralAssetGenerator.generateWeaponSprite(state.theme, state.size);
                break;
            case 'armor':
                canvas = ProceduralAssetGenerator.generateArmorSprite(state.theme, state.size);
                break;
            case 'item':
                canvas = ProceduralAssetGenerator.generateItemSprite(state.theme, state.size);
                break;
            default:
                canvas = ProceduralAssetGenerator.generateEnemySprite(state.theme, state.size);
                break;
        }

        const preview = container.querySelector('#assetPreview');
        if (!preview) {
            return;
        }
        preview.innerHTML = '';
        canvas.style.width = `${state.size * state.scale}px`;
        canvas.style.height = `${state.size * state.scale}px`;
        preview.appendChild(canvas);
    });

    container.querySelector('#closeAssetGenUI')?.addEventListener('click', () => {
        container.remove();
    });
}
