class createMap {
	constructor(mapData) {
		/** @type {Array.number[]} */ this.map = mapData.map ?? [
			[1, 0],
			[1, 1],
		];
		/** @type {boolean} */ this.roof = mapData.roof ?? false;
		/** @type {HTMLElement} */ this.scene = mapData.scene;
		/** @type {number} */ this.size = mapData.size ?? 250;
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

	generateGreedyMeshing() {
		const draws = [];
		let maxZ = 0;
		// console.log(this.map);
		// Top
		// for (let y = 0; y < this.map.length; y++) {
		// 	if (!(0 in this.map[y])) continue;
		// 	if (this.map[y][0].length > maxZ) maxZ = this.map[y][0].length;
		// 	const textures = [...new Set(this.map[y].flat())];
		// 	for (const texture of textures) {
		// 		if (texture == 0) continue;
		// 		draws.push(...runGreedyMeshingAlgorithm(this.map[y], texture).map((info) => ({ ...info, dir: "top", texture, y, z: info.y })));
		// 	}
		// }

		// Top & Bottom
		for (let y = 0; y < this.map.length; y++) {
			const topArr = [];
			const bottomArr = [];
			for (let z = 0; z < this.map[y].length; z++) {
				maxZ = Math.max(maxZ, this.map[y][z].length);
				topArr.push([]);
				bottomArr.push([]);
				for (let x = 0; x < this.map[y][z]?.length; x++) {
					const prevBottom = this.map[y - 1]?.[z][x];
					const prevTop = this.map[y + 1]?.[z][x];
					// topArr[z].push(this.map[y][z][x] ?? 0);
					if (!prevTop) topArr[z].push(this.map[y][z][x] ?? 0);
					else topArr[z].push(0);
					if (!prevBottom) bottomArr[z].push(this.map[y][z][x] ?? 0);
					else bottomArr[z].push(0);
				}
			}

			for (const texture of [...new Set(topArr.flat())]) {
				if (texture == 0) continue;
				draws.push(
					...runGreedyMeshingAlgorithm(topArr, texture).map((info) => ({
						...info,
						dir: "top",
						texture,
						z: info.y,
						y,
					}))
				);
			}

			// console.log(topArr);
			for (const texture of [...new Set(bottomArr.flat())]) {
				if (texture == 0) continue;
				draws.push(
					...runGreedyMeshingAlgorithm(bottomArr, texture).map((info) => ({
						...info,
						dir: "bottom",
						texture,
						z: info.y + info.wy - 1,
						y,
					}))
				);
			}
		}

		// back & front
		for (let x = 0; x < this.map[0].length; x++) {
			const backArr = [];
			const frontArr = [];
			for (let y = 0; y < this.map.length; y++) {
				backArr.push([]);
				frontArr.push([]);
				for (let z = 0; z < maxZ; z++) {
					const prevFront = this.map[y][x + 1]?.[z];
					const prevBack = this.map[y][x - 1]?.[z];
					if (!prevBack) backArr[y].push(this.map[y][x][z] ?? 0);
					else backArr[y].push(0);
					if (!prevFront) frontArr[y].push(this.map[y][x][z] ?? 0);
					else frontArr[y].push(0);
				}
			}

			// console.log(backArr, maxZ);

			for (const texture of [...new Set(backArr.flat())]) {
				if (texture == 0) continue;
				draws.push(
					...runGreedyMeshingAlgorithm(backArr, texture).map((info) => ({
						...info,
						dir: "back",
						texture,
						z: x,
						x: info.x + info.wx - 1,
						y: info.y + info.wy - 1,
					}))
				);
			}
			for (const texture of [...new Set(frontArr.flat())]) {
				if (texture == 0) continue;
				draws.push(
					...runGreedyMeshingAlgorithm(frontArr, texture).map((info) => ({
						...info,
						dir: "front",
						texture,
						y: info.y + info.wy - 1,
						z: x,
					}))
				);
			}
		}

		// left & right
		// for (let x = 0; x < maxZ; x++) {
		// 	const rightArr = [];
		// 	const leftArr = [];
		// 	for (let y = 0; y < this.map.length; y++) {
		// 		rightArr.push([]);
		// 		leftArr.push([]);
		// 		for (let z = 0; z < this.map[y].length; z++) {
		// 			const prevRight = this.map[y][x + 1]?.[z];
		// 			const prevLeft = this.map[y]?.[x - 1]?.[z];
		// 			if (!prevLeft) rightArr[y].push(this.map[y][x][z] ?? 0);
		// 			else rightArr[y].push(0);
		// 			if (!prevLeft) leftArr[y].push(this.map[y][z][x] ?? 0);
		// 			else leftArr[y].push(0);
		// 		}
		// 	}

		// 	for (const texture of [...new Set(rightArr.flat())]) {
		// 		if (texture == 0) continue;
		// 		draws.push(
		// 			...runGreedyMeshingAlgorithm(rightArr, texture).map((info) => ({
		// 				...info,
		// 				dir: "right",
		// 				texture,
		// 				z: x + info.wx - 1,
		// 				x: info.x + info.wx - 1,
		// 				y: info.y + info.wy - 1,
		// 			}))
		// 		);
		// 	}
		// 	for (const texture of [...new Set(leftArr.flat())]) {
		// 		if (texture == 0) continue;
		// 		draws.push(
		// 			...runGreedyMeshingAlgorithm(leftArr, texture).map((info) => ({
		// 				...info,
		// 				dir: "left",
		// 				texture,
		// 				z: x,
		// 				y: info.y + info.wy - 1,
		// 			}))
		// 		);
		// 	}
		// 	// console.log(leftArr);
		// }

		for (const draw of draws) {
			this.appendTile2(draw);
		}
	}

	appendTile(x, y, z, dir, tile) {
		const div = document.createElement("div");
		div.classList.add("tile", dir, textures[tile]);
		div.style.width = this.size + "px";
		div.style.height = this.size + "px";

		if (dir === "bottom")
			div.style.transform = `translate3d(${x * this.size}px, ${-y * this.size + this.size}px, ${
				z * this.size + this.size
			}px) rotateX(270deg)`;
		else if (dir === "top") div.style.transform = `translate3d(${x * this.size}px, ${-y * this.size}px, ${z * this.size}px) rotateX(90deg)`;
		else if (dir === "right")
			div.style.transform = `translate3d(${x * this.size + this.size}px, ${-y * this.size}px, ${
				z * this.size + this.size
			}px) rotateY(90deg)`;
		else if (dir === "left")
			div.style.transform = `translate3d(${x * this.size}px, ${-y * this.size}px, ${z * this.size}px) rotateY(-90deg)`;
		else if (dir === "back")
			div.style.transform = `translate3d(${x * this.size + this.size}px, ${-y * this.size}px, ${z * this.size}px) rotateY(180deg)`;
		else if (dir === "front") div.style.transform = `translate3d(${x * this.size}px, ${-y * this.size}px, ${z * this.size + this.size}px)`;
		sceneElem.append(div);
	}

	appendTile2({ x, y, z, wx, wy, dir, texture }) {
		const div = document.createElement("div");
		div.classList.add("tile", dir, textures[texture]);
		div.style.width = this.size * wx + "px";
		div.style.height = this.size * wy + "px";
		div.style.backgroundSize = `${this.size}px ${this.size}px`;

		if (dir === "bottom")
			div.style.transform = `translate3d(${x * this.size}px, ${-y * this.size + this.size}px, ${
				z * this.size + this.size
			}px) rotateX(270deg)`;
		else if (dir === "top") div.style.transform = `translate3d(${x * this.size}px, ${-y * this.size}px, ${z * this.size}px) rotateX(90deg)`;
		else if (dir === "right")
			div.style.transform = `translate3d(${x * this.size + this.size}px, ${-y * this.size}px, ${
				z * this.size + this.size
			}px) rotateY(90deg)`;
		else if (dir === "left")
			div.style.transform = `translate3d(${x * this.size}px, ${-y * this.size}px, ${z * this.size}px) rotateY(-90deg)`;
		else if (dir === "back")
			div.style.transform = `translate3d(${x * this.size + this.size}px, ${-y * this.size}px, ${z * this.size}px) rotateY(180deg)`;
		else if (dir === "front") div.style.transform = `translate3d(${x * this.size}px, ${-y * this.size}px, ${z * this.size + this.size}px)`;
		sceneElem.append(div);
	}

	/**
	 * @param {PerlinNoise} noise
	 * @param {number} size - Tile size
	 * @param {HTMLElement} scene
	 */
	static fromNoise(noise, size, scene) {
		const map = [];
		const perlinNoise = noise.generate();
		for (let z = -1; z < 255; z++) {
			const layer = [];
			for (let y = 0; y < noise.height; y++) {
				layer.push([]);
				for (let x = 0; x < noise.width; x++) {
					const value = perlinNoise[y * noise.width + x];
					layer[y].push(value > z ? 1 : 0);
				}
			}
			map.push(layer);
		}

		return new createMap({ map, size, scene });
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
};
