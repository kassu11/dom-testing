import { resizeBox } from "./resizeBox.js"
import { Grid } from "./grid.js"
import { settings } from "./settings.js";

const container = document.querySelector("#mapContainer");
const settingsForm = document.querySelector("#settings form");
export const grid = new Grid({
	element: container,
	map: [
		[0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
		[0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
		[0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[1, 1, 1, 1, 1, 0, 0, 0, 1, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
	]
});

settings(settingsForm);

resizeBox(container);

console.log(grid)




// Global variables

Object.defineProperty(globalThis, "grid", {
	get() { return grid },
	set(value) { grid = value }
});