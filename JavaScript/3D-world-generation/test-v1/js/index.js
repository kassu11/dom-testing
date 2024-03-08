const perspective = 400;
const size = 16;

const viewportElem = document.querySelector("#mapViewport");
const cameraElem = document.querySelector("#mapCamera");
const skyboxCameraElem = document.querySelector("#skyboxCamera");
const sceneElem = document.querySelector("#mapScene");
const fpsElem = document.querySelector("#fps");

// const gameMap = new createMap({ map: map1, size, scene: sceneElem });

const camera = new Camera({
	map: new WorldMap(100, size, sceneElem),
	cameraElem,
	viewportElem,
	perspective,
	skyboxCameraElem,
	mouseSensitivity: 0.15,
	renderDistance: 3,
});

// gameMap.generate();
// gameMap.generateGreedyMeshing();

window.requestAnimationFrame(updateFrame);
