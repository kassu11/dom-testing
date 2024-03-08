class WorldMap {
	#chunkSize = 16;
	#worldHeight = 255;
	#loadedChunkMeshings = new Map();
	#loadedChunkElements = new Map();
	#activeChunks = new Map();

	/**
	 * @param {number} seed
	 * @param {number} size
	 * @param {HTMLElement} scene
	 */
	constructor(seed, size, scene) {
		/** @type {number} */ this.seed = seed;
		/** @type {HTMLElement} */ this.scene = scene;
		/** @type {number} */ this.size = size ?? 250;
		this.noise = new PerlinNoise(seed, this.#chunkSize, this.#chunkSize);
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

	generateGreedyMeshing(chunk) {
		const draws = [];

		// Top & Bottom
		for (let y = 0; y < chunk.length; y++) {
			const topArr = [];
			const bottomArr = [];
			for (let z = 0; z < chunk[y].length; z++) {
				topArr.push([]);
				bottomArr.push([]);
				for (let x = 0; x < chunk[y][z]?.length; x++) {
					const prevBottom = chunk[y - 1]?.[z][x];
					const prevTop = chunk[y + 1]?.[z][x];
					if (prevTop === 0) topArr[z].push(chunk[y][z][x] ?? 0);
					else topArr[z].push(0);
					if (prevBottom === 0) bottomArr[z].push(chunk[y][z][x] ?? 0);
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
		for (let x = 0; x < chunk[0].length; x++) {
			const backArr = [];
			const frontArr = [];
			for (let y = 0; y < chunk.length; y++) {
				backArr.push([]);
				frontArr.push([]);
				for (let z = 0; z < chunk[y][x].length; z++) {
					const prevFront = chunk[y][x + 1]?.[z];
					const prevBack = chunk[y][x - 1]?.[z];
					if (prevBack === 0) backArr[y].push(chunk[y][x][z] ?? 0);
					else backArr[y].push(0);
					if (prevFront === 0) frontArr[y].push(chunk[y][x][z] ?? 0);
					else frontArr[y].push(0);
				}
			}

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
		for (let x = 0; x < chunk[0][0].length; x++) {
			const rightArr = [];
			const leftArr = [];
			for (let y = 0; y < chunk.length; y++) {
				rightArr.push([]);
				leftArr.push([]);
				for (let z = 0; z < chunk[y].length; z++) {
					const prevRight = chunk[y][z][x + 1];
					const prevLeft = chunk[y]?.[z][x - 1];
					if (prevRight === 0) rightArr[y].push(chunk[y][z][x] ?? 0);
					else rightArr[y].push(0);
					if (prevLeft === 0) leftArr[y].push(chunk[y][z][x] ?? 0);
					else leftArr[y].push(0);
				}
			}

			for (const texture of [...new Set(rightArr.flat())]) {
				if (texture == 0) continue;
				draws.push(
					...runGreedyMeshingAlgorithm(rightArr, texture).map((info) => ({
						...info,
						dir: "right",
						texture,
						z: info.x + info.wx - 1,
						x: x,
						y: info.y + info.wy - 1,
					}))
				);
			}
			for (const texture of [...new Set(leftArr.flat())]) {
				if (texture == 0) continue;
				draws.push(
					...runGreedyMeshingAlgorithm(leftArr, texture).map((info) => ({
						...info,
						dir: "left",
						texture,
						z: info.x,
						x: x,
						y: info.y + info.wy - 1,
					}))
				);
			}
		}

		return draws;
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

	generateGreedyMeshingElementTile({ x, y, z, wx, wy, dir, texture }, marginX, marginZ) {
		const div = document.createElement("div");
		div.classList.add("tile", dir, textures[texture]);
		div.style.width = this.size * wx + "px";
		div.style.height = this.size * wy + "px";
		div.style.backgroundSize = `${this.size}px ${this.size}px`;

		x = x + marginX * this.#chunkSize;
		z = z + marginZ * this.#chunkSize;

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
		return div;
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

		return new WorldMap({ map, size, scene });
	}

	getChunk(x, z) {
		const chunk = [];
		const noiseData = this.noise.generate(x * this.#chunkSize, z * this.#chunkSize);

		for (let y = 0; y < this.#worldHeight; y++) {
			chunk.push([]);
			for (let z = 0; z < this.noise.height; z++) {
				chunk[y].push([]);
				for (let x = 0; x < this.noise.width; x++) {
					const value = noiseData[z * this.noise.width + x];
					chunk[y][z].push(value < y ? 0 : 4);
				}
			}
		}

		return chunk;
	}

	renderNewChunk(x, z, offerX = 0, offerZ = 0) {
		if (this.#loadedChunkElements.has(`${x},${z}`)) {
			this.#loadedChunkElements.get(`${x},${z}`).style.display = null;
			this.#activeChunks.set(`${x},${z}`, this.#loadedChunkElements.get(`${x},${z}`));
		} else {
			const chunk = this.getChunk(x, z);
			const meshing = this.generateGreedyMeshing(chunk);
			this.#loadedChunkMeshings.set(`${x},${z}`, meshing);
			const chunkElement = this.render(meshing, offerX, offerZ);
			this.#loadedChunkElements.set(`${x},${z}`, chunkElement);
			this.#activeChunks.set(`${x},${z}`, chunkElement);
		}
	}

	render(meshing, offerX, offerZ) {
		const chunkParent = document.createElement("div");
		chunkParent.classList.add("chunk");
		chunkParent.append(...meshing.map((mesh) => this.generateGreedyMeshingElementTile(mesh, offerX, offerZ)));
		this.scene.append(chunkParent);
		return chunkParent;
	}

	hideChunk(x, z, renderDistance) {
		this.#activeChunks.forEach((value, key) => {
			const [chunkX, chunkZ] = key.split(",").map(Number);
			const distance = Math.hypot(chunkX - x, chunkZ - z);
			if (distance > renderDistance) {
				value.style.display = "none";
				this.#activeChunks.delete(key);
			}
		});
	}

	getChunkSize() {
		return this.#chunkSize * this.size;
	}
}

const textures = {
	1: "wall",
	2: "rock",
	3: "floor",
	4: "bookshelf",
	5: "quartz",
};
