import { grid } from "../index.js";
import { perfectMergeTiles } from "../perfectMergeTiles.js";

export default function main() {
	const gridClone = structuredClone(grid.map);
	horizontalFill(gridClone);
	// stretchMerge(gridClone);
	render(gridClone, grid.tilesElem);
}

function stretchMerge(grid) {
	const height = grid.length;
	const width = grid[0].length;

	for (let loop = 1; loop--;) {
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				if (grid[y][x] === 1) continue;
				if (stretchVertically(grid[y][x])) loop = 1;
			}
		}
	}

	function stretchVertically(tile) {
		const bottomTiles = [];
		while (true) {
			const lastTile = bottomTiles.at(-1) ?? tile;
			const bottomTile = grid[lastTile.y + lastTile.wy]?.[tile.x] ?? {};
			if (bottomTile.wx >= tile.wx && (bottomTile.x === tile.x || bottomTile.x + bottomTile.wx === tile.x + tile.wx)) {
				bottomTiles.push(bottomTile);
			} else break;
		}

		const TopTiles = [];
		while (true) {
			const lastTile = TopTiles.at(-1) ?? tile;
			const topTile = grid[lastTile.y - 1]?.[tile.x] ?? {};
			if (topTile.wx >= tile.wx && (topTile.x === tile.x || topTile.x + topTile.wx === tile.x + tile.wx)) {
				TopTiles.push(topTile);
			} else break;
		}

		const strechTile = (curTile) => {
			if (curTile.x === tile.x) {
				fill(grid, { x: tile.x + tile.wx, y: curTile.y, wx: curTile.wx - tile.wx, wy: curTile.wy });
			} else if (curTile.x + curTile.wx === tile.x + tile.wx) {
				fill(grid, { x: curTile.x, y: curTile.y, wx: curTile.wx - tile.wx, wy: curTile.wy });
			}
		}

		bottomTiles.forEach(strechTile);
		TopTiles.forEach(strechTile);

		if (bottomTiles.length || TopTiles.length) {
			const bottomTile = bottomTiles.at(-1) ?? tile;
			const topTile = TopTiles.at(-1) ?? tile;
			const newTile = { x: tile.x, y: topTile.y, wx: tile.wx, wy: bottomTile.y + bottomTile.wy - topTile.y }
			fill(grid, newTile);
			perfectMergeTiles(newTile, grid);
			return true;
		}
	}
}


function fill(grid, tileData) {
	const height = tileData.y + tileData.wy;
	const width = tileData.x + tileData.wx;
	for (let y = tileData.y; y < height; y++) {
		for (let x = tileData.x; x < width; x++) {
			grid[y][x] = tileData;
		}
	}
}


function horizontalFill(grid) {
	const gridHeight = grid.length;
	const gridWidth = grid[0].length;

	for (let y = 0; y < gridHeight; y++) {
		for (let x = 0; x < gridWidth; x++) {
			if (grid[y][x] !== 0) continue;
			grid[y][x] = { x, y, wx: 1, wy: 1 };
			const wallIndex = grid[y].indexOf(1, x);
			const width = wallIndex === -1 ? gridWidth - x : wallIndex - x;
			for (let i = x; i < width + x; i++) grid[y][i] = { x, y, wx: width, wy: 1 };
			x += width - 1;
		}
	}

	// for (let y = 0; y < gridHeight; y++) {
	// 	for (let x = 0; x < gridWidth; x++) {
	// 		if (grid[y][x] === 1) continue;
	// 		const tile = grid[y][x];
	// 		perfectMergeTiles(tile, grid);
	// 		x += tile.wx - 1;
	// 	}
	// }
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