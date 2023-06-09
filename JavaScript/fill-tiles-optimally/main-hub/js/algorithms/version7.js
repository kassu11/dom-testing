import { grid } from "../index.js";
import { perfectMergeTiles } from "../perfectMergeTiles.js";

export default function main() {
	const gridClone = structuredClone(grid.map);
	verticalFill(gridClone);
	// stretchMerge(gridClone);
	stretchMergeHorizontal(gridClone);
	// stretchMerge(gridClone);
	// stretchMergeHorizontal(gridClone);
	// customStretchMerge(gridClone);
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

function stretchMergeHorizontal(grid) {
	const height = grid.length;
	const width = grid[0].length;

	for (let loop = 1; loop--;) {
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				if (grid[y][x] === 1) continue;
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
		}

		rightTiles.forEach(strechTile);
		leftTiles.forEach(strechTile);

		if (rightTiles.length || leftTiles.length) {
			const rightTile = rightTiles.at(-1) ?? tile;
			const leftTile = leftTiles.at(-1) ?? tile;
			const newTile = { x: leftTile.x, y: tile.y, wx: rightTile.x + rightTile.wx - leftTile.x, wy: tile.wy }
			fill(grid, newTile);
			perfectMergeTiles(newTile, grid);
			return true;
		}
	}
}

function customStretchMerge(grid) {
	const height = grid.length;
	const width = grid[0].length;

	for (let loop = 10; loop--;) {
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const tile = grid[y][x];
				if (tile === 1) continue;
				if (tile.wx < tile.wy) {
					stretchHorizontaly(tile)
				}
				else stretchVertically(tile)
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
		}

		rightTiles.forEach(strechTile);
		leftTiles.forEach(strechTile);

		if (rightTiles.length || leftTiles.length) {
			const rightTile = rightTiles.at(-1) ?? tile;
			const leftTile = leftTiles.at(-1) ?? tile;
			const newTile = { x: leftTile.x, y: tile.y, wx: rightTile.x + rightTile.wx - leftTile.x, wy: tile.wy }
			fill(grid, newTile);
			perfectMergeTiles(newTile, grid);
			return true;
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

	for (let x = 0; x < gridWidth; x++) {
		for (let y = 0; y < gridHeight; y++) {
			if (grid[y][x] !== 0) continue;
			grid[y][x] = { x, y, wx: 1, wy: 1 };

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
		}
	}

	for (let y = 0; y < gridHeight; y++) {
		for (let x = 0; x < gridWidth; x++) {
			if (grid[y][x] === 1) continue;
			const tile = grid[y][x];
			perfectMergeTiles(tile, grid);
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


old: { // Old code that is not used, but could be useful in the future
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

		function mergeIntersection(tiles) {
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

	function hasIntersection(grid, tile) {
		const maxX = tile.x + tile.wx;
		const maxY = tile.y + tile.wy;
		const tiles = [tile]
		for (let x = tile.x; x < maxX; x++) { // Top
			const a = grid[tile.y - 1]?.[x] ?? 1;
			if (a === 1) continue;
			x = a.x + a.wx - 1;
			const b = grid[tile.y - 1]?.[a.x + a.wx] ?? 1;
			if (b === 1 || b.x + b.wx > maxX) continue;
			tiles.push(a, b)
		};
		for (let x = tile.x; x < maxX; x++) { // bottom
			const a = grid[tile.y + tile.wy]?.[x] ?? 1;
			if (a === 1) continue;
			x = a.x + a.wx - 1;
			const b = grid[tile.y + tile.wy]?.[a.x + a.wx] ?? 1;
			if (b === 1 || b.x + b.wx > maxX) continue;
			tiles.push(a, b)
		};
		for (let y = tile.y; y < maxY; y++) { // Left
			const a = grid[y][tile.x - 1] ?? 1;
			if (a === 1) continue;
			y = a.y + a.wy - 1;
			const b = grid[a.y + a.wy]?.[tile.x - 1] ?? 1;
			if (b === 1 || b.y + b.wy > maxY) continue;
			tiles.push(a, b)
		};
		for (let y = tile.y; y < maxY; y++) { // Right
			const a = grid[y][tile.x + tile.wx] ?? 1;
			if (a === 1) continue;
			y = a.y + a.wy - 1;
			const b = grid[a.y + a.wy]?.[tile.x + tile.wx] ?? 1;
			if (b === 1 || b.y + b.wy > maxY) continue;
			tiles.push(a, b)
		};
		return tiles.length > 1 ? tiles : false;
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
}