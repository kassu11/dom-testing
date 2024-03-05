class PerlinNoise {
	constructor(seed, width, height) {
		this.seed = Number(seed) || Math.random() * 10 ** 6;
		this.width = width;
		this.height = height;
		this.coordinatesRandom = new RandomFromCoordinates(this.seed);
		this.random = new Random(this.seed);
	}

	generate() {
		const perlinNoiseArray = new Float32Array(this.width * this.height);
		const max = 5;

		for (let i = max; i > 1; i--) {
			const pixelSize = ~~(75 / i);
			const blurSize = ~~((pixelSize / 10) * 4);
			const layarNoise = this.#generateLayer(pixelSize, blurSize);
			for (let i = 0, j = 0; i < layarNoise.length; i += 4, j++) {
				const rand = this.random.next() / 7 + 1.7;
				perlinNoiseArray[j] = ~~((layarNoise[i] + perlinNoiseArray[j]) / rand);
			}
		}

		return perlinNoiseArray;
	}

	#generateLayer(pixelSize, blurSize) {
		const canvas = document.createElement("canvas");
		const blurCanvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d", { alpha: false });
		const blurContext = blurCanvas.getContext("2d");

		canvas.width = this.width;
		canvas.height = this.height;
		blurCanvas.width = canvas.width;
		blurCanvas.height = canvas.height;

		this.coordinatesRandom.setSeed(this.random.next());

		for (let y = 0; y < canvas.height; y += pixelSize) {
			for (let x = 0; x < canvas.width; x += pixelSize) {
				const color = Math.floor(this.coordinatesRandom.from(x, y) * 45);
				ctx.fillStyle = `rgb(${color}, 0, 0)`;
				ctx.fillRect(x, y, pixelSize, pixelSize);
			}
		}

		blurContext.filter = `blur(${blurSize}px)`;
		blurContext.drawImage(canvas, 0, 0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		const width = canvas.width - pixelSize * 2;
		const height = canvas.height - pixelSize * 2;
		ctx.drawImage(blurCanvas, pixelSize, pixelSize, width, height, 0, 0, canvas.width, canvas.height);

		return ctx.getImageData(0, 0, canvas.width, canvas.height).data;
	}
}
