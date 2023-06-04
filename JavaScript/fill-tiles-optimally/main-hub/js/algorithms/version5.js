import { grid } from "../index.js";
import { perfectMergeTiles } from "../perfectMergeTiles.js";

export default function main() {
	const bigTilesWithoutWalls = [...Array(grid.height)].map(() => Array(grid.width).fill({ x: 0, y: 0, wx: grid.width, wy: grid.height }));
	const bigTilesGrid = tileWallSplit(bigTilesWithoutWalls, grid.map)
	megaMergeTiles(bigTilesGrid);
	render(bigTilesGrid, grid.tilesElem);
}

function tileWallSplit(bigTiles, walls) {
	const height = walls.length;
	const width = walls[0].length;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
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
		const height = tileData.y + tileData.wy;
		const width = tileData.x + tileData.wx;
		segments?.push(tileData);
		for (let y = tileData.y; y < height; y++) {
			for (let x = tileData.x; x < width; x++) {
				bigTiles[y][x] = tileData;
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
	const height = bigTiles.length;
	const width = bigTiles[0].length;
	let perfect = false;
	while (!perfect) {
		perfect = true;
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const tile = bigTiles[y][x];
				if (tile === 1 || tile?.perfect) continue;
				const closestTiles = new Set([tile]);
				addClosestTiles(closestTiles, tile, tile);
				if (!simulate(Array.from(closestTiles))) perfect = false;
			}
		}
	}

	function addClosestTiles(list, tile, mainTile = tile) {
		const currentList = new Set();
		const height = tile.y + tile.wy;
		const width = tile.x + tile.wx;

		for (let x = tile.x; x < width; x++) {
			closestTileLogic(bigTiles[tile.y - 1]?.[x]); // Top
			closestTileLogic(bigTiles[height]?.[x]); // Bottom
		};

		for (let y = tile.y; y < height; y++) {
			closestTileLogic(bigTiles[y][tile.x - 1]); // Left
			closestTileLogic(bigTiles[y][width]); // Right
		};


		function closestTileLogic(closestTile) {
			if (closestTile === 1 || closestTile == undefined) return;
			if (list.has(closestTile)) return;


			if (tile === mainTile ||
				closestTile.x === mainTile.x ||
				closestTile.x + closestTile.wx === mainTile.x + mainTile.wx ||
				closestTile.y === mainTile.y ||
				closestTile.y + closestTile.wy === mainTile.y + mainTile.wy ||
				(closestTile.wx === 1 && closestTile.wy === 1)) {
				currentList.add(closestTile);
				list.add(closestTile);
			}
		}

		currentList.forEach((tile) => addClosestTiles(list, tile, mainTile));
	}

	function simulate(tiles) {
		if (tiles.length === 1) return true;
		const mainTile = tiles[0];
		const gridSize = { minX: mainTile.x, maxX: mainTile.x + mainTile.wx, minY: mainTile.y, maxY: mainTile.y + mainTile.wy }
		tiles.forEach(tile => {
			gridSize.minX = Math.min(gridSize.minX, tile.x);
			gridSize.minY = Math.min(gridSize.minY, tile.y);
			gridSize.maxX = Math.max(gridSize.maxX, tile.x + tile.wx);
			gridSize.maxY = Math.max(gridSize.maxY, tile.y + tile.wy);
		});

		const grid = [...Array(gridSize.maxY - gridSize.minY)].map(() => Array(gridSize.maxX - gridSize.minX).fill(1));
		tiles.forEach(tile => {
			const startY = tile.y - gridSize.minY;
			const startX = tile.x - gridSize.minX;
			const height = startY + tile.wy;
			const width = startX + tile.wx;

			for (let y = startY; y < height; y++) {
				for (let x = startX; x < width; x++) grid[y][x] = 0;
			}
		});

		const horizontal = grid.map(row => row.slice(0));
		const vertical = grid.map(row => row.slice(0));

		const horizontalCount = horizontalFill(horizontal);
		const verticalCount = verticalFill(vertical);

		if (verticalCount < tiles.length && !(horizontalCount < verticalCount)) replaceGridWithSimulation(vertical, gridSize);
		else if (horizontalCount < tiles.length) replaceGridWithSimulation(horizontal, gridSize);
		else return true;
	}

	function replaceGridWithSimulation(grid, gridSize) {
		const height = grid.length;
		const width = grid[0].length;
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const tile = grid[y][x] ?? {};
				if (tile === 1) continue;
				const offset = { x: tile.x + gridSize.minX, y: tile.y + gridSize.minY, wx: tile.wx, wy: tile.wy };
				fill(bigTiles, offset);
			}
		}
	}

	function getNierestTilesOld(tile, smallMode = false, rootObject) {
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
		returnObject.tileSet.forEach(nTile => {
			if (smallMode && nTile.wx === 1 && nTile.wy === 1 || nTile === tile) return;
			const nearestData = getNierestTilesOld(nTile, true, rootObject || returnObject);
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
			if (rootObject?.tileSet.has(tile)) return;
			if ((smallMode && tile.wx === 1 && tile.wy === 1) || !smallMode || (
				rootObject?.x === tile.x ||
				rootObject?.y === tile.y ||
				rootObject?.x + rootObject?.wx === tile.x + tile.wx ||
				rootObject?.y + rootObject?.wy === tile.y + tile.wy)) {
				if (tile.x < returnObject.minX) returnObject.minX = tile.x;
				if (tile.x + tile.wx > returnObject.maxX) returnObject.maxX = tile.x + tile.wx;
				if (tile.y < returnObject.minY) returnObject.minY = tile.y;
				if (tile.y + tile.wy > returnObject.maxY) returnObject.maxY = tile.y + tile.wy;

				returnObject.tileSet.add(tile);
				rootObject?.tileSet.add(tile);
				return true;
			}
		}
	}

	function simulateSizeOld({ minX, maxX, minY, maxY, tileSet, parentTile }) {
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
	let horizontalCount = 0;

	for (let y = 0; y < gridHeight; y++) {
		for (let x = 0; x < gridWidth; x++) {
			if (grid[y][x] !== 0) continue;
			grid[y][x] = { x, y, wx: 1, wy: 1 };
			const wallIndex = grid[y].indexOf(1, x);
			const width = wallIndex === -1 ? gridWidth - x : wallIndex - x;
			for (let i = x; i < width + x; i++) grid[y][i] = { x, y, wx: width, wy: 1 };
			x += width - 1;
			horizontalCount++;
		}
	}

	for (let y = 0; y < gridHeight; y++) {
		for (let x = 0; x < gridWidth; x++) {
			if (grid[y][x] === 1) continue;
			const tile = grid[y][x];
			perfectMergeTiles(tile, grid);
			if (tile !== grid[y][x]) horizontalCount--;
		}
	}

	return horizontalCount;
}

function verticalFill(grid) {
	const gridHeight = grid.length;
	const gridWidth = grid[0].length;
	let verticalCount = 0;

	for (let x = 0; x < gridWidth; x++) {
		for (let y = 0; y < gridHeight; y++) {
			if (grid[y][x] !== 0) continue;
			grid[y][x] = { x, y, wx: 1, wy: 1 };
			// const wallIndex = grid.findIndex((row, index) => row[x] === 1 && index > y);
			let wallIndex = -1;
			for (let i = y + 1; i < gridHeight; i++) {
				if (grid[i][x] === 1) {
					wallIndex = i;
					break;
				}
			}

			const height = wallIndex === -1 ? gridHeight - y : wallIndex - y;
			for (let i = y; i < height + y; i++) grid[i][x] = { x, y, wx: 1, wy: height };
			y += height - 1;
			verticalCount++;
		}
	}

	for (let y = 0; y < gridHeight; y++) {
		for (let x = 0; x < gridWidth; x++) {
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