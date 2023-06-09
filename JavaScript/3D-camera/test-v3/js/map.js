class createMap {
	constructor(mapData) {
		/** @type {Array.number[]} */ this.map = mapData.map ?? [[1, 0], [1, 1]];
		/** @type {boolean} */ this.roof = mapData.roof ?? false;
		/** @type {HTMLElement} */this.scene = mapData.scene;
		/** @type {number} */this.size = mapData.size ?? 250;
	}

	generate() {
		const maxY = this.map.length;
		for (let y = 0; y < maxY; y++) {
			const maxZ = this.map[y].length;
			for (let z = 0; z < maxZ; z++) {
				const maxX = this.map[y][z].length;
				for (let x = 0; x < maxX; x++) {
					const currentTile = this.map[y][z][x];
					if (currentTile === 0) continue;
					if (maxY === 1 || this.map[y + 1]?.[z]?.[x] === 0) this.appendTile(x, y, z, "top", currentTile);
					if (y > 0 && this.map[y - 1]?.[z]?.[x] === 0) this.appendTile(x, y, z, "bottom", currentTile);
					if (y > 0 && this.map[y]?.[z]?.[x - 1] === 0) this.appendTile(x, y, z, "left", currentTile);
					if (y > 0 && this.map[y]?.[z]?.[x + 1] === 0) this.appendTile(x, y, z, "right", currentTile);
					if (y > 0 && this.map[y]?.[z + 1]?.[x] === 0) this.appendTile(x, y, z, "front", currentTile);
					if (y > 0 && this.map[y]?.[z - 1]?.[x] === 0) this.appendTile(x, y, z, "back", currentTile);
				}
			}
		}

	}

	appendTile(x, y, z, dir, tile) {
		const div = document.createElement("div");
		div.classList.add("tile", dir, textures[tile]);
		div.style.width = this.size + "px";
		div.style.height = this.size + "px";

		if (dir === "bottom") div.style.transform = `translate3d(${x * this.size}px, ${-y * this.size + this.size}px, ${z * this.size + this.size}px) rotateX(270deg)`;
		else if (dir === "top") div.style.transform = `translate3d(${x * this.size}px, ${-y * this.size}px, ${z * this.size}px) rotateX(90deg)`;
		else if (dir === "right") div.style.transform = `translate3d(${x * this.size + this.size}px, ${-y * this.size}px, ${z * this.size + this.size}px) rotateY(90deg)`;
		else if (dir === "left") div.style.transform = `translate3d(${x * this.size}px, ${-y * this.size}px, ${z * this.size}px) rotateY(-90deg)`;
		else if (dir === "back") div.style.transform = `translate3d(${x * this.size + this.size}px, ${-y * this.size}px, ${z * this.size}px) rotateY(180deg)`;
		else if (dir === "front") div.style.transform = `translate3d(${x * this.size}px, ${-y * this.size}px, ${z * this.size + this.size}px)`;
		sceneElem.append(div);
	}
}

const map1 = [
	[
		[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1],
		[1, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 1],
		[3, 3, 3, 3, 3, 1, 3, 3, 2, 3, 3, 3, 1],
		[3, 3, 3, 3, 3, 1, 3, 3, 2, 3, 3, 3, 1],
		[3, 3, 3, 3, 3, 1, 3, 3, 2, 3, 3, 3, 1],
		[3, 3, 3, 3, 3, 1, 1, 3, 2, 3, 3, 3, 1],
		[3, 3, 3, 3, 3, 1, 3, 3, 2, 3, 3, 3, 1],
		[3, 3, 3, 3, 3, 1, 3, 3, 2, 3, 3, 3, 1],
		[3, 3, 3, 3, 3, 1, 3, 3, 1, 3, 3, 3, 1],
		[3, 3, 3, 3, 3, 1, 3, 3, 1, 3, 3, 3, 1],
		[3, 3, 3, 3, 3, 1, 3, 3, 1, 3, 3, 3, 1],
		[3, 2, 3, 3, 3, 1, 3, 3, 1, 3, 3, 3, 1],
		[3, 2, 3, 3, 3, 1, 3, 3, 1, 3, 3, 3, 1],
		[3, 2, 3, 3, 3, 1, 3, 3, 1, 3, 3, 3, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	],
	[
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
	],
	[
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	],
	[
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 1, 3, 3, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 1, 3, 3, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 1, 3, 3, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 1, 3, 3, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 1, 3, 3, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	],
];

const textures = {
	1: "wall",
	2: "rock",
	3: "floor",
}