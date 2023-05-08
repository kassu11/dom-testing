const divContainer = document.querySelector("#box") as HTMLDivElement;
const divContent = divContainer.querySelector(".container") as HTMLDivElement;
let x: number = 0, y: number = 0, scale: number = 1;

// @ts-ignore
divContainer.onmousedown = () => divContainer.requestPointerLock({ unadjustedMovement: true });
divContainer.onmouseup = () => document.exitPointerLock();

document.addEventListener("pointerlockerror", () => {
	console.error("Error locking pointer");
});

document.addEventListener("pointerlockchange", () => {
	if (document.pointerLockElement === divContainer) {
		document.addEventListener("mousemove", mouseMovement);
	} else document.removeEventListener("mousemove", mouseMovement);
});

document.addEventListener("wheel", (wheelEvent: WheelEvent) => {
	if (!document.pointerLockElement && !(wheelEvent.target as HTMLElement)?.closest("#box")) return;
	wheelEvent.preventDefault();
	const minScale = .1, maxScale = 150;

	if (wheelEvent.deltaY > 0) scale = Math.max(scale ** .9 - .1, minScale)
	else scale = Math.min(scale ** 1.15 + .1, maxScale);

	const { left, top, width, height } = divContent.getBoundingClientRect();

	const layerX = wheelEvent.x - left;
	const layerY = wheelEvent.y - top;

	const percentageX = layerX / width;
	const percentageY = layerY / height;

	divContent.style.transform = `scale(${scale})`;

	const { width: scaledWidth, height: scaledHeight } = divContent.getBoundingClientRect();

	x += (width - scaledWidth) * percentageX;
	y += (height - scaledHeight) * percentageY;

	updateContentCordinates();
}, { passive: false });

function mouseMovement(event: MouseEvent) {
	x += event.movementX;
	y += event.movementY;
	updateContentCordinates();
}

function updateContentCordinates() {
	divContent.style.left = `${x}px`;
	divContent.style.top = `${y}px`;

	document.querySelector("#xValue code")!.textContent = x.toString();
	document.querySelector("#yValue code")!.textContent = y.toString();
}