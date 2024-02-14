class Point {
	/**
	 * @param {number} x - The x coordinate of the point
	 * @param {number} y - The y coordinate of the point
	 */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Rectangle {
	/**
	 * @param {number} x - The x coordinate of the center of the rectangle
	 * @param {number} y - The y coordinate of the center of the rectangle
	 * @param {number} w - The width of the rectangle
	 * @param {number} h - The height of the rectangle
	 */
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	contains(point) {
		return point.x >= this.x && point.x <= this.x + this.w && point.y >= this.y && point.y <= this.y + this.h;
	}
}

class QuadTree {
	/**
	 * @param {Rectangle} boundary - The boundary of the quadtree
	 * @param {number} capacity - The maximum number of points that can be stored in the quadtree
	 */
	constructor(boundary, capacity) {
		this.boundary = boundary;
		this.capacity = capacity;
		this.points = [];
		this.divided = false;
	}

	/**
	 * @param {Point} point - The point to insert into the quadtree
	 */
	insert(point) {
		if (!this.boundary.contains(point)) return false;
		if (this.points.length < this.capacity) this.points.push(point);
		else {
			if (!this.divided) this.subdivide();
			this.northwest.insert(point) || this.northeast.insert(point) || this.southwest.insert(point) || this.southeast.insert(point);
		}
	}

	subdivide() {
		const { x, y, w, h } = this.boundary;
		const halfWidth = w / 2;
		const halfHeight = h / 2;

		const northwestBoundary = new Rectangle(x, y, halfWidth, halfHeight);
		const northeastBoundary = new Rectangle(x + halfWidth, y, halfWidth, halfHeight);
		const southwestBoundary = new Rectangle(x, y + halfHeight, halfWidth, halfHeight);
		const southeastBoundary = new Rectangle(x + halfWidth, y + halfHeight, halfWidth, halfHeight);

		this.northwest = new QuadTree(northwestBoundary, this.capacity);
		this.northeast = new QuadTree(northeastBoundary, this.capacity);
		this.southwest = new QuadTree(southwestBoundary, this.capacity);
		this.southeast = new QuadTree(southeastBoundary, this.capacity);
		this.divided = true;
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context for the canvas
	 */
	show(ctx) {
		this.boundary && ctx.strokeRect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);
		if (this.divided) {
			this.northwest.show(ctx);
			this.northeast.show(ctx);
			this.southwest.show(ctx);
			this.southeast.show(ctx);
		}
		// this.points.forEach((point) => {
		// 	ctx.beginPath();
		// 	ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
		// 	ctx.fill();
		// });
	}
}
