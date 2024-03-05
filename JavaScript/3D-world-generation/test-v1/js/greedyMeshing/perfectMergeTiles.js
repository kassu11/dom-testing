/**
 * @typedef {Object} Tile
 * @property {number} x - The x coordinate of the tile.
 * @property {number} y - The y coordinate of the tile.
 * @property {number} wx - The width of the tile.
 * @property {number} wy - The height of the tile.
 * @property {boolean|undefined} perfect - Whether the tile is a perfect tile.
 */

/**
 * @typedef {Array.<Array.<Number|Tile>>} Grid
 */

/**
 * @param {Tile} tile - The tile you are trying to merge.
 * @param {Grid} grid - The grid where the tiles exist.
 */

function perfectMergeTiles(tile, grid) {
	try {
		grid[tile.y][tile.x + tile.wx];
	} catch (e) {
		console.trace(tile, grid, tile?.x, tile?.wx);
		throw new Error("Tile is out of bounds");
	}
	const right = grid[tile.y][tile.x + tile.wx] ?? {};
	const left = grid[tile.y][tile.x - 1] ?? {};
	const bottom = grid[tile.y + tile.wy]?.[tile.x] ?? {};
	const top = grid[tile.y - 1]?.[tile.x] ?? {};

	if (tile.y === right.y && tile.wy === right.wy) {
		// Perfect y match right
		fill(grid, { x: tile.x, y: tile.y, wx: tile.wx + right.wx, wy: tile.wy });
	} else if (tile.y === left.y && tile.wy === left.wy) {
		// Perfect y match left
		fill(grid, { x: left.x, y: tile.y, wx: tile.wx + left.wx, wy: tile.wy });
	} else if (tile.x === bottom.x && tile.wx === bottom.wx) {
		// Perfect x match bottom
		fill(grid, { x: tile.x, y: tile.y, wx: tile.wx, wy: tile.wy + bottom.wy });
	} else if (tile.x === top.x && tile.wx === top.wx) {
		// Perfect x match top
		fill(grid, { x: tile.x, y: top.y, wx: tile.wx, wy: tile.wy + top.wy });
	}
}

function fill(grid, tileData) {
	const { x, y, wx, wy } = tileData;
	for (let i = y; i < y + wy; i++) {
		for (let j = x; j < x + wx; j++) {
			grid[i][j] = tileData;
		}
	}
}
