const perspective = 400;
const size = 250;

const viewportElem = document.querySelector("#mapViewport");
const cameraElem = document.querySelector("#mapCamera");
const skyboxCameraElem = document.querySelector("#skyboxCamera");
const sceneElem = document.querySelector("#mapScene");
const fpsElem = document.querySelector("#fps");

// const gameMap = new createMap({ map: map1, size, scene: sceneElem });
const noise = new PerlinNoise(435345, 70, 70);
const gameMap = WorldMap.fromNoise(noise, size, sceneElem);

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
