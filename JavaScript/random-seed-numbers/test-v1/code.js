function badHash(string) {
	let hash = 0;
	for (i = 0; i < string.length; i++) {
		const ch = string.charCodeAt(i);
		hash = ((hash << 5) - hash) + ch;
		hash = hash & hash; // Convert to 32bit integer
	}

	if (Math.abs(hash) < 100) return badHash(hash.toString() + "a")
	return hash;
}

function random(x, y, seed) {
	const rx = 4421.8904
	const ry = 84103.2963
	const rScale = 15722.5951

	const dot = rx * x + ry * y
	return Math.abs(Math.cos(Math.sin(seed * dot) * rScale))
}

let seed = 234234

document.querySelector("input").addEventListener("input", (e) => {
	seed = badHash(e.target.value)
	renderCanvas();
});


const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
function renderCanvas() {
	canvas.width = 500
	canvas.height = 500
	pixelSize = 10

	for (let y = 0; y < canvas.height; y += pixelSize) {
		for (let x = 0; x < canvas.width; x += pixelSize) {
			const value = random(x, y, seed)
			const color = Math.floor(value * 255)
			ctx.fillStyle = `rgb(${color}, ${color}, ${color})`
			ctx.fillRect(x, y, pixelSize, pixelSize)
		}
	}
}

renderCanvas()