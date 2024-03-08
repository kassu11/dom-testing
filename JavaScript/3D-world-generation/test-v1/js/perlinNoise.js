class PerlinNoise {
	#maxNoise = 50;
	#padding = 250;
	#maxGridSize = 75;

	constructor(seed, width, height) {
		this.seed = Number(seed) || Math.random() * 10 ** 6;
		this.width = width;
		this.height = height;
		this.coordinatesRandom = new RandomFromCoordinates(this.seed);
	}

	generate(genX, genY) {
		const perlinNoiseArray = new Float32Array(this.width * this.height);
		const max = 5;

		for (let i = max; i > 1; i--) {
			const pixelSize = ~~(this.#maxGridSize / i);
			const blurSize = ~~((pixelSize / 10) * 4);
			const layarNoise = this.#generateLayer(pixelSize, blurSize, genX, genY);
			for (let i = 0, j = 0; i < layarNoise.length; i += 4, j++) {
				perlinNoiseArray[j] = ~~((layarNoise[i] + perlinNoiseArray[j]) / 1.8);
			}
		}

		return perlinNoiseArray;
	}

	#generateLayer(pixelSize, blurSize, genX, genY) {
		const canvas = document.createElement("canvas");
		const blurCanvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d", { alpha: false });
		const blurContext = blurCanvas.getContext("2d");

		canvas.width = this.width + this.#padding;
		canvas.height = this.height + this.#padding;
		blurCanvas.width = canvas.width;
		blurCanvas.height = canvas.height;

		const calcMove = cords => {
			const value = ~~(cords / this.#maxGridSize) * this.#maxGridSize;
			const remainder = value % pixelSize;
			return [value - remainder, remainder]
		}

		const [moveX, offsetX] = calcMove(genX);
		const [moveY, offsetY] = calcMove(genY);

		for (let y = 0; y < canvas.height; y += pixelSize) {
			for (let x = 0; x < canvas.width; x += pixelSize) {
				const color = Math.floor(this.coordinatesRandom.from(x + moveX, y + moveY) * this.#maxNoise);
				ctx.fillStyle = `rgb(${color}, 0, 0)`;
				ctx.fillRect(x - offsetX, y - offsetY, pixelSize, pixelSize);
			}
		}

		blurContext.filter = `blur(${blurSize}px)`;
		blurContext.drawImage(canvas, 0, 0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(blurCanvas, 0, 0, canvas.width, canvas.height);
		
		return ctx.getImageData(this.#padding / 2 + genX % this.#maxGridSize, this.#padding / 2 + genY % this.#maxGridSize, this.width, this.height).data;
	}
}