const WIDTH = 600;
const HEIGHT = 600;

const pointCount = document.getElementById("pointCount");
const totalPointCount = document.getElementById("totalPointCount");

/**
 * @param {Number} min - The minimum value
 * @param {Number} max - The maximum value
 * @returns {Number} - A random number between min and max
 */
function random(min, max) {
	return Math.round(Math.random() * (max - min)) + min;
}

const canvas = /**  @type {HTMLCanvasElement} */ (document.getElementById("canvas"));
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext("2d");

const boundary = new Rectangle(0, 0, WIDTH, HEIGHT);
const tree = new QuadTree(boundary, 16);
const searchRange = new Rectangle(random(0, WIDTH), random(0, HEIGHT), random(0, WIDTH), random(0, HEIGHT));

for (let i = 0; i < 1000; i++) {
	const randomX = Math.abs(WIDTH / 2 + (Math.random() * 2 - 1) ** 5 * WIDTH);
	const randomY = Math.abs(HEIGHT / 2 + (Math.random() * 2 - 1) ** 5 * HEIGHT);
	const p = new Point(randomX, randomY);
	tree.insert(p);
}

canvas.addEventListener("mousemove", (event) => {
	searchRange.x = event.offsetX - searchRange.w / 2;
	searchRange.y = event.offsetY - searchRange.h / 2;

	if (event.buttons == 1) {
		const p = new Point(event.offsetX, event.offsetY);
		tree.insert(p);
	}
	update();
});

console.log(tree);

update();

function update() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	tree.show(ctx);
	searchRange.draw(ctx, "lime");
	const queryPoints = tree.query(searchRange);

	pointCount.textContent = String(queryPoints.length);
	totalPointCount.textContent = String(tree.length);

	queryPoints.forEach((point) => {
		point.draw(ctx, "lime");
	});
}
