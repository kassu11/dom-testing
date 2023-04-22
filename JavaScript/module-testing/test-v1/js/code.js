console.log("???")

import defImport from "./module.js";

defImport();

import { obj as newName, array, sword } from "./module.js";
console.log(array)
console.log(newName)

console.log(sword)

document.querySelector("button").addEventListener("click", async (e) => {
	const module = await import("./card.module.js")
	const card = module.default();

	document.body.appendChild(card);

	card.querySelector("button").addEventListener("click", () => {
		module.changeColor();
	});
});



const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

await sleep(1000);
console.log("Top level await")