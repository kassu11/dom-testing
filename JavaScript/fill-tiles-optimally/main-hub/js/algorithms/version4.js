import { grid } from "../index.js";
import { perfectMergeTiles } from "../perfectMergeTiles.js";

export default function main() {
	const emtyBigTilesGrid = grid.map.map(row => row.map(() => ({ x: 0, y: 0, wx: grid.width, wy: grid.height })));
	const bigTilesGrid = splitSelections(emtyBigTilesGrid, grid.map)
	megaMergeTiles(bigTilesGrid);
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

			newTileSegments.forEach(mergeTiles);
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

function megaMergeTiles(bigTiles) {
	let perfect = false;
	while (!perfect) {
		perfect = true;
		for (let y = 0; y < bigTiles.length; y++) {
			for (let x = 0; x < bigTiles[y].length; x++) {
				const tile = bigTiles[y][x];
				if (tile === 1 || tile?.perfect) continue;
				const nierestTilesData = getNierestTiles(tile, false);
				if (!simulateSize(nierestTilesData)) perfect = false;
			}
		}
	}

	for (let y = 0; y < bigTiles.length; y++) {
		for (let x = 0; x < bigTiles[y].length; x++) {
			const tile = bigTiles[y][x];
			if (tile === 1 || tile?.perfect) continue;
			console.log(tile.perfect)
		}
	}

	function getNierestTiles(tile, smallMode = false) {
		const returnObject = {
			minX: tile.x,
			maxX: tile.x + tile.wx,
			minY: tile.y,
			maxY: tile.y + tile.wy,
			parentTile: tile,
			tileSet: new Set([tile]),
		}

		for (let x = tile.x; x < tile.x + tile.wx; x++) {
			if (nearestTileLogic(bigTiles[tile.y - 1]?.[x])) x += bigTiles[tile.y - 1][x].wx - 1;
		};
		for (let x = tile.x; x < tile.x + tile.wx; x++) {
			if (nearestTileLogic(bigTiles[tile.y + tile.wy]?.[x])) x += bigTiles[tile.y + tile.wy][x].wx - 1;
		};
		for (let y = tile.y; y < tile.y + tile.wy; y++) {
			if (nearestTileLogic(bigTiles[y][tile.x - 1])) y += bigTiles[y][tile.x - 1].wy - 1;
		};
		for (let y = tile.y; y < tile.y + tile.wy; y++) {
			if (nearestTileLogic(bigTiles[y][tile.x + tile.wx])) y += bigTiles[y][tile.x + tile.wx].wy - 1;
		};

		const smallTiles = new Set();
		if (!smallMode) returnObject.tileSet.forEach(tile => {
			const nearestData = getNierestTiles(tile, true);
			nearestData.tileSet.forEach(smallTile => smallTiles.add(smallTile));

			returnObject.minX = Math.min(returnObject.minX, nearestData.minX);
			returnObject.maxX = Math.max(returnObject.maxX, nearestData.maxX);
			returnObject.minY = Math.min(returnObject.minY, nearestData.minY);
			returnObject.maxY = Math.max(returnObject.maxY, nearestData.maxY);
		});

		smallTiles.forEach(smallTile => returnObject.tileSet.add(smallTile))

		return returnObject;

		function nearestTileLogic(tile) {
			if (tile === 1 || tile == null) return;
			if ((smallMode && tile.wx === 1 && tile.wy === 1) || !smallMode) {
				if (tile.x < returnObject.minX) returnObject.minX = tile.x;
				if (tile.x + tile.wx > returnObject.maxX) returnObject.maxX = tile.x + tile.wx;
				if (tile.y < returnObject.minY) returnObject.minY = tile.y;
				if (tile.y + tile.wy > returnObject.maxY) returnObject.maxY = tile.y + tile.wy;

				returnObject.tileSet.add(tile);
				return true;
			}
		}
	}

	function simulateSize({ minX, maxX, minY, maxY, tileSet, parentTile }) {
		const grid = [...Array(maxY - minY)].map(() => Array(maxX - minX).fill(1));
		tileSet.forEach(tile => {
			for (let y = tile.y; y < tile.y + tile.wy; y++) {
				for (let x = tile.x; x < tile.x + tile.wx; x++) {
					grid[y - minY][x - minX] = 0;
				}
			}
		});

		const horizontal = grid.map(row => row.slice(0));
		const vertical = grid.map(row => row.slice(0));


		const horizontalCount = horizontalFill(horizontal);
		const verticalCount = verticalFill(vertical);
		if (verticalCount < tileSet.size && !(horizontalCount < verticalCount)) {
			for (let y = 0; y < vertical.length; y++) {
				for (let x = 0; x < vertical[y].length; x++) {
					const tile = vertical[y][x] ?? {};
					if (tile === 1) continue;
					const offset = { x: tile.x + minX, y: tile.y + minY, wx: tile.wx, wy: tile.wy };
					fill(bigTiles, offset);
				}
			}
		} else if (horizontalCount < tileSet.size) {
			for (let y = 0; y < horizontal.length; y++) {
				for (let x = 0; x < horizontal[y].length; x++) {
					const tile = horizontal[y][x] ?? {};
					if (tile === 1) continue;
					const offset = { x: tile.x + minX, y: tile.y + minY, wx: tile.wx, wy: tile.wy };
					fill(bigTiles, offset);
				}
			}
		} else {
			parentTile.perfect = true;
			fill(bigTiles, parentTile);
			return true;
		}
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

function horizontalFill(grid) {
	let horizontalCount = 0;
	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y].length; x++) {
			if (grid[y][x] !== 0) continue;
			grid[y][x] = { x, y, wx: 1, wy: 1 };
			const wallIndex = grid[y].indexOf(1, x);
			const width = wallIndex === -1 ? grid[y].length - x : wallIndex - x;
			for (let i = x; i < width + x; i++) grid[y][i] = { x, y, wx: width, wy: 1 };
			x += width - 1;
			horizontalCount++;
		}
	}

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y].length; x++) {
			if (grid[y][x] === 1) continue;
			const tile = grid[y][x];
			perfectMergeTiles(tile, grid);
			if (tile !== grid[y][x]) horizontalCount--;
		}
	}

	return horizontalCount;
}

function verticalFill(grid) {
	let verticalCount = 0;
	for (let x = 0; x < grid[0].length; x++) {
		for (let y = 0; y < grid.length; y++) {
			if (grid[y][x] !== 0) continue;
			grid[y][x] = { x, y, wx: 1, wy: 1 };
			const wallIndex = grid.findIndex((row, index) => row[x] === 1 && index > y);
			const height = wallIndex === -1 ? grid.length - y : wallIndex - y;
			for (let i = y; i < height + y; i++) grid[i][x] = { x, y, wx: 1, wy: height };
			y += height - 1;
			verticalCount++;
		}
	}

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y].length; x++) {
			if (grid[y][x] === 1) continue;
			const tile = grid[y][x];
			perfectMergeTiles(tile, grid);
			if (tile !== grid[y][x]) verticalCount--;
		}
	}

	return verticalCount;
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