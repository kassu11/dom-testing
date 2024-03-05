const perspective = 400;
const size = 250;

const viewportElem = document.querySelector("#mapViewport");
const cameraElem = document.querySelector("#mapCamera");
const skyboxCameraElem = document.querySelector("#skyboxCamera");
const sceneElem = document.querySelector("#mapScene");
const fpsElem = document.querySelector("#fps");

// const gameMap = new createMap({ map: map1, size, scene: sceneElem });
const noise = new PerlinNoise(123, 10, 10);
const gameMap = createMap.fromNoise(noise, size, sceneElem);

const camera = new Camera({
	map: gameMap,
	cameraElem,
	viewportElem,
	perspective,
	skyboxCameraElem,
	mouseSensitivity: 0.15,
});

// gameMap.generate();
gameMap.generateGreedyMeshing();

window.requestAnimationFrame(updateFrame);
