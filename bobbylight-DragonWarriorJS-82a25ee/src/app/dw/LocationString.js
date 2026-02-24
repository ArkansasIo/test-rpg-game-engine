export const toLocationString = (row, col) => {
    return `${row},${col}`;
};
export const toRowAndColumn = (location) => {
    const values = location.split(',');
    return { row: parseInt(values[0], 10), col: parseInt(values[1], 10) };
};
//# sourceMappingURL=LocationString.js.map