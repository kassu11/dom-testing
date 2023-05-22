// const tiles = [
// 	[1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
// 	[0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 	[1, 1, 1, 1, 1, 0, 0, 0, 1, 0],
// 	[0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
// 	[0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
// 	[0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
// ]
const tiles = [
	[1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[0, 1, 0, 1, 0, 0, 1, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 0, 0, 0, 1, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
]

const container = document.querySelector("#container");

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

test()
function test() {
	for (let y = 0; y < tiles.length; y++) {
		for (let x = 0; x < tiles[y].length; x++) {
			if (tiles[y][x] == 0) {
				tiles[y][x] = { x, y, wx: 1, wy: 1 };
				const width = tiles[y].indexOf(1, x);
				for (let i = x; i < width; i++) tiles[y][i] = { x, y, wx: width - x, wy: 1 };
				if (width !== -1) x = width;
			}
		}
	}


	for (let i = 0; i < 20; i++) {
		for (let y = 0; y < tiles.length; y++) {
			for (let x = 0; x < tiles[y].length; x++) {
				const current = tiles[y][x];
				if (current === 1) continue;
				const bottom = tiles[current.y + current.wy]?.[x] ?? {};
				const right = tiles[current.y][current.x + current.wx] ?? {};

				if (current.x === bottom.x && current.wx === bottom.wx) { // Perfect x match
					const data = { ...current, wy: current.wy + bottom.wy };
					fill(data);
				}
				else if (current.y === right.y && current.wy === right.wy) { // Perfect y match
					const data = { ...current, wx: current.wx + right.wx };
					fill(data);
				}
				else if (current.x === bottom.x && current.wx > bottom.wx) { // Same starting x
					const mergeData = { x: current.x, y: current.y, wx: bottom.wx, wy: current.wy + bottom.wy };
					const leftOverData = { x: current.x + bottom.wx, y: current.y, wx: current.wx - bottom.wx, wy: current.wy };

					fill(mergeData);
					fill(leftOverData);
				}
				else if (current.x === bottom.x && current.wx < bottom.wx) { // Same starting x
					const mergeData = { x: current.x, y: current.y, wx: current.wx, wy: current.wy + bottom.wy };
					const leftOverData = { x: current.x + current.wx, y: bottom.y, wx: bottom.wx - current.wx, wy: bottom.wy };

					fill(mergeData);
					fill(leftOverData);
				}
				else if (current.x + current.wx === bottom.x + bottom.wx && current.wx > bottom.wx) { // Same ending x
					const mergeData = { x: current.x, y: current.y, wx: current.wx - bottom.wx, wy: current.wy };
					const leftOverData = { x: bottom.x, y: current.y, wx: bottom.wx, wy: bottom.wy + current.wy };

					fill(mergeData);
					fill(leftOverData);
				}
				else if (current.x + current.wx === bottom.x + bottom.wx && current.wx < bottom.wx) { // Same ending x
					const mergeData = { x: current.x, y: current.y, wx: current.wx, wy: current.wy + bottom.wy };
					const leftOverData = { x: bottom.x, y: bottom.y, wx: bottom.wx - current.wx, wy: bottom.wy };

					fill(mergeData);
					fill(leftOverData);
				}
				else if (current.y === right.y && current.wy > right.wy) { // Same starting y
					const mergeData = { x: current.x, y: current.y, wx: current.wx + right.wx, wy: right.wy };
					const leftOverData = { x: current.x, y: current.y + right.wy, wx: current.wx, wy: current.wy - right.wy };

					fill(mergeData);
					fill(leftOverData);
				}
				else if (current.y === right.y && current.wy < right.wy) { // Same starting y
					const mergeData = { x: current.x, y: current.y, wx: current.wx + right.wx, wy: current.wy };
					const leftOverData = { x: right.x, y: current.y + current.wy, wx: right.wx, wy: right.wy - current.wy };

					fill(mergeData);
					fill(leftOverData);
				}
				else if (current.y + current.wy === right.y + right.wy && current.wy > right.wy) { // Same ending y
					const mergeData = { x: current.x, y: current.y, wx: current.wx, wy: current.wy - right.wy };
					const leftOverData = { x: current.x, y: right.y, wx: current.wx + right.wx, wy: right.wy };

					fill(mergeData);
					fill(leftOverData);
				}
				else if (current.y + current.wy === right.y + right.wy && current.wy < right.wy) { // Same ending y
					const mergeData = { x: current.x, y: current.y, wx: current.wx + right.wx, wy: current.wy };
					const leftOverData = { x: right.x, y: right.y, wx: right.wx, wy: right.wy - current.wy };

					fill(mergeData);
					fill(leftOverData);
				}
			}
		}
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

console.log("score", container.querySelectorAll(".bigTile").length);