class Rectangle {
	/**
	 * @param {number} x - The x coordinate of the center of the rectangle
	 * @param {number} y - The y coordinate of the center of the rectangle
	 * @param {number} w - The width of the rectangle
	 * @param {number} h - The height of the rectangle
	 * @property {number} x - The x coordinate of the center of the rectangle
	 * @property {number} y - The y coordinate of the center of the rectangle
	 * @property {number} w - The width of the rectangle
	 * @property {number} h - The height of the rectangle
	 */
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.color = `hsla(${random(0, 255)}, 100%, 50%, .5)`;
	}

	/**
	 * @param {Rectangle} rectangle - The rectangle to check for containment
	 * @returns {boolean} - Whether the rectangle is contained in this rectangle
	 */
	contains(rectangle) {
		return (
			this.x <= rectangle.x &&
			rectangle.x + rectangle.w <= this.x + this.w &&
			rectangle.y >= this.y &&
			rectangle.y + rectangle.h <= this.y + this.h
		);
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

	/**
	 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context for the canvas
	 * @param {string} [color] - The color of the rectangle
	 * @returns {void}
	 */
	fill(ctx, color = "grey") {
		ctx.fillStyle = color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}

class QuadTree {
	/**
	 * @param {Rectangle} boundary - The boundary of the quadtree
	 * @param {number} maxDepth - The maximum depth of the quadtree
	 * @property {Rectangle} boundary - The boundary of the quadtree
	 * @property {number} depth - The depth of the quadtree
	 * @property {Rectangle[]} shapes - The points contained in the quadtree
	 * @property {boolean} divided - Whether the quadtree is divided into quadrants
	 * @property {QuadTree} northwest - The northwest quadrant of the quadtree
	 * @property {QuadTree} northeast - The northeast quadrant of the quadtree
	 * @property {QuadTree} southwest - The southwest quadrant of the quadtree
	 * @property {QuadTree} southeast - The southeast quadrant of the quadtree
	 */
	constructor(boundary, maxDepth) {
		this.boundary = boundary;
		this.maxDepth = maxDepth;
		this.depth = 1;
		/** @type {Rectangle[]} */
		this.shapes = [];
		this.divided = false;
		/** @type {QuadTree[]} */
		this.quadTrees = [];

		const { x, y, w, h } = this.boundary;
		const halfWidth = w / 2;
		const halfHeight = h / 2;

		this.quadTreeBoundaries = [
			new Rectangle(x, y, halfWidth, halfHeight),
			new Rectangle(x + halfWidth, y, halfWidth, halfHeight),
			new Rectangle(x, y + halfHeight, halfWidth, halfHeight),
			new Rectangle(x + halfWidth, y + halfHeight, halfWidth, halfHeight),
		];
	}

	get length() {
		return this.shapes.length + this.quadTrees.reduce((acc, tree) => acc + tree.length, 0);
	}

	/**
	 * @param {Rectangle} rectangle - The rectangle to insert into the quadtree
	 * @returns {void} - Whether the rectangle was successfully inserted into the quadtree
	 */
	insert(rectangle) {
		for (const i in this.quadTreeBoundaries) {
			if (this.quadTreeBoundaries[i].contains(rectangle)) {
				console.log("????", rectangle, this.quadTreeBoundaries[i]);
				if (this.depth + 1 < this.maxDepth) {
					if (!this.quadTrees[i]) {
						this.quadTrees[i] = new QuadTree(this.quadTreeBoundaries[i], this.maxDepth);
						this.quadTrees[i].depth = this.depth + 1;
					}

					this.quadTrees[i].insert(rectangle);
					return;
				}
			}
		}

		this.shapes.push(rectangle);
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context for the canvas
	 * @returns {void}
	 */
	show(ctx) {
		this.boundary?.draw(ctx);
		this.quadTrees.forEach((tree) => tree.show(ctx));
		this.shapes.forEach((rectangle) => rectangle.fill(ctx, rectangle.color));
	}

	/**
	 * @param {Rectangle} range - The range to query for rectangles
	 * @param {Rectangle[]} [found] - The rectangles found in the range
	 * @returns {Rectangle[]} - The rectangles found in the range
	 */
	query(range, found = []) {
		for (const tree of this.quadTrees) {
			if (tree?.boundary?.intersects(range)) tree.query(range, found);
		}

		this.shapes.forEach((rectangle) => {
			if (range.intersects(rectangle)) found.push(rectangle);
		});

		return found;
	}
}
