import { grid } from "../index.js";
import { perfectMergeTiles } from "../perfectMergeTiles.js";

export default function main() {
	// const bigTilesWithoutWalls = [...Array(grid.height)].map(() => Array(grid.width).fill({ x: 0, y: 0, wx: grid.width, wy: grid.height }));
	// const bigTilesGrid = tileWallSplit(bigTilesWithoutWalls, grid.map)

	const gridClone = structuredClone(grid.map);
	horizontalFill(gridClone);
	halfMerge(gridClone);

	// const a = bigTilesGrid[0][0];
	// const b = bigTilesGrid.at(-1).at(-1);

	// mergeUnevenTiles(a, b);
	// fill(bigTilesGrid, a);
	// fill(bigTilesGrid, b);
	// console.log(b)
	// megaMergeTiles(bigTilesGrid);
	// findIntersections(bigTilesGrid);
	render(gridClone, grid.tilesElem);
}

function halfMerge(grid) {
	const height = grid.length;
	const width = grid[0].length;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (grid[y][x] === 1) continue;
			const tile = grid[y][x];
			split2(tile);
		}
	}

	function split(tile) {
		const ltTile = grid[tile.y - 1]?.[tile.x] ?? {};
		const lbTile = grid[tile.y + 1]?.[tile.x] ?? {};
		const rtTile = grid[tile.y - 1]?.[tile.x + tile.wx - 1] ?? {};
		const rbTile = grid[tile.y + 1]?.[tile.x + tile.wx - 1] ?? {};

		if (ltTile.wx === lbTile.wx && ltTile.wx < tile.wx && tile.x === ltTile.x && tile.x === lbTile.x) {
			const leftNew = { x: ltTile.x, y: ltTile.y, wx: ltTile.wx, wy: ltTile.wy + tile.wy + lbTile.wy };
			const rightNew = { x: tile.x + leftNew.wx, y: tile.y, wx: tile.wx - leftNew.wx, wy: tile.wy };
			fillAndMerge(leftNew);
			fillAndMerge(rightNew);
		} else if (rtTile.wx === rbTile.wx && rtTile.wx < tile.wx && tile.x + tile.wx === rtTile.x + rtTile.wx && tile.x + tile.wx === rbTile.x + rbTile.wx) {
			const rightNew = { x: rtTile.x, y: rtTile.y, wx: rtTile.wx, wy: rtTile.wy + tile.wy + rbTile.wy };
			const leftNew = { x: tile.x, y: tile.y, wx: tile.wx - rightNew.wx, wy: tile.wy };
			fillAndMerge(rightNew);
			fillAndMerge(leftNew);
		}
	}

	function split2(tile) {
		const leftTiles = [];
		while (true) {
			const lastTile = leftTiles.at(-1) ?? tile;
			const bottomTile = grid[lastTile.y + lastTile.wy]?.[tile.x] ?? {};
			if (bottomTile.wx > tile.wx && (bottomTile.x === tile.x || bottomTile.x + bottomTile.wx === tile.x + tile.wx)) {
				leftTiles.push(bottomTile);
			} else if (bottomTile.x === tile.x && bottomTile.wx === tile.wx) {
				fillAndMerge({ x: tile.x, y: tile.y, wx: tile.wx, wy: bottomTile.y + bottomTile.wy - tile.y });
				break;
			} else {
				leftTiles.length = 0;
				break;
			}
		}

		leftTiles.forEach((curTile) => {
			if (curTile.x === tile.x) {
				fillAndMerge({ x: tile.x + tile.wx, y: curTile.y, wx: curTile.wx - tile.wx, wy: curTile.wy });
			} else if (curTile.x + curTile.wx === tile.x + tile.wx) {
				fillAndMerge({ x: curTile.x, y: curTile.y, wx: curTile.wx - tile.wx, wy: curTile.wy });
			}

			console.log(curTile.x + curTile.wx, tile.x + tile.wx, curTile, tile)
		});

		// const ltTile = grid[tile.y - 1]?.[tile.x] ?? {};
		// const lbTile = grid[tile.y + 1]?.[tile.x] ?? {};
		// const rtTile = grid[tile.y - 1]?.[tile.x + tile.wx - 1] ?? {};
		// const rbTile = grid[tile.y + 1]?.[tile.x + tile.wx - 1] ?? {};

		// if (ltTile.wx === lbTile.wx && ltTile.wx < tile.wx && tile.x === ltTile.x && tile.x === lbTile.x) {
		// 	const leftNew = { x: ltTile.x, y: ltTile.y, wx: ltTile.wx, wy: ltTile.wy + tile.wy + lbTile.wy };
		// 	const rightNew = { x: tile.x + leftNew.wx, y: tile.y, wx: tile.wx - leftNew.wx, wy: tile.wy };
		// 	fillAndMerge(leftNew);
		// 	fillAndMerge(rightNew);
		// } else if (rtTile.wx === rbTile.wx && rtTile.wx < tile.wx && tile.x + tile.wx === rtTile.x + rtTile.wx && tile.x + tile.wx === rbTile.x + rbTile.wx) {
		// 	const rightNew = { x: rtTile.x, y: rtTile.y, wx: rtTile.wx, wy: rtTile.wy + tile.wy + rbTile.wy };
		// 	const leftNew = { x: tile.x, y: tile.y, wx: tile.wx - rightNew.wx, wy: tile.wy };
		// 	fillAndMerge(rightNew);
		// 	fillAndMerge(leftNew);
		// }
	}

	function fillAndMerge(tile) {
		fill(grid, tile);
		perfectMergeTiles(tile, grid);
	}
}

function tileWallSplit(bigTiles, walls) {
	const height = walls.length;
	const width = walls[0].length;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (walls[y][x] !== 1) continue;
			const tile = bigTiles[y][x];
			bigTiles[y][x] = 1;

			if (tile.x < x) fill({ x: tile.x, y: tile.y, wx: x - tile.x, wy: y - tile.y + 1 });
			if (tile.y < y) fill({ x: x, y: tile.y, wx: tile.wx - (x - tile.x), wy: y - tile.y });
			if (tile.x + tile.wx - 1 > x) fill({ x: x + 1, y: y, wx: tile.wx - (x - tile.x) - 1, wy: tile.wy - (y - tile.y) });
			if (tile.y + tile.wy - 1 > y) fill({ x: tile.x, y: y + 1, wx: x - tile.x + 1, wy: tile.wy - (y - tile.y) - 1 });

			// if (bigTiles[y][x + 1]?.wx) mergeTiles(bigTiles[y][x + 1]);
			// if (bigTiles[y][x - 1]?.wx) mergeTiles(bigTiles[y][x - 1]);
			// if (bigTiles[y + 1]?.[x].wx) mergeTiles(bigTiles[y + 1][x]);
			// if (bigTiles[y - 1]?.[x].wx) mergeTiles(bigTiles[y - 1][x]);
		}
	} return bigTiles;

	function fill(tileData) {
		const height = tileData.y + tileData.wy;
		const width = tileData.x + tileData.wx;
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

function findIntersections(bigTiles) {
	const height = bigTiles.length;
	const width = bigTiles[0].length;

	console.log("findIntersections")

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const tile = bigTiles[y][x];
			if (tile === 1) continue;

			const intersection = hasIntersection(tile);

			console.log(intersection)
			if (intersection) {
				mergeIntersection(intersection)
			};
		}
	}

	function hasIntersection(tile) {
		const maxX = tile.x + tile.wx;
		const maxY = tile.y + tile.wy;
		for (let x = tile.x; x < maxX; x++) { // Top
			const a = bigTiles[tile.y - 1]?.[x] ?? 1;
			if (a === 1) continue;
			x = a.x + a.wx - 1;
			const b = bigTiles[tile.y - 1]?.[a.x + a.wx] ?? 1;
			if (b === 1 || b.x + b.wx > maxX) continue;
			return [tile, a, b];
		};
		for (let x = tile.x; x < maxX; x++) { // bottom
			const a = bigTiles[tile.y + 1]?.[x] ?? 1;
			if (a === 1) continue;
			x = a.x + a.wx + 1;
			const b = bigTiles[tile.y + 1]?.[a.x + a.wx] ?? 1;
			if (b === 1 || b.x + b.wx > maxX) continue;
			return [tile, a, b];
		};
		for (let y = tile.y; y < maxY; y++) { // Left
			const a = bigTiles[y][tile.x - 1] ?? 1;
			if (a === 1) continue;
			y = a.y + a.wy - 1;
			const b = bigTiles[a.y + a.wy]?.[tile.x - 1] ?? 1;
			if (b === 1 || b.y + b.wy > maxY) continue;
			return [tile, a, b];
		};
		for (let y = tile.y; y < maxY; y++) { // Right
			const a = bigTiles[y][tile.x + 1] ?? 1;
			if (a === 1) continue;
			y = a.y + a.wy - 1;
			const b = bigTiles[a.y + a.wy]?.[tile.x + 1] ?? 1;
			if (b === 1 || b.y + b.wy > maxY) continue;
			return [tile, a, b];
		};
		return false
	}

	function mergeIntersection(tiles) {
		console.log("m", tiles)
		mergeUnevenTiles(tiles[0], tiles.at(-1))

		for (let i = 0; i < tiles.length; i++) {
			const merged = mergeUnevenTiles(tiles[i], tiles.at(i - 1))
			if (!merged) continue;

			console.log("merged", structuredClone(tiles[i]), structuredClone(tiles.at(i - 1)))
			tiles.forEach(t => fill(bigTiles, t))
			if (tiles.every(t => hasIntersection(t) === false)) continue;
		}
	}
}



function mergeUnevenTiles(a, b) {
	return smallToBig(a, b) || smallToBig(b, a);

	function smallToBig(a, b) {
		if ((a.x === b.x || a.x + a.wx === b.x + b.wx) && a.wx <= b.wx) { // Vertical
			a.wy += b.wy;
			b.wx -= a.wx;
			if (a.x === b.x) b.x += a.wx;
			if (a.y > b.y) a.y = b.y;
		} else if ((a.y === b.y || a.y + a.wy === b.y + b.wy) && a.wy <= b.wy) { // Horizontal
			a.wx += b.wx;
			b.wy -= a.wy;
			if (a.y === b.y) b.y += a.wy;
			if (a.x > b.x) a.x = b.x;
		} else return false;
		return true;
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

	for (let y = 0; y < gridHeight; y++) {
		for (let x = 0; x < gridWidth; x++) {
			if (grid[y][x] === 1) continue;
			const tile = grid[y][x];
			perfectMergeTiles(tile, grid);
			x += tile.wx - 1;
		}
	}
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