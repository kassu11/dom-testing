const container = document.querySelector("#container");
const size = 10;
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
		blue.setAttribute("data-x", size - x - 1);
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
		green.setAttribute("data-x", size - x - 1);
		green.setAttribute("data-y", 0);
		green.setAttribute("data-z", y);

		container.append(blue, orange, green);
	}
}

const corners = [[0, 0, 0]];

function checkCords(x, y, z) {
	const blue = container.querySelector(`.blue[data-x="${x}"][data-y="${y}"][data-z="${z}"]`);
	const orange = container.querySelector(`.orange[data-x="${x}"][data-y="${y}"][data-z="${z}"]`);
	const green = container.querySelector(`.green[data-x="${x}"][data-y="${y}"][data-z="${z}"]`);

	return (blue && orange && green);
}

function moveUp(x, y, z) {
	const blue = container.querySelector(`.blue[data-x="${x}"][data-y="${y}"][data-z="${z}"]`);
	const orange = container.querySelector(`.orange[data-x="${x}"][data-y="${y}"][data-z="${z}"]`);
	const green = container.querySelector(`.green[data-x="${x}"][data-y="${y}"][data-z="${z}"]`);

	green.style.top = `${parseFloat(green.style.top) - tilePixelSize}px`;
	green.setAttribute("data-y", y + 1);

	blue.style.top = `${parseFloat(blue.style.top) + tileOffset}px`;
	blue.style.left = `${parseFloat(blue.style.left) + tilePixelSize}px`;
	blue.setAttribute("data-z", z + 1);

	orange.style.top = `${parseFloat(orange.style.top) + tileOffset}px`;
	orange.style.left = `${parseFloat(orange.style.left) - tilePixelSize}px`;
	orange.setAttribute("data-x", x + 1);

	const returnCorners = [];

	if (checkCords(x + 1, y, z)) returnCorners.push([x + 1, y, z]);
	if (checkCords(x, y + 1, z)) returnCorners.push([x, y + 1, z]);
	if (checkCords(x, y, z + 1)) returnCorners.push([x, y, z + 1]);

	return returnCorners;
}

for (let i = 0; i < 300; i++) {
	const randomCorner = Math.floor(Math.random() * corners.length);
	const [firstC, ...rest] = moveUp(...corners[randomCorner]);
	if (firstC) corners[randomCorner] = firstC;
	else corners.splice(randomCorner, 1);

	if (rest.length) corners.push(...rest);
}