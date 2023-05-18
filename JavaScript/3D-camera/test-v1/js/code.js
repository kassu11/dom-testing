const map = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 1, 0, 2, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
]

const size = 250;

const moveContainer = document.querySelector("#scene")

for (let y = 0; y < map.length; y++) {
	for (let x = 0; x < map[y].length; x++) {
		const div = document.createElement("div")
		div.classList.add("block")
		div.style.translate = `${y * size}px 0px ${x * size}px`
		moveContainer.appendChild(div)
		if (map[y][x] !== 0) {
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

		if (map[y][x] === 2) {
			div.classList.add("rock")
		}
	}
}

const player = {
	x: size / 2,
	y: size * 2 / 3,
	z: size / 2,
	mouseX: 0,
	mouseZ: 0,
	xCords: 0,
	zCords: 0,
	angle: 180
}

window.addEventListener("keydown", e => {
	playerKeys.add(e.code);
});

window.addEventListener("keyup", e => {
	playerKeys.delete(e.code);
});


window.requestAnimationFrame(movePlayer);

const playerKeys = new Set();
function movePlayer() {
	const moveSpeed = 10;
	const turnSpeed = 2;
	if (playerKeys.has("KeyW")) {
		player.z += Math.round(moveSpeed * Math.cos((player.angle - 180) * Math.PI / 180))
		player.x += Math.round(moveSpeed * Math.sin(player.angle * Math.PI / 180))
	}
	if (playerKeys.has("KeyA")) {
		player.z += Math.round(moveSpeed * Math.cos((player.angle + 90) * Math.PI / 180))
		player.x += Math.round(moveSpeed * Math.sin((player.angle - 90) * Math.PI / 180))
	}
	if (playerKeys.has("KeyS")) {
		player.z += Math.round(moveSpeed * Math.cos(player.angle * Math.PI / 180))
		player.x += Math.round(moveSpeed * Math.sin((player.angle + 180) * Math.PI / 180))
	}
	if (playerKeys.has("KeyD")) {
		player.z += Math.round(moveSpeed * Math.cos((player.angle - 90) * Math.PI / 180));
		player.x += Math.round(moveSpeed * Math.sin((player.angle + 90) * Math.PI / 180));
	}
	if (playerKeys.has("Space")) {
		player.y += moveSpeed;
	}
	if (playerKeys.has("ShiftLeft")) {
		player.y -= moveSpeed;
	}

	if (playerKeys.has("ArrowRight")) {
		player.angle += turnSpeed;
	}

	if (playerKeys.has("ArrowLeft")) {
		player.angle -= turnSpeed;
	}

	updateCamera();
	window.requestAnimationFrame(movePlayer);
}

// document.body.onmousedown = () => document.body.requestPointerLock({ unadjustedMovement: true });
// document.body.onmouseup = () => document.exitPointerLock();

// document.addEventListener("pointerlockerror", () => {
// 	console.error("Error locking pointer");
// });

// document.addEventListener("pointerlockchange", () => {
// 	if (document.pointerLockElement) {
// 		document.addEventListener("mousemove", mouseMovement);
// 	} else document.removeEventListener("mousemove", mouseMovement);
// });

// function mouseMovement(event) {
// 	console.log("??")
// 	player.mouseX += event.movementX;
// 	player.mouseZ -= event.movementY;
// 	moveContainer.style.setProperty("--mouseX", player.mouseX + "deg")
// 	moveContainer.style.setProperty("--mouseZ", player.mouseZ + "deg")
// }


function updateCamera() {
	moveContainer.style.setProperty("--angle", player.angle + "deg")
	moveContainer.style.setProperty("--x", player.x + "px")
	moveContainer.style.setProperty("--z", player.z + "px")
	moveContainer.style.setProperty("--y", player.y + "px")
}