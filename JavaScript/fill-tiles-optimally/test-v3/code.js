const tiles = [
	[0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
	[0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
	[0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 0, 0, 0, 1, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
];

const container = document.querySelector("#container");
container.style.width = `${tiles[0].length * 50}px`;
container.style.height = `${tiles.length * 50}px`;

generateBase();
function generateBase() {
	for (let y = 0; y < tiles.length; y++) {
		for (let x = 0; x < tiles[y].length; x++) {
			if (tiles[y][x] == 1) {
				const div = document.createElement("div");
				div.classList.add("tile");
				div.style.left = `${x * 50}px`;
				div.style.top = `${y * 50}px`;
				container.append(div);
			}
		}
	}
}

function generateBaseTiles(tiles) {
	const horizontal = tiles.map(row => [...row]);
	const vertical = tiles.map(row => [...row]);
	let horizontalCount = 0;
	let verticalCount = 0;
	for (let y = 0; y < tiles.length; y++) {
		for (let x = 0; x < tiles[y].length; x++) {
			if (horizontal[y][x] === 0) {
				horizontal[y][x] = { x, y, wx: 1, wy: 1 };
				const width = horizontal[y].indexOf(1, x);
				for (let i = x; i < width; i++) horizontal[y][i] = { x, y, wx: width - x, wy: 1 };
				horizontalCount++;
			}

			if (vertical[y][x] === 0) {
				vertical[y][x] = { x, y, wx: 1, wy: 1 };
				const height = vertical.findIndex((value, i) => value[x] === 1 && i > y)
				for (let i = y; i < height; i++) vertical[i][x] = { x, y, wx: 1, wy: height - y };
				verticalCount++;
			}
		}
	}

	if (horizontalCount > verticalCount) return horizontal;
	return vertical;
}

const baseTile = generateBaseTiles(tiles)
const calculatedTiles = test(baseTile)
render(calculatedTiles);

function test(tiles) {
	for (let i = 0; i < 5; i++) {
		for (let y = 0; y < tiles.length; y++) {
			for (let x = 0; x < tiles[y].length; x++) {
				const current = () => tiles[y][x];
				if (current() === 1) continue;

				const bottom = () => tiles[current().y + current().wy]?.[x] ?? {};
				const right = () => tiles[y][current().x + current().wx] ?? {};

				if (current().x === bottom().x && current().wx === bottom().wx) { // Perfect x match
					const data = { ...current(), wy: current().wy + bottom().wy };
					fill(data);
				}
				if (current().y === right().y && current().wy === right().wy) { // Perfect y match
					const data = { ...current(), wx: current().wx + right().wx };
					fill(data);
				}
				if (current().x === bottom().x && current().wx > bottom().wx) { // Same starting x
					const mergeData = { x: current().x, y: current().y, wx: bottom().wx, wy: current().wy + bottom().wy };
					const leftOverData = { x: current().x + bottom().wx, y: current().y, wx: current().wx - bottom().wx, wy: current().wy };
					marge(mergeData, leftOverData, current(), bottom());
				}
				if (current().x === bottom().x && current().wx < bottom().wx) { // Same starting x
					const mergeData = { x: current().x, y: current().y, wx: current().wx, wy: current().wy + bottom().wy };
					const leftOverData = { x: current().x + current().wx, y: bottom().y, wx: bottom().wx - current().wx, wy: bottom().wy };
					marge(mergeData, leftOverData, current(), bottom());
				}
				if (current().x + current().wx === bottom().x + bottom().wx && current().wx > bottom().wx) { // Same ending x
					const mergeData = { x: current().x, y: current().y, wx: current().wx - bottom().wx, wy: current().wy };
					const leftOverData = { x: bottom().x, y: current().y, wx: bottom().wx, wy: bottom().wy + current().wy };
					marge(mergeData, leftOverData, current(), bottom());
				}
				if (current().x + current().wx === bottom().x + bottom().wx && current().wx < bottom().wx) { // Same ending x
					const mergeData = { x: current().x, y: current().y, wx: current().wx, wy: current().wy + bottom().wy };
					const leftOverData = { x: bottom().x, y: bottom().y, wx: bottom().wx - current().wx, wy: bottom().wy };
					marge(mergeData, leftOverData, current(), bottom());
				}
				if (current().y === right().y && current().wy > right().wy) { // Same starting y
					const mergeData = { x: current().x, y: current().y, wx: current().wx + right().wx, wy: right().wy };
					const leftOverData = { x: current().x, y: current().y + right().wy, wx: current().wx, wy: current().wy - right().wy };
					marge(mergeData, leftOverData, current(), right());
				}
				if (current().y === right().y && current().wy < right().wy) { // Same starting y
					const mergeData = { x: current().x, y: current().y, wx: current().wx + right().wx, wy: current().wy };
					const leftOverData = { x: right().x, y: current().y + current().wy, wx: right().wx, wy: right().wy - current().wy };
					marge(mergeData, leftOverData, current(), right());
				}
				if (current().y + current().wy === right().y + right().wy && current().wy > right().wy) { // Same ending y
					const mergeData = { x: current().x, y: current().y, wx: current().wx, wy: current().wy - right().wy };
					const leftOverData = { x: current().x, y: right().y, wx: current().wx + right().wx, wy: right().wy };
					marge(mergeData, leftOverData, current(), right());
				}
				if (current().y + current().wy === right().y + right().wy && current().wy < right().wy) { // Same ending y
					const mergeData = { x: current().x, y: current().y, wx: current().wx + right().wx, wy: current().wy };
					const leftOverData = { x: right().x, y: right().y, wx: right().wx, wy: right().wy - current().wy };
					marge(mergeData, leftOverData, current(), right());
				}
			}
		}
	}

	return tiles;

	function marge(mergeData, leftOverData, current, swap) {
		const newDelta = Math.abs(mergeData.wx * mergeData.wy - leftOverData.wx * leftOverData.wy);
		const oldDelta = Math.abs(current.wx * current.wy - swap.wx * swap.wy);
		if (newDelta < oldDelta) {
			fill(mergeData);
			fill(leftOverData);
		};
	}

	function fill(data) {
		const { x, y, wx, wy } = data;
		for (let i = x; i < x + wx; i++) {
			for (let j = y; j < y + wy; j++) {
				tiles[j][i] = data;
			}
		}
	}
}

function render(tiles) {
	for (let y = 0; y < tiles.length; y++) {
		for (let x = 0; x < tiles[y].length; x++) {
			if (tiles[y][x] === 1) continue;
			if (tiles[y][x].x !== x || tiles[y][x].y !== y) continue;
			const div = document.createElement("div");
			div.classList.add("bigTile");
			div.style.left = `${x * 50}px`;
			div.style.top = `${y * 50}px`;
			div.style.width = `${tiles[y][x].wx * 50}px`;
			div.style.height = `${tiles[y][x].wy * 50}px`;
			x += tiles[y][x].wx - 1;
			container.append(div);
		}
	}
}

console.log("score", container.querySelectorAll(".bigTile").length);