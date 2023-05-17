const map = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 0, 0, 0, 0, 1, 0, 0, 0],
	[1, 0, 0, 0, 0, 1, 0, 0, 0],
	[1, 0, 0, 0, 0, 1, 0, 0, 0],
	[1, 0, 0, 0, 0, 1, 1, 0, 0],
	[1, 0, 0, 0, 0, 1, 0, 0, 0],
]

const rotateContainer = document.querySelector(".rotateWrapper")
const moveContainer = document.querySelector(".moveWrapper")

for (let y = 0; y < map.length; y++) {
	for (let x = 0; x < map[y].length; x++) {
		const div = document.createElement("div")
		div.classList.add("block")
		div.style.translate = `${x * 100}px ${y * 100}px`
		rotateContainer.appendChild(div)
		if (map[y][x] === 1) {
			div.classList.add("wall")
			const front = document.createElement("div");
			front.classList.add("front");
			const back = document.createElement("div");
			back.classList.add("back");
			const right = document.createElement("div");
			right.classList.add("right");
			const left = document.createElement("div");
			left.classList.add("left");
			const top = document.createElement("div");
			top.classList.add("top");
			div.append(front, back, right, left, top)
		} else {
			div.classList.add("floor")
		}
	}
}

const player = {
	x: 0,
	y: 0,
}

window.addEventListener("keydown", e => {
	if (e.code === "KeyW") {
		player.y++;
	}
	if (e.code === "KeyS") {
		player.y--;
	}
	if (e.code === "KeyA") {
		player.x++;
	}
	if (e.code === "KeyD") {
		player.x--;
	}

	updateCamera();
})

updateCamera();

function updateCamera() {
	moveContainer.style.setProperty("--x", (player.x - 1) * 100 + "px")
	moveContainer.style.setProperty("--y", (player.y + 6) * 100 + "px")
}