const output = document.querySelector("output")
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

const polygon = [[10, 10], [450, 50], [500, 500], [200, 50], [10, 550]]

function render(close = true) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = "white"
	if(polygon.length == 0) return;

	const [first, ...rest] = polygon;
	ctx.beginPath()
	ctx.moveTo(first[0], first[1]);

	rest.forEach(point => {
		ctx.lineTo(point[0], point[1])
	});
	
	if(close) ctx.lineTo(first[0], first[1]);
	ctx.stroke();
}

let editing = false;

document.addEventListener("click", e => {
	if (!editing) {
		polygon.length = 0;
		editing = true;
	}

	const {top, left} = canvas.getBoundingClientRect();
	polygon.push([e.x - left, e.y - top]);
	calculateArea();
	render(false);
});

document.addEventListener("mousemove", e => {
	if(polygon.length === 0 || !editing) return;
	const {top, left} = canvas.getBoundingClientRect();
	render(false)

	ctx.lineTo(e.x - left, e.y - top);
	ctx.stroke();
});

document.addEventListener("keydown", e => {
	if(e.code == "Enter") {
		editing = false;
		render();
	}
})


function calculateArea() {
	output.textContent = 0;
	let polygonCopy = structuredClone(polygon);
	if(polygonCopy.length < 3) return 0;

	const triangle = []
	let area = 0;
	for(let i = 0; i < polygonCopy.length + 2 && polygonCopy.length > 2; i++) {
		triangle.push(polygonCopy[i % polygonCopy.length])
		if(triangle.length > 3) triangle.shift()
		else if (triangle.length !== 3) continue;

		const line = [triangle[0], triangle[2]].flat();
		if(!isTriangleValid(polygonCopy, line, triangle)) continue;

		area += calculateTriangleArea(triangle)
		console.log("????")
		polygonCopy = polygonCopy.filter(p => p !== triangle[1]);
		triangle.length = 0;
		i = 0;
	}

	output.textContent = area;
}

calculateArea();

// const p1 = [Math.random() * 100, Math.random() * 100]
// const p2 = [Math.random() * 100, Math.random() * 100]
// const p3 = [Math.random() * 100, Math.random() * 100]
// console.log(Math.hypot(p1[0] - p2[0], p1[1] - p2[1]))
// console.log(Math.hypot(p2[0] - p3[0], p2[1] - p3[1]))
// console.log(Math.hypot(p3[0] - p1[0], p3[1] - p1[1]))

// console.log(calculateTriangleArea([p1, p2, p3]))
// Gets the same area value then https://www.calculator.net/triangle-calculator.html

function calculateTriangleArea(points) {
	const [a, b, c] = points;
	return Math.abs((a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1])) / 2);
}

function isPointInsidePolygon(polygon, x, y) {
	let count = 0;
	for(let i = 0; i < polygon.length; i++) {
		const [x1, y1, x2, y2] = [polygon[i], polygon.at(i - 1)].flat();
		if((y1 < y && y2 >= y || y2 < y && y1 >= y) && (x1 <= x || x2 <= x)) {
			count += (x1 + (y - y1) / (y2 - y1) * (x2 - x1)) < x;
		}
	}
	return count % 2 === 1;

}


function isTriangleValid(polygon, line, triangle) {
	for(let i = 0; i < polygon.length; i++) {
		if(triangle.some(points => points === polygon[i] || points === polygon.at(i - 1))) continue;
		if (findIntersection(line, [polygon[i], polygon.at(i - 1)].flat())) {
			return false
		}
	}

	const x = (triangle[0][0] + triangle[1][0] + triangle[2][0]) / 3;
	const y = (triangle[0][1] + triangle[1][1] + triangle[2][1]) / 3;

	return isPointInsidePolygon(polygon, x, y);
}

function findIntersection([x1, y1, x2, y2], [x3, y3, x4, y4]) {

	// Calculating slopes of the lines
	const slope1 = (y2 - y1) / (x2 - x1);
	const slope2 = (y4 - y3) / (x4 - x3);

	// Checking if lines are parallel
	if (slope1 === slope2) {
			return false; // No intersection
	}

	// Calculating intersection point
	const x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
						((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
	const y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
						((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));

	if(!vectorInRange([x1, y1, x2, y2], x, y) || !vectorInRange([x3, y3, x4, y4], x, y)) return false;
	// Returning the intersection point
	return { x, y };
}

function vectorInRange([x1, y1, x2, y2], x, y) {
	if(x1 < x && x2 < x) return false;
	if(x1 > x && x2 > x) return false;
	if(y1 < y && y2 < y) return false;
	if(y1 > y && y2 > y) return false;
	return true;
}

render();