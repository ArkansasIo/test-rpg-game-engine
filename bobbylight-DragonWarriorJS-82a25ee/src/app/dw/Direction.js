// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Direction {
    static fromString(str = 'SOUTH') {
        switch (str.toUpperCase()) {
            case 'NORTH':
                return Direction.NORTH;
            case 'EAST':
                return Direction.EAST;
            case 'WEST':
                return Direction.WEST;
            case 'SOUTH':
                return Direction.SOUTH;
            default:
                return Direction.SOUTH;
        }
    }
}
Direction.NORTH = 0;
Direction.EAST = 1;
Direction.SOUTH = 2;
Direction.WEST = 3;
//# sourceMappingURL=Direction.js.map