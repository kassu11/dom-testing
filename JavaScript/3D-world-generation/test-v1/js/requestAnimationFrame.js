const fps = []

function updateFrame(currentTime, previousTime = 0) {
	const deltaTime = currentTime - previousTime;
	updateFps(currentTime);
	movePlayer(deltaTime);

	window.requestAnimationFrame(time => updateFrame(time, currentTime));
}

function updateFps(currentTime) {
	fps.push(currentTime);

	for (let i = 0; i < fps.length; i++) {
		if (fps[i] < currentTime - 1000) fps.splice(i--, 1);
		else break;
	}

	// console.log(fps.length)
	fpsElem.textContent = fps.length + " FPS";
}