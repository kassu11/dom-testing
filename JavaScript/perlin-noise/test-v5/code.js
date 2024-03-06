class RandomFromCoordinates {
	constructor(seed) {
		this.seed = seed;
	}

	from(x, y) {
		const rx = 4421.8904;
		const ry = 84103.2963;
		const rScale = 15722.5951;

		const dot = rx * x + ry * y;
		return Math.cos(Math.sin(this.seed * dot) * rScale);
	}

	setSeed(seed) {
		this.seed = seed;
	}
}

class PerlinNoise {
	#maxNoise = 255;
	#padding = 200;

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
			const pixelSize = ~~(75 / i);
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

		for (let y = 0; y < canvas.height; y += pixelSize) {
			for (let x = 0; x < canvas.width; x += pixelSize) {
				const color = Math.floor(this.coordinatesRandom.from(x - genX, y - genY) * this.#maxNoise);
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

		return ctx.getImageData(this.#padding / 2, this.#padding / 2, this.width, this.height).data;
	}
}

function badHash(string) {
	let hash = 0;
	for (i = 0; i < string.length; i++) {
		const ch = string.charCodeAt(i);
		hash = (hash << 5) - hash + ch;
		hash = hash & hash;
	}

	if (Math.abs(hash) < 100) return badHash(hash.toString() + "a");
	return hash;
}

let seed = 234234;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d", { alpha: false });

document.querySelector("input").addEventListener("input", (e) => {
	seed = badHash(e.target.value);
	renderCanvas();
});

renderCanvas();

function renderCanvas() {
	const perlinNoise = new PerlinNoise(seed, 100, 100);
	const noise = perlinNoise.generate(50, 50);

	const imageData = new ImageData(100, 100);
	for (let i = 0, j = 0; i < noise.length; i++, j += 4) {
		imageData.data[j] = noise[i];
		imageData.data[j + 1] = noise[i];
		imageData.data[j + 2] = noise[i];
		imageData.data[j + 3] = 255;
	}
	ctx.putImageData(imageData, 0, 0);
}
