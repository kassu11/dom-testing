class Point {
	/**
	 * @param {number} x - The x coordinate of the point
	 * @param {number} y - The y coordinate of the point
	 * @property {number} x - The x coordinate of the point
	 * @property {number} y - The y coordinate of the point
	 */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context for the canvas
	 * @param {string} [color] - The color of the point
	 * @returns {void}
	 */
	draw(ctx, color = "#ffffff90") {
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.arc(this.x, this.y, 1.5, 0, 2 * Math.PI);
		ctx.fill();
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

	/**
	 * @param {Point} point - The point to check for containment
	 * @returns {boolean} - Whether the point is contained in the rectangle
	 */
	contains(point) {
		return point.x >= this.x && point.x <= this.x + this.w && point.y >= this.y && point.y <= this.y + this.h;
	}

	/**
	 * @param {Rectangle} range - The range to check for intersection
	 * @returns {boolean} - Whether the rectangle intersects the range
	 */
	intersects(range) {
		return !(range.x > this.x + this.w || range.x + range.w < this.x || range.y > this.y + this.h || range.y + range.h < this.y);
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context for the canvas
	 * @param {string} [color] - The color of the rectangle
	 * @returns {void}
	 */
	draw(ctx, color = "#3d3d3d") {
		ctx.strokeStyle = color;
		ctx.strokeRect(this.x, this.y, this.w, this.h);
	}
}

class QuadTree {
	#_length = 0;

	/**
	 * @param {Rectangle} boundary - The boundary of the quadtree
	 * @param {number} capacity - The maximum number of points that can be stored in the quadtree
	 * @property {Rectangle} boundary - The boundary of the quadtree
	 * @property {number} capacity - The maximum number of points that can be stored in the quadtree
	 * @property {Point[]} points - The points contained in the quadtree
	 * @property {boolean} divided - Whether the quadtree is divided into quadrants
	 * @property {QuadTree} northwest - The northwest quadrant of the quadtree
	 * @property {QuadTree} northeast - The northeast quadrant of the quadtree
	 * @property {QuadTree} southwest - The southwest quadrant of the quadtree
	 * @property {QuadTree} southeast - The southeast quadrant of the quadtree
	 */
	constructor(boundary, capacity) {
		this.boundary = boundary;
		this.capacity = capacity;
		this.points = [];
		this.divided = false;
	}

	get length() {
		return this.#_length;
	}

	/**
	 * @param {Point} point - The point to insert into the quadtree
	 * @returns {boolean} - Whether the point was successfully inserted into the quadtree
	 */
	insert(point) {
		if (!this.boundary.contains(point)) return false;

		this.#_length++;
		if (this.points.length < this.capacity) this.points.push(point);
		else {
			if (!this.divided) this.subdivide();
			this.northwest.insert(point) || this.northeast.insert(point) || this.southwest.insert(point) || this.southeast.insert(point);
		}
	}

	/**
	 * Subdivides the quadtree into four quadrants
	 * @returns {void}
	 */
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
	 * @returns {void}
	 */
	show(ctx) {
		this.boundary?.draw(ctx);
		if (this.divided) {
			this.northwest.show(ctx);
			this.northeast.show(ctx);
			this.southwest.show(ctx);
			this.southeast.show(ctx);
		}

		this.points.forEach((point) => point.draw(ctx));
	}

	/**
	 * @param {Rectangle} range - The range to query for points
	 * @param {?Point[]} [found] - The points found in the range
	 * @returns {Point[]} - The points found in the range
	 */
	query(range, found = []) {
		if (this.boundary.intersects(range)) {
			this.points.forEach((point) => {
				if (range.contains(point)) found.push(point);
			});

			if (this.divided) {
				this.northwest.query(range, found);
				this.northeast.query(range, found);
				this.southwest.query(range, found);
				this.southeast.query(range, found);
			}
		}

		return found;
	}
}
