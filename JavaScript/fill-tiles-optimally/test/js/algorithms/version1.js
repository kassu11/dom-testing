import { grid } from "../index.js";

export default function main() {
	const newGrid = grid.map.map(row => [...row]);
	const points = generateSearchPoints(newGrid, grid.tilesElem);
	fillTiles(points, newGrid, grid.tilesElem);
}

function generateSearchPoints(tiles, elem) {
	const returnValues = {};
	for (let y = 0; y < tiles.length; y++) {
		const xValues = [];
		tiles[y].forEach((value, x) => {
			if (value !== 0) return;
			const topRightXindex = tiles[y - 1]?.indexOf(1, x);
			const currentRightXindex = tiles[y].indexOf(1, x);
			const topLeftXindex = tiles[y - 1]?.lastIndexOf(1, x);
			const currentLeftXindex = tiles[y].lastIndexOf(1, x);

			const leftBottomYindex = tiles.findIndex((row, index) => row[x - 1] === 1 && index > y);
			const currentBottomYindex = tiles.findIndex((row, index) => row[x] === 1 && index > y);
			const leftTopYindex = tiles.findLastIndex((row, index) => row[x - 1] === 1 && index < y);
			const currentTopYindex = tiles.findLastIndex((row, index) => row[x] === 1 && index < y);

			const leftValue = tiles[y][x - 1];
			const topValue = tiles[y - 1]?.[x];
			const topLeftValue = tiles[y - 1]?.[x - 1];

			if (leftValue !== 0 && y === 0) xValues.push(x);
			// else if (topRightXindex !== currentRightXindex && leftValue !== 0) xValues.push(x);
			// else if (topValue == 1 && leftValue !== 0) xValues.push(x);
			// else if (currentBottomYindex !== leftBottomYindex && topValue !== 0) xValues.push(x);
			else if (leftValue === 1 && topLeftValue === 0) xValues.push(x);
			// else if (topLeftValue === 0 && topValue === 1) xValues.push(x);
			else if (
				(leftTopYindex !== currentTopYindex || leftBottomYindex !== currentBottomYindex) &&
				(topLeftXindex !== currentLeftXindex || topRightXindex !== currentRightXindex)
			) xValues.push(x);
		});

		for (const x of xValues) {
			const div = document.createElement("div");
			div.classList.add("search", "tile");
			div.style.left = `${x * 50}px`;
			div.style.top = `${y * 50}px`;
			elem.append(div);
			returnValues[`${x}-${y}`] = { x, y };
		}
	} return returnValues;
}

function fillTiles(points, tiles, elem) {
	const pointsArray = Object.values(points).sort((a, b) => {
		let aNum = calcValue(a.x, a.y);
		let bNum = calcValue(b.x, b.y);
		return aNum - bNum;
	});

	function calcValue(x, y) {
		let num = 0;
		if (`${x}-${y - 1}` in points) num++
		if (`${x}-${y + 1}` in points) num++
		if (`${x - 1}-${y}` in points) num++
		if (`${x + 1}-${y}` in points) num++
		if (`${x - 1}-${y - 1}` in points) num += 0.5
		if (`${x + 1}-${y - 1}` in points) num += 0.5
		if (`${x - 1}-${y + 1}` in points) num += 0.5
		if (`${x + 1}-${y + 1}` in points) num += 0.5
		return num;
	}

	for (const value of pointsArray) {
		let currentMaxData = { wx: 1, wy: 1, size: 0 };
		let currentMaxX = Infinity;
		if (tiles[value.y][value.x] !== 0) continue;

		for (let y = value.y; y < tiles.length; y++) {
			if (tiles[y][value.x] !== 0) break;
			for (let x = value.x; x < tiles[y].length; x++) {
				if (tiles[y][x] !== 0 || x > currentMaxX) {
					if (x - 1 < currentMaxX) currentMaxX = x - 1;
					break;
				};
				const currentSize = (y - value.y + 1) * (x - value.x + 1);
				if (currentSize > currentMaxData.size) {
					currentMaxData.wx = x - value.x + 1;
					currentMaxData.wy = y - value.y + 1;
					currentMaxData.size = currentSize;
				}
			}
		}

		for (let y = 0; y < currentMaxData.wy; y++) {
			for (let x = 0; x < currentMaxData.wx; x++) {
				tiles[value.y + y][value.x + x] = 1;
			}
		}

		const div = document.createElement("div");
		div.classList.add("bigTile", "tile");
		div.style.left = `${value.x * 50}px`;
		div.style.top = `${value.y * 50}px`;
		div.style.width = `${currentMaxData.wx * 50}px`;
		div.style.height = `${currentMaxData.wy * 50}px`;
		elem.append(div);
	}
}