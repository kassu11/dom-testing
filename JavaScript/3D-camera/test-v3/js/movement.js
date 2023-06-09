const userKeys = new Set();

window.addEventListener("keydown", ({ code, repeat }) => {
	if (repeat) return;
	userKeys.add(code);

	if (code === "ArrowRight") {
		camera.mouseX += 90;
		camera.updateRotation(true);
	} else if (code === "ArrowLeft") {
		camera.mouseX -= 90;
		camera.updateRotation(true);
	}
});

window.addEventListener("keyup", ({ code }) => userKeys.delete(code));
window.onblur = () => userKeys.clear();

function movePlayer(curentTime, previousTime = 0) {
	const deltaTime = curentTime - previousTime;
	const moveSpeed = (size * 5) * deltaTime / 1000;

	if (userKeys.has("KeyW")) {
		camera.z += moveSpeed * Math.cos((camera.mouseX + 180) * Math.PI / 180)
		camera.x += moveSpeed * Math.sin(camera.mouseX * Math.PI / 180)
	}
	if (userKeys.has("KeyA")) {
		camera.z += moveSpeed * Math.cos((camera.mouseX + 90) * Math.PI / 180)
		camera.x += moveSpeed * Math.sin((camera.mouseX - 90) * Math.PI / 180)
	}
	if (userKeys.has("KeyS")) {
		camera.z += moveSpeed * Math.cos(camera.mouseX * Math.PI / 180)
		camera.x += moveSpeed * Math.sin((camera.mouseX + 180) * Math.PI / 180)
	}
	if (userKeys.has("KeyD")) {
		camera.z += moveSpeed * Math.cos((camera.mouseX - 90) * Math.PI / 180);
		camera.x += moveSpeed * Math.sin((camera.mouseX + 90) * Math.PI / 180);
	}
	if (userKeys.has("Space")) camera.y += moveSpeed;
	if (userKeys.has("ShiftLeft")) camera.y -= moveSpeed;

	if (camera.positionMoved) camera.updatePosition();

	window.requestAnimationFrame(time => movePlayer(time, curentTime));
}

document.body.onclick = () => !document.pointerLockElement && document.body.requestPointerLock({ unadjustedMovement: true });
document.addEventListener("pointerlockerror", () => console.error("Error locking pointer"));

document.addEventListener("pointerlockchange", () => {
	if (document.pointerLockElement) document.addEventListener("mousemove", mouseMovement);
	else {
		document.removeEventListener("mousemove", mouseMovement);
		userKeys.clear();
	}
});

function mouseMovement(event) {
	camera.mouseX += (event?.movementX ?? 0) * camera.mouseSensitivity;
	camera.mouseY -= (event?.movementY ?? 0) * camera.mouseSensitivity;
	camera.mouseY = Math.min(90, Math.max(camera.mouseY, -90));

	camera.updateRotation();
}