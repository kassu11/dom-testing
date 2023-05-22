const perspective = 400;
const size = 250;

const viewportElem = document.querySelector("#viewport")
const cameraElem = document.querySelector("#camera")
const sceneElem = document.querySelector("#scene")

const map = new createMap({ map: map1, size, scene: sceneElem });

const camera = new Camera({
	map: map,
	cameraElem,
	viewportElem,
	perspective,
	mouseSensitivity: 0.15,
});

map.generate();

window.requestAnimationFrame(movePlayer);