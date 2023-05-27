import { grid } from "./index.js";

export function settings(form) {
	processFormValues(form)

	form.addEventListener("input", () => processFormValues(form));
	form.querySelector("button").addEventListener("click", () => {
		grid.fillRandomly();
	});
}

async function processFormValues(form) {
	const formData = Object.fromEntries(new FormData(form));
	form.querySelectorAll("input[data-type='number']").forEach(elem => {
		const { id, value, min = 2, max = 5 } = elem;
		// regex to remove all non-numeric characters
		const val = parseInt(value.replace(/\D/g, "") || 0);
		formData[id] = elem.value = Math.max(Math.min(val, +max), +min);
	});

	const callback = await import(`./algorithms/${formData.algorithm}.js`);
	grid.updateAlgorithm(callback.default, formData.algorithm);
	grid.resize(formData.width, formData.height);
}

export function updateFormSizeValues(width, height) {
	const form = document.querySelector("#settings form");
	form.querySelector("#width").value = width;
	form.querySelector("#height").value = height;
}