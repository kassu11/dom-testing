const WIDTH = 600;
const HEIGHT = 600;

const pointCount = document.getElementById("pointCount");
const totalPointCount = document.getElementById("totalPointCount");

/**
 * @param {Number} min - The minimum value
 * @param {Number} max - The maximum value
 * @returns {Number} - A random number between min and max
 */
function random(min, max = 0) {
	return Math.round(Math.random() * (max - min)) + min;
}

const canvas = /**  @type {HTMLCanvasElement} */ (document.getElementById("canvas"));
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext("2d");

const boundary = new Rectangle(0, 0, WIDTH, HEIGHT);
const tree = new QuadTree(boundary, 8);
const searchRange = new Rectangle(0, 0, 100, 100);

for (let i = 0; i < 100; i++) {
	const r = new Rectangle(random(WIDTH), random(HEIGHT), random(WIDTH / 5), random(HEIGHT / 5));
	tree.insert(r);
}

tree.insert(new Rectangle(1, 1, 10, 10));

window.addEventListener("mousemove", (event) => {
	const x = event.x - canvas.offsetLeft;
	const y = event.y - canvas.offsetTop;
	searchRange.x = x - searchRange.w / 2;
	searchRange.y = y - searchRange.h / 2;

	if (event.buttons == 1) {
		event.preventDefault();
		const p = new Rectangle(x - 50, y - 50, 100, 100);
		tree.insert(p);
	}
	update();
});

console.log(tree);

update();

function update() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	tree.show(ctx);
	const queryPoints = tree.query(searchRange);

	pointCount.textContent = String(queryPoints.length);
	totalPointCount.textContent = String(tree.length);

	queryPoints.forEach((rectangle) => {
		rectangle.fill(ctx, "white");
	});
	searchRange.draw(ctx, "lime");
}
