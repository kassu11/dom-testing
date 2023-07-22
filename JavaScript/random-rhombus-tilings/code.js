const container = document.querySelector("#container");
const size = 20;

const maxWidth = 700;
container.style.transform = `scale(${maxWidth / (size * 100 * 2)})`

for (let y = 0; y < size; y++) {
	for (let x = 0; x < size; x++) {
		const blue = document.createElement("div");
		blue.classList.add("blue");
		blue.style.left = `${x * 100}px`;
		blue.style.top = `${y * 100 + x * -58}px`;
		blue.setAttribute("data-x", x);
		blue.setAttribute("data-y", y);

		const orange = document.createElement("div");
		orange.classList.add("orange");
		orange.style.left = `${size * 100 + x * 100}px`;
		orange.style.top = `${y * 100 + (x - size + 1) * 58}px`;
		orange.setAttribute("data-x", x);
		orange.setAttribute("data-y", y);

		const green = document.createElement("div");
		green.classList.add("green");
		green.style.left = `${x * 100 + y * 100 + 60}px`;
		green.style.top = `${y * 57 + (x) * -58 + size * 100 - 14}px`;
		green.setAttribute("data-x", x);
		green.setAttribute("data-y", y);

		container.append(blue, orange, green);
	}
}