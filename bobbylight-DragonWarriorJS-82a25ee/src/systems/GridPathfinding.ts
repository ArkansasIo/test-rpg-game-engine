import type {
    Coord2D,
    Coord2DTime,
    Cost2D,
    Cost2DTime,
    Walkability2D,
    Walkability2DTime,
} from '../types/GridTypes';

export interface Pathfinding2DOptions {
    width: number;
    height: number;
    start: Coord2D;
    goal: Coord2D;
    isWalkable: Walkability2D;
    movementCost?: Cost2D;
}

export interface Pathfinding2DTimeOptions {
    width: number;
    height: number;
    time: number;
    start: Coord2DTime;
    goal: Coord2D;
    isWalkable: Walkability2DTime;
    movementCost?: Cost2DTime;
}

interface Node2D {
    pos: Coord2D;
    g: number;
    f: number;
    parentKey?: string;
}

interface Node2DTime {
    pos: Coord2DTime;
    g: number;
    f: number;
    parentKey?: string;
}

function key2D(x: number, y: number): string {
    return `${x},${y}`;
}

function key2DTime(x: number, y: number, t: number): string {
    return `${x},${y},${t}`;
}

function manhattan2D(a: Coord2D, b: Coord2D): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function inBounds2D(width: number, height: number, x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < width && y < height;
}

function inBounds2DTime(width: number, height: number, time: number, x: number, y: number, t: number): boolean {
    return x >= 0 && y >= 0 && t >= 0 &&
        x < width && y < height && t < time;
}

function reconstructPath2D(nodes: Map<string, Node2D>, endKey: string): Coord2D[] {

    const path: Coord2D[] = [];
    let currentKey: string | undefined = endKey;

    while (currentKey) {
        const node = nodes.get(currentKey);
        if (!node) {
            break;
        }

        path.push(node.pos);
        currentKey = node.parentKey;
    }

    path.reverse();
    return path;
}

function reconstructPath2DTime(nodes: Map<string, Node2DTime>, endKey: string): Coord2DTime[] {

    const path: Coord2DTime[] = [];
    let currentKey: string | undefined = endKey;

    while (currentKey) {
        const node = nodes.get(currentKey);
        if (!node) {
            break;
        }

        path.push(node.pos);
        currentKey = node.parentKey;
    }

    path.reverse();
    return path;
}

function popBest2D(open: Set<string>, nodes: Map<string, Node2D>): string | undefined {

    let bestKey: string | undefined;
    let bestF = Number.POSITIVE_INFINITY;
    let bestG = Number.POSITIVE_INFINITY;

    for (const k of open) {
        const n = nodes.get(k);
        if (!n) {
            continue;
        }

        if (n.f < bestF || n.f === bestF && n.g < bestG) {
            bestF = n.f;
            bestG = n.g;
            bestKey = k;
        }
    }

    if (bestKey) {
        open.delete(bestKey);
    }

    return bestKey;
}

function popBest2DTime(open: Set<string>, nodes: Map<string, Node2DTime>): string | undefined {

    let bestKey: string | undefined;
    let bestF = Number.POSITIVE_INFINITY;
    let bestG = Number.POSITIVE_INFINITY;

    for (const k of open) {
        const n = nodes.get(k);
        if (!n) {
            continue;
        }

        if (n.f < bestF || n.f === bestF && n.g < bestG) {
            bestF = n.f;
            bestG = n.g;
            bestKey = k;
        }
    }

    if (bestKey) {
        open.delete(bestKey);
    }

    return bestKey;
}

export function findPath2D(options: Pathfinding2DOptions): Coord2D[] | null {

    const {
        width,
        height,
        start,
        goal,
        isWalkable,
        movementCost = () => 1,
    } = options;

    if (!inBounds2D(width, height, start.x, start.y) || !inBounds2D(width, height, goal.x, goal.y)) {
        return null;
    }

    if (!isWalkable(start.x, start.y) || !isWalkable(goal.x, goal.y)) {
        return null;
    }

    const open = new Set<string>();
    const closed = new Set<string>();
    const nodes = new Map<string, Node2D>();

    const startKey = key2D(start.x, start.y);
    nodes.set(startKey, {
        pos: start,
        g: 0,
        f: manhattan2D(start, goal),
    });
    open.add(startKey);

    while (open.size > 0) {
        const currentKey = popBest2D(open, nodes);
        if (!currentKey) {
            break;
        }

        const current = nodes.get(currentKey);
        if (!current) {
            continue;
        }

        if (current.pos.x === goal.x && current.pos.y === goal.y) {
            return reconstructPath2D(nodes, currentKey);
        }

        closed.add(currentKey);

        const nextCandidates: readonly Coord2D[] = [
            { x: current.pos.x + 1, y: current.pos.y },
            { x: current.pos.x - 1, y: current.pos.y },
            { x: current.pos.x, y: current.pos.y + 1 },
            { x: current.pos.x, y: current.pos.y - 1 },
        ];

        for (const nextPos of nextCandidates) {
            if (!inBounds2D(width, height, nextPos.x, nextPos.y)) {
                continue;
            }
            if (!isWalkable(nextPos.x, nextPos.y)) {
                continue;
            }

            const nextKey = key2D(nextPos.x, nextPos.y);
            if (closed.has(nextKey)) {
                continue;
            }

            const moveCost = movementCost(nextPos.x, nextPos.y);
            if (!Number.isFinite(moveCost) || moveCost < 0) {
                continue;
            }

            const g = current.g + moveCost;
            const h = manhattan2D(nextPos, goal);
            const f = g + h;
            const existing = nodes.get(nextKey);

            if (!existing || g < existing.g) {
                nodes.set(nextKey, {
                    pos: nextPos,
                    g,
                    f,
                    parentKey: currentKey,
                });
                open.add(nextKey);
            }
        }
    }

    return null;
}

export function findPath2DTime(options: Pathfinding2DTimeOptions): Coord2DTime[] | null {

    const {
        width,
        height,
        time,
        start,
        goal,
        isWalkable,
        movementCost = () => 1,
    } = options;

    if (!inBounds2DTime(width, height, time, start.x, start.y, start.t)) {
        return null;
    }
    if (!inBounds2D(width, height, goal.x, goal.y)) {
        return null;
    }
    if (!isWalkable(start.x, start.y, start.t)) {
        return null;
    }

    const open = new Set<string>();
    const closed = new Set<string>();
    const nodes = new Map<string, Node2DTime>();

    const startKey = key2DTime(start.x, start.y, start.t);
    nodes.set(startKey, {
        pos: start,
        g: 0,
        f: manhattan2D(start, goal),
    });
    open.add(startKey);

    while (open.size > 0) {
        const currentKey = popBest2DTime(open, nodes);
        if (!currentKey) {
            break;
        }

        const current = nodes.get(currentKey);
        if (!current) {
            continue;
        }

        if (current.pos.x === goal.x && current.pos.y === goal.y) {
            return reconstructPath2DTime(nodes, currentKey);
        }

        closed.add(currentKey);

        const nextT = current.pos.t + 1;
        if (nextT >= time) {
            continue;
        }

        const nextCandidates: readonly Coord2DTime[] = [
            { x: current.pos.x, y: current.pos.y, t: nextT },
            { x: current.pos.x + 1, y: current.pos.y, t: nextT },
            { x: current.pos.x - 1, y: current.pos.y, t: nextT },
            { x: current.pos.x, y: current.pos.y + 1, t: nextT },
            { x: current.pos.x, y: current.pos.y - 1, t: nextT },
        ];

        for (const nextPos of nextCandidates) {
            if (!inBounds2DTime(width, height, time, nextPos.x, nextPos.y, nextPos.t)) {
                continue;
            }
            if (!isWalkable(nextPos.x, nextPos.y, nextPos.t)) {
                continue;
            }

            const nextKey = key2DTime(nextPos.x, nextPos.y, nextPos.t);
            if (closed.has(nextKey)) {
                continue;
            }

            const moveCost = movementCost(nextPos.x, nextPos.y, nextPos.t);
            if (!Number.isFinite(moveCost) || moveCost < 0) {
                continue;
            }

            const g = current.g + moveCost;
            const h = manhattan2D(nextPos, goal);
            const f = g + h;
            const existing = nodes.get(nextKey);

            if (!existing || g < existing.g) {
                nodes.set(nextKey, {
                    pos: nextPos,
                    g,
                    f,
                    parentKey: currentKey,
                });
                open.add(nextKey);
            }
        }
    }

    return null;
}
