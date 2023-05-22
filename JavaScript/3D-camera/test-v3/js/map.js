class createMap {
	constructor(mapData) {
		/** @type {Array.number[]} */ this.map = mapData.map ?? [[1, 0], [1, 1]];
		/** @type {boolean} */ this.roof = mapData.roof ?? false;
		/** @type {HTMLElement} */this.scene = mapData.scene;
		/** @type {number} */this.size = mapData.size ?? 250;
	}

	generate() {
		const height = this.map.length;
		for (let y = 0; y < height; y++) {
			const width = this.map[y].length
			for (let x = 0; x < width; x++) {
				const currentTile = this.map[y][x];
				let texture = "floor"
				if (currentTile === 1) texture = "wall";
				else if (currentTile === 2) texture = "rock";

				if (currentTile === 0) { this.appendTile(x, y, "bottom", texture); continue };

				if (currentTile !== 0) this.appendTile(x, y, "top", texture);
				if (this.map[y][x + 1] === 0) this.appendTile(x, y, "right", texture);
				if (this.map[y][x - 1] === 0) this.appendTile(x, y, "left", texture);
				if (this.map[y + 1]?.[x] === 0) this.appendTile(x, y, "front", texture);
				if (this.map[y - 1]?.[x] === 0) this.appendTile(x, y, "back", texture);
			}
		}
	}

	appendTile(x, y, dir, texture) {
		const div = document.createElement("div");
		div.classList.add("tile", dir, texture);
		div.style.width = this.size + "px";
		div.style.height = this.size + "px";

		if (dir === "bottom") div.style.transform = `translate3d(${x * this.size}px, ${this.size}px, ${y * this.size}px) rotateX(90deg)`;
		else if (dir === "top") div.style.transform = `translate3d(${x * this.size}px, 0px, ${y * this.size}px) rotateX(90deg)`;
		else if (dir === "right") div.style.transform = `translate3d(${x * this.size + this.size}px, 0px, ${y * this.size + this.size}px) rotateY(90deg)`;
		else if (dir === "left") div.style.transform = `translate3d(${x * this.size}px, 0px, ${y * this.size}px) rotateY(-90deg)`;
		else if (dir === "back") div.style.transform = `translate3d(${x * this.size + this.size}px, 0px, ${y * this.size}px) rotateY(180deg)`;
		else if (dir === "front") div.style.transform = `translate3d(${x * this.size}px, 0px, ${y * this.size + this.size}px)`;
		else div.style.transform = `translate3d(${x * this.size}px, 0px, ${y * this.size}px)`;
		sceneElem.append(div);
	}
}

const map1 = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 1, 1, 0, 2, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];