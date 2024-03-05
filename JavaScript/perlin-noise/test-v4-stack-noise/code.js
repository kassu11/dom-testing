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

function random(x, y, seed) {
	const rx = 4421.8904;
	const ry = 84103.2963;
	const rScale = 15722.5951;

	const dot = rx * x + ry * y;
	return Math.cos(Math.sin(seed * dot) * rScale);
}

function splitmix32(a) {
	return function () {
		a |= 0;
		a = (a + 0x9e3779b9) | 0;
		let t = a ^ (a >>> 16);
		t = Math.imul(t, 0x21f0aaad);
		t = t ^ (t >>> 15);
		t = Math.imul(t, 0x735a2d97);
		return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
	};
}

let seed = 234234;

document.querySelector("input").addEventListener("input", (e) => {
	seed = badHash(e.target.value);
	renderCanvas();
});

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d", { alpha: false });
function renderCanvas() {
	const random = splitmix32(seed);
	canvas.width = 800;
	canvas.height = 800;

	const mainImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

	const max = 5;

	for (let i = max; i > 1; i--) {
		const pixelSize = ~~(75 / i);
		const blurSize = ~~((pixelSize / 10) * 4);
		const seed = random();
		const imageData = getNoiseImageData(pixelSize, blurSize, seed, canvas.width, canvas.height);
		for (let i = 0; i < imageData.data.length; i += 4) {
			const r = random() / 7 + 1.7;
			mainImageData.data[i] = ~~((imageData.data[i] + mainImageData.data[i]) / r);
			mainImageData.data[i + 1] = ~~((imageData.data[i + 1] + mainImageData.data[i + 1]) / r);
			mainImageData.data[i + 2] = ~~((imageData.data[i + 2] + mainImageData.data[i + 2]) / r);
		}
	}

	ctx.putImageData(mainImageData, 0, 0);
}

function getNoiseImageData(pixelSize, blurSize, seed, canvasWidth, canvasHeight) {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d", { alpha: false });

	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	for (let y = 0; y < canvas.height; y += pixelSize) {
		for (let x = 0; x < canvas.width; x += pixelSize) {
			const value = random(x, y, seed);
			const color = Math.floor(value * 255);
			ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
			ctx.fillRect(x, y, pixelSize, pixelSize);
		}
	}

	const blurCanvas = document.createElement("canvas");
	blurCanvas.width = canvas.width;
	blurCanvas.height = canvas.height;
	const blurContext = blurCanvas.getContext("2d");
	blurContext.filter = `blur(${blurSize}px)`;
	blurContext.drawImage(canvas, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	const width = canvas.width - pixelSize * 2;
	const height = canvas.height - pixelSize * 2;
	ctx.drawImage(blurCanvas, pixelSize, pixelSize, width, height, 0, 0, canvas.width, canvas.height);

	return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

renderCanvas();
