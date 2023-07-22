const container = document.querySelector("#container");
const size = 10;
const tilePixelSize = 100;
const tileOffset = Math.tan(30 * Math.PI / 180) * tilePixelSize;
const topOffset = size * tileOffset;

const maxWidth = 700;
container.style.transform = `scale(${maxWidth / (size * 100 * 2)})`

for (let y = 0; y < size; y++) {
	for (let x = 0; x < size; x++) {
		const left = document.createElement("div");
		left.classList.add("left");
		left.style.left = `${x * tilePixelSize}px`;
		left.style.top = `${y * tilePixelSize + x * -tileOffset + topOffset}px`;
		left.setAttribute("data-x", size - x - 1);
		left.setAttribute("data-y", size - y - 1);
		left.setAttribute("data-z", 0);

		const right = document.createElement("div");
		right.classList.add("right");
		right.style.left = `${size * tilePixelSize + x * tilePixelSize}px`;
		right.style.top = `${y * tilePixelSize + (x - size + 1) * tileOffset + topOffset}px`;
		right.setAttribute("data-x", 0);
		right.setAttribute("data-y", size - y - 1);
		right.setAttribute("data-z", x);

		const bottom = document.createElement("div");
		bottom.classList.add("bottom");
		bottom.style.left = `${x * tilePixelSize + y * tilePixelSize + 60}px`;
		bottom.style.top = `${y * tileOffset + (x) * -tileOffset + size * tilePixelSize - 14 + topOffset}px`;
		bottom.setAttribute("data-x", size - x - 1);
		bottom.setAttribute("data-y", 0);
		bottom.setAttribute("data-z", y);

		container.append(left, right, bottom);
	}
}

const corners = [[0, 0, 0]];

function checkCords(x, y, z) {
	const left = container.querySelector(`.left[data-x="${x}"][data-y="${y}"][data-z="${z}"]`);
	const right = container.querySelector(`.right[data-x="${x}"][data-y="${y}"][data-z="${z}"]`);
	const bottom = container.querySelector(`.bottom[data-x="${x}"][data-y="${y}"][data-z="${z}"]`);

	return (left && right && bottom);
}

function moveUp(x, y, z) {
	const left = container.querySelector(`.left[data-x="${x}"][data-y="${y}"][data-z="${z}"]`);
	const right = container.querySelector(`.right[data-x="${x}"][data-y="${y}"][data-z="${z}"]`);
	const bottom = container.querySelector(`.bottom[data-x="${x}"][data-y="${y}"][data-z="${z}"]`);

	bottom.style.top = `${parseFloat(bottom.style.top) - tilePixelSize}px`;
	bottom.setAttribute("data-y", y + 1);

	left.style.top = `${parseFloat(left.style.top) + tileOffset}px`;
	left.style.left = `${parseFloat(left.style.left) + tilePixelSize}px`;
	left.setAttribute("data-z", z + 1);

	right.style.top = `${parseFloat(right.style.top) + tileOffset}px`;
	right.style.left = `${parseFloat(right.style.left) - tilePixelSize}px`;
	right.setAttribute("data-x", x + 1);

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