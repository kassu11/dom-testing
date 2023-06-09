import { grid } from "../index.js";

export default function main() {
	const emtyBigTilesGrid = grid.map.map(row => row.map(() => ({ x: 0, y: 0, wx: grid.width, wy: grid.height })));
	const bigTilesGrid = splitSelections(emtyBigTilesGrid, grid.map)
	render(bigTilesGrid, grid.tilesElem);
}

function splitSelections(bigTiles, walls) {
	for (let y = 0; y < walls.length; y++) {
		for (let x = 0; x < walls[y].length; x++) {
			if (walls[y][x] !== 1) continue;
			const newTileSegments = [];
			const tile = bigTiles[y][x];
			bigTiles[y][x] = 1;

			if (tile.x < x) fill({ x: tile.x, y: tile.y, wx: x - tile.x, wy: y - tile.y + 1 }, newTileSegments);
			if (tile.y < y) fill({ x: x, y: tile.y, wx: tile.wx - (x - tile.x), wy: y - tile.y }, newTileSegments);
			if (tile.x + tile.wx - 1 > x) fill({ x: x + 1, y: y, wx: tile.wx - (x - tile.x) - 1, wy: tile.wy - (y - tile.y) }, newTileSegments);
			if (tile.y + tile.wy - 1 > y) fill({ x: tile.x, y: y + 1, wx: x - tile.x + 1, wy: tile.wy - (y - tile.y) - 1 }, newTileSegments);

			// newTileSegments.forEach(mergeTiles);
		}
	} return bigTiles;

	function fill(tileData, segments = null) {
		const { x, y, wx, wy } = tileData;
		segments?.push(tileData);
		for (let i = y; i < y + wy; i++) {
			for (let j = x; j < x + wx; j++) {
				bigTiles[i][j] = tileData;
			}
		}
	}

	function mergeTiles(tile) {
		const right = bigTiles[tile.y][tile.x + tile.wx] ?? {};
		const left = bigTiles[tile.y][tile.x - 1] ?? {};
		const bottom = bigTiles[tile.y + tile.wy]?.[tile.x] ?? {};
		const top = bigTiles[tile.y - 1]?.[tile.x] ?? {};

		if (tile.y === right.y && tile.wy === right.wy) { // Perfect y match right
			fill({ x: tile.x, y: tile.y, wx: tile.wx + right.wx, wy: tile.wy });
		}
		else if (tile.y === left.y && tile.wy === left.wy) { // Perfect y match left
			fill({ x: left.x, y: tile.y, wx: tile.wx + left.wx, wy: tile.wy });
		}
		else if (tile.x === bottom.x && tile.wx === bottom.wx) { // Perfect x match bottom
			fill({ x: tile.x, y: tile.y, wx: tile.wx, wy: tile.wy + bottom.wy });
		}
		else if (tile.x === top.x && tile.wx === top.wx) { // Perfect x match top
			fill({ x: tile.x, y: top.y, wx: tile.wx, wy: tile.wy + top.wy });
		}
	}
}

function render(tiles, element) {
	for (let y = 0; y < tiles.length; y++) {
		for (let x = 0; x < tiles[y].length; x++) {
			if (tiles[y][x] === 1) continue;
			if (tiles[y][x].x !== x || tiles[y][x].y !== y) continue;
			const div = document.createElement("div");
			div.classList.add("bigTile", "tile");
			div.style.left = `${x * 50}px`;
			div.style.top = `${y * 50}px`;
			div.style.width = `${tiles[y][x].wx * 50}px`;
			div.style.height = `${tiles[y][x].wy * 50}px`;
			x += tiles[y][x].wx - 1;
			element.append(div);
		}
	}
}