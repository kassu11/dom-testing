const visualize = document.querySelector("#visualize");
const output = document.querySelector("output")
const canvas = document.querySelector("canvas");
const gifCanvas = document.querySelector("#gif");
const ctx = canvas.getContext("2d");
const gifCtx = gifCanvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

const polygon = [[125,32.125],[489,40.125],[546,156.125],[521,415.125],[418,559.125],[186,572.125],[25,455.125],[48,166.125],[145,80.125],[328,71.125],[129,234.125],[175,452.125],[406,458.125],[242,303.125],[537,234.125],[259,201.125],[443,156.125],[444,107.125],[348,58.125],[190,53.125],[42,58.125],[53,18.125]]

function render(ctx, points, close = true, color = "white", clear = true, drawPoints = false) {
	if(clear) ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = color
	
	if(points.length == 0) return;
	const [first, ...rest] = points;
	ctx.beginPath()
	ctx.moveTo(first[0], first[1]);

	rest.forEach(point => {
		ctx.lineTo(point[0], point[1])
	});

	
	
	if(close) ctx.lineTo(first[0], first[1]);
	ctx.stroke();

	if (drawPoints) {
		points.forEach(([x, y], i) => {
			ctx.moveTo(x, y);
			ctx.beginPath();
			ctx.lineWidth = 3;
			if (i === 1) ctx.strokeStyle = "lime";
			else ctx.strokeStyle = color;
			ctx.arc(x, y, 5, 0, 2 * Math.PI)
			ctx.stroke();
		})
	}

	
}

let editing = false;

canvas.addEventListener("click", e => {
	if (!editing) {
		polygon.length = 0;
		editing = true;
	}

	const {top, left} = canvas.getBoundingClientRect();
	polygon.push([e.x - left, e.y - top]);
	calculateArea();
	render(ctx, polygon, false);
});

document.addEventListener("mousemove", e => {
	if(polygon.length === 0 || !editing) return;
	const {top, left} = canvas.getBoundingClientRect();
	render(ctx, polygon, false)

	ctx.lineTo(e.x - left, e.y - top);
	ctx.stroke();
});

document.addEventListener("keydown", e => {
	if(e.code == "Enter") {
		editing = false;
		render(ctx, polygon);
	}
})


function calculateArea() {
	output.textContent = 0;
	visualize.textContent = "";
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

		visualizeCaluculation(polygonCopy, triangle)

		area += calculateTriangleArea(triangle)
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
	if(!isPointInsidePolygon(polygon, x, y)) return false;

	const isValid = polygon.every(point => {
		if(triangle.some(t => point === t)) return true;
		return !isPointInsidePolygon(triangle, point[0], point[1])
	})

	return isValid;
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

render(ctx, polygon);

function visualizeCaluculation(polygons, triangle, area) {
	const newCanvas = document.createElement("canvas");
	newCanvas.width = canvas.width;
	newCanvas.height = canvas.height;
	const newCtx = newCanvas.getContext("2d");
	render(newCtx, polygons);
	render(newCtx, triangle, true, "red", false, true);

	const x = (triangle[0][0] + triangle[1][0] + triangle[2][0]) / 3;
	const y = (triangle[0][1] + triangle[1][1] + triangle[2][1]) / 3;

	newCtx.strokeStyle = "white";
	newCtx.beginPath();
	newCtx.arc(x, y, 5, 0, 2 * Math.PI);
	newCtx.stroke();

	visualize.appendChild(newCanvas);
}

let gifInterval = 0;
gifCanvas.width = canvas.width;
gifCanvas.height = canvas.height;
setInterval(() => {
	gifCanvas.width = canvas.width;
	gifCanvas.height = canvas.height;
	const frames = document.querySelectorAll("#visualize canvas");
	if(frames.length === 0 || gifInterval > frames.length) {
		gifInterval = 0;
		return;
	};

	const ctx = frames[gifInterval].getContext("2d");
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	gifCtx.putImageData(imageData, 0, 0);

	gifInterval = (gifInterval + 1) % frames.length;
}, 500)