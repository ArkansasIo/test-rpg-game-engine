export interface GeneratedKingdom {
    id: number;
    name: string;
    color: string;
    capitalCol: number;
    capitalRow: number;
}

export interface GeneratedWorldMap {
    worldName: string;
    widthKm: number;
    heightKm: number;
    cols: number;
    rows: number;
    seed: string;
    tiles: number[][];
    kingdoms: GeneratedKingdom[];
}

const KINGDOM_COLORS = [
    '#7a3b2e',
    '#2e5f7a',
    '#2f6a43',
    '#7a6f2e',
    '#5f2e7a',
    '#7a4e2e',
    '#2e7a75',
    '#6b2e4f',
    '#59612b',
];

const KINGDOM_NAMES = [
    'Stormmarch',
    'Ashen Crown',
    'Verdant Reach',
    'Sable Keep',
    'Sunken Throne',
    'Moonspire',
    'Iron Wilds',
    'Rune Vale',
    'Erdcrest',
];

const WATER_TILE = -1;

function stringToSeed(input: string): number {
    let h = 2166136261;
    for (let i = 0; i < input.length; i++) {
        h ^= input.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function mulberry32(seed: number): () => number {
    let t = seed;
    return () => {
        t += 0x6D2B79F5;
        let r = Math.imul(t ^ (t >>> 15), 1 | t);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
}

function normalize(value: number, min: number, max: number): number {
    if (max - min === 0) {
        return 0;
    }
    return (value - min) / (max - min);
}

export function createGeneratedWorldMap(seed: string): GeneratedWorldMap {
    const cols = 180;
    const rows = 96;
    const kingdomCount = 9;
    const random = mulberry32(stringToSeed(seed));

    const kingdoms: GeneratedKingdom[] = [];
    for (let i = 0; i < kingdomCount; i++) {
        kingdoms.push({
            id: i,
            name: KINGDOM_NAMES[i],
            color: KINGDOM_COLORS[i],
            capitalCol: Math.floor((0.1 + 0.8 * random()) * cols),
            capitalRow: Math.floor((0.1 + 0.8 * random()) * rows),
        });
    }

    const tiles: number[][] = Array.from({ length: rows }, () => Array(cols).fill(WATER_TILE));
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const nx = normalize(col, 0, cols - 1) * 2 - 1;
            const ny = normalize(row, 0, rows - 1) * 2 - 1;
            const radial = Math.sqrt(nx * nx + ny * ny);
            const coastBias = 0.88 - radial;
            const noise = (random() - 0.5) * 0.35;
            const land = coastBias + noise > 0;
            if (!land) {
                continue;
            }

            let bestKingdomId = 0;
            let bestDistance = Number.POSITIVE_INFINITY;
            for (const kingdom of kingdoms) {
                const dc = col - kingdom.capitalCol;
                const dr = row - kingdom.capitalRow;
                const d = dc * dc + dr * dr;
                if (d < bestDistance) {
                    bestDistance = d;
                    bestKingdomId = kingdom.id;
                }
            }
            tiles[row][col] = bestKingdomId;
        }
    }

    return {
        worldName: 'The Shattered Lands',
        widthKm: 40075,
        heightKm: 20037,
        cols,
        rows,
        seed,
        tiles,
        kingdoms,
    };
}

export function renderGeneratedWorldMapOverlay(
    ctx: CanvasRenderingContext2D,
    map: GeneratedWorldMap,
    heroWorldCol: number,
    heroWorldRow: number,
    currentMapName: string,
) {
    const panelX = 36;
    const panelY = 26;
    const panelW = 650;
    const panelH = 420;
    const mapX = panelX + 22;
    const mapY = panelY + 56;
    const mapW = panelW - 44;
    const mapH = 292;
    const tileW = mapW / map.cols;
    const tileH = mapH / map.rows;

    ctx.save();
    ctx.fillStyle = 'rgba(8, 10, 16, 0.92)';
    ctx.fillRect(panelX, panelY, panelW, panelH);
    ctx.strokeStyle = '#d8c47a';
    ctx.lineWidth = 2;
    ctx.strokeRect(panelX, panelY, panelW, panelH);

    ctx.fillStyle = '#e8ddb1';
    ctx.font = 'bold 18px serif';
    ctx.fillText(`${map.worldName} - Elden Style Atlas`, panelX + 16, panelY + 28);
    ctx.font = '13px serif';
    ctx.fillStyle = '#d1c9ab';
    ctx.fillText(`Earth-scale estimate: ${map.widthKm.toLocaleString()} km x ${map.heightKm.toLocaleString()} km`, panelX + 16, panelY + 46);

    for (let row = 0; row < map.rows; row++) {
        for (let col = 0; col < map.cols; col++) {
            const tile = map.tiles[row][col];
            if (tile === WATER_TILE) {
                ctx.fillStyle = '#10273a';
            } else {
                ctx.fillStyle = map.kingdoms[tile].color;
            }
            ctx.fillRect(mapX + col * tileW, mapY + row * tileH, tileW + 0.6, tileH + 0.6);
        }
    }

    ctx.strokeStyle = '#314354';
    ctx.strokeRect(mapX, mapY, mapW, mapH);

    ctx.fillStyle = '#f6e37a';
    const heroX = mapX + heroWorldCol * tileW;
    const heroY = mapY + heroWorldRow * tileH;
    ctx.beginPath();
    ctx.arc(heroX, heroY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffe';
    ctx.font = '12px serif';
    ctx.fillText(`You are here (${currentMapName})`, heroX + 8, heroY - 8);

    ctx.fillStyle = '#d9c88d';
    ctx.font = '11px serif';
    for (let i = 0; i < map.kingdoms.length; i++) {
        const kingdom = map.kingdoms[i];
        const legendX = panelX + 18 + (i % 3) * 210;
        const legendY = panelY + 365 + Math.floor(i / 3) * 16;
        ctx.fillStyle = kingdom.color;
        ctx.fillRect(legendX, legendY - 9, 10, 10);
        ctx.fillStyle = '#d9c88d';
        ctx.fillText(`${kingdom.name}`, legendX + 14, legendY);
    }

    ctx.fillStyle = '#a8a8a8';
    ctx.fillText('Press G to close world map', panelX + panelW - 150, panelY + panelH - 8);
    ctx.restore();
}
