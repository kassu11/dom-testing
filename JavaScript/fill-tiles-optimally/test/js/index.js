import { boxClickEvent } from "./boxClickEvent.js"
import { Grid } from "./grid.js"
import { settings } from "./settings.js";

const container = document.querySelector("#mapContainer");
const settingsForm = document.querySelector("#settings form");
// export const grid = new Grid({
// 	element: container,
// 	map: [
// 		[0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
// 		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 		[0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
// 		[0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
// 		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 		[0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
// 		[0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
// 		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 		[1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
// 		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 		[1, 1, 1, 1, 1, 0, 0, 0, 1, 0],
// 		[0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
// 		[0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
// 	]
// });

// export const grid = new Grid({
// 	element: container,
// 	map: [
// 		[0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
// 		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 		[0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
// 		[0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
// 		[1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
// 		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 		[0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
// 		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 		[0, 1, 1, 0, 0, 0, 1, 0, 0, 0],
// 		[0, 0, 0, 0, 0, 0, 0, 1, 0, 0]
// 	]
// });

// export const grid = new Grid({
// 	element: container,
// 	map: [
// 		[0, 1, 0, 0],
// 		[0, 0, 0, 1],
// 		[1, 0, 0, 0],
// 		[0, 0, 0, 0],
// 		[0, 0, 0, 0]
// 	]
// });

export const grid = new Grid({
	element: container,
	map: [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 1, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 1, 0, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0]
	]
});

settings(settingsForm);

boxClickEvent(container);

console.log(grid)


function printGrid() {
	console.log(JSON.stringify(grid.map, (key, value) => {
		if (Array.isArray(value) && Number.isInteger(value[0])) return JSON.stringify(value).replaceAll(",", ", ")
		return value;
	}, 2).replaceAll('"', ""))
}


// Global variables

Object.defineProperty(globalThis, "grid", {
	get() { return grid },
	set(value) { grid = value }
});

Object.defineProperty(globalThis, "printGrid", {
	get() { return printGrid },
	set(value) { printGrid = value }
});