const canvas = /**  @type {HTMLCanvasElement} */ (document.getElementById("canvas"));
canvas.width = 2 ** 9;
canvas.height = 2 ** 9;
const ctx = canvas.getContext("2d");

const boundary = new Rectangle(0, 0, 2 ** 9, 2 ** 9);
const tree = new QuadTree(boundary, 4);

for (let i = 0; i < 20; i++) {
	const p = new Point(Math.random() * 2 ** 9, Math.random() * 2 ** 9);
	tree.insert(p);
}

canvas.addEventListener("mousemove", (event) => {
	if (event.buttons !== 1) return;
	const p = new Point(event.offsetX, event.offsetY);
	tree.insert(p);

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	tree.show(ctx);
});

const point1 = new Point(100, 50);
const point2 = new Point(200, 100);
const point3 = new Point(50, 50);
const point4 = new Point(50, 50);
const point5 = new Point(100, 100);

tree.insert(point1);
tree.insert(point2);
tree.insert(point3);
tree.insert(point4);
tree.insert(point5);

console.log(tree);

tree.show(ctx);
