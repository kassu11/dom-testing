// Code from https://gist.github.com/banksean/304522
class ClassicalNoise {
  constructor(rand) {
    if (rand == undefined) rand = Math.random;
    this.grad3 = [
      [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
      [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
      [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
    ];

    this.perm = [];
    for (var i = 0; i < 256; i++) {
      this.perm[i] = this.perm[i + 256] = Math.floor(rand() * 256);
    }
  }
  dot(g, x, y, z) {
    return g[0] * x + g[1] * y + g[2] * z;
  }

  mix(a, b, t) {
    return (1.0 - t) * a + t * b;
  }

  fade(t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  }

  noise(x, y, z) {
    var X = Math.floor(x);
    var Y = Math.floor(y);
    var Z = Math.floor(z);

    // Get relative xyz coordinates of point within that cell 
    x = x - X;
    y = y - Y;
    z = z - Z;

    // Wrap the integer cells at 255 (smaller integer period can be introduced here) 
    X = X & 255;
    Y = Y & 255;
    Z = Z & 255;

    // Calculate a set of eight hashed gradient indices 
    var gi000 = this.perm[X + this.perm[Y + this.perm[Z]]] % 12;
    var gi001 = this.perm[X + this.perm[Y + this.perm[Z + 1]]] % 12;
    var gi010 = this.perm[X + this.perm[Y + 1 + this.perm[Z]]] % 12;
    var gi011 = this.perm[X + this.perm[Y + 1 + this.perm[Z + 1]]] % 12;
    var gi100 = this.perm[X + 1 + this.perm[Y + this.perm[Z]]] % 12;
    var gi101 = this.perm[X + 1 + this.perm[Y + this.perm[Z + 1]]] % 12;
    var gi110 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z]]] % 12;
    var gi111 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z + 1]]] % 12;

    // The gradients of each corner are now: 
    var n000 = this.dot(this.grad3[gi000], x, y, z);
    var n100 = this.dot(this.grad3[gi100], x - 1, y, z);
    var n010 = this.dot(this.grad3[gi010], x, y - 1, z);
    var n110 = this.dot(this.grad3[gi110], x - 1, y - 1, z);
    var n001 = this.dot(this.grad3[gi001], x, y, z - 1);
    var n101 = this.dot(this.grad3[gi101], x - 1, y, z - 1);
    var n011 = this.dot(this.grad3[gi011], x, y - 1, z - 1);
    var n111 = this.dot(this.grad3[gi111], x - 1, y - 1, z - 1);
    // Compute the fade curve value for each of x, y, z 
    var u = this.fade(x);
    var v = this.fade(y);
    var w = this.fade(z);
    // Interpolate along x the contributions from each of the corners 
    var nx00 = this.mix(n000, n100, u);
    var nx01 = this.mix(n001, n101, u);
    var nx10 = this.mix(n010, n110, u);
    var nx11 = this.mix(n011, n111, u);
    // Interpolate the four results along y 
    var nxy0 = this.mix(nx00, nx10, v);
    var nxy1 = this.mix(nx01, nx11, v);
    // Interpolate the two last results along z 
    var nxyz = this.mix(nxy0, nxy1, w);

    return nxyz;
  }
}




function splitmix32(seedNum) {
  return function() {
    seedNum |= 0;
    seedNum = (seedNum + 0x9e3779b9) | 0;
    let t = seedNum ^ (seedNum >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
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

let inputX = 0;
let inputY = 0;
let perlinNoise = new ClassicalNoise(splitmix32(0))

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

document.querySelector("#cordsX").addEventListener("input", (e) => {
  inputX = Number(e.target.value);
  renderCanvas();
});

document.querySelector("#cordsY").addEventListener("input", (e) => {
  inputY = Number(e.target.value);
  renderCanvas();
});

document.querySelector("#seed").addEventListener("input", (e) => {
  const seed = badHash(e.target.value);
  perlinNoise = new ClassicalNoise(splitmix32(seed))
  renderCanvas();
});

renderCanvas();



function renderCanvas() {
  canvas.width = 800;
  canvas.height = 800;

  const imageData = new ImageData(canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const j = (y * canvas.height + x) * 4;
      const noise = Math.floor((Math.abs(perlinNoise.noise((y + inputY) / 100, (x + inputX) / 100, (x + y + inputY + inputX) / 100))) * 255);
      imageData.data[j] = noise
      imageData.data[j + 1] = noise
      imageData.data[j + 2] = noise
      imageData.data[j + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
