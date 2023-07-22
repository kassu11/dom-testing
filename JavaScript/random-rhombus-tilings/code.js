const container = document.querySelector("#container");
const size = 10;
const tilePixelSize = 100;
const tileOffset = Math.tan(30 * Math.PI / 180) * tilePixelSize;

const maxWidth = 700;
container.style.transform = `scale(${maxWidth / (size * 100 * 2)})`

for (let y = 0; y < size; y++) {
	for (let x = 0; x < size; x++) {
		const blue = document.createElement("div");
		blue.classList.add("blue");
		blue.style.left = `${x * tilePixelSize}px`;
		blue.style.top = `${y * tilePixelSize + x * -tileOffset}px`;
		blue.setAttribute("data-x", x);
		blue.setAttribute("data-y", y);

		const orange = document.createElement("div");
		orange.classList.add("orange");
		orange.style.left = `${size * tilePixelSize + x * tilePixelSize}px`;
		orange.style.top = `${y * tilePixelSize + (x - size + 1) * tileOffset}px`;
		orange.setAttribute("data-x", x);
		orange.setAttribute("data-y", y);

		const green = document.createElement("div");
		green.classList.add("green");
		green.style.left = `${x * tilePixelSize + y * tilePixelSize + 60}px`;
		green.style.top = `${y * tileOffset + (x) * -tileOffset + size * tilePixelSize - 14}px`;
		green.setAttribute("data-x", x);
		green.setAttribute("data-y", y);

		container.append(blue, orange, green);
	}
}