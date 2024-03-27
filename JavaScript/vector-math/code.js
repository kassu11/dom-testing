const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;

const pointA = [{x: 1, y: 2}, {x: 5, y: 6}];
const pointB = [{x: 1, y: 6}, {x: 6, y: 1}];


const A = {x: 1, y: 3 / 5 }
const B = pointB[0].x + pointB[0].y
console.log(A, B);

function a(x) {
	return 7 - x;
}

function b(x) {
	return x + 1;
}



function findIntersection(vector1, vector2) {
		// Extracting coordinates for the first vector
		const x1 = vector1.x1;
		const y1 = vector1.y1;
		const x2 = vector1.x2;
		const y2 = vector1.y2;

		// Extracting coordinates for the second vector
		const x3 = vector2.x1;
		const y3 = vector2.y1;
		const x4 = vector2.x2;
		const y4 = vector2.y2;

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

		if(!vectorInRange(vector1, x, y) || !vectorInRange(vector2, x, y)) return false;
		// Returning the intersection point
		return { x, y };
}

function vectorInRange(vector, x, y) {
	if(vector.x1 < x && vector.x2 < x) return false;
	if(vector.x1 > x && vector.x2 > x) return false;
	if(vector.y1 < y && vector.y2 < y) return false;
	if(vector.y1 > y && vector.y2 > y) return false;
	return true;
}

// Example usage:
const vector1 = { x1: 1, y1: 5, x2: 100, y2: 500 };
const vector2 = { x1: 200, y1: 150, x2: 600, y2: 400 };

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.strokeStyle = "white";
	ctx.moveTo(vector1.x1, vector1.y1);
	ctx.lineTo(vector1.x2, vector1.y2);
	ctx.moveTo(vector2.x1, vector2.y1);
	ctx.lineTo(vector2.x2, vector2.y2);
	ctx.stroke();

	const intersection = findIntersection(vector1, vector2);

	if(intersection) {
		ctx.beginPath();
		ctx.arc(intersection.x, intersection.y, 5, 0, 2 * Math.PI);
		ctx.stroke();
	}
}
render()


let counter = 0;

document.addEventListener("mousedown", e => {
	const target = ++counter % 2 ? vector1 : vector2;
	const {top, left} = canvas.getBoundingClientRect();

	console.log(top, left)

	target.x1 = e.x - left;
	target.y1 = e.y - top;

	const moveMouse = e => {
		target.x2 = e.x - left;
		target.y2 = e.y - top;
		render();
	}

	render();

	window.addEventListener("mousemove", moveMouse);
	window.addEventListener("mouseup", () => {
		removeEventListener("mousemove", moveMouse);
	}, { once: true });
});