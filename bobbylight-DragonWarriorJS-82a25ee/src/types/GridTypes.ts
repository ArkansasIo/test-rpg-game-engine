export interface Coord2D {
    x: number;
    y: number;
}

export interface Coord2DTime extends Coord2D {
    t: number;
}

export interface Tile {
    id: number;
    walkable: boolean;
    cost: number;
}

export type Walkability2D = (x: number, y: number) => boolean;

export type Walkability2DTime = (x: number, y: number, t: number) => boolean;

export type Cost2D = (x: number, y: number) => number;

export type Cost2DTime = (x: number, y: number, t: number) => number;
