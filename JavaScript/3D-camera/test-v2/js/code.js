const map = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 1, 1, 0, 2, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

const perspective = 400;
const size = 250;
const cameraOffset = size / 2;

const camera = document.querySelector("#camera")
const scane = document.querySelector("#scene")

for (let y = 0; y < map.length; y++) {
	for (let x = 0; x < map[y].length; x++) {
		let texture = "floor"
		if (map[y][x] === 1) texture = "wall";
		else if (map[y][x] === 2) texture = "rock";

		if (map[y][x] === 0) { makeTile(x, y, "bottom", texture); continue };

		if (map[y][x] !== 0) makeTile(x, y, "top", texture);
		if (map[y][x + 1] === 0) makeTile(x, y, "right", texture);
		if (map[y][x - 1] === 0) makeTile(x, y, "left", texture);
		if (map[y + 1]?.[x] === 0) makeTile(x, y, "front", texture);
		if (map[y - 1]?.[x] === 0) makeTile(x, y, "back", texture);
	}
}

function makeTile(x, y, dir, texture) {
	const div = document.createElement("div");
	div.classList.add("tile", dir, texture);
	div.style.width = size + 1 + "px";
	div.style.height = size + 1 + "px";
	if (dir === "bottom") div.style.transform = `translate3d(${x * size}px, ${size}px, ${y * size}px) rotateX(90deg)`;
	else if (dir === "top") div.style.transform = `translate3d(${x * size}px, 0px, ${y * size}px) rotateX(90deg)`;
	else if (dir === "right") div.style.transform = `translate3d(${x * size + size}px, 0px, ${y * size + size}px) rotateY(90deg)`;
	else if (dir === "left") div.style.transform = `translate3d(${x * size}px, 0px, ${y * size}px) rotateY(-90deg)`;
	else if (dir === "back") div.style.transform = `translate3d(${x * size + size}px, 0px, ${y * size}px) rotateY(180deg)`;
	else if (dir === "front") div.style.transform = `translate3d(${x * size}px, 0px, ${y * size + size}px)`;
	else div.style.transform = `translate3d(${x * size}px, 0px, ${y * size}px)`;
	scane.append(div);
}

const player = {
	x: size / 2,
	y: 0,
	z: size / 2,
	mouseY: 0,
	mouseX: 180,
}

window.addEventListener("keydown", e => {
	playerKeys.add(e.code);
});

window.addEventListener("keyup", e => {
	playerKeys.delete(e.code);
});


window.requestAnimationFrame(movePlayer);
updateCamera();

const playerKeys = new Set();
window.onblur = () => playerKeys.clear();
function movePlayer() {
	const moveSpeed = 10;
	const turnSpeed = 2;
	const oldPlayer = { ...player };
	if (playerKeys.has("KeyW")) {
		player.z += Math.round(moveSpeed * Math.cos((player.mouseX - 180) * Math.PI / 180))
		player.x += Math.round(moveSpeed * Math.sin(player.mouseX * Math.PI / 180))
	}
	if (playerKeys.has("KeyA")) {
		player.z += Math.round(moveSpeed * Math.cos((player.mouseX + 90) * Math.PI / 180))
		player.x += Math.round(moveSpeed * Math.sin((player.mouseX - 90) * Math.PI / 180))
	}
	if (playerKeys.has("KeyS")) {
		player.z += Math.round(moveSpeed * Math.cos(player.mouseX * Math.PI / 180))
		player.x += Math.round(moveSpeed * Math.sin((player.mouseX + 180) * Math.PI / 180))
	}
	if (playerKeys.has("KeyD")) {
		player.z += Math.round(moveSpeed * Math.cos((player.mouseX - 90) * Math.PI / 180));
		player.x += Math.round(moveSpeed * Math.sin((player.mouseX + 90) * Math.PI / 180));
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

	for (const [key, value] of Object.entries(oldPlayer)) {
		if (player[key] !== value) {
			updateCamera();
			break;
		}
	}


	window.requestAnimationFrame(movePlayer);
}

function updateCamera() {
	scane.style.transformOrigin = `${player.x}px ${-player.y + cameraOffset}px ${player.z - cameraOffset}px`;
	scane.style.transform = `translate3d(${-player.x}px, ${player.y - cameraOffset}px, ${-player.z + cameraOffset}px)`;
}

document.body.onclick = () => !document.pointerLockElement && document.body.requestPointerLock({ unadjustedMovement: true });

document.addEventListener("pointerlockerror", () => {
	console.error("Error locking pointer");
});

document.addEventListener("pointerlockchange", () => {
	if (document.pointerLockElement) {
		document.addEventListener("mousemove", mouseMovement);
	} else document.removeEventListener("mousemove", mouseMovement);
});

mouseMovement();
function mouseMovement(event) {
	player.mouseX += event?.movementX / 2 || 0;
	player.mouseY -= event?.movementY / 2 || 0;
	if (player.mouseY > 90) player.mouseY = 90;
	if (player.mouseY < -90) player.mouseY = -90;

	camera.style.transform = `translate3d(0px, 0px, ${perspective}px) rotateX(${player.mouseY}deg) rotateY(${player.mouseX}deg)`;
}