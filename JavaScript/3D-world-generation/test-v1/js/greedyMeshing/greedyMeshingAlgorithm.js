function runGreedyMeshingAlgorithm(array, combineValue = 0) {
	const gridClone = structuredClone(array);
	verticalFill(gridClone, combineValue);
	stretchMergeHorizontal(gridClone, combineValue);
	return [...new Set(gridClone.flat())];
}

function stretchMergeHorizontal(grid, combineValue) {
	const height = grid.length;
	const width = grid[0].length;

	for (let loop = 1; loop--; ) {
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				if (grid[y][x] < combineValue || grid[y][x] > combineValue) continue;
				if (stretchHorizontaly(grid[y][x])) loop = 1;
			}
		}
	}

	function stretchHorizontaly(tile) {
		const rightTiles = [];
		while (true) {
			const lastTile = rightTiles.at(-1) ?? tile;
			const rightTile = grid[tile.y][lastTile.x + lastTile.wx] ?? {};
			if (rightTile.wy >= tile.wy && (rightTile.y === tile.y || rightTile.y + rightTile.wy === tile.y + tile.wy)) {
				rightTiles.push(rightTile);
			} else break;
		}

		const leftTiles = [];
		while (true) {
			const lastTile = leftTiles.at(-1) ?? tile;
			const leftTile = grid[tile.y][lastTile.x - 1] ?? {};
			if (leftTile.wy >= tile.wy && (leftTile.y === tile.y || leftTile.y + leftTile.wy === tile.y + tile.wy)) {
				leftTiles.push(leftTile);
			} else break;
		}

		const strechTile = (curTile) => {
			if (curTile.y === tile.y) {
				fill(grid, { x: curTile.x, y: curTile.y + tile.wy, wx: curTile.wx, wy: curTile.wy - tile.wy });
			} else if (curTile.y + curTile.wy === tile.y + tile.wy) {
				fill(grid, { x: curTile.x, y: curTile.y, wx: curTile.wx, wy: curTile.wy - tile.wy });
			}
		};

		rightTiles.forEach(strechTile);
		leftTiles.forEach(strechTile);

		if (rightTiles.length || leftTiles.length) {
			const rightTile = rightTiles.at(-1) ?? tile;
			const leftTile = leftTiles.at(-1) ?? tile;
			const newTile = { x: leftTile.x, y: tile.y, wx: rightTile.x + rightTile.wx - leftTile.x, wy: tile.wy };
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

function verticalFill(grid, combineValue) {
	const gridHeight = grid.length;
	const gridWidth = grid[0].length;

	for (let x = 0; x < gridWidth; x++) {
		for (let y = 0; y < gridHeight; y++) {
			if (grid[y][x] !== combineValue) continue;
			grid[y][x] = { x, y, wx: 1, wy: 1 };

			let wallIndex = -1;
			for (let i = y + 1; i < gridHeight; i++) {
				if (grid[i][x] < combineValue || grid[i][x] > combineValue) {
					wallIndex = i;
					break;
				}
			}

			const height = wallIndex === -1 ? gridHeight - y : wallIndex - y;
			for (let i = y; i < height + y; i++) grid[i][x] = { x, y, wx: 1, wy: height };
			y += height - 1;
		}
	}

	for (let y = 0; y < gridHeight; y++) {
		for (let x = 0; x < gridWidth; x++) {
			if (grid[y][x] < combineValue || grid[y][x] > combineValue) continue;
			const tile = grid[y][x];
			perfectMergeTiles(tile, grid);
		}
	}
}

// function render(tiles, element) {
// 	for (let y = 0; y < tiles.length; y++) {
// 		for (let x = 0; x < tiles[y].length; x++) {
// 			if (tiles[y][x] === 1) continue;
// 			if (tiles[y][x].x !== x || tiles[y][x].y !== y) continue;
// 			const div = document.createElement("div");
// 			div.classList.add("bigTile", "tile");
// 			div.style.left = `${x * 50}px`;
// 			div.style.top = `${y * 50}px`;
// 			div.style.width = `${tiles[y][x].wx * 50}px`;
// 			div.style.height = `${tiles[y][x].wy * 50}px`;
// 			x += tiles[y][x].wx - 1;
// 			element.append(div);
// 		}
// 	}
// }
