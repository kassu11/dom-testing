import { grid } from "./index.js";

export function updateCounters() {
	document.querySelector("#bigTiles span").textContent = document.querySelectorAll(".bigTile").length;
	let tiles = 0;
	grid.map.forEach(row => {
		row.forEach(tile => {
			if (tile === 0) tiles++;
		});
	});
	document.querySelector("#totalTiles span").textContent = tiles;
}