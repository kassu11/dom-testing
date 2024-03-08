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
let inputX = 0;
let inputY = 0;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d", { alpha: false });

document.querySelector("#cordsX").addEventListener("input", (e) => {
	inputX = Number(e.target.value);
	renderCanvas();
});

document.querySelector("#cordsY").addEventListener("input", (e) => {
	inputY = Number(e.target.value);
	renderCanvas();
});

document.querySelector("#seed").addEventListener("input", (e) => {
	seed = badHash(e.target.value);
	renderCanvas();
});

renderCanvas();

function renderCanvas() {
	const perlinNoise = new PerlinNoise(seed, 600, 600);
	const noise = perlinNoise.generate(inputX, inputY);
	canvas.width = perlinNoise.width;
	canvas.height = perlinNoise.height;

	const imageData = new ImageData(perlinNoise.width, perlinNoise.height);
	for (let i = 0, j = 0; i < noise.length; i++, j += 4) {
		imageData.data[j] = noise[i];
		imageData.data[j + 1] = noise[i];
		imageData.data[j + 2] = noise[i];
		imageData.data[j + 3] = 255;
	}
	ctx.putImageData(imageData, 0, 0);
}
