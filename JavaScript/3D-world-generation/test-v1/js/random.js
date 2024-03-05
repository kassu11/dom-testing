class Random {
	constructor(seed) {
		this.random = this.#splitmix32(Number(seed) ?? Math.random() * 10 ** 6);
	}

	#splitmix32(a) {
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

	next() {
		return this.random();
	}
}

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
