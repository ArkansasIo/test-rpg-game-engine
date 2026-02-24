function key2D(x, y) {
    return `${x},${y}`;
}
function key2DTime(x, y, t) {
    return `${x},${y},${t}`;
}
function manhattan2D(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
function inBounds2D(width, height, x, y) {
    return x >= 0 && y >= 0 && x < width && y < height;
}
function inBounds2DTime(width, height, time, x, y, t) {
    return x >= 0 && y >= 0 && t >= 0 &&
        x < width && y < height && t < time;
}
function reconstructPath2D(nodes, endKey) {
    const path = [];
    let currentKey = endKey;
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
function reconstructPath2DTime(nodes, endKey) {
    const path = [];
    let currentKey = endKey;
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
function popBest2D(open, nodes) {
    let bestKey;
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
function popBest2DTime(open, nodes) {
    let bestKey;
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
export function findPath2D(options) {
    const { width, height, start, goal, isWalkable, movementCost = () => 1, } = options;
    if (!inBounds2D(width, height, start.x, start.y) || !inBounds2D(width, height, goal.x, goal.y)) {
        return null;
    }
    if (!isWalkable(start.x, start.y) || !isWalkable(goal.x, goal.y)) {
        return null;
    }
    const open = new Set();
    const closed = new Set();
    const nodes = new Map();
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
        const nextCandidates = [
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
export function findPath2DTime(options) {
    const { width, height, time, start, goal, isWalkable, movementCost = () => 1, } = options;
    if (!inBounds2DTime(width, height, time, start.x, start.y, start.t)) {
        return null;
    }
    if (!inBounds2D(width, height, goal.x, goal.y)) {
        return null;
    }
    if (!isWalkable(start.x, start.y, start.t)) {
        return null;
    }
    const open = new Set();
    const closed = new Set();
    const nodes = new Map();
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
        const nextCandidates = [
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
//# sourceMappingURL=GridPathfinding.js.map