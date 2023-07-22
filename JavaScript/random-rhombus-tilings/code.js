const container = document.querySelector("#container");
const size = 20;
const tilePixelSize = 100;
const tileOffset = Math.tan(30 * Math.PI / 180) * tilePixelSize;
const topOffset = size * tileOffset;

const maxWidth = 700;
container.style.transform = `scale(${maxWidth / (size * 100 * 2)})`

for (let y = 0; y < size; y++) {
	for (let x = 0; x < size; x++) {
		const blue = document.createElement("div");
		blue.classList.add("blue");
		blue.style.left = `${x * tilePixelSize}px`;
		blue.style.top = `${y * tilePixelSize + x * -tileOffset + topOffset}px`;
		blue.setAttribute("data-x", x);
		blue.setAttribute("data-y", size - y - 1);
		blue.setAttribute("data-z", 0);

		const orange = document.createElement("div");
		orange.classList.add("orange");
		orange.style.left = `${size * tilePixelSize + x * tilePixelSize}px`;
		orange.style.top = `${y * tilePixelSize + (x - size + 1) * tileOffset + topOffset}px`;
		orange.setAttribute("data-x", 0);
		orange.setAttribute("data-y", size - y - 1);
		orange.setAttribute("data-z", x);

		const green = document.createElement("div");
		green.classList.add("green");
		green.style.left = `${x * tilePixelSize + y * tilePixelSize + 60}px`;
		green.style.top = `${y * tileOffset + (x) * -tileOffset + size * tilePixelSize - 14 + topOffset}px`;
		green.setAttribute("data-x", x);
		green.setAttribute("data-y", 0);
		green.setAttribute("data-z", y);

		container.append(blue, orange, green);
	}
}

const corners = [container.querySelector(`.green[data-x="${size - 1}"][data-y="0"][data-z="0"]`)];

function checkCords(x, y, z) {
	const blue = container.querySelector(`.green[data-x="${x}"][data-y="${y}"][data-z="${z}"]`);
	const orange = container.querySelector(`.blue[data-x="${x}"][data-y="${y}"][data-z="${z}"]`);
	const green = container.querySelector(`.orange[data-x="${x}"][data-y="${y}"][data-z="${z}"]`);

	return blue && orange && green;
}