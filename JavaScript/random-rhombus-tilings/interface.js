const sizeInput = document.querySelector("#size");
const simulationsInput = document.querySelector("#simulations");

sizeInput.addEventListener("input", e => {
	const numbers = [...Array(10)].map((_, i) => i);
	e.target.value = e.target.value.split("").filter(char => numbers.includes(+char)).join("");

	const size = Math.max(2, parseInt(e.target.value)) || 2;
	generateEmptyGrid(size);
});

simulationsInput.addEventListener("input", e => {
	const numbers = [...Array(10)].map((_, i) => i);
	e.target.value = e.target.value.split("").filter(char => numbers.includes(+char)).join("");
});

document.querySelector("button#generate").addEventListener("click", e => {
	const amount = Math.max(0, parseInt(simulationsInput.value)) || 0;
	simulateCorners(amount);
});

document.querySelector("button#reset").addEventListener("click", e => {
	const size = Math.max(2, parseInt(sizeInput.value)) || 2;
	generateEmptyGrid(size);
});

document.querySelector(`input[type="checkbox"]`).addEventListener("change", e => {
	container.classList.toggle("animate", e.target.checked);
});
