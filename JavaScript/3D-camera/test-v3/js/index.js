const perspective = 400;
const size = 250;

const viewportElem = document.querySelector("#mapViewport");
const cameraElem = document.querySelector("#mapCamera");
const skyboxCameraElem = document.querySelector("#skyboxCamera");
const sceneElem = document.querySelector("#mapScene");
const fpsElem = document.querySelector("#fps");

const map = new createMap({ map: map1, size, scene: sceneElem });

const camera = new Camera({
	map: map,
	cameraElem,
	viewportElem,
	perspective,
	skyboxCameraElem,
	mouseSensitivity: 0.15,
});

map.generate();

window.requestAnimationFrame(updateFrame);